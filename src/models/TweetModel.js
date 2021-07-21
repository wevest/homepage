import {store} from 'src/store/store';
import {baseCollection} from 'src/models/baseModel';
import _ from 'lodash';

import PriceService from 'src/services/priceService';
import logger from 'src/error/Logger';


export class TweetModel{        
    id=null;    
    text=null;
    created_at=null;
    owner=null;
    asset=null;
    asset_id=null;

    assign(obj) {

    }

    post() {
        let dic_param = {
            text: this.text,
            asset_id: this.asset_id
        };

        return new Promise(function(resolve,reject) {
            dic_param.token = store.getters.token;
            CMSAPI.postTweet(dic_param,function(response) {
                resolve(response);    
            }, function(response) {
                reject(response);
            });
        });
    }


    
}


