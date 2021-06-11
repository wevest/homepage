import {MoaConfig} from 'src/data/MoaConfig';
import AuthService from 'src/services/authService';


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


  constructor() {

  }

  assign(obj) {
    this.id = obj.id;
    this.username = obj.username;
    this.email = obj.email;
    this.avatar = obj.avatar;
    this.avatar_thumb = obj.avatar_thumb;
    this.token = obj.token;
    this.loggedIn = obj.loggedIn;
    this.staySignedIn = obj.staySignedIn;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  updateAvatar(url) {
    this.avatar_url = url;
  }



}
 