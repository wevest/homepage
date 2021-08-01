import {MoaConfig} from 'src/data/MoaConfig';
import {baseCollection} from 'src/models/baseModel';
import _ from 'lodash';

import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import APIService from 'src/services/apiService';
import PriceService from 'src/services/priceService';
import LocalStorageService from 'src/services/localStorage';
import CMSAPI from 'src/services/cmsService';


import {HolderModel,HolderListModel} from 'src/models/UserModel';

export class TickerModel {
    name=null;
    symbol=null;

    cmc_rank=null;
    date_added=null;
    num_market_pairs=null;

    last=null;
    volume=null;
    ret_24h=null;
    ret_7d=null;
    ret_1m=null;
    ret_3m=null;

    assign(obj) {
        //logger.log.debug("TickerModel.assign:obj=",obj);

        this.symbol=obj.symbol;
        this.name=obj.name;
        this.cmc_rank=obj.cmc_rank;
        this.num_market_pairs=obj.num_market_pairs;

        this.ret_24h=parseFloat(obj['quote']['USD'].percent_change_24h);
        this.ret_7d=parseFloat(obj['quote']['USD'].percent_change_7d);
        this.ret_1m=parseFloat(obj['quote']['USD'].percent_change_30d);
        this.ret_3m=parseFloat(obj['quote']['USD'].percent_change_90d);

        this.last=parseFloat(obj['quote']['USD'].price);
        this.volume=parseFloat(obj['quote']['USD'].volume_24h);
        
        this.updated_at = CommonFunc.getCurrentDatetime(2);
    }

    assignExt(key,obj) {
        //logger.log.debug("TickerModel.assign:obj=",obj);

        //this.pair=obj.symbol;
        this.symbol=key;
        this.name = obj.name;
        this.last=parseFloat(obj.last);
        this.base_volume=parseFloat(obj.vol);
        this.change_percentage=parseFloat(obj.ret);
        this.updated_at = CommonFunc.getCurrentDatetime(2);
    }

}


export class TickerListModel extends baseCollection {

    assign(items) {
        //for (let index=0;index<items.length;index++) {
        
        for (let key in items) {
            let a_ticker = new TickerModel();
            //logger.log.debug("TickerListModel.ticker=",items[key]);            
            a_ticker.assign(items[key]);
            this.add(a_ticker);    
        }
    }

    assignExt(items) {
        //for (let index=0;index<items.length;index++) {
        
        for (let key in items) {
            let a_ticker = new TickerModel();            
            a_ticker.assignExt(key,items[key]);
            this.add(a_ticker);    
        }
    }

    getByPair(pair) {
        return _.find(this.items,{pair:pair} );
    }

    getBySymbol(symbol) {                
        return _.find(this.items,{symbol:symbol} );
    }

    load(symbol=null,exchange=null,quoteCurrency="USDT") {
        const _this=this;

        let dicParam = {exchange:exchange};
        if (symbol) {
            dicParam.pair = symbol+"_"+quoteCurrency;
        }
        
        return new Promise(function(resolve,reject) {            
            PriceService.getPrice(dicParam).then(response=>{
                logger.log.debug("TickerListModel.load - response=",response.data.data);
                
                //if (! response.data.data.hasOwnProperty('label')) {}
                _this.assignExt(response.data.data);                                
                resolve(response);

            }).catch(err=>{
                logger.log.error("TickerListModel.load - error",err);
                reject(err);
            });
        });                    
    }

}

export class AssetModel{    
    id=null;
    symbol=null;
    name=null;
    object_id=null;
    object_category=null;
    category=null;
    first_price=null;
    date_added=null;
    logo_thumb=null;
    description=null;
    description_kr=null;
    cmc_rank=null;
    num_market_pairs=null;
    total_supply=null;
    max_supply=null;
    circulating_supply=null;
    platform=null;
    token_address=null;
    website=null;
    source_code=null;
    twitter=null;
    announcement=null;
    reddit=null;
    chat=null;
    tags=null;
    
    alltime_high=null;
    alltime_low=null;
    alltime_high_date=null;
    alltime_low_date=null;

    w52_high=null;
    w52_low=null;
    w52_high_date=null;
    w52_low_date=null;
    
    is_deleted=null;
    github_network_count=null;

    is_selected=null;
    exchanges=null;

    like_count=null;
    dislike_count=null;
    portfolio_count=null;
    average_rating=null;

    ticker = new TickerModel();
    holders = new HolderListModel();

    constructor() {}

    static create(item) {
        let a_item = new AssetModel();
        a_item.assign(item);
        return a_item;
    }

    _getPriceDate(json_data,dic_columns,column) {
        let a_value = "$ " + CommonFunc.formatNumber(json_data['values'][0][dic_columns[column]],2) + " (" + json_data['values'][0][dic_columns[column+'_date']] + ')';
        return a_value;
    }

    _getFirstLink(a_links) {
        //let a_links = json_data['values'][0][dic_columns[column]];          
        if (!a_links) {
            return '';
        }
        if (a_links.length==0) return '';
        return a_links.split(',')[0];
    }

    assign(item) {
        this.id = item.id;
        this.asset_type = item.asset_type;
        this.symbol = item.symbol;
        this.name=item.name;
        this.logo_thumb = item.logo_thumb;
        this.category = item.category;
        this.first_price = item.first_price;
        this.description = item.description; 
        this.description_kr = item.description_kr;
        this.cmc_rank = item.cmc_rank;
        this.num_market_pairs = item.num_market_pairs;

        this.like_count = item.like_count;
        this.dislike_count = item.dislike_count;
        this.average_rating = item.average_rating;
        this.portfolio_count = item.portfolio_count;

        this.max_supply = item.max_supply;
        this.total_supply = item.total_supply;
        this.circulating_supply = item.circulating_supply;
        
        this.website = item.website;
        //this.github = item.source_code;
        this.announcement = item.announcement;
        this.source_code = item.source_code;
        this.twitter = item.twitter;
        this.chat = item.chat;
        this.explorer = this._getFirstLink(item.explorer);
        this.tags = item.tags;
        this.platform = item.platform;
        this.token_address = item.token_address;
        this.date_added = item.date_added;

        this.is_selected = item.is_selected;
        this.exchanges = item.exchanges;
    }
    
    assignExt(json_data) {

        const dic_columns = CommonFunc.getColumnDic(json_data.columns,[],[]);
        //logger.log.debug('items=',dic_columns);

        this.id = json_data['values'][0][dic_columns['id']];
        this.name = json_data['values'][0][dic_columns['name']];        
        this.first_price= json_data['values'][0][dic_columns['first_price']];    
        this.description = json_data['values'][0][dic_columns['description']];
        this.description_kr = json_data['values'][0][dic_columns['description_kr']];

        this.alltime_high = json_data['values'][0][dic_columns['alltime_high']]; 
        this.alltime_low = json_data['values'][0][dic_columns['alltime_low']];
        this.w52_high = json_data['values'][0][dic_columns['w52_high']];
        this.w52_low = json_data['values'][0][dic_columns['w52_low']];

        this.alltime_high_date = json_data['values'][0][dic_columns['alltime_high_date']]; 
        this.alltime_low_date = json_data['values'][0][dic_columns['alltime_low_date']];
        this.w52_high_date = json_data['values'][0][dic_columns['w52_high_date']];
        this.w52_low_date = json_data['values'][0][dic_columns['w52_low_date']];
        
        this.max_supply = json_data['values'][0][dic_columns['max_supply']];
        this.total_supply = json_data['values'][0][dic_columns['total_supply']];
        this.circulating_supply = json_data['values'][0][dic_columns['circulating_supply']];
        
        this.website = json_data['values'][0][dic_columns['website']];
        this.github = json_data['values'][0][dic_columns['source_code']];
        this.announcement = json_data['values'][0][dic_columns['announcement']];
        this.source_code = json_data['values'][0][dic_columns['source_code']];
        this.twitter = json_data['values'][0][dic_columns['twitter']];
        this.chat = json_data['values'][0][dic_columns['chat']];
        this.explorer = this._getFirstLink(json_data,dic_columns,'explorer');
        this.tags = json_data['values'][0][dic_columns['tags']];
        this.platform = json_data['values'][0][dic_columns['platform']];
        this.token_address = json_data['values'][0][dic_columns['token_address']];
        this.date_added = json_data['values'][0][dic_columns['date_added']];
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

    loadBaseinfo() {
        const _this = this;
        let dic_param = {asset_id:this.id};
        logger.log.debug("AssetModel.loadBaseinfo - dic_param=",dic_param);

        return new Promise(function(resolve,reject) {            
            APIService.getAssetData(dic_param,function(response) {
                //_this.g_data = response.data.data;
                logger.log.debug("AssetView.loadBaseinfo - response",response.data);
                _this.assign(response.data.results[0]);
                resolve(response.data);
            },function(err) {
                logger.log.error("AssetView.loadBaseinfo - error",err);
                reject();
            });
        });            
    }

    loadPriceHistory(dicParam) {
        const _this = this;

        //let dic_param = {symbol:symbol,quote:'USD',freq:a_freq,start_date:a_start_date, end_date:a_end_date, exchange:'cc',quote:'USD' };
        //logger.log.debug("AssetModel.loadPriceHistory - dicParam=",dicParam);
        
        return new Promise(function(resolve,reject) {            
            APIService.getCryptoPriceHistory(dicParam,function(response) {
                //logger.log.debug("AssetModel.loadPriceHistory - response",response.data.data);
                resolve(response.data.data);
            },function(err) {
                logger.log.error("AssetModel.loadPriceHistory - error",err);
                reject(err);
            });
        });
    }


    loadCommitData() {
        const _this = this;
        let dic_param = {symbol:this.symbol};
        return new Promise(function(resolve,reject) {            
            MoaBackendAPI.getCommitData(dic_param,function(response) {
                logger.log.debug("AssetModel.loadCommitData - response",response.data.data);
                resolve(response.data.data);
            },function(err) {
                logger.log.error("AssetModel.loadCommitData - error",err);
                reject(err);
            });
        });            
    }

    getPriceTicker(quoteCurrency="USDT") {
        const _this = this;
        
        let dic_param = {symbol:this.symbol};
        logger.log.debug("AssetModel.getPriceTicker - dic_param=",dic_param);        

        return new Promise(function(resolve,reject) {            
            PriceService.getTicker(dic_param).then(response=>{
                logger.log.debug("AssetModel.getPriceTicker - response",response.data);
                
                _this.ticker.assign(response.data.data[_this.symbol]);
                resolve(response);
                
            }).catch(err=>{
                logger.log.error("AssetModel.getPriceTicker - error",err);
                reject(err);
            });
        });            
    }

    loadHolders(dic_param) {
        const _this = this;

        return new Promise(function(resolve,reject) {
            CMSAPI.getPortfolioItem(dic_param, function(response) {                
                logger.log.debug("AssetModel.loadHolders:response=",response);
                
                _this.holders.assign(response.data.results);
                resolve(response);

            }, function(err) {
                reject(err);
            });
        });

    }
        
}


export class AssetListModel extends baseCollection{

    getAsset(symbol) {

        if (this.isEmpty()) {
            let response = this.load();
        }

        //logger.log.debug("getPrice.pair=",this.items);
        return _.find(this.items,{symbol:symbol} );
    }
    
    load(reqParam) {
        const _this = this;
                
        return new Promise(function(resolve,reject) {            

            //let reqParam = {};      
            //if (limit) reqParam['limit'] = limit;
            //if (offset) reqParam['offset'] = offset;
            //if (asset_id) reqParam['asset_id'] = asset_id;

            APIService.getAssetData(reqParam,function(response) {
                logger.log.debug("load : response=",response);

                const items = response.data.results;      
                _this.last_updated = CommonFunc.getCurrentDatetime();      

                for (let index=0;index<items.length;index++) {
                    _this.add( AssetModel.create(items[index]) );
                }
                resolve(response);
            },function(err) {
                reject(err);
            });        
        });
    }

    query(keyword) {
        const _this = this;
        
        let reqParam = {keyword:keyword};
        logger.log.debug("AssetListModel.query : reqParam=",reqParam);
        return new Promise(function(resolve,reject) {            
            APIService.queryAsset(reqParam,function(response) {
                logger.log.debug("AssetListModel.query : response=",response);

                const items = response.data.results;      
                resolve(response);
            },function(err) {
                logger.log.debug("AssetListModel.query : err=",err);
                reject(err);
            });        
        });
    }
/*
    async load() {     
        let response = await this.fetch();
        logger.log.debug("AssetListModel.load : response=",this.items);
        return response;        
    }   
*/
    saveToCookie() {        
        let dic_data = {'last_updated':this.last_updated, 'items': this.items};
        //logger.log.debug("saveToCookie:=",JSON.stringify(dic_data));
        LocalStorageService.save(MoaConfig.general.COINCODE, dic_data );
    }

    loadFromCookie() {
        let dic_data = LocalStorageService.load(MoaConfig.general.COINCODE);
        //logger.log.debug("Assets.loadFromCookie:=",dic_data);
        
        const _this = this;

        if (CommonFunc.isEmptyObject(dic_data)) {
            this.load().then( response => {
                _this.saveToCookie();
            });
        } else {
            let a_today = CommonFunc.getCurrentDatetime();
            const diff_minutes = ((a_today-dic_data.last_updated)/1000)/60;
            logger.log.debug("loadFromCookie:time_diff=",dic_data.last_updated,a_today,diff_minutes);
            this.clear();
            for (let index=0;index<dic_data.items.length;index++) {
                this.add( AssetModel.create(dic_data.items[index]) );
            }                
        }

    }
}
