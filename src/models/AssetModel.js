import {MoaConfig} from 'src/data/MoaConfig';
import {baseCollection} from 'src/models/baseModel';
import _ from 'lodash';

import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
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

    constructor() {}

    static create(item) {
        let a_item = new AssetModel();
        a_item.assign(item);
        return a_item;
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
