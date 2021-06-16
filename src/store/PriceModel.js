import {MoaConfig} from 'src/data/MoaConfig';
import {baseCollection} from 'src/store/baseModel';
import _ from 'lodash';

import PriceService from 'src/services/priceService';
import logger from 'src/error/Logger';


export class PriceModel{    
    currency_pair=null;
    last=null;
    lowest_ask=null;
    highest_bid= null;
    change_percentage=null;
    base_volume=null;
    quote_volume=null;
    high_24h=null;  
    low_24h=null;            

    constructor() {

    }

    static create(item) {
        let a_item = new PriceModel();
        a_item.assign(item);
        return a_item;
    }

    assign(item) {
        this.currency_pair = item.currency_pair;
        this.last = item.last;
        this.lowest_ask=item.lowest_ask;
        this.highest_bid = item.highest_bid;
        this.change_percentage = item.change_percentage;
        this.base_volume = item.base_volume;
        this.quote_volume = item.quote_volume;
        this.high_24h = item.high_24h; 
        this.low_24h = item.low_24h;
    }

    toDict() {
        let reqParam = {id: this.id, 
            portfolio_id: this.portfolio_id, 
            asset_id: this.asset_id, 
            price: this.price,
            qty: this.qty,
            state: this.state,
            description : this.description
        };

        return reqParam;
    }

    add() {        
        const _this = this;

        return new Promise(function(resolve,reject) {
            let reqParam = _this.toDict();
            reqParam.token = MoaConfig.auth.token;
            reqParam.action = "add";
            AuthService.addPortfolioItem(reqParam, function(response) {
                resolve(response);
            }, function(err) {
                reject(err);
            });
        });

    }   

}


export class PriceListModel extends baseCollection{

    getPrice(symbol,quotePair="USDT") {
        let a_pair = symbol + "_" + quotePair;
        //logger.log.debug("getPrice.pair=",this.items);
        return _.find(this.items,{currency_pair:a_pair} );
    }
    
    load() { 
        const _this = this;

        let reqParam = { token: MoaConfig.auth.token};
        return new Promise(function(resolve,reject) {
            PriceService.getPrice(reqParam).then( response => {
                const items = response.data.data;
                
                _this.clear();
                for (let index=0;index<items.length;index++) {
                    _this.add( PriceModel.create(items[index]) );
                }
                resolve(response);
            }).catch(err=> {
                reject(err);
            });        
        });
    }   

}
