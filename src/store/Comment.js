/**
 * Comment Model
 *
 * @example
 * {
 *   "id": 102,
 *   "comment": "Lorem ipsum dolor sit amet, in cum ignota sensibus pericula.",
 *   "modified_date": "2019-08-03T01:49:19.015378Z",
 *   "commentable_id": 6754947194429697,
 *   "commentable_type": "launches",
 *   "user_id": 1,
 *   "parent_id": 99
 * }
 */

 import { Model } from "@vuex-orm/core";
 import User from "src/store/User";
 
 export default class Comment extends Model {
    static entity = "comments";
 
    static fields() {
        return {
            id: this.attr(null).nullable(),
            comment: this.string(""),
            modified_date: this.string(""),

            // Associated entities
            commentable_id: this.number(), // should match the $id of the corresponding entry from the commentable_type Model
            commentable_type: this.string(), // should match the entity name of the corresponding Model, e.g. 'launches' or 'tasks'

            // User
            user_id: this.number(null),
            user: this.belongsTo(User, "user_id"),

            // Parent Comment
            parent_id: this.number(null).nullable(),

            // Child Comments
            children: this.hasMany(Comment, "parent_id")
        };
    }
 
    static beforeCreate(model) {
        model.modified_date = new Date().toISOString();
    }
 
    get parent() {
        return Comment.query().find(this.parent_id);
    }
 
   get child_ids() {
        return Comment.query()
            .where("parent_id", this.id)
            .get()
            .map(comment => comment.id);
    }
 
    get author() {
        return this.user.email;
    }
 }
 