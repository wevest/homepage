import {store} from 'src/store/store';
import logger from "src/error/Logger";
import _ from 'lodash';

import CommonFunc from 'src/util/CommonFunc';

import CMSAPI from 'src/services/cmsService';
import AuthService from 'src/services/authService';

import {baseCollection} from 'src/models/baseModel';
import {AssetModel} from 'src/models/AssetModel';
import {AnswerCommentListModel, AnswerCommentModel,QuestionCommentListModel, QuestionCommentModel, CommentListModel} from 'src/models/CommentModel';


export class PostPageModel {
    id = null;
    api_categories = null;
    api_tags = null;
    api_owner = {id:null, avatar:'', avatar_thumb:'', username:null, first_name:'', last_name:'', biography:''};

    body = null;
    text = null;
    dislike_count=null;
    like_count=null;
    meta=null;
    owner={id:null, avatar:'', avatar_thumb:'', username:null, first_name:'', last_name:'', biography:''};
    pub_date=null;
    read_count=null;
    title=null;
    slug=null;
    url_path=null;
    live=true;

    //computed fields
    is_owner=null;
    category=null;
    category_id=null;
    category_name=null;
    tags=null;
    
    youtube_url=null;
    image_url=null;
    link_url=null;

    //to check saved
    saved=null;

    // to track content type
    content_type=null;

    reward=0;
    parent_id=null;
    question_id=null;
    asset_id=null;

    closed=false;
    description=null;
    total_points=null;

    //to assign comments
    comments=new CommentListModel();

    constructor() 
    {

    }

    formatTags(tags) {
        let msg = "";

        if (! tags) {
            return msg;
        }            

        for (let index=0;index<tags.length;index++) {
            msg += tags[index].name + ",";
        }
        return msg.substring(0,msg.length-1);
    }


    setContentType(value) {
      this.content_type = value;
    }

    assign(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.slug = CommonFunc.safeGetKeyValue(obj,'slug');        
        this.url_path = CommonFunc.safeGetKeyValue(obj,'url_path');
        this.body = obj.body;
        
        this.read_count=obj.read_count;
        this.dislike_count=obj.dislike_count;
        this.like_count=obj.like_count;
        this.pub_date = obj.first_published_at;        

        this.api_owner = obj.api_owner;
        this.is_owner = false;
        // is logged-in?
        if (store.getters.me.id) {
            if (this.api_owner.id==store.getters.me.id) {
                this.is_owner = true;
            }
        }

        this.asset_id = obj.asset_id;
        this.youtube_url = obj.youtube_url;
        this.image_url = obj.image_url;
        this.link_url = obj.link_url;
        this.live = obj.live;

        this.api_categories = obj.api_categories;

        this.category_id=null;
        this.category_name=null;
        if (this.api_categories) {
            if (this.api_categories.length>0) {
                this.category_id = this.api_categories[0].id;
                this.category_name = this.api_categories[0].name;
            }    
        }

        this.api_tags = obj.api_tags;
        
        this.tags = this.formatTags(this.api_tags);
        
        // for editor
        //this.text = null;
    }
  

    load(page_id) {        
        logger.log.debug("PostModel.load");

        return new Promise(function(resolve,reject) {
            //let dic_param = {page_id:page_id, token:store.getters.token};
            let dic_param = {page_id:page_id};
            logger.log.debug("PostModel.load - dic_param",dic_param);
            CMSAPI.getBlogData(dic_param,function(response) {
                logger.log.debug("PostModel.loadPost - response",response);
                resolve(response);
            },function(err) {
                logger.log.error("PostModel.loadPost - error",err);
                reject();
            });
        });            
    }

    post(dic_param) {

        return new Promise(function(resolve,reject) {
            dic_param.token = store.getters.token;
            CMSAPI.postBlogPost(dic_param,function(response) {
                resolve(response);    
            }, function(response) {
                reject(response);
            });
        });

    }

    remove() {
        const _this = this;
        let dic_param = { id:this.id, token:store.getters.token};
        return new Promise(function(resolve,reject) {
            logger.log.debug('PostModel.delete - ',dic_param);
            CMSAPI.deleteBlogPost(dic_param,function(response) {                
                //_this.$emit("onPostDelete",{ret:1, response:response});
                resolve(response);
            }, function(error) {
                //_this.$emit("onPostDelete",{ret:0, response:error});
                reject(error);
            });
        });
    }

