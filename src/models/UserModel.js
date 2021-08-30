import {store} from 'src/store/store';
import {Config} from 'src/data/Config';

import CMSAPI from 'src/services/cmsService';
import AuthService from 'src/services/authService';

import {baseCollection} from 'src/models/baseModel';

import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import Hasher from 'src/util/Hasher';
import logger from "src/error/Logger";

import LocalStorageService from 'src/services/localStorage';
import { PortfolioListModel, PortfolioModel, PortfolioItemModel} from "src/models/PortfolioModel";
import { BookmarkListModel } from "src/models/BookmarkModel";


export class FeedModel {
    id=null;
    uuid=null;
    object=null;
    username=null;
    user_id=null;
    avatar=null;
    pub_date=null;
    title=null;
    verb=null;
    url= null;
    parent=null;
    parent_id=null;
    foreign_id=null;
    category=null;
    question=null;
    question_id=null;
    owner=null;
    action=null;
    extra=null;
    
    target=null;
    target_user=null;
    target_display_name=null;

    assign(obj) {
        //logger.log.debug("FeedModel.assign: obj=",obj);

        this.id = obj.object;
        this.verb = obj.verb;
        this.pub_date = obj.time;
        this.avatar = obj.avatar;
        this.username = obj.actor;
        this.user_id = obj.user_id;
        this.title = obj.title;
        this.uuid = obj.id;
        this.foreign_id = CommonFunc.safeGetKeyValue(obj,'foreign_id');

        this.parent = CommonFunc.safeGetKeyValue(obj,'parent');
        this.parent_id = CommonFunc.safeGetKeyValue(obj,'parent_id');
        this.category = CommonFunc.safeGetKeyValue(obj,'category');

        this.question = CommonFunc.safeGetKeyValue(obj,'question');
        this.question_id = CommonFunc.safeGetKeyValue(obj,'question_id');

        this.owner = CommonFunc.safeGetKeyValue(obj,'owner');
        this.action = CommonFunc.safeGetKeyValue(obj,'action');
        this.extra = CommonFunc.safeGetKeyValue(obj,'extra');
        this.target = CommonFunc.safeGetKeyValue(obj,'target');

        //this.url = this.getUrl();
    }

    getUrl() {
        let a_url = "";

        if (this.verb=='post') {
            a_url = NavFunc.navBlogDetail(null,this.id,true);
        }
        
        return a_url;
    }
}

export class FeedListModel extends baseCollection{
    next_url= null;

    assign(response) {
        logger.log.debug("FeedListModel.assign : response=",response);

        this.next_url = response.next;
        for (let index=0; index<response.results.length; index++) {
            let a_feed = new FeedModel();
            a_feed.assign(response.results[index]);
            this.add(a_feed);
        }
    }

    load(userid,username,limit=20,uuid='') {
        let dic_param = {user_id:userid,username:username,uuid:uuid,limit:limit};
        
        const _this = this;
        return new Promise(function(resolve,reject) {
            CMSAPI.getUserFeeds(dic_param,function(response) {
                logger.log.debug("FeedListModel.load - response",response.data);
                
                _this.assign(response.data.data);
                resolve(response.data);

            },function(err) {
                logger.log.error("FeedListModel.load - error",err);                
                reject(err);
            });
        });            

    }

    loadMine(userid,username,offset=0,limit=20,uuid='') {
        let dic_param = {user_id:userid,username:username,
            token:store.getters.token,uuid:uuid,offset:offset,limit:limit};
        
        const _this = this;
        return new Promise(function(resolve,reject) {
            CMSAPI.getMyFeeds(dic_param,function(response) {
                logger.log.debug("FeedListModel.loadMine - response",response.data);
                
                _this.assign(response.data.data);
                resolve(response.data);

            },function(err) {
                logger.log.error("FeedListModel.loadMine - error",err);                
                reject(err);
            });
        });            

    }

}


export class NotificationListModel extends FeedListModel{

