import {MoaConfig} from 'src/data/MoaConfig';
import {Model, Collection} from 'vue-mc';

import PriceService from 'src/services/priceService';


export class PriceModel extends Model{
    
    defaults() {
        return {
            currency_pair: null,
            last: null,
            lowest_ask: null,
            highest_bid: null,
            change_percentage:null,
            base_volume:null,
            quote_volume:null,    
            high_24h:null,  
            low_24h: null,            
        }    
    }

    mutations() {
        return {
            currency_pair: String,
            last: Number,
            lowest_ask: Number,
            highest_bid: Number,
            change_percentage: Number,
            base_volume: Number,
            quote_volume: Number,    
            high_24h: Number,  
            low_24h: Number,
        }
    }
 
    validation() {
        return {

        }
    }

    routes() {
        return {
        }
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


export class PriceListModel extends Collection {
    model() {
        return PriceModel;
    }

    defaults() {
        return {

        }
    }

    load() { 
        const _this = this;

        let reqParam = { token: MoaConfig.auth.token};
        return new Promise(function(resolve,reject) {        
            
            PriceService.getPrice(reqParam).then( response => {
                const items = response.data.data;
                for (let index=0;index<items.length;index++) {
                    _this.add( {
                        currency_pair: items[index].currency_pair,
                        last: items[index].last,
                        lowest_ask: items[index].lowest_ask,
                        highest_bid: items[index].highest_bid,
                        change_percentage: items[index].change_percentage,
                        base_volume: items[index].base_volume,
                        quote_volume: items[index].quote_volume,    
                        high_24h: items[index].high_24h,  
                        low_24h:  items[index].low_24h,
                    });
                }
                resolve(response);
            });        
        });
    }   

}
