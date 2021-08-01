import {store} from 'src/store/store';
//import {MoaConfig} from 'src/data/MoaConfig';
import {baseCollection} from 'src/models/baseModel';
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

    static create(symbol,item) {
        let a_item = new PriceModel();
        item.symbol = symbol;
        a_item.assign(item);
        return a_item;
    }

    assign(item) {
        this.symbol = item.symbol;
        this.last = Number(item.last);
        //this.lowest_ask= Number(item.lowest_ask);
        //this.highest_bid = Number(item.highest_bid);
        this.change_percentage = Number(item.ret);
        this.base_volume = Number(item.vol);
        //this.quote_volume = Number(item.quoteVolume);
        //this.high_24h = Number(item.high); 
        //this.low_24h = Number(item.low);
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
            reqParam.token = store.getters.token;
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

    findPrice(symbol,quotePair="USDT") {
        let a_pair = symbol + "_" + quotePair;
        //logger.log.debug("findPrice.pair=",a_pair,this.items);
        return _.find(this.items,{currency_pair:a_pair} );
    }

    getPrice(symbol) {
        //logger.log.debug("findPrice.pair=",a_pair);
        return _.find(this.items,{symbol:symbol} );
    }

    getPriceByPair(symbol,quotePair="USDT") {
        let a_pair = symbol + "/" + quotePair;
        //logger.log.debug("findPrice.pair=",a_pair);
        return _.find(this.items,{currency_pair:a_pair} );
    }

    fetch() {
        const _this = this;
        
        let reqParam = {};
        return new Promise(function(resolve,reject) {
            PriceService.getPrice(reqParam).then( response => {
                const items = response.data.data;
                
                logger.log.debug("PriceModel.fetch : response=",items);

                _this.clear();
                
                for (let a_key in items) {
                    let a_item = items[a_key];
                    _this.add( PriceModel.create(a_key,a_item) );
                }
                resolve(response);

            }).catch(err=> {
                reject(err);
            });        
        });

    }

    async load() { 
        let response = null;

        if (this.isEmpty()) {            
            response = await this.fetch();
        } 
        
        logger.log.debug("PriceModel.load : response=",response);
        return response;            
    }   

}