    assign(response) {
        logger.log.debug("NotificationListModel.assign : response=",response);

        this.next_url = response.next;
        for (let index=0; index<response.results.length; index++) {
            for (let index2=0; index2<response.results[index].activities.length; index2++) {    
                let a_feed = new FeedModel();
                a_feed.assign(response.results[index].activities[index2]);
                this.add(a_feed);
            }
        }
    }

    load(userid,username,limit=20,uuid='') {
        let dic_param = {user_id:userid,username:username,
            token:store.getters.token,uuid:uuid,limit:limit};
        
        const _this = this;
        return new Promise(function(resolve,reject) {
            CMSAPI.getUserNotification(dic_param,function(response) {
                logger.log.debug("NotificationListModel.load - response",response.data);
                
                _this.assign(response.data.data);
                resolve(response.data);

            },function(err) {
                logger.log.error("NotificationListModel.load - error",err);                
                reject(err);
            });
        });            

    }    
}

export class FriendModel {
    username=null;
    id=null;
    created_at=null;    
    avatar=null;
    avatar_thumb=null;
    biography=null;
    target_id=null;
    
    is_follower=false;
    is_following=false;

    assign(obj) {
        this.id = obj.api_user.id;
        this.username = obj.api_user.username;        
        this.biography = obj.api_user.biography;
        this.avatar = obj.api_user.avatar;
        this.avatar_thumb = obj.api_user.avatar_thumb;
        this.created_at = obj.created_at;
    }

}


export class FriendListModel extends baseCollection{
    next_url= null;

    assign(items) {
        for (let index=0; index<items.length; index++) {
            let a_friend = new FriendModel();
            
            //logger.log.debug("FriendListModel.assign : item=",items[index]);

            a_friend.assign(items[index]);
            this.add(a_friend);
        }
    }

    setFollowers(value) {
        for (let index=0; index<this.items.length; index++) {
            let a_friend = this.items[index];
            a_friend.is_follower = value;
        }
    }

    setFollowings(value) {
        for (let index=0; index<this.items.length; index++) {
            let a_friend = this.items[index];
            a_friend.is_following = value;
        }
    }

}



export class HolderModel {
    username=null;
    id=null;
    created_at=null;    
    updated_at=null;    
    avatar=null;
    avatar_thumb=null;
    biography=null;
    description=null;
    price=null;
    asset=null;
    portfolio_id=null;
    portfolio_item_id=null;
    
    assign(obj) {
        this.id = obj.api_user.id;
        this.username = obj.api_user.username;        
        this.display_name = obj.api_user.display_name;
        this.biography = obj.api_user.biography;
        this.avatar = obj.api_user.avatar;
        this.avatar_thumb = obj.api_user.avatar_thumb;        
        this.description=obj.description;
        this.price = obj.price;
        this.portfolio_id = obj.portfolio_id;
        this.portfolio_item_id = obj.portfolio_item_id;
        this.created_at = obj.created_at;
        this.updated_at = obj.updated_at;
        this.asset = obj.api_asset;

        if (CommonFunc.isEmptyObject(this.display_name)) {
            this.display_name = this.username;
        }

    }
}


export class HolderListModel extends baseCollection{
    next_url= null;

    assign(items) {
        for (let index=0; index<items.length; index++) {
            let a_holder = new HolderModel();            
            //logger.log.debug("FriendListModel.assign : item=",items[index]);
            a_holder.assign(items[index]);
            this.add(a_holder);
        }
    }
}

export default class User {
    id = null; 
    username = null;
    email = null;
    title=null;
    password=null;
    token = null;
    loggedIn = false;
    staySignedIn = false;
    
    avatar = null;
    avatar_thumb = null;
    first_name = null;
    last_name = null;
    biography=null;
    display_name=null;

    coin=null;
    dislike_count=null;
    like_count=null;
    comment_count=null;
    question_count=null;
    answer_count=null;
    post_count=null;
    follower_count=0;
    following_count=0;
    is_following=false;
    default_lang=null;

    portfolio = new PortfolioListModel();

    follower = new FriendListModel();
    following = new FriendListModel();

    feeds = new FeedListModel();
    bookmarks = new BookmarkListModel();

    constructor() {

    }


