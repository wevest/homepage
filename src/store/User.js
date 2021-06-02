/**
 * User Model
 *
 * @example
 * {
 *   "id": 6604207465431047,
 *   "active": true,
 *   "email": "joe@google.com",
 *   "ldap": "joe",
 *   "avatarLetter": "J",
 * },
 */
 import { Model } from "@vuex-orm/core";

 export default class User extends Model {
   static entity = "users";
 
   static fields() {
     return {
       id: this.attr(""), // Intentionally not a number to allow for use with getters.blankUser
 
       active: this.boolean(true),
       current_user: this.boolean(false),
       email: this.string("")
     };
   }
 
   /**
    * Modify data before it's stored
    */
   static mutators() {
     return {
       /**
        * Ensure emails are always lowercase
        * @param {string} originalEmail - the raw email
        */
       email(originalEmail) {
         return originalEmail.toLowerCase();
       }
     };
   }
 
   /**
    * Get the LDAP name from the user's email.
    */
   get ldap() {
     if (this.id === "null") return "(Blank)";
 
     // If the user is a Nerdery account, return the full email address
     // This helps prevent duplicate LDAPs on test environments
     if (this.email.trim().endsWith("@nerdery.com")) return this.email;
 
     // If the user's email doesn't contain an `@` symbol, return the full string.
     // Otherwise, return the part before the `@`.
     const index = this.email.indexOf("@");
     const ldap = index >= 0 ? this.email.slice(0, index) : this.email;
     return ldap;
   }
 
   get avatarLetter() {
     return this.email.charAt(0).toUpperCase();
   }
 
   /**
    * Filter out users that are inactive or missing an ldap
    * @param {Array<User>} users - The user list
    */
   static beforeSelect(users) {
     return users.filter(user => Boolean(user.active) && user.ldap);
   }
 }
 