    vote(dic_param) {
        const _this = this;

        return new Promise(function(resolve,reject) {            
            dic_param.method = "vote";
            dic_param.token = store.getters.token;
            CMSAPI.voteBlogPost(dic_param,function(response) {
                logger.log.debug('ratePost - ',response);
        
                CommonFunc.updateRatingCount(_this,response);
                resolve(response);

            }, function(err) {
                logger.log.error('ratePost - ',err);
                reject(err);
            });                  
        });
    }
}


export class PostPageListModel extends baseCollection {

    addFirst(jsonPost) {
        let a_post = new PostPageModel();
        a_post.assign(jsonPost);
        this.insertAtFirst(a_post);
    }

    assign (posts) {
        for (let index = 0; index < posts.length; index++) {
            let a_page = new PostPageModel();
            a_page.assign(posts[index]);
            this.add(a_page);
        }
    }

    load(dic_param) {
        const _this = this;

        return new Promise(function(resolve,reject) {            
            /*
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
            */
           
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



export class AssetReviewPageModel {
    id = null;
    content = null;
    content_type_id = null;
    creation_date=null;
    like_count=null;    
    dislike_count=null;    
    owner=null;
    object_id=null;    
    average_rating=5;
    asset=new AssetModel();
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
        
        if (this.user.id==store.getters.me.id) {
            this.is_owner = true;
        } else {
            this.is_owner = false;
        }
    }

    vote() {
        const _this = this;

        return new Promise(function(resolve,reject) {
            let dic_param = { id:_this.id, value:_this.value, method: 'vote', token:store.getters.token };
            CMSAPI.voteAssetReview(dic_param,function(response) {
                logger.log.debug('onClickReviewRating - ',response);
                CommonFunc.updateRatingCount(_this,response);
                resolve(response.data);
            }, function(err) {
                logger.log.debug('onClickReviewRating - ',err);
                reject(err);
            });          

        });
    }

    save(dic_param) {
        
        dic_param.token = store.getters.token;
        //dic_param.category = this.g_asset.symbol;
        return new Promise(function(resolve,reject) {
            CMSAPI.postAssetReview(dic_param,function(response) {
                logger.log.debug('AssetReviewPageModel.save - response = ',response);
                resolve(response);
            }, function(err) {
                logger.log.error('AssetReviewPageModel.save - err = ',err);
                reject(err);
            });
        });
    }

    remove() {
        
        let dic_param = {id:this.id, token: store.getters.token};
        //dic_param.category = this.g_asset.symbol;
        return new Promise(function(resolve,reject) {
            CMSAPI.removeAssetReview(dic_param,function(response) {
                logger.log.debug('AssetReviewPageModel.remove - response = ',response);
                resolve(response);
            }, function(err) {
                logger.log.error('AssetReviewPageModel.remove - err = ',err);
                reject(err);
            });
        });
    }

}


export class AssetReviewStatModel {
    id=null;
    updated_at=null;
    category=null;
    total_count=null;
    average_rating=null;
    count_rating_1=null;
    count_rating_2=null;
    count_rating_3=null;
    count_rating_4=null;
    count_rating_5=null;

    rating_1 = null;
    rating_2 = null;
    rating_3 = null;
    rating_4 = null;
    rating_5 = null;

    assign(obj) {
        this.id=obj.id;
        this.category=obj.identifier;
        this.updated_at = obj.updated_at;
        this.total_count=CommonFunc.safeGetNumericValue(obj.total_count);
        this.average_rating=CommonFunc.safeGetNumericValue(obj.average_rating);
        this.count_rating_1 = CommonFunc.safeGetNumericValue(obj.count_rating_1);
        this.count_rating_2 = CommonFunc.safeGetNumericValue(obj.count_rating_2);
        this.count_rating_3 = CommonFunc.safeGetNumericValue(obj.count_rating_3);
        this.count_rating_4 = CommonFunc.safeGetNumericValue(obj.count_rating_4);
        this.count_rating_5 = CommonFunc.safeGetNumericValue(obj.count_rating_5);

        this.update();
    }

    update() {
        this.rating_1 = (this.count_rating_1/this.total_count)*100;
        this.rating_2 = (this.count_rating_2/this.total_count)*100;
        this.rating_3 = (this.count_rating_3/this.total_count)*100;
        this.rating_4 = (this.count_rating_4/this.total_count)*100;
        this.rating_5 = (this.count_rating_5/this.total_count)*100;
    }
}

export class AssetReviewStatListModel extends baseCollection {
    assign(stats) {
        for (let index=0; index<stats.length;index++) {
            let a_stat = new AssetReviewStatModel();
            a_stat.assign(stats[index]);
            this.add(a_stat);
        }
    }

    load(asset_id) {
        const _this=this;
        
        let dic_param = {asset_id:asset_id};
        logger.log.debug("AssetReviewPageListModel.stat - dic_param=",dic_param);

        return new Promise(function(resolve,reject) {
            //let a_today = CommonFunc.getToday(false);
            CMSAPI.getAssetReviewStat(dic_param,function(response) {
                logger.log.debug("AssetReviewPageListModel.stat - response=",response.data);
                _this.assign(response.data.results);
                resolve(response);
            },function(err) {
                logger.log.error("AssetReviewPageListModel.stat - error",err);
                reject();
            });
        });            
    }
}


export class AssetReviewPageListModel extends baseCollection {
    stat = new AssetReviewStatModel();

    assign(reviews) {
        for (let index=0; index<reviews.length;index++) {
            let a_review = new AssetReviewPageModel();
            a_review.assign(reviews[index]);
            this.add(a_review);
        }
    }

    addFirst(jsonReview) {
        let a_review = new AssetReviewPageModel();
        a_review.assign(jsonReview);
        this.insertAtFirst(a_review);
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

    loadStat(asset_id) {
        const _this=this;
        
        let dic_param = {asset_id:asset_id};
        logger.log.debug("AssetReviewPageListModel.stat - dic_param=",dic_param);

        return new Promise(function(resolve,reject) {
            let stats = new AssetReviewStatListModel();
            stats.load(asset_id).then(resp=> {                
                logger.log.debug("AssetReviewPageListModel.loadStat - response=",resp);
                _this.stat = stats.items[0];
            }).catch(err=>{
                reject(err);
            });
        });            

    }
}




export class QuestionPageModel extends PostPageModel{
    comments = new QuestionCommentListModel();

    assign(obj) {
        //this = new PostPage();
        this.id = obj.id;
        this.title = obj.title;
        this.body = obj.body;
        this.api_tags = obj.api_tags;

        this.comment_count=obj.comment_count;
        this.read_count= obj.read_count;
        this.dislike_count= obj.dislike_count;
        this.like_count = obj.like_count;
        this.pub_date = obj.pub_date;        
        this.parent_id = obj.parent_id;

        this.reward = obj.reward;
        this.closed = obj.closed;
        this.total_points = obj.total_porints;

        this.owner = obj.api_owner;
        this.is_owner = false;

        this.category = CommonFunc.safeGetKeyValue(obj,'symbol');

        // is logged-in?
        if (store.getters.me.id) {
            if (this.owner.id==store.getters.me.id) {
                this.is_owner = true;
            }
        }

        this.comments = new QuestionCommentListModel();
    }
  
    addCommentFirst(jsonComment) {
        let a_comment = new QuestionCommentModel();
        a_comment.assign(jsonComment);
        this.comments.insertAtFirst(a_comment);
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

    post(dic_param) {
        return new Promise(function(resolve,reject) {
            dic_param.token = store.getters.token;
            CMSAPI.postAssetQuestion(dic_param,function(response) {
                logger.log.debug("onClickSave : response=",response);
                resolve(response);
                //_this.$emit("onPostSave",{ret:1, response:response});
            }, function(error) {
                //_this.$emit("onPostSave",{ret:0, response:error});
                reject(error);
            });
        });
    }

    vote(dic_param) {
        const _this = this;
        
        dic_param.method="vote";
        dic_param.id = this.id;
        dic_param.token = store.getters.token;
        return new Promise(function(resolve,reject) {                        
            CMSAPI.voteAssetQuestion(dic_param,function(response) {
                logger.log.debug('onClickQuestionRating - ',response);
                
                CommonFunc.updateRatingCount(_this,response);
                resolve(response);
            }, function(err) {
                logger.log.debug('onClickQuestionRating - ',err);
                reject(err);
            });          
        });
    }    

    remove() {
        const _this = this;
        
        const dic_param = { id:this.id, token:store.getters.token };
        return new Promise(function(resolve,reject) {                        
            CMSAPI.deleteAssetQuestion(dic_param,function(response) {
                logger.log.debug('onClickQuestionRemove - ',response);                
                resolve(response);
            }, function(err) {
                logger.log.debug('onClickQuestionRating - ',err);
                reject(err);
            });          
        });
    }

    comment(dic_param) {        
        dic_param.question_id = this.id;
        dic_param.token = store.getters.token;

        return new Promise(function(resolve,reject) {
            CMSAPI.postAssetQuestionComment(dic_param,function(response) {
                logger.log.debug("QuestionPageModel.comment - response",response);
                resolve(response);

            },function(err) {
                logger.log.error("QuestionPageModel.comment - error",err);
                reject(err);
            });
        });
    }

/*
    loadComments(limit=null, offset=null) {
        const _this=this;
        let dic_param = {id:this.id,limit:limit, offset:offset};
        return new Promise(function(resolve,reject) {
            _this.comments.load(dic_param).then(resp=>{
                resolve(resp);
            }).catch(err=>{
                reject(err);
            });
        });
    }
*/

}


export class QuestionPageListModel extends baseCollection {

    addFirst(jsonQuestion) {
        let a_question = new QuestionPageModel();
        a_question.assign(jsonQuestion);
        this.insertAtFirst(a_question);
    }

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

export class AnswerPageModel extends PostPageModel{
    question_id = null;
    comments = [];
    answered = false;
    is_owner=false;

    addCommentFirst(jsonComment) {
        let a_comment = new AnswerCommentModel();
        a_comment.assign(jsonComment);
        this.comments.insertAtFirst(a_comment);
    }

    assign(obj) {
        //this = new PostPage();
        this.id = obj.id;        
        this.body = obj.body;
        this.api_tags = obj.api_tags;
        this.answered = obj.answered;

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

        this.comments = new AnswerCommentListModel();        
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

    loadComment(a_offset=null,a_limit=null) {
        const _this = this;

        //let dic_param = {'id': this.id};
        return new Promise(function(resolve,reject) {
            _this.comments.load(_this.id,a_offset,a_limit).then( resp => {                    
                //logger.log.debug("AssetAnswerList.loadAnswerComments : resp=",resp);    
                resolve(resp);
            }).catch( err => {
                reject(err);
            });
        });
    }

    post(dic_param) {
        
        return new Promise(function(resolve,reject) {
            dic_param.token = store.getters.token;
            CMSAPI.postAssetAnswer(dic_param,function(response) {
                logger.log.debug("AnswerPageModel.post : response=",response);
                //_this.$emit("onPostSave",{ret:1, response:response});                  
                resolve(response);
            }, function(error) {
                //_this.$emit("onPostSave",{ret:0, response:error});
                reject(error);
            });
        });

    }

    accept() {
        let dic_param = {
            id:this.id,
            token:store.getters.token
        };
        logger.log.debug("AnswerPageModel.accept : dic_param=",dic_param);
        return new Promise(function(resolve,reject) {        
            AuthService.acceptAnswer(dic_param,function(response) {
                logger.log.debug('AnswerPageModel.accept : response ',response);
                //CommonFunc.updateRatingCount(_this,response);
                resolve(response);
            }, function(err) {
                logger.log.debug('AnswerPageModel.accept : error = ',err);
                reject(err);
            });          
        });
    }
    

    comment(dic_param) {
        
        dic_param.answer_id = this.id;
        dic_param.question_id = this.question_id;
        dic_param.token = store.getters.token;

        return new Promise(function(resolve,reject) {
            CMSAPI.postAssetAnswerComment(dic_param,function(response) {
                logger.log.debug("AnswerPageModel.comment - response",response);
                resolve(response);

            },function(err) {
                logger.log.error("AnswerPageModel.comment - error",err);
                reject(err);
            });
        });
    }


    vote(dic_param) {
        const _this=this;

        dic_param.id=this.id;
        dic_param.token = store.getters.token;
        dic_param.method = 'vote';

        return new Promise(function(resolve,reject) {
            CMSAPI.voteAssetAnswer(dic_param,function(response) {
                logger.log.debug('onClickQuestionRating - ',response);
                CommonFunc.updateRatingCount(_this,response);
                resolve(response);
            }, function(err) {
                logger.log.debug('onClickQuestionRating - ',err);
                reject(err);
            });          
        });
    }

    remove() {
        let dic_param = { id:this.id, token:store.getters.token};
        return new Promise(function(resolve,reject) {
            logger.log.debug('AnswerPageModel.delete - ',dic_param);
            CMSAPI.deleteAnswerPost(dic_param,function(response) {                
                resolve(response);
            }, function(error) {
                reject(error);
            });
        });
    }

}



export class AnswerPageListModel extends baseCollection {

    addFirst(jsonAnswer) {
        let a_answer = new AnswerPageModel();
        a_answer.assign(jsonAnswer);
        this.insertAtFirst(a_answer);
    }

    assign(answers) {
        for (let index=0; index<answers.length;index++) {
            let a_page = new AnswerPageModel();
            a_page.assign(answers[index]);
            //a_page.comments = [];
            this.add(a_page);
        }
    }

    load(question_id,a_offset=null,a_limit=null) {
        const _this=this;

        return new Promise(function(resolve,reject) {
            let dic_param = {question_id:question_id,offset:a_offset,limit:a_limit};
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

    updateAcceptance(answer_id) {
        const index = _.findIndex(this.items,{id:answer_id});
        this.items[index].answered = true;
    }

    remove(id) {

        const _this=this;

        return new Promise(function(resolve,reject) {
            const a_answer = _this.getItem(id);
            if (! a_answer) {
                logger.log.error("Fail to get answer page id="+id);
                reject();
            }

            a_answer.remove().then(response=>{
                _this.delete(id);
                resolve(response);
            }).catch(err=>{
                reject(err);
            });
        });

    }
}



export class AssetPageListModel extends baseCollection {

    assign(jsonData) {
        logger.log.debug("AssetPageListModel.assign=",jsonData);

        for (let index=0; index<jsonData.length;index++) {
            let a_post = {
                id:jsonData[index].id, 
                slug:jsonData[index].slug, 
                title:jsonData[index].title, 
                url_path:jsonData[index].url_path
            };
            this.add(a_post);
        }
    }

    load() {
        const _this=this;

        let dic_param = {};
        logger.log.debug("AssetPageListModel.load - dic_param=",dic_param);

        return new Promise(function(resolve,reject) {    
            CMSAPI.getAssetPage(dic_param,function(response) {
                //_this.g_data = response.data;
                logger.log.debug("AssetPageListModel.load - response",response);
                _this.assign(response.data.results);
                resolve(response);

            },function(err) {
                logger.log.error("AssetPageListModel.load - error",err);
                reject(err);
            });
        });            
    
    }
    
}



export class BlogCategoryModel {
    id=null;
    slug=null;
    name=null;

    assign(obj) {
        //this = new PostPage();
        this.id = obj.id;        
        this.slug = obj.slug;
        this.name = obj.name;
    }    
}


export class BlogCategoryListModel extends baseCollection {

    assign(jsonData) {
        logger.log.debug("BlogCategoryListModel.assign=",jsonData);

        for (let index=0; index<jsonData.length;index++) {
            let a_category = new BlogCategoryModel();
            a_category.assign(jsonData[index]);
            this.add(a_category);
        }
    }

    load() {
        const _this=this;

        let dic_param = {};
        logger.log.debug("BlogCategoryListModel.load - dic_param=",dic_param);

        return new Promise(function(resolve,reject) {    
            CMSAPI.getBlogCategory(dic_param,function(response) {
                //_this.g_data = response.data;
                logger.log.debug("BlogCategoryListModel.load - response",response);
                _this.assign(response.data.results);
                resolve(response);

            },function(err) {
                logger.log.error("BlogCategoryListModel.load - error",err);
                reject(err);
            });
        });            
    
    }
    
}