    assign(obj) {
        this.id = obj.id;
        this.username = obj.username;
        this.email = obj.email;
        this.avatar = obj.avatar;
        this.avatar_thumb = obj.avatar_thumb;
        
        this.first_name = CommonFunc.safeGetKeyValue(obj,'first_name');
        this.last_name = CommonFunc.safeGetKeyValue(obj,'last_name');
        this.display_name = CommonFunc.safeGetKeyValue(obj,'display_name');
        this.biography = CommonFunc.safeGetKeyValue(obj,'biography');
        this.avatar = CommonFunc.safeGetKeyValue(obj,'avatar');
        this.avatar_thumb = CommonFunc.safeGetKeyValue(obj,'avatar_thumb');
        this.coin = CommonFunc.safeGetKeyValue(obj,'coin');
        this.like_count = CommonFunc.safeGetKeyValue(obj,'like_count');
        this.dislike_count = CommonFunc.safeGetKeyValue(obj,'dislike_count');
        this.date_joined = CommonFunc.safeGetKeyValue(obj,'date_joined');
        this.default_lang = CommonFunc.safeGetKeyValue(obj,'default_lang');

        this.follower_count = CommonFunc.safeGetKeyValue(obj,'follower_count');
        this.following_count = CommonFunc.safeGetKeyValue(obj,'following_count');
        this.is_following = CommonFunc.safeGetKeyValue(obj,'is_following');

        this.follower = new FriendListModel();
        this.following = new FriendListModel();    
        this.feeds = new FeedListModel();
        this.bookmarks = new BookmarkListModel();

        if (CommonFunc.isEmptyObject(this.display_name)) {
            this.display_name = this.username;
        }

        //not necessary 
        ///this.password = CommonFunc.safeGetKeyValue(obj,'password');        
        //this.token = CommonFunc.safeGetKeyValue(obj,'token');
        //this.loggedIn = CommonFunc.safeGetKeyValue(obj,'loggedIn');
        //this.staySignedIn = CommonFunc.safeGetKeyValue(obj,'staySignedIn');
    }

    isLoggedIn() {
        return this.loggedIn;
    }

    updateAvatar(url) {
        this.avatar_url = url;
    }

    toJson() {
        let jsonData = {
            id: this.id,
            username: this.username,
            avatar: this.avatar,
            avatar_thumb: this.avatar_thumb,
            display_name:this.display_name,
            staySignedIn:this.staySignedIn,
            loggedIn:this.loggedIn,
            email: this.email,
            default_lang: this.default_lang,        
            bookmarks: this.bookmarks.toDict(),
            extra:'',
            token:''
        };
        

        if ( (this.password) && (this.password.length>0) ) {
            jsonData.extra = Hasher.encode(this.username,this.password);
        }

        if ( (this.token) && (this.token.length>0) ) {
            jsonData.token = Hasher.encode(this.username,this.token);
        }
        
        return jsonData;
    }

    fromJson(obj) {
        this.id = CommonFunc.safeGetKeyValue(obj,'id');
        this.username = CommonFunc.safeGetKeyValue(obj,'username');
        this.display_name = CommonFunc.safeGetKeyValue(obj,'display_name');
        this.avatar = CommonFunc.safeGetKeyValue(obj,'avatar');
        this.avatar_thumb = CommonFunc.safeGetKeyValue(obj,'avatar_thumb');
        this.staySignedIn = CommonFunc.safeGetKeyValue(obj,'staySignedIn');
        this.loggedIn = CommonFunc.safeGetKeyValue(obj,'loggedIn');
        this.email = CommonFunc.safeGetKeyValue(obj,'email');
        
        this.default_lang = 'en';
        if ( (obj) && (obj.hasOwnProperty('default_lang'))) {
            this.default_lang = obj.default_lang;
        }
        
        this.password = '';
        if ( (obj) && (obj.hasOwnProperty('extra'))) {
            if (this.username) {
                if ( (obj.extra) && (obj.extra.length>0) ) {
                    this.password = Hasher.decode(this.username,obj.extra);
                }                
            }
        }

        this.token = '';
        if ( (obj) && (obj.hasOwnProperty('token'))) {
            if ( (obj.token) && (obj.token.length>0) ) {
                this.token = Hasher.decode(this.username,obj.token);
            }            
        }


        if ( (obj) && (obj.hasOwnProperty('bookmarks'))) {
            this.bookmarks.fromJson(obj.bookmarks);
        }
        
    }

