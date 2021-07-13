//import Firebase from 'firebase';
import {MoaConfig} from 'src/data/MoaConfig';
import Errors from 'src/error/Errors';
import logger from "src/error/Logger";


export class EHandler {
    constructor() {
        this.options = MoaConfig.error;
        this.errors = [];
        this.firestore = null;
        this.errorHandler = null;
    }

    _serializeError(value) {
        if (typeof value === 'object') {
            return this._destroyCircular(value, []);
        }
    
        // People sometimes throw things besides Error objects…
        if (typeof value === 'function') {
            // `JSON.stringify()` discards functions. We do too, unless a function is thrown directly.
            return `[Function: ${(value.name || 'anonymous')}]`;
        }
    
        return value;
    }
    
    _isNetworkError(err) {
        if ( (err.errCode<-1) && (err.errCode>-100) ) {
            return true;
        }
        return false;
    }

    _isOperationalError(err) {
        if ( (err.errCode<-1) && (err.errCode>-100000) ) {
            return true;
        }
        return false;
    }

    _isCustomError(err) {
        if ('errCode' in err) {
            return true;
        }
        return false;
    }

    _sanityCheck(value) {
        logger.log.debug("_sanityCheck - value",value);
        if( value == "" || value == null || value == undefined){
            logger.log.debug("_sanityCheck - value : false");
            return false;
        }
        logger.log.debug("_sanityCheck - value : true");
        return true;
    }


    _destroyCircular(from, seen) {
        const to = Array.isArray(from) ? [] : {};

        seen.push(from);
    
        for (const [key, value] of Object.entries(from)) {
            if (typeof value === 'function') {
                continue;
            }
    
            if (!value || typeof value !== 'object') {
                to[key] = value;
                continue;
            }
    
            if (!seen.includes(from[key])) {
                to[key] = this._destroyCircular(from[key], seen.slice());
                continue;
            }
    
            to[key] = '[Circular]';
        }
    
        const commonProperties = [
            'name',
            'message',
            'stack',
            'code'
        ];
    
        for (const property of commonProperties) {
            if (typeof from[property] === 'string') {
                to[property] = from[property];
            }
        }
    
        return to;
    }

    // Private functions
    _getTimestamp() {
        return new Date().getTime();
    }


    isEIAMTokenExpirationError(err) {
        if (err.errCode==Errors.AuthTokenExpired) {
            return true;
        }
        return false;        
    }

    // methods start here
    setErrorHandler(func) {
        logger.log.debug("ehandler.setErrorHandler",func);
        this.errorHandler = func;
    }
    
    assert(...formattedArguments) {
        //console.log("assert", ...formattedArguments);
        console.assert( ...formattedArguments);   
    }

    assertReference(obj,msg) {
        //console.log("assert", ...formattedArguments);
        console.assert(this._sanityCheck(obj),msg);   
    }

    throw(err,data=null,raiseError=true) {
        logger.log.debug("Logger.throw - err,data",err,data);

        this.errors.push(err);
        logger.log.error(err);
        if (data) {
            logger.log.error(data);
        }

        if (this.options.uploadError) {
            //logger.log.debug("Logger.throw - uploadError");
            //this.uploadError(err,data);
        }

        if (this._isCustomError(err)) {
            logger.log.debug("Logger.throw - customError");
            if (this.errorHandler) {
                this.errorHandler(err);
            }
        }

        if (raiseError) {
            throw err;
        }     
    }

    sanityCheckAndThrow(obj,errCode=Errors.ERRCODE.OPERATION.ServerResponseError) {
        if (this._sanityCheck(obj)) {
            return true;
        } 
        this.throw(Errors.raise(errCode,'',obj));
        return false;
    }
    

    // firebase functions
    save(collectionName,docName,json) {
        //logger.log.debug("Logger.save",collectionName,docName,this.firestore);
        const parentRef = this.firestore.collection(collectionName).doc(docName);
        const childRef = parentRef.collection("logs").doc(this._getTimestamp().toString());
        return childRef.set(json);
    }
    uploadError(err,info=null) {
        //logger.log.debug("Logger.uploadError",err,info);
        if (! this.firestore) {
            this.firestore = Firebase.firestore();
        }
        const docName = this.options.firebaseReference;
        const jsonErr = this._serializeError(err);
        //logger.log.debug("Logger.save",jsonErr);

        this.save(this.options.firebaseCollection,docName,jsonErr);
    }
    // end    
}



export const vueErrorHandler = (err, vm, info) => {
    // handle error
    // `info` is a Vue-specific error info, e.g. which lifecycle hook
    // the error was found in. Only available in 2.2.0+
    //alert('Error - Vue');
    ehandler.throw(err,info);
}


const ehandler = new EHandler();
export default ehandler;