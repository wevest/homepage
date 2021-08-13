import {store} from 'src/store/store';
import {baseCollection} from 'src/models/baseModel';
import _ from 'lodash';


import CMSAPI from 'src/services/cmsService';
import logger from 'src/error/Logger';
import CommonFunc from 'src/util/CommonFunc';

import {TweetCommentModel, TweetCommentListModel} from 'src/models/CommentModel';


export class TweetModel{        
    id=null;    
    body=null;
    youtube_url=null;
    image_url=null;    
    link_url=null;
    created_at=null;
    
    like_count=null;
    dislike_count=null;
    read_count=null;
    comment_count=null;
    share_count=null;

    owner=null;
    asset=null;
    asset_id=null;

    comments=new TweetCommentListModel();

    assign(obj) {
        this.asset = obj.api_asset;
        this.owner = obj.api_owner;
        
        this.id = obj.id;
        this.created_at = obj.created_at;
        this.body = obj.body;
        this.link_url = obj.link_url;
        this.image_url = obj.image_url;
        this.youtube_url = obj.youtube_url;

        this.like_count = obj.like_count;
        this.dislike_count = obj.dislike_count;
        this.share_count = obj.share_count;
        this.comment_count = obj.comment_count;
        this.read_count = obj.read_count;
    }

    addCommentFirst(jsonComment) {
        let a_comment = new TweetCommentModel();
        a_comment.assign(jsonComment);
        this.comments.insertAtFirst(a_comment);
    }

    post() {
        let dic_param = {
            id: this.id,
            asset_id: this.asset_id,
            body: this.body,
            youtube_url: this.youtube_url,
            image_url: this.image_url,
            link_url: this.link_url,
            token: store.getters.token            
        };

        return new Promise(function(resolve,reject) {
            CMSAPI.postTweet(dic_param,function(response) {
                resolve(response);    
            }, function(response) {
                reject(response);
            });
        });
    }

    remove() {
        let dic_param = {
            id: this.id,
            asset_id: this.asset_id,
            token: store.getters.token
        };

        return new Promise(function(resolve,reject) {            
            CMSAPI.removeTweet(dic_param,function(response) {
                resolve(response);    
            }, function(response) {
                reject(response);
            });
        });
    }

    vote(dic_param) {
        const _this = this;        
        return new Promise(function(resolve,reject) {
            //let dic_param = { id:_this.id, value:_this.value, method: 'vote', token:store.getters.token };
            dic_param['method'] = 'vote';
            dic_param['token'] = store.getters.token;
            CMSAPI.voteTweet(dic_param,function(response) {
                logger.log.debug('onClickReviewRating - ',response);
                CommonFunc.updateRatingCount(_this,response);
                resolve(response);
            }, function(err) {
                logger.log.debug('onClickReviewRating - ',err);
                reject(err);
            });          

        });
    }


    comment(dic_param) {        
        dic_param.tweet_id = this.id;
        dic_param.token = store.getters.token;

        return new Promise(function(resolve,reject) {
            CMSAPI.postTweetComment(dic_param,function(response) {
                logger.log.debug("TweetModel.comment - response",response);
                resolve(response);

            },function(err) {
                logger.log.error("TweetModel.comment - error",err);
                reject(err);
            });
        });
    }    
}


export class TweetListModel extends baseCollection{

    getItem(id) {
        return _.find(this.items,{id:id} );
    }

    assign(tweets) {
        for (let index = 0; index < tweets.length; index++) {
            let a_tweet = new TweetModel();
            a_tweet.assign(tweets[index]);
            this.add(a_tweet);
        }
    }

    load(dic_param) { 
        const _this = this;
        
        return new Promise(function(resolve,reject) {
            CMSAPI.getTweet(dic_param,function(response) {
                logger.log.debug("TweetListModel.load : response=",response);
                _this.assign(response.data.results);
                resolve(response);    
            }, function(response) {
                reject(response);
            });
        });
        
    }
}

