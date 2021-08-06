import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';
import rpc,{query} from 'jsonrpc-client-http';
import Cookies from 'js-cookie'
import logger from 'src/error/Logger';
import ehandler from 'src/error/EHandler';
import Errors from 'src/error/Errors';

import {store} from 'src/store/store';


/*
//import request from 'request-promise'
import {store} from '@/store/store';
*/
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';


export const get = async route => {
    return Promise.race([
        fetch(route).then(res => res.json()).catch(() => null),
        new Promise(resolve => setTimeout(() => resolve(null), 60000))
    ])
}

export const post = async (route, data) => {
    ehandler.assertReference(route,"route is null!!");

    return Promise.race([
        fetch(route, {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).catch(() => null),
        new Promise(resolve => setTimeout(() => resolve(null), 120000))
    ])
};


export const callAPI = async(call_method,url,config,req_params) => {
    return new Promise(function(resolve,reject) {

        if (Object.keys(config).length === 0) {        
            config = {
                mode: 'no-cors',
                headers: {
                    //'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
                timeout: 0,
                maxContentLength: 1024*1024,
                maxBodyLength: 1024*1024,
                //withCredentials: true,
                //credentials: 'include', 
                //json: true
            };
        }
        config['url'] = url;
        config['method'] = call_method;
        config['data'] = req_params;
        //config['data'] = JSON.stringify(req_params);


        //logger.log.debug('callAPI',config);           

        axios(config)
        .then(function(response) {
            logger.log.debug("callAPI - 0",response);
            resolve(response);            
        })
        .catch(function(error) {
            logger.log.error('CallAPI - error object',error);
            
            //reject(error);
            if (!(error.response)) {
                ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.NetworkConnectionError,'',error));
            } else if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                //console.log(error.response.data);
                //console.log(error.response.status);
                //console.log(error.response.headers);
                logger.log.error('CallAPI - response',error.response);
                
                if (error.response.data.err_code == '-5001') {
                    ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.AuthTokenExpired,'',error.response));
                } else if (error.response.data.err_code == '-5004') {
                    ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.AuthTokenUnauthorized,'',error.response));
                } else if (error.response.data.err_code == '-10091') {
                    var jsonmessage = JSON.parse(error.response.data.data.error.data.error.replace('Node error: ',''))
                    if (jsonmessage.code == '-32000') {
                        ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.EthereumNetworkError,'',jsonmessage.message,true));
                    }
                } else if (error.response.data.err_code == '-10304') {
                    if (error.response.data.data.error.err_code == '-2005') {
                        ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.WrongSwapCurrency,'',error.response));
                    }
                } else if (error.response.data.err_code == '-10201') {
                    if (error.response.data.data.error.cause == "priceInvalid") {
                        ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.PegasusSwapException,'',error.response.data.data.error.msg));
                    }
                } else {
                    //ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.HTTPStatusError,'',error.response));
                    ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.NotDefined,'',"err_code:"+error.response.data.err_code+" msg:"+error.response.data.data.msg+" => "+error.response.data.data.error));
                }
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.NoResponseError,'',error.request));
            } else {
                // Something happened in setting up the request that triggered an Error
                //ehandler.throw(new Errors.OtherNetworkError(error=error));
                ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.OtherNetworkError,'',error));
                //console.log('Error', error.message);
            }
            //console.log(error.config);            
        });        
    });

};


export const callCMSAPI = async(call_method,url,config,req_params) => {
    return new Promise(function(resolve,reject) {

        config = {
            mode: 'no-cors',
            headers: {
                //'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
                //'Content-Type': 'application/x-www-form-urlencoded',
                //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                //'Authorization': 'Token ' + MoaConfig.auth.token,
                //'X-CSRFToken': Cookies.get('csrftoken')
            },
            timeout: 0,
            maxContentLength: 1024*1024,
            maxBodyLength: 1024*1024,
            //withCredentials: true,
            //credentials: 'include', 
            //json: true
        };
        
        /*
        const excludes = ['/api/auth/token/login/',
            '/api/user/users/check/','/api/user/users/activation/'];
        
        let addToken = true;
        for (let index=0;index<excludes.length;index++) {
            if (url.indexOf(excludes[index])>-1) {
                logger.log.debug("callCMS -- me=",url,store.getters.me);    
                //logger.log.debug("callCMS -- 3");
                addToken = false;                
            }
        }
        
        if (addToken) {
            if (store.getters.me.isLoggedIn()) {
                config.headers['Authorization'] = 'Token ' + store.getters.me.token;
            }
        }
        */
        
        if (req_params.hasOwnProperty('token')) {
            config.headers['Authorization'] = 'Token ' + req_params.token;
            delete req_params.token;
        }
        

        config['url'] = url;
        config['method'] = call_method;
        config['data'] = req_params;
        //config['data'] = JSON.stringify(req_params);
        logger.log.debug('HTTP.callCMSAPI',config);           

        axios(config)
        .then(function(response) {
            resolve(response);
        })
        .catch(function(error) {
            logger.log.error('callCMSAPI - error ',error.response);
            //reject(error);
            if (error.response.status==400) {
                reject(error.response);
            } else if (error.response.status==403) {
                reject(error.response);
            } else {
                // Something happened in setting up the request that triggered an Error
                //ehandler.throw(new Errors.OtherNetworkError(error=error));
                ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.OtherNetworkError,'',error.response));
                //console.log('Error', error.message);
            }
            //console.log(error.config);            
        });        
    });

};

export const callGetAPI = async(url,req_params,func) => {
    
    return new Promise(function(resolve,reject) {
        let config = {};
        config['url'] = url;
        //config['method'] = 'GET';
        config['adapter'] = jsonpAdapter;
        config['data'] = req_params;
        config['callbackParamName'] = func;
        logger.log.debug('callGetAPI',config);           

        axios(config)
        .then(function(response) {
            logger.log.debug("1231231");
            resolve(response);
        })
        .catch(function(error) {
            logger.log.debug("error");
            reject(error);
        });        
    });

};

export const callPostAPI = async(call_method,url,config,req_params) => {
    return new Promise(function(resolve,reject) {
        if (Object.keys(config).length === 0) {        
            config = {
                mode: 'no-cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
                withCredentials: false,
                credentials: 'same-origin', 
            };
        }

        logger.log.debug('callPostAPI',config);           

        axios(config)
        .then(function(response) {
            resolve(response);
        })
        .catch(function(error) {
            reject(error);
        });        
    });

};



export const callJsonRPC = async(call_method,url,req_params) => {

    const query = {
        method : call_method, 
        id : new Date().getTime(), //default
        jsonrpc : "2.0",           //default
        params : req_params
    }

    const config = {
        mode: 'no-cors',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        },
    }

    return new Promise(function(resolve,reject) {
        rpc.post(url, query, config)
        .then(function(response) {
            logger.log.debug("callJsonRPC - url ,",url,response.data);
            resolve(response.data);
        })
        .catch(function(error) {
            logger.log.error("callJsonRPC",error);
            reject(error);
        });
    });

};    