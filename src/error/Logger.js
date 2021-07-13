//import Vue from 'vue';
import {MoaConfig} from 'src/data/MoaConfig';
import Errors from 'src/error/Errors';

const logLevels = ['debug', 'info', 'warn', 'error', 'fatal'];


//const firebaseApp = Firebase.initializeApp(MoaConfig.firebase);
/*
window.onerror = function (errorMsg, url, lineNumber) {
    alert('Error - Global : ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber);
}
*/

export class Logger {
    constructor() {
        this.options = MoaConfig.log;
        this.log = this.initLoggerInstance(this.options,logLevels);
        //this.firestore = firebaseApp;
        //console.log("Logger.constructor",MoaConfig.log);
    }
    

    _toJson(obj) {
        let jsonStr = JSON.stringify(obj);
        return JSON.parse(jsonStr);
    }

    
    initLoggerInstance (options, logLevels) {
        if (! this.isValidOptions(options, logLevels)) {
            logger.log.error("Logger - option is not valid");
            throw new Error('Logger option is not valid');
            return;
        }

        const logger = {};
        logLevels.forEach(logLevel => {
            if (logLevels.indexOf(logLevel) >= logLevels.indexOf(options.logLevel)) {
                logger[logLevel] = (...args) => {
                    //hide logger if showDev false;
                    if(!options.showDev) return;

                    let methodName = this.getMethodName()
                    const methodNamePrefix = options.showMethodName ? methodName + ` ${options.separator} ` : ''
                    const logLevelPrefix = options.showLogLevel ? logLevel + ` ${options.separator} ` : ''
                    const formattedArguments = options.stringifyArguments ? args.map(a => JSON.stringify(a)) : args
                    this.print(logLevel, logLevelPrefix, methodNamePrefix, formattedArguments, options.showConsoleColors)
                }
            }
            else {
                logger[logLevel] = () => {}
            }
        })
        return logger
    }

    print (logLevel = false, logLevelPrefix = false, methodNamePrefix = false, formattedArguments = false, showConsoleColors = false) {
        if (showConsoleColors && (logLevel === 'warn' || logLevel === 'error' || logLevel === 'fatal')) {
            console[logLevel === 'fatal' ? 'error' : logLevel](logLevelPrefix, methodNamePrefix, ...formattedArguments)
        } else {
            //this.log.debug(logLevelPrefix, methodNamePrefix, ...formattedArguments)
            console.log(logLevelPrefix, methodNamePrefix, ...formattedArguments);
        }
    }

    isValidOptions (options, logLevels) {
        if (!(options.logLevel && typeof options.logLevel === 'string' && logLevels.indexOf(options.logLevel) > -1)) {
            return false
        }
        if (options.stringifyArguments && typeof options.stringifyArguments !== 'boolean') {
            return false
        }
        if (options.showLogLevel && typeof options.showLogLevel !== 'boolean') {
            return false
        }
        if (options.showConsoleColors && typeof options.showConsoleColors !== 'boolean') {
            return false
        }
        if(options.showDev && typeof options.showDev !== 'boolean') {
            return false
        }
        if (options.separator && (typeof options.separator !== 'string' || (typeof options.separator === 'string' && options.separator.length > 3))) {
            return false
        }
        return !(options.showMethodName && typeof options.showMethodName !== 'boolean')
    }

    getMethodName () {
        let stackTrace = Error().stack.split('\n')[3]
        if (/ /.test(stackTrace)) {
            stackTrace = stackTrace.trim().split(' ')[1]
        }
        if (stackTrace.includes('.')) {
            stackTrace = stackTrace.split('.')[1]
        }
        return stackTrace
    }
      
};

const logger = new Logger();
export default logger;