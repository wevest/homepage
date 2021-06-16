import {MoaConfig} from 'src/data/MoaConfig';
import AuthService from 'src/services/authService';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import { PortfolioListModel, PortfolioModel, PortfolioItemModel} from "src/store/PortfolioModel";

export default class User {
  id = null; 
  username = null;
  email = null;

  token = null;
  loggedIn = false;
  staySignedIn = false;
  
  avatar = null;
  avatar_thumb = null;
  first_name = null;
  last_name = null;
  biography=null;

  coin=null;
  dislike_count=null;
  like_count=null;
  comment_count=null;
  question_count=null;
  answer_count=null;
  post_count=null;

  portfolio=new PortfolioListModel();


  constructor() {

  }


  static loadProfile(username) {    
    let dic_param = {'username':username};
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

  assign(obj) {
    this.id = obj.id;
    this.username = obj.username;
    this.email = obj.email;
    this.avatar = obj.avatar;
    this.avatar_thumb = obj.avatar_thumb;
    this.token = CommonFunc.safeGetKeyValue(obj,'token');
    this.loggedIn = CommonFunc.safeGetKeyValue(obj,'loggedIn');
    this.staySignedIn = CommonFunc.safeGetKeyValue(obj,'staySignedIn');

    this.first_name = CommonFunc.safeGetKeyValue(obj,'first_name');
    this.last_name = CommonFunc.safeGetKeyValue(obj,'last_name');
    this.title = CommonFunc.safeGetKeyValue(obj,'title');
    this.biography = CommonFunc.safeGetKeyValue(obj,'biography');
    this.avatar = CommonFunc.safeGetKeyValue(obj,'avatar');
    this.avatar_thumb = CommonFunc.safeGetKeyValue(obj,'avatar_thumb');
    this.coin = CommonFunc.safeGetKeyValue(obj,'coin');
    this.like_count = CommonFunc.safeGetKeyValue(obj,'like_count');
    this.dislike_count = CommonFunc.safeGetKeyValue(obj,'dislike_count');
    this.date_joined = CommonFunc.safeGetKeyValue(obj,'date_joined');
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  updateAvatar(url) {
    this.avatar_url = url;
  }

 loadPortfolio()  {
  const _this = this;
  return new Promise(function(resolve,reject) {   
    _this.portfolio.load(_this.username).then( response => {
      resolve(response);
    });
    });
  }

}
 