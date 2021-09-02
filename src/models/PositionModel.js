import {store} from 'src/store/store';
import {baseCollection} from 'src/models/baseModel';
import _ from 'lodash';

import CMSAPI from 'src/services/cmsService';
import logger from 'src/error/Logger';
import CommonFunc from 'src/util/CommonFunc';


export class PTSLModel{        
    id=null;    
    asset=null;
    symbol=null;
    position=null;
    stop_price=null;
    portion=null;
    estimated_value=null;

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

