import {MoaConfig} from 'src/data/MoaConfig';
import AuthService from 'src/services/authService';


export default class User {
  id = null; 
  username = null;
  email = null;
  avatar_url = null;
  token = null;
  loggedIn = false;
  staySignedIn = false;

  constructor() {

  }

  assign(obj) {
    this.id = obj.id;
    this.username = obj.username;
    this.email = obj.email;
    this.avatarUrl = obj.avatarUrl;
    this.token = obj.token;
    this.loggedIn = obj.loggedIn;
    this.staySignedIn = obj.staySignedIn;
  }

  isLoggedIn() {
    return this.loggedIn;
  }

  
}
 