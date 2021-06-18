import {store} from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import logger from "src/error/Logger";
import CommonFunc from 'src/util/CommonFunc';

import {baseCollection} from 'src/models/baseModel';

import CMSAPI from 'src/services/cmsService';


export class PostPageModel {
    id = null;
    category = null;
    category_id = null;
    api_categories = null;
    api_tags = null;
    api_owner = {id:null, avatar:'', avatar_thumb:'', username:null};
    body = null;
    text = null;
    dislike_count=null;
    like_count=null;
    meta=null;
    owner=null;
    pub_date=null;
    read_count=null;
    title=null;
    slug=null;

    //computed fields
    is_owner=null;
    category_id=null;
    category_name=null;
    tags=null;
    
    //to check saved
    saved=null;

    // to track content type
    content_type=null;

    reward=0;
    parent_id=null;
    question_id=null;

    closed=false;
    description=null;
    total_points=null;

    constructor() 
    {

    }

    formatTags(tags) {
      let msg = "";
      for (let index=0;index<tags.length;index++) {
        msg += tags[index].name + ",";
      }
      return msg.substring(0,msg.length-1);
    }


    setContentType(value) {
      this.content_type = value;
    }


    assign(obj) {
        //this = new PostPage();
        this.id = obj.id;
        this.title = obj.title;
        this.slug = CommonFunc.safeGetKeyValue(obj,'slug');        
        this.body = obj.body;
        
        this.read_count=obj.read_count;
        this.dislike_count=obj.dislike_count;
        this.like_count=obj.like_count;
        this.pub_date = obj.last_published_at;        

        this.owner = obj.api_owner;
        this.is_owner = false;
        // is logged-in?
        if (store.getters.me.id) {
            if (this.owner.id==store.getters.me.id) {
                this.is_owner = true;
            }
        }

        this.api_categories = obj.api_categories;

        this.category_id=null;
        this.category_name=null;
        if (this.api_categories.length>0) {
            this.category_id = this.api_categories[0].id;
            this.category_name = this.api_categories[0].name;
        }

        this.api_tags = obj.api_tags;
        
        this.tags = this.formatTags(this.api_tags);

        // for editor
        //this.text = null;
    }
  


    loadPost(page_id) {        
        return new Promise(function(resolve,reject) {
            //let dic_param = {page_id:page_id, token:store.getters.token};
            let dic_param = {page_id:page_id};
            CMSAPI.getBlogData(dic_param,function(response) {
                logger.log.debug("PostModel.loadPost - response",response);
                resolve(response);
            },function(err) {
                logger.log.error("PostModel.loadPost - error",err);
                reject();
            });
        });            
    }

    loadComments(page_id,limit=null,offset=null) {

        return new Promise(function(resolve,reject) {            
            let dic_param = {content_type:'blog-postpage' , id:page_id, limit:limit, offset:offset};
            CMSAPI.getComments(dic_param,function(response) {
                logger.log.debug("PostModel.loadComments - dic_param=",dic_param,response);
                resolve(response);
            },function(err) {
                logger.log.error("PostModel.loadComments - error",err);
                reject(err);
            });
        });            
    }

    postComment(dic_param) {        
        return new Promise(function(resolve,reject) {            
            dic_param.token = store.getters.token;
            CMSAPI.postBlogComment(dic_param,function(response) {
                logger.log.debug("PostModel.postComment=",response);
                resolve(response);

            }, function(err) {
                logger.log.error("PostModel.postComment=",err);
                reject(Err);
            });
        });
    }

    ratePost(dic_param) {
        const _this = this;

        return new Promise(function(resolve,reject) {            
            dic_param.token = store.getters.token;
            dic_param.value = -1;
            if (dic_param.method=='like') {
                dic_param.value = 1;
            }            

            CMSAPI.voteBlogPost(dic_param,function(response) {
                logger.log.debug('ratePost - ',response);
                
                if (response.data.data.value==1) {
                    _this.like_count += 1;
                } else {
                    _this.dislike_count += 1;
                }

                resolve(response);
            }, function(err) {
                logger.log.error('ratePost - ',err);
                reject(err);
            });                  
        });
    }

    postCommentRate(dic_param) {
        return new Promise(function(resolve,reject) {            
            dic_param.token = store.getters.token;

            CMSAPI.postCommentFeedback(dic_param,function(response) {
                resolve(response);
            }, function(response) {
                reject(response);
            });                
        });
    }

}


export class PostPageListModel extends baseCollection {

    assign (posts) {
        for (let index = 0; index < posts.length; index++) {
            let a_page = new PostPageModel();
            a_page.assign(posts[index]);
            this.add(a_page);
        }
    }

    load(param) {
        const _this = this;

        return new Promise(function(resolve,reject) {            
            let dic_param = {};
            if (param.content_type) {
                dic_param.content_type = param.content_type;
            }
            if (param.category) {
                dic_param.category = param.category;
            }
            if (param.user_id) {
                dic_param.user_id = param.user_id;
            }
            
            CMSAPI.getBlogData(dic_param,function(response) {
                logger.log.debug("PostPageListModel.load - response=",response);
                _this.assign(response.data.results);
                resolve(response);
            },function(err) {
                logger.log.error("PostPageListModel.load - error",err);
                reject(err);
            });
        });            
    }
    
}



export class QuestionPageModel extends PostPageModel{

    assign(obj) {
        //this = new PostPage();
        this.id = obj.id;
        this.title = obj.title;
        this.description = obj.description;
        
        this.comment_count=obj.comment_count;
        this.dislike_count= obj.dislike_count;
        this.like_count = obj.like_count;
        this.pub_date = obj.pub_date;        
        this.parent_id = obj.parent_id;

        this.closed = obj.closed;
        this.total_points = obj.total_porints;

        this.owner = obj.api_owner;
        this.is_owner = false;
        // is logged-in?
        if (store.getters.me.id) {
            if (this.owner.id==store.getters.me.id) {
                this.is_owner = true;
            }
        }
    }
  

    load() {
        const _this = this;

        let dic_param = {'id': this.id};
        return new Promise(function(resolve,reject) {
            //dic_param.id = _this.id;
            CMSAPI.getAssetQuestion(dic_param,function(response) {
                logger.log.debug("QuestionPageModel.load - response",response.data);
                _this.assign(response.data.results[0]);
                resolve(response);
            },function(err) {
                logger.log.error("QuestionPageModel.load - error",err);
                reject(err);
            });
        });
    }

    vote(dic_param) {
        return new Promise(function(resolve,reject) {
            CMSAPI.voteAssetQuestion(dic_param,function(response) {
                logger.log.debug('onClickQuestionRating - ',response);
                resolve(response);
            }, function(err) {
                logger.log.debug('onClickQuestionRating - ',err);
                reject(err);
            });          
        });
    }
    
}


export class QuestionPageListModel extends baseCollection {
    assign(questions) {
        //logger.log.debug("updateAssetQuestion=",questions);

        //let v_questions = [];
        for (let index=0; index<questions.length;index++) {
            let a_question = new QuestionPageModel();
            a_question.assign(questions[index]);
            this.add(a_question);
        }
    }

    load(dic_param) {
        //let dic_param = {'parent_id': parent_id};
        const _this=this;

        return new Promise(function(resolve,reject) {
            CMSAPI.getAssetQuestion(dic_param,function(response) {
                logger.log.debug("QuestionPageListModel.load - response",response);
                _this.assign(response.data.results);
                resolve(response);
            },function(err) {
                logger.log.error("AssetView.loadAssetQuestionData - error",err);
                reject(err);
            });
        });
    }

}


export class AssetReviewPageModel {
    id = null;
    content = null;
    content_type_id = null;
    creation_date=null;
    like_count=null;    
    dislike_count=null;    
    owner=null;
    object_id=null;
    average_rating=null;

    //computed fields
    is_owner=null;

    constructor() 
    {

    }

    assign(obj) {
        this.id = obj.id;
        this.creation_date = obj.creation_date;
        this.average_rating = obj.average_rating;
        this.content = obj.content;
        this.user = obj.api_owner;
        this.object_id = obj.object_id;
        this.content_type_id = obj.content_type_id;
        this.like_count = obj.like_count;
        this.dislike_count = obj.dislike_count;
    }
}


export class AssetReviewPageListModel extends baseCollection {

    assign(reviews) {
        for (let index=0; index<reviews.length;index++) {
            let a_review = new AssetReviewPageModel();
            a_review.assign(reviews[index]);
            this.add(a_review);
        }
    }

    load(dic_param) {
        const _this=this;

        return new Promise(function(resolve,reject) {
            //let a_today = CommonFunc.getToday(false);
            logger.log.debug("AssetReviewPageListModel.load - dic_param=",dic_param);
            CMSAPI.getAssetReview(dic_param,function(response) {
                logger.log.debug("AssetReviewPageListModel.load - response=",response.data);
                _this.assign(response.data.results);
                resolve(response);
            },function(err) {
                logger.log.error("AssetReviewPageListModel.load - error",err);
                reject();
            });
        });            
    }

}



export class AnswerPageModel extends PostPageModel{
    answer_text = null;
    question_id = null;
    comments = null;

    assign(obj) {
        //this = new PostPage();
        this.id = obj.id;        
        this.answer_text = obj.answer_text;
        
        this.comment_count=obj.comment_count;
        this.dislike_count= obj.dislike_count;
        this.like_count = obj.like_count;
        this.pub_date = obj.updated;        
        this.question_id = obj.question_id;

        this.total_points = obj.total_porints;

        this.owner = obj.api_owner;
        this.is_owner = false;
        // is logged-in?
        if (store.getters.me.id) {
            if (this.owner.id==store.getters.me.id) {
                this.is_owner = true;
            }
        }
    }
  

    load() {
        const _this = this;

        let dic_param = {'id': this.id};
        return new Promise(function(resolve,reject) {
            //dic_param.id = _this.id;
            CMSAPI.getAssetQuestion(dic_param,function(response) {
                logger.log.debug("QuestionPageModel.load - response",response.data);
                _this.assign(response.data.results[0]);
                resolve(response);
            },function(err) {
                logger.log.error("QuestionPageModel.load - error",err);
                reject(err);
            });
        });
    }

    vote(dic_param) {
        return new Promise(function(resolve,reject) {
            CMSAPI.voteAssetQuestion(dic_param,function(response) {
                logger.log.debug('onClickQuestionRating - ',response);
                resolve(response);
            }, function(err) {
                logger.log.debug('onClickQuestionRating - ',err);
                reject(err);
            });          
        });
    }
    
}



export class AnswerPageListModel extends baseCollection {

    assign(answers) {
        for (let index=0; index<answers.length;index++) {
            let a_page = new AnswerPageModel();
            a_page.assign(answers[index]);
            a_page.comments = [];
            this.add(a_page);
        }
    }

    load(question_id) {
        const _this=this;

        return new Promise(function(resolve,reject) {
            let dic_param = {question_id:question_id};
            logger.log.debug("AnswerPageListModel.load - dic_param=",dic_param);

            CMSAPI.getAssetAnswer(dic_param,function(response) {
                logger.log.debug("AnswerPageListModel.load - response",response.data);
                _this.assign(response.data.results);
                resolve(response);
            },function(err) {
                logger.log.error("AnswerPageListModel.load - error",err);
                reject(err);
            });
        });            

    }

    addComments(comments) {
        logger.log.debug('addComments : comments=',comments.items);

        for (let index=0; index<comments.items.length;index++) {            
            let a_page = _.find(this.items, { id:comments.items[index].answer_id } );
            if (a_page) {
                //logger.log.debug("addComments : a_page=",a_page);
                a_page.comments.push( comments.items[index] );
            }
        }
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
