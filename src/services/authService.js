//import api from '@/services/api'
import {callAPI, callCMSAPI, callPostAPI, callJsonRPC} from 'src/util/Http';
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import LocalStorageService from 'src/services/localStorage';



export default class AuthService{

  constructor(){}
  
    static getUrl(host,url) {
        return host + url;
    }

    static signUp(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/auth/users/");
        callCMSAPI("POST",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }

    static signIn(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/auth/token/login/");
        callCMSAPI("POST",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }

    static signOut(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/auth/token/logout/");
        callCMSAPI("POST",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }

    static getUserinfo(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/auth/users/me/");
        callCMSAPI("GET",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }

    static setData(json_auth) {
        MoaConfig.auth = json_auth;
        AuthService.saveToCookie()
    }

    static saveToCookie() {
        logger.log.debug("saveToCookie=",MoaConfig.auth);
        LocalStorageService.save('auth',MoaConfig.auth);
    }

    static loadFromCookie() {
        let auth_data = LocalStorageService.load('auth');
        logger.log.debug('loadFromCookie=',auth_data);
        MoaConfig.auth = auth_data;
        return MoaConfig.auth;
    }

    static processLogin(username,auth_token,staySignedIn) {

        let dic_param = {token:auth_token};
        AuthService.getUserinfo(dic_param,function(response) {
            logger.log.debug("processLogin.response=",response);
            
            let json_auth = {
                username:username, token:auth_token,loggedIn: true, staySignedIn: staySignedIn,
                id:response.data.id, email:response.data.email
            }
            AuthService.setData(json_auth);
    
        }, function(response) {
            logger.log.debug("processLogin.Error - response=",response);
            if (response.status==400) {
            }
        });

    }

    static processLogout(username) {
        let json_auth = {
            username:username, token:null,loggedIn: false, staySignedIn: MoaConfig.auth.staySignedIn
        }
        AuthService.setData(json_auth);
    }

}
