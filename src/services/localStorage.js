import { store } from 'src/store/store';
import { MoaConfig } from 'src/data/MoaConfig';

import logger from "src/error/Logger";
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';


export default class LocalStorageService{

    constructor(){
        
    }
    
    static save(key,json_data) {
        localStorage.setItem(key, JSON.stringify(json_data));
    }
    
    static load(key) {
        let data = localStorage.getItem(key);
        return JSON.parse(data);
    }


    static findCode(asset) {
        let codes = LocalStorageService.getCode();
        return codes[asset];            
    }

    static loadKCodes() {
        const a_code = LocalStorageService.load(MoaConfig.general.KCODE);
        //console.log("localStorage.getCode=",a_code);

        if ( a_code) {
            //console.log("localStorage.getCode2=",a_code);            
            return a_code;
        }        
        
        return new Promise(function(resolve,reject) {
            const dic_param = {};
            MoaBackendAPI.getCode(dic_param,function(response) {
                let g_code = response.data.data.values;

                logger.log.debug("LocalStorageService.loadCode - response",g_code);                                
                
                LocalStorageService.save(MoaConfig.general.KCODE,g_code);
                resolve(g_code);

            },function(err) {
                logger.log.error("Common.LocalStorageService - error",err);
                reject();
            });
        });
    }

    static loadCoinCodes(force=false) {
        const a_code = LocalStorageService.load(MoaConfig.general.COINCODE);
        //console.log("localStorage.getCode=",a_code);

        if ((! force) && ( a_code)) {
            //console.log("localStorage.getCode2=",a_code);            
            return a_code;
        }        
        
        return new Promise(function(resolve,reject) {
            const dic_param = {'type':'simple'};

            MoaBackendAPI.getCryptoBaseinfo(dic_param,function(response) {
                let g_code = response.data.data.values;

                logger.log.debug("LocalStorageService.loadCoinCodes - response",g_code);                                
                
                LocalStorageService.save(MoaConfig.general.COINCODE,g_code);
                resolve(g_code);

            },function(err) {
                logger.log.error("LocalStorageService.loadCoinCodes - error",err);
                reject();
            });
        });
    }

    static getCoinCode() {
        return LocalStorageService.load(MoaConfig.general.COINCODE);    
    }

    static getCode() {
        return LocalStorageService.load(MoaConfig.general.KCODE);    
    }

    static getCodes() {
        let items_asset = CommonFunc.getAppData(appdata_name);
        let a_range = CommonFunc.range(0,n_top,1,true);

        let dates = [];
        items_asset.forEach(a_item=> {
            a_range.forEach( a_index => {                
                if (asset==a_item[a_index]) {
                    //console.log("a_item=",a_item);
                    dates.push( a_item[column_date]);
                }
            });
        });

        return dates;
    }

}
