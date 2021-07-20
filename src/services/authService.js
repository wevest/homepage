//import api from '@/services/api'
import {callAPI, callCMSAPI, callPostAPI, callJsonRPC} from 'src/util/Http';
import {store} from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
//import LocalStorageService from 'src/services/localStorage';


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
        //reqParam.no_token = "1";

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
            logger.log.error("AuthService.signOut : err=",err);
            funcErr(err);
        });
    }

    static resetPassword(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/api/user/users/" + reqParam.id + "/reset/");
        callCMSAPI("POST",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            logger.log.error("AuthService.resetPassword : err=",err);
            funcErr(err);
        });
    }

    static forgotPassword(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/api/users/reset_password/");
        callCMSAPI("POST",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            logger.log.error("AuthService.forgotPassword : err=",err);
            funcErr(err);
        });
    }

/*
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
*/
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

    static getUserProfile(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/api/user/users?username="+reqParam.username);
        callCMSAPI("GET",url,{},reqParam)
        .then( (response) => {
            logger.log.debug("getUserProfile:dic_param=",reqParam);

            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }


    static updateUserProfile(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/api/user/users/");
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

    static getInboxMessage(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/api/dm/inbox/");
        callCMSAPI("GET",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    

    static postPrivateMessage(reqParam,func,funcErr) {
        let a_method = "/api/dm/message/thread/"+store.getters.me.id+"/send/";
        let url = AuthService.getUrl(MoaConfig.urls.cms,a_method);
        callCMSAPI("POST",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    

    static deletePrivateMessage(reqParam,func,funcErr) {
        let a_method = "/api/dm/message/thread/"+reqParam.uuid+"/" + reqParam.id + "/delete/";

        let url = AuthService.getUrl(MoaConfig.urls.cms,a_method);
        callCMSAPI("DELETE",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    

    static getThreadMessage(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/api/dm/message/thread/"+reqParam.uuid+"/");
        callCMSAPI("GET",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    

    static editThreadMessage(reqParam,func,funcErr) {
        let a_method = "/api/dm/message/thread/"+store.getters.me.id+"/"+reqParam.thread+"/edit/"
        let url = AuthService.getUrl(MoaConfig.urls.cms,a_method);
        callCMSAPI("PUT",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    


    static deleteThreadMessage(reqParam,func,funcErr) {
        let a_method = "/api/dm/message/thread/"+store.getters.me.id+"/"+reqParam.thread+"/remove/"
        let url = AuthService.getUrl(MoaConfig.urls.cms,a_method);
        callCMSAPI("DELETE",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    

    static replyThreadMessage(reqParam,func,funcErr) {
        let a_method = "/api/dm/message/thread/"+reqParam.uuid+"/"+store.getters.me.id+"/send/";
        let url = AuthService.getUrl(MoaConfig.urls.cms,a_method);
        callCMSAPI("POST",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    

    static addPortfolioItem(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/api/portfolio/portfolios/");
        callCMSAPI("POST",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    


    static deletePortfolioItem(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/api/portfolio/portfolioitems/");
        callCMSAPI("DELETE",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    


    static deletePortfolio(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/api/portfolio/portfolios/");
        callCMSAPI("DELETE",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    


    static getPortfolio(reqParam,func,funcErr) {
        let a_method = "/api/portfolio/portfolios/";
        if ( (reqParam.hasOwnProperty('username')) && (reqParam.username) ) {
            a_method += "?username="+reqParam.username;
        }
        
        if ( (reqParam.hasOwnProperty('id')) && (reqParam.id) ) {
            a_method += "&id=" + reqParam.id;
        }

        if ( (reqParam.hasOwnProperty('type')) && (reqParam.type) ) {
            if (a_method.indexOf('?')==-1) {
                a_method += "?type="+reqParam.type;
            } else {
                a_method += "&type="+reqParam.type;
            }            
        }
        
        let url = AuthService.getUrl(MoaConfig.urls.cms,a_method);
        callCMSAPI("GET",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    


    static getPortfolioGroup(reqParam,func,funcErr) {
        let url = AuthService.getUrl(MoaConfig.urls.cms,"/api/portfolio/portfolios/list/");
        callCMSAPI("GET",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    

    static acceptAnswer(reqParam,func,funcErr) {
        let a_method = "/api/qa/answers/"+reqParam.id+"/accept/";
        logger.log.debug("AuthService.acceptAnaswer : method="+a_method);

        let url = AuthService.getUrl(MoaConfig.urls.cms,a_method);
        callCMSAPI("POST",url,{},reqParam)
        .then( (response) => {
            func(response);
        })
        .catch( (err) => {
            funcErr(err);
        });
    }    


    static followUser(dic_param, func, funcErr) {
        logger.log.debug("AuthService.followUser");

        let a_method = "/api/user/users/" + dic_param.id + "/follow/";
        const url = AuthService.getUrl(MoaConfig.urls.cms,a_method);

        //logger.log.debug("AuthService.followUser : URL=",url);

        callCMSAPI("POST", url, {}, dic_param)
        .then(response => {
            func(response);
        })
        .catch(err => {
            funcErr(err);
        });
    }


    static getRelations(dic_param, func, funcErr) {
        logger.log.debug("AuthService.getRelations");

        let a_method = "/api/user/users/" + dic_param.id + "/relation/";
        const url = AuthService.getUrl(MoaConfig.urls.cms,a_method);

        //logger.log.debug("AuthService.followUser : URL=",url);

        callCMSAPI("POST", url, {}, dic_param)
        .then(response => {
            func(response);
        })
        .catch(err => {
            funcErr(err);
        });
    }

    static getFollower(dic_param, func, funcErr) {
        logger.log.debug("AuthService.getFollower");

        let a_method = "/api/user/users/" + dic_param.id + "/follower/";
        const url = AuthService.getUrl(MoaConfig.urls.cms,a_method);

        callCMSAPI("POST", url, {}, dic_param)
        .then(response => {
            func(response);
        })
        .catch(err => {
            funcErr(err);
        });
    }

    static getFollowing(dic_param, func, funcErr) {
        logger.log.debug("AuthService.getFollowing");

        let a_method = "/api/user/users/" + dic_param.id + "/following/";
        const url = AuthService.getUrl(MoaConfig.urls.cms,a_method);

        callCMSAPI("POST", url, {}, dic_param)
        .then(response => {
            func(response);
        })
        .catch(err => {
            funcErr(err);
        });
    }
    
}