    getToken() {
        return this.token;
    }
  
    loadPortfolio(portfolio_id)  {
        const _this = this;
        
        let dicParam = {username:this.username,portfolio_id:portfolio_id};
        return new Promise(function(resolve,reject) {   
            _this.portfolio.clear();
            _this.portfolio.load(dicParam).then( response => {
                resolve(response);
            }).catch(err=>{
                reject(err);
            });
        });
    }

    static loadProfile(username) {    
        let dic_param = {'username':username};
        if (store.getters.me.isLoggedIn() ) {
            dic_param['token'] = store.getters.token;
        }
        logger.log.debug("UserModel.loadProfile - dic_param",dic_param);
        return new Promise(function(resolve,reject) {
            
            AuthService.getUserProfile(dic_param,function(response) {
                logger.log.debug("UserModel.loadProfile - response",response);
                
                if (response.data.results.length==0) {
                  reject();
                }
  
                const obj = response.data.results[0];
                
                let v_user = new User();            
                v_user.assign(obj);
  
                resolve(v_user);
  
            },function(err) {
                logger.log.error("ProfileView.loadUserProfile - error",err);
                reject();
            });
        });
    }

    loadProfile() {    
        let dic_param = {'username':this.username};
        if (this.isLoggedIn() ) {
            dic_param['token'] = this.token;
        }
        logger.log.debug("UserModel.loadProfile - dic_param",dic_param);
        const _this=this;
        return new Promise(function(resolve,reject) {
            AuthService.getUserProfile(dic_param,function(response) {
                logger.log.debug("UserModel.loadProfile - response",response);
                
                if (response.data.results.length==0) {
                    reject(response.data);
                }
  
                const obj = response.data.results[0];                
                _this.assign(obj);
                resolve(response.data);
  
            },function(err) {
                logger.log.error("UserModel.loadProfile - error",err);
                reject(err);
            });
        });
    }

    signUp(dic_param) {
        const _this=this;

        return new Promise(function(resolve,reject) {
            AuthService.signUp(dic_param,function(response) {
                logger.log.debug("UserModel.signUp.response=",response);
                resolve(response);                
                                
            }, function(response) {
                if (response.status==400) {
                    reject(response);
                }
            });
        });
    }

    signIn(dic_param) {
        const _this = this;

        return new Promise(function(resolve,reject) {    
            AuthService.signIn(dic_param,function(response) {
                logger.log.debug("onSignIn.response=",response);

                _this.loggedIn = true;                
                _this.token = response.data.auth_token;            
                _this.staySignedIn = dic_param.stay_loggedin;
                _this.password = dic_param.password;

                _this.processLogin(response.data.auth_token, dic_param.stay_loggedin).then( resp => {
                
                    logger.log.debug("onSignIn.response2=",resp.data);
                    _this.assign(resp.data);
                    _this.saveToCookie();

                    resolve(response);
                });

            }, function(response) {
                logger.log.debug("onSignIn.Error - response=",response);
                if (response.status==400) {
                    reject(response);
                }
            });
        });

    }


    signOut() {
        const _this = this;
        let dic_param = {token:this.getToken()};

        logger.log.debug("User.signOut");
        return new Promise(function(resolve,reject) {    
            AuthService.signOut(dic_param,function(response) {          
                _this.processLogout();
                logger.log.debug("User.signOut - done");
                resolve(response);
            }, function(response) {
                logger.log.debug("onClickSignOut.Error - response=",response);                
                _this.processLogout();
                reject(response);                
            });
        });

    }

    processLogout() {
        this.loggedIn = false;
        this.token = '';
        this.saveToCookie();
    }

    processLogin(auth_token) {
        return new Promise(function(resolve,reject) {    
            let dic_param = {token:auth_token};
            AuthService.getUserinfo(dic_param,function(response) {
                logger.log.debug("processLogin.response=",response);
                resolve(response);
            }, function(response) {
                logger.log.debug("processLogin.Error - response=",response);
                if (response.status==400) {
                    reject(response);
                }
            });

        });

    }

    saveToCookie() {
        logger.log.debug("saveToCookie=",this.toJson());
        LocalStorageService.save('auth',this.toJson());
    }

    loadFromCookie()
    {
        //"b115a4bd60cb0cf081976f2c1605ff2ce922023f"
        let auth_data = LocalStorageService.load('auth');
 
        //logger.log.debug('loadFromCookie=',auth_data);
        this.fromJson(auth_data);
        logger.log.debug('loadFromCookie=',auth_data);
    }

    updateProfile() {
        const _this = this;
        
        let dic_param = {
            id:this.id,
            username:this.username,
            first_name:this.first_name,
            last_name:this.last_name,
            biography:this.biography,
            display_name:this.display_name,
            avatar:this.avatar,
            avatar_thumb:this.avatar_thumb,
            default_lang:this.default_lang,
            token:store.getters.token
        };
        //dic_param.token = v_user.token;
        logger.log.debug("UserModel.updateUserProfile :  dic_param=",dic_param);

        return new Promise(function(resolve,reject) {
            AuthService.updateUserProfile(dic_param,function(response) {
                logger.log.debug("UserModel.updateUserProfile - response",response.data);
                _this.saveToCookie();
                resolve(response.data);
            },function(err) {
                logger.log.error("UserModel.updateUserProfile - error",err);                
                reject(err);
            });
        });            
    }

    updateFollowProperty(response) {
        
        if (response.data.ret==0) {
            if (response.data.value==1) {
                this.is_following = true;
                this.follower_count += 1;
            } else {
                this.is_following = false;
                this.follower_count -= 1;
            }
        }
    }

    follow(user_id,value) {
        const _this = this;

        let dic_param = {
            id:user_id,
            value:value,
            token:store.getters.token
        };
        //dic_param.token = v_user.token;
        logger.log.debug("UserModel.follow :  dic_param=",dic_param);

        return new Promise(function(resolve,reject) {

            AuthService.followUser(dic_param,function(response) {
                logger.log.debug("UserModel.follow - response",response.data);                
                _this.updateFollowProperty(response);
                resolve(response.data);
            },function(err) {
                logger.log.error("UserModel.follow - error",err);                
                reject(err);
            });
        });            
    }
    
    getRelation(offset,limit) {
        let dic_param = {id:this.id,username:this.username,token:store.getters.token,
            offset:offset,limit:limit};
        
        const _this = this;
        return new Promise(function(resolve,reject) {
            CMSAPI.getUserRelation(dic_param,function(response) {
                logger.log.debug("UserModel.getRelation - response",response.data);
                
                _this.following.assign(response.data.data.following);
                _this.follower.assign(response.data.data.follower);

                resolve(response.data);
            },function(err) {
                logger.log.error("UserModel.getRelation - error",err);                
                reject(err);
            });
        });            
    }

    loadFollower(offset,limit) {
        let dic_param = {id:this.id,username:this.username,token:store.getters.token,
            offset:offset,limit:limit};
        
        const _this = this;
        return new Promise(function(resolve,reject) {
            CMSAPI.getFollower(dic_param,function(response) {
                logger.log.debug("UserModel.loadFollower - response",response.data);
                
                //_this.following.assign(response.data.data.following);
                _this.follower_count = response.data.data.count;
                _this.follower.assign(response.data.data.results);
                _this.follower.setFollowers(true);
                logger.log.debug("UserModel.loadFollower - this=",_this);

                resolve(response.data);
            },function(err) {
                logger.log.error("UserModel.getFollower - error",err);                
                reject(err);
            });
        });            
    }

