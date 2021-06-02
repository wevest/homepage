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
        let json_auth = {
            username:username, token:auth_token,loggedIn: true, staySignedIn: staySignedIn
        }
        AuthService.setData(json_auth);
    }

    static processLogout(username) {
        let json_auth = {
            username:username, token:null,loggedIn: false, staySignedIn: MoaConfig.auth.staySignedIn
        }
        AuthService.setData(json_auth);
    }

}
