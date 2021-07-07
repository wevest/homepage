import {MoaConfig} from 'src/data/MoaConfig';
import {baseCollection} from 'src/models/baseModel';
import _ from 'lodash';

import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
import MoaBackendAPI from 'src/services/apiService';
import PriceService from 'src/services/priceService';
import logger from 'src/error/Logger';
import LocalStorageService from 'src/services/localStorage';



export class AssetModel{    
    id=null;
    symbol=null;
    name=null;
    category=null;
    first_price=null;
    date_added=null;
    image= null;
    image_thumb=null;
    description=null;
    description_kr=null;

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

    _getFirstLink(json_data,dic_columns,column) {
        let a_links = json_data['values'][0][dic_columns[column]];          
        if (a_links.length==0) return '';
        return a_links.split(',')[0];
    }

    assign(item) {
        this.id = item.id;
        this.symbol = item.symbol;
        this.name=item.name;
        this.image = item.image;
        this.image_thumb = item.image_thumb;
        this.category = item.category;
        this.first_price = item.first_price;
        this.description = item.description; 
        this.description_kr = item.description_kr;
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
        let dic_param = {symbol:this.symbol};
        logger.log.debug("AssetModel.loadBaseinfo - dic_param=",dic_param);

        return new Promise(function(resolve,reject) {            
            MoaBackendAPI.getCryptoBaseinfo(dic_param,function(response) {
                //_this.g_data = response.data.data;
                logger.log.debug("AssetView.loadCryptoBaseinfo - response",response.data);
                _this.assignExt(response.data.data);
                //_this.updateScoreWidget(_this.g_data);
                //_this.$refs.assetinfoTable.update(_this.g_data,_this.g_vc);                
                resolve(response.data.data);
            },function(err) {
                logger.log.error("AssetView.loadCryptoBaseinfo - error",err);
                reject();
            });
        });            
    }

    loadPriceHistory(dicParam) {
        const _this = this;

        //let dic_param = {symbol:symbol,quote:'USD',freq:a_freq,start_date:a_start_date, end_date:a_end_date, exchange:'cc',quote:'USD' };
        logger.log.debug("AssetModel.loadPriceHistory - dicParam=",dicParam);
        
        return new Promise(function(resolve,reject) {            
            MoaBackendAPI.getCryptoPriceHistory(dicParam,function(response) {
                logger.log.debug("AssetModel.loadPriceHistory - response",response.data.data);
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

}


export class AssetListModel extends baseCollection{

    getAsset(symbol) {

        if (this.isEmpty()) {
            let response = this.load();
        }

        //logger.log.debug("getPrice.pair=",this.items);
        return _.find(this.items,{symbol:symbol} );
    }
    
    load() {
        const _this = this;
        
        return new Promise(function(resolve,reject) {
            let reqParam = { token: MoaConfig.auth.token};            
            APIService.getAssetData(reqParam,function(response) {
                logger.log.debug("load : response=",response);

                const items = response.data.results;      
                _this.last_updated = CommonFunc.getCurrentDatetime();          
                _this.clear();
                for (let index=0;index<items.length;index++) {
                    _this.add( AssetModel.create(items[index]) );
                }
                resolve(response);
            },function(err) {
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
