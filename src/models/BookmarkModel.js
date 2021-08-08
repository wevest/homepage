import { store } from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import {baseCollection} from 'src/models/baseModel';
import _ from 'lodash';

import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import AuthService from 'src/services/authService';
import LocalStorageService from 'src/services/localStorage';


export class BookmarkModel {
    id=null;
    vote=null;
    seq_no=null;
    updated_at=null;
    created_at=null;
    is_deleted=null;
    api_asset=null;
    api_user=null;
    name=null;
    symbol=null;
    asset_id=null;
    logo_thumb=null;

    constructor() {}

    assign(obj) {
        this.id = obj.id;
        this.vote = obj.vote;        
        this.created_at = obj.created_at;
        this.updated_at = obj.updated_at;
        this.seq_no = obj.seq_no;
        this.is_deleted = obj.is_deleted;
        this.api_asset = obj.api_asset;
        this.api_user = obj.api_user;

        this.asset_id = this.api_asset.id;
        this.name = this.api_asset.name;
        this.symbol = this.api_asset.symbol;
        this.logo_thumb = this.api_asset.logo_thumb;
    }

    toDict() {
        return { 
            id: this.id, name: this.name, 
            asset_id:this.api_asset.id, 
            symbol: this.api_asset.symbol,
            logo_thumb: this.api_asset.logo_thumb
        }
    }
}


export class BookmarkListModel extends baseCollection{

    toDict() {
        let dicts = [];
        for (let index=0;index<this.items.length;index++) {
            dicts.push(this.items[index].toDict());
        }
        return dicts;
    }

    fromJson(items) {
        //logger.log.debug("BookmarkListModel.fromJson : items=",items);
        for (let index=0;index<items.length;index++) {
            let a_bookmark = new BookmarkModel();
            a_bookmark.id = items[index].id;
            a_bookmark.name = items[index].name;
            a_bookmark.symbol = items[index].symbol;
            a_bookmark.asset_id = items[index].asset_id;
            a_bookmark.logo_thumb = items[index].logo_thumb;
            //logger.log.debug("BookmarkListModel.fromJson : bookmark=",a_bookmark);
            this.add(a_bookmark);
        }
    }

    assign(bookmarks) {
        for (let index = 0; index < bookmarks.length; index++) {
            let a_bookmark = new BookmarkModel();
            a_bookmark.assign(bookmarks[index]);
            const a_found = this.find('name',a_bookmark.api_asset.name);
            if (!a_found) this.add(a_bookmark);
        }
    }

    assignExt(assets) {
        //logger.log.debug("BookmarkModel.assignExt : assets=",assets);

        for (let index = 0; index < assets.length; index++) {
            let a_bookmark = new BookmarkModel();
            a_bookmark.id = null;
            a_bookmark.api_asset = assets[index];
            a_bookmark.seq_no = this.items.length+1;
            a_bookmark.name = a_bookmark.api_asset.name;
            
            //logger.log.debug("BookmarkModel.assignExt : api_asset=",a_bookmark.api_asset);

            const a_found = this.find('name',a_bookmark.name);
            if (!a_found) this.add(a_bookmark);
        }
    }
    
    getBookmark(symbol) {

        if (this.isEmpty()) {
            let response = this.load();
        }

        //logger.log.debug("getPrice.pair=",this.items);
        return _.find(this.items,{symbol:symbol} );
    }
    
    addToServer(reqParam) {        
        const _this = this;

        return new Promise(function(resolve,reject) {
            reqParam.token = store.getters.token;
            reqParam.action = "add";
            AuthService.addBookmarkData(reqParam, function(response) {
                logger.log.debug("BookmarkListModel.addToServer : response=",response);
                resolve(response);
            }, function(err) {
                reject(err);
            });
        });
    }   

    addBookmarks(items) {
        this.assignExt(items);        
    }

    deleteFromServer(reqParam) {
        const _this = this;
                
        return new Promise(function(resolve,reject) {
            logger.log.debug("BookmarkListModel.deleteFromServer : dicParam=",reqParam);
            
            reqParam.token = store.getters.token;
            AuthService.deleteBookmarkData(reqParam,function(response) {
                logger.log.debug("BookmarkList.deleteFromServer : response=",response.data.results);
                _this.delete(reqParam.id);
                resolve(response);

            },function(err) {
                reject(err);
            });        
        });

    }

    load(reqParam) {
        const _this = this;
                
        return new Promise(function(resolve,reject) {
            logger.log.debug("BookmarkListModel.load : dicParam=",reqParam);
            
            AuthService.getBookmarkData(reqParam,function(response) {
                logger.log.debug("BookmarkListModel.load : response=",response.data.results);
                _this.assign(response.data.results);
                resolve(response);

            },function(err) {
                reject(err);
            });        
        });
    }

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
