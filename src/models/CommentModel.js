import {store} from 'src/store/store';
import logger from "src/error/Logger";
import _ from 'lodash';

import CommonFunc from 'src/util/CommonFunc';

import {baseCollection} from 'src/models/baseModel';

import CMSAPI from 'src/services/cmsService';
import { a } from 'hangul-js';


export class CommentModel {
    id = null;
    allow_reply = null;
    comment = null;
    flags = null;
    is_removed = null;
    level=null;
    parent_id = null;
    permalink = null;
    submit_date=null;
    user_avatar=null;
    user_name = null;
    user_moderator=null;
    user_url=null;
    children=[];

    like_count=0;
    dislike_count=0;

    static clone(item) {
        let a_comment = new CommentModel();
        a_comment.assign(item);
        return a_comment;
    }
    
    setVoteCount() {
        this.like_count = _.filter(this.flags,{'flag':'like'}).length;
        this.dislike_count = _.filter(this.flags,{'flag':'dislike'}).length;
        logger.log.debug("CommentModel.setVoteCount : like,dislike=",this.like_count);
    }

    assign(obj) {
        this.id = obj.id;
        this.allow_reply = obj.allow_reply;
        this.comment = obj.comment;
        this.is_removed = obj.is_removed;
        this.level=obj.level;
        this.parent_id = obj.parent_id;
        this.permalink = obj.permalink;
        this.submit_date=obj.submit_date;
        this.user_avatar=obj.user_avatar;
        this.user_name = obj.user_name;
        this.user_moderator=obj.user_moderator;
        this.user_url=obj.user_url;

        this.flags = CommonFunc.safeGetKeyValue(obj,'flags',null);        
        this.children=CommonFunc.safeGetKeyValue(obj,'children',null);
        this.setVoteCount();
    }   

    remove() {

    }
}

export class CommentListModel extends baseCollection {
    assign (comments) {
        for (let index = 0; index < comments.length; index++) {
            let a_comment = new CommentModel();
            a_comment.assign(comments[index]);
            this.add(a_comment);
        }
    }

    toCommentModel (comments) {
        let items = [];
        for (let index = 0; index < comments.length; index++) {
            let a_comment = new CommentModel();
            a_comment.assign(comments[index]);
            items.push(a_comment);
        }
        return items;
    }

    toTree(items) {
        const _this=this;

        // Create root for top-level node(s)
        let root = [];
        // Cache found parent index
        let map = {};
        
        items.forEach(node => {
            //console.log("node=",node);
            // No parentId means top level
            node.level = 1;
            if ( (!node.parent_id) || (node.id==node.parent_id) ) {
                node.level = 0;
                return root.push(node);
            }
            
            // Insert node as child of parent in flat array
            let parentIndex = map[node.parent_id];
            if (typeof parentIndex !== "number") {
                parentIndex = items.findIndex(el => el.id === node.parent_id);
                map[node.parent_id] = parentIndex;
            }
            
            if (!items[parentIndex].children) {
                return items[parentIndex].children = [node];
            }
            
            items[parentIndex].children.push(node);
        });
        
        console.log("CommenList.toTreeData=",root);
        return root;
    }


    addComments(dic_param,response) {
        logger.log.debug("CommentListModel.addComments: dic_param=",dic_param,response);

        let a_comment = new CommentModel();        
        a_comment.id = response.data.id;
        a_comment.comment = response.data.comment; 
        a_comment.user_name=response.data.name;
        a_comment.user_avatar=dic_param.avatar;
        a_comment.submit_date = CommonFunc.getCurrentDatetime(1);

        a_comment.allow_reply = true;
        a_comment.flags=[];
        a_comment.is_removed=false;
        a_comment.level=0;
        a_comment.permalink='';        
        a_comment.user_url = '';
        a_comment.user_moderator='';

        logger.log.debug("CommentListModel.addComments : a_comment=",a_comment);

        //is it reply?
        if (dic_param.reply_to==0) {
            a_comment.parent_id = response.data.id;
            this.items.unshift(a_comment);
            return;
        } 
        
        //let v_comments = [...this.items];

        a_comment.parent_id = response.data.reply_to;
        a_comment.level = 1;

        //return _.find(this.items,{id:id} );
        let index = _.findIndex(this.items,{id:a_comment.parent_id});
        
        if (index>-1) {
            let a_item = this.items[index];
            logger.log.debug("addComments : a_item=",a_item);

            if ( (! a_item.hasOwnProperty("children")) || (CommonFunc.isEmptyObject(a_item.children)) ) {
                a_item.children = [];
            } 
            a_item.children.unshift(a_comment);
            
            this.items[index] = a_item;
        }
    }

    editComments(dic_param,response) {
        logger.log.debug("CommentListModel.editComments - dic_param=",dic_param,response);
        //this.delete(dic_param.id);
    }

    removeComments(dic_param,response) {
        logger.log.debug("CommentListModel.removeComments - dic_param=",dic_param,response);
        this.delete(dic_param.id);
    }

    load(dic_param) {
        const _this=this;

        return new Promise(function(resolve,reject) {            
            //let dic_param = {content_type:'blog-postpage' , id:page_id, limit:limit, offset:offset};
            CMSAPI.getComments(dic_param,function(response) {
                logger.log.debug("PostModel.loadComments - dic_param=",dic_param,response);
                
                let comments = _this.toCommentModel(response.data.results);
                logger.log.debug("PageModel.loadComments: comments=",comments);
                let treeComments = _this.toTree(comments);
                logger.log.debug("PageModel.loadComments: treeComments=",treeComments);                    
                _this.items = _this.items.concat(treeComments); 
    
                resolve(response);

            },function(err) {
                logger.log.error("PostModel.loadComments - error",err);
                reject(err);
            });
        });            
    }

    post(dic_param) {
        const _this=this;

        return new Promise(function(resolve,reject) {            
            dic_param.token = store.getters.token;
            CMSAPI.postBlogComment(dic_param,function(response) {
                logger.log.debug("PostModel.postComment=",response);
                _this.addComments(dic_param,response);
                resolve(response);

            }, function(err) {
                logger.log.error("PostModel.postComment=",err);
                reject(Err);
            });
        });
    }    


    editComment(dic_param) {
        const _this=this;
        logger.log.debug("CommentListModel.editComment : dic_param=",dic_param);
        return new Promise(function(resolve,reject) {            
            dic_param.token = store.getters.token;
            CMSAPI.editBlogComment(dic_param,function(response) {
                logger.log.debug("CommentListModel.editComment=",response);
                _this.editComments(dic_param,response);
                resolve(response);

            }, function(err) {
                logger.log.error("CommentListModel.editComment=",err);
                reject(Err);
            });
        });
    }    

    removeComment(dic_param) {
        const _this=this;
        logger.log.debug("CommentListModel.removeComment : dic_param=",dic_param);
        return new Promise(function(resolve,reject) {            
            dic_param.token = store.getters.token;
            CMSAPI.deleteBlogComment(dic_param,function(response) {
                logger.log.debug("CommentListModel.removeComment=",response);
                _this.removeComments(dic_param,response);
                resolve(response);

            }, function(err) {
                logger.log.error("CommentListModel.removeComment=",err);
                reject(Err);
            });
        });
    }    

    vote(dic_param) {
        const _this=this;
        logger.log.debug("CommentsListModel.vote : dic_param=",dic_param);

        return new Promise(function(resolve,reject) {            
            dic_param.token = store.getters.token;
            CMSAPI.postCommentFeedback(dic_param,function(response) {
                logger.log.debug("CommentsListModel.vote : response=",response);
                
                if (response.status=="201") {                    
                    
                    let index = _.findIndex(_this.items,{id:dic_param.comment});
                    if (index>-1) {
                        let a_comment = _this.items[index];

                        //logger.log.debug("CommentsListModel.vote : a_comment=",a_comment);
                        if (dic_param.flag=="like") {
                            a_comment.like_count = a_comment.like_count+1;    
                        } else {
                            a_comment.dislike_count = a_comment.dislike_count+1;    
                        }                        
                    }
                }
                        
                CommonFunc.updateRatingCount(_this,response);
                resolve(response);


            }, function(response) {
                reject(response);
            });                
        });
    }

}


export class AnswerCommentModel {
    id=null;
    answer_id=null;
    question_id=null;
    owner=null;
    comment_text=null;
    like_count=null;
    dislike_count=null;
    pub_date = null;   
    comments = null;

    assign(obj) {
        this.id=obj.id;
        this.answer_id=obj.answer_id;
        this.question_id=obj.question_id;
        this.owner=obj.api_owner;
        this.comment_text=obj.comment_text;
        this.like_count=obj.like_count;
        this.dislike_count=obj.dislike_count;
        this.pub_date=obj.pub_date;
    }

    vote(dic_param) {
        const _this=this;
        
        dic_param.id = this.id;
        dic_param.token = store.getters.token;
        return new Promise(function(resolve,reject) {
            CMSAPI.voteAssetAnswerComment(dic_param,function(response) {
                //_this.g_data = response.data;
                logger.log.debug("AnswerCommentModel.vote - response",response);

                _this.like_count = response.data.data.like_count;
                _this.dislike_count = response.data.data.dislike_count;

                resolve(response);

            },function(err) {
                logger.log.error("AnswerCommentModel.vote - error",err);
                reject(err);
            });
        });
    }

}



export class AnswerCommentListModel extends baseCollection {

    assign(comments) {
        for (let index=0; index<comments.length;index++) {
            let a_comment = new AnswerCommentModel();
            a_comment.assign(comments[index]);
            this.add(a_comment);
        }
    }

    load(question_id) {
        const _this = this;

        return new Promise(function(resolve,reject) {
            let dic_param = {question_id:question_id};
            logger.log.debug("AnswerCommentListModel.load - dic_param=",dic_param);

            CMSAPI.getAssetAnswerComment(dic_param,function(response) {
                logger.log.debug("AnswerCommentListModel.load - response",response.data);
                _this.assign(response.data.results);
                resolve(response);
            },function(err) {
                logger.log.error("AnswerCommentListModel.load - error",err);
                reject(err);
            });
        });            

    }

}