    loadFollowing(offset,limit) {
        let dic_param = {id:this.id,username:this.username, token:store.getters.token,
            offset:offset,limit:limit};
        
        const _this = this;
        return new Promise(function(resolve,reject) {
            CMSAPI.getFollowing(dic_param,function(response) {
                logger.log.debug("UserModel.loadFollowing - response",response.data);
                
                //_this.following.assign(response.data.data.following);
                _this.following_count = response.data.data.count;
                _this.following.assign(response.data.data.results);
                _this.following.setFollowings(true);
                resolve(response.data);
            },function(err) {
                logger.log.error("UserModel.loadFollowing - error",err);                
                reject(err);
            });
        });            
    }

    loadFeeds(offset,limit,uuid='') {
        //let dic_param = {user_id:this.id,username:this.username,uuid:uuid,offset:offset,limit:limit};        
        logger.log.debug("UserModel.loadFeeds : feeds=",this.feeds);
        const _this = this;
        return new Promise(function(resolve,reject) {
            _this.feeds.load(_this.id,_this.username,offset,limit,uuid).then(response=>{
                resolve(response);
            }).catch(err=>{
                reject(err);
            });                
        });            
    }

    loadMyFeeds(offset,limit,uuid='') {
        //let dic_param = {user_id:this.id,username:this.username,uuid:uuid,offset:offset,limit:limit};        
        logger.log.debug("UserModel.loadMyFeeds : feeds=",this.feeds);
        const _this = this;
        return new Promise(function(resolve,reject) {
            _this.feeds.loadMine(_this.id,_this.username,offset,limit,uuid).then(response=>{
                resolve(response);
            }).catch(err=>{
                reject(err);
            });                
        });            
    }

    loadBookmarks() {
        logger.log.debug("UserModel.loadBookmarks");
        const _this = this;

        let dicParam = {userid:this.id,offset:0,limit:1000};
        return new Promise(function(resolve,reject) {
            _this.bookmarks.load(dicParam).then(response=>{
                resolve(response);
            }).catch(err=>{
                reject(err);
            });                
        });            
    }

    changePassword(dicParam) {
        dicParam.id=this.id;
        dicParam.token = store.getters.token;
        logger.log.debug("UserModel.changePassword : dicParam=",dicParam);
                
        const _this = this;
        return new Promise(function(resolve,reject) {            
            AuthService.changePassword(dicParam,function(response) {
                resolve(response);
            },function(err) {
                reject(err);
            });                
        });            
    }

    resetPassword(dicParam) {
        dicParam.id=this.id;
        logger.log.debug("UserModel.resetPassword : dicParam=",dicParam);
                
        const _this = this;
        return new Promise(function(resolve,reject) {
            AuthService.forgotPassword(dicParam,function(response) {
                resolve(response);
            },function(err) {
                reject(err);
            });                
        });            
    }

    uploadAvatar(form) {
        const _this=this;

        return new Promise(function(resolve,reject) {
            AuthService.uploadAvatar(form,function(response) {
                logger.log.debug("UserModel.uploadAvatar");
                resolve(response);
            }, function(err) {
                logger.log.error("UserModel.uploadAvatar");
                reject(err);
            })
        });
    }

    uploadImage(form) {
        const _this=this;

        return new Promise(function(resolve,reject) {
            AuthService.uploadImage(form,function(response) {
                logger.log.debug("UserModel.uploadImage");
                resolve(response);
            }, function(err) {
                logger.log.error("UserModel.uploadImage");
                reject(err);
            })
        });
    }

}


export class UserListModel extends baseCollection{

    assign(items) {
        for (let index=0; index<items.length; index++) {
            let a_user = new User();            
            //logger.log.debug("FriendListModel.assign : item=",items[index]);
            a_user.assign(items[index]);
            this.add(a_user);
        }
    }

    load(dic_param) {
        logger.log.debug("UserListModel.load");
                
        const _this = this;
        return new Promise(function(resolve,reject) {
            CMSAPI.getCaptains(dic_param,function(response) {
                logger.log.debug("UserListModel.load - response",response.data);
                
                _this.assign(response.data.data.results);
                logger.log.debug("UserListModel.load - this=",_this);

                resolve(response.data);
            },function(err) {
                logger.log.error("UserListModel.getFollower - error",err);                
                reject(err);
            });
        });            

    }
}