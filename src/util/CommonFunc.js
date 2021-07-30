import {store} from 'src/store/store';
//import * as Actions from 'src/store/constants'

import logger from "src/error/Logger";
import Errors from 'src/error/Errors';
import ehandler from 'src/error/EHandler';
import MoaBackendAPI from 'src/services/apiService';
import LocalStorageService from 'src/services/localStorage';

import moment from 'moment';

//const ethUtil = require('ethereumjs-util');
//const web3util = new Web3();

export default class CommonFunc {
    static groupBy(xs, f) {
        return xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {});
    }

    static clone(obj) {
        try {
            return JSON.parse(JSON.stringify(obj));
        } catch(error) {
            ehandler.throw(Errors.raise(Errors.ERRCODE.OPERATION.JSONParsingError,'',error));
        }
    }

    static formatNumber(value,decimal=4,add_comma=false) {
        let new_value = value.toFixed(decimal).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        if (add_comma) {
            return String(new_value).replace(/^0+/, '').replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    
        return new_value;
    }

    static formatDate(d) {
        //var d = new Date(date);
        var a_date = [
          d.getFullYear(),
          ('0' + (d.getMonth() + 1)).slice(-2),
          ('0' + d.getDate()).slice(-2)
        ].join('-');
        return a_date;
    }

    static unixToDatetime(unixTimestamp) {
        let date = new Date(Number(unixTimestamp));
        //let dateStr = date.toLocaleDateString('en-US') + ' ' + date.toLocaleTimeString();
        //return moment.unix(unixTimestamp).format("YYYY-MM-DD HH:mm:SS");
        return moment(unixTimestamp).format("YYYY-MM-DD HH:mm:SS");
    }

    static compareStr( a, b ) {
        //return a.toLowerCase() === b.toLowerCase();
        // if (a.toString() < b.toString()) return false;
        // if (a.toString() > b.toString()) return false;
        if (a.toLowerCase() === b.toLowerCase()) return true;

        return false;     
    }

    static sanityCheck(value) {
        if( value == "" || value == null || value == undefined){
            return false;
        }
        return true;
    }

    static safeDivide(x,y) {
        if (y==0) {
            return 0;
        }

        return x/y;
    }

    static isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    static returnJson(jsonStr) {
        let json = jsonStr;
        if (jsonStr.constructor===String) {
            json = JSON.parse(jsonStr);
        }
        return json;
    }

    static replaceAll(str, searchStr, replaceStr) {
        return str.split(searchStr).join(replaceStr);
    }

    static convertEmailFormat(email) {
        let newEmail = CommonFunc.replaceAll(email,'.','|');
        return newEmail;
    }
    
    static getFilteredData(arr,column,value) {
        let rows = [];
        arr.forEach(item => {
          if (item[column]==value) {
              rows.push(item);
          }
        })
        return rows;
    }

    static setFilterExt(items,fields,keyword) {
        logger.log.debug("CommonFunc.setFilter",keyword,fields,items);

        items.forEach(function(item) {
            if (keyword.length==0) {
                item.filtered = true;
            } else {
                let flag = false;
                fields.forEach(function(field) {
                    if (item[field].toLowerCase().includes(keyword.trim().toLowerCase())) {
                        flag = true;
                    }
                });
                item.filtered = flag;
            }
        });
  
    }


    static sortArray(arr,sortField,sortBy='a') {
        let newArr = arr;
        newArr.sort(function(a,b) {
            if (sortBy=='a') {
                return a[sortField] < b[sortField] ? -1 : a[sortField] > b[sortField] ? 1 : 0;
            } else {
                return a[sortField] > b[sortField] ? -1 : a[sortField] < b[sortField] ? 1 : 0;
            }
        });
        return newArr;
    }

    static sortArrayForFavorite(items,sortField,sortBy='a') {
        //logger.log.debug("sortArrayForFavorite",items);
    
        const favoriteItems = CommonFunc.getItemCount(items,'favorite',true);
        //logger.log.debug("sortArrayForFavorite - 1.1",favoriteItems);
        let fItems = CommonFunc.sortArray(favoriteItems.items,sortField,sortBy); 
        //logger.log.debug("sortArrayForFavorite - 1.1",items1);

        //logger.log.debug("sortArrayForFavorite - 1.2",favoriteItems);
        const normalItems = CommonFunc.getItemCount(items,'favorite',false);
        let nItems = CommonFunc.sortArray(normalItems.items,sortField,sortBy); 
        //logger.log.debug("sortArrayForFavorite - 1.2",items2);

        let newItems = [];
        newItems = newItems.concat(fItems);
        newItems = newItems.concat(nItems);
    
        //logger.log.debug("sortAddress - 1.3",newItems);
    
        return newItems;      
    }

    static safeGetKeyValue(obj,key,default_value=null) {
        if (key in obj) {
            return obj[key];
        }
        return default_value;
    }

    static checkKeyExist(obj,keyArray) {
        let result = true;
        //logger.log.debug("checkKeyExist",obj);
        keyArray.forEach(function(key) {
            if (!(key in obj)) {
                result = false;
                //logger.log.debug("checkKeyExist - false",key);
            }
        });
        return result;
    }

    static strToDate(a_date) {
        var dt = new Date(a_date.substring(0,5), a_date.substring(6,2), a_date.substring(8,2));
        return dt;
    }

    static getWeekDay(dt) 
    {
        var tdt = new Date(dt.valueOf());
        var dayn = (dt.getDay() + 6) % 7;
        tdt.setDate(tdt.getDate() - dayn + 3);
        var firstThursday = tdt.valueOf();
        tdt.setMonth(0, 1);
        if (tdt.getDay() !== 4) 
        {
            tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
        }
        return 1 + Math.ceil((firstThursday - tdt) / 604800000);
    }
      
    static insertAtFirst(arr,value) {
        arr.unshift(value);
    }

    static insertItemsAtFirst(srcItems, items, property) {
        const clonedItems = CommonFunc.clone(srcItems);
        items.forEach(function(item) {
            const found = CommonFunc.getItemCount(clonedItems,property,item[property]);
            //logger.log.debug("Messages.insertMessageAtFirst",message,found);
            if (found.count==0) {
                CommonFunc.insertAtFirst(clonedItems,CommonFunc.clone(item));
            }
        });
        return clonedItems;
    }

    static dictionaryToArray(dic) {
        let items = [];
        for (let key in dic) {
            const item = dic[key];
            items.unshift(item);
        }
        return items;
    }

    static getAllUrlParams(url) {

        // get query string from url (optional) or window
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
      
        // we'll store the parameters here
        var obj = {};
      
        // if query string exists
        if (queryString) {
      
            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];

            // split our query string into its component parts
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                var a = arr[i].split('=');
        
                // set parameter name and value (use 'true' if empty)
                var paramName = a[0];
                var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];
        
                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
        
                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {        
                    // create key if it doesn't exist
                    var key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) obj[key] = [];
            
                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        var index = /\[(\d+)\]/.exec(paramName)[1];
                        obj[key][index] = paramValue;
                    } else {
                        // otherwise add the value to the end of the array
                        obj[key].push(paramValue);
                    }
                } else {
                    // we're dealing with a string
                    if (!obj[paramName]) {
                        // if it doesn't exist, create property
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                        // if property does exist and it's a string, convert it to an array
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        // otherwise add the property
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }    
        return obj;
    }    

    static getLastPath(url) {
        const paths = url.split('/');
        return paths[paths.length-1];
    }

    static calcPercent(v1,v2) {
        let value = CommonFunc.formatNumber((parseFloat(v1)/parseFloat(v2))*100);
        return value;
    }

    static calcRet(v0,v1) {
        let value = (v1/v0)-1;
        return value;
    }

    static isInteger(numValue) {
        //return (numValue.toString().match(/^[0-9]+$/) != null);
        return /^\d+$/.test(numValue.toString());
    }

    static isFloat(numValue) {
        const data = numValue.toString() +"e1";                      // Disallow eng. notation "10e2"+"e1" is NaN
        var clean = parseFloat(data,10) / data ; // 1 if parsed cleanly
        return ( data==0 || clean && (data/data) === 1.0);  // Checks for NaN
    }
    static isValidFloatingAmount(numValue) {
        if ( (numValue<=0) || (!CommonFunc.isFloat(numValue) ) ) {
            return false;
        } 
        return true;
    }

    static removeLeadingZero(numValue) {
        let value = numValue.toString().replace(/^0+/,'');
        return parseFloat(value);
    }

    static getUnixTimestamp() {
        return Math.floor(new Date().getTime() / 1000);
    }

    static compareUnixTimestamp(compare,start,end) {
        start = Math.floor(new Date(start).getTime() / 1000);
        end = Math.floor(new Date(end).getTime() / 1000);
        
        if (compare>start && compare<end) {
            return true;
        }
        return false
    }
    
    static getuuid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    static copy(obj) {
        let a_copy = Object.assign({},obj);
        return a_copy;
    }

    static getToday(is_str) {
        var today = new Date();
        if (is_str) {
            //var a_date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            return today.toLocaleDateString('en-CA');
        }
        
        return today;
    }

    static addDays(src_date,days,is_date=false) {
        
        var new_date = null;
        if (! is_date) {
            new_date = new Date();
            new_date.setDate( new_date.getDate() + days );
        } else {
            new_date = new Date(src_date);
            new_date.setDate( new_date.getDate() + days );
        }
        
        var a_date = null;
        if (! is_date) {
            a_date = CommonFunc.formatDate(new_date);
        } else {
            a_date = new_date;
        }
        
        //var a_date = src_date.getFullYear()+'-'+(src_date.getMonth()+1)+'-'+src_date.getDate();
        return a_date;        
    }

    static getReportList(list,category,data_type=0) {
        console.log('showReportList=',list);

        let a_table_items = [];
        let a_categories = [];
        let dic_category = [{value:'전체', text:'전체'}];


        list.forEach(function(a_row) {
            var a_item = {};
            if (data_type==0) {
                a_item['recommend_date'] = a_row[2];
                a_item['category'] = a_row[89];
                a_item['name'] = a_row[88];
                a_item['asset'] = a_row[3];
                a_item['target_price'] = a_row[7];
                a_item['title'] = a_row[4];
                a_item['author'] = a_row[10];
                a_item['company'] = a_row[11];

                a_item['win_ratio_t20'] = (a_row[50]*100).toFixed(2);                    
                a_item['win_ratio_t60'] = (a_row[52]*100).toFixed(2);                    
                a_item['win_ratio_t120'] = (a_row[55]*100).toFixed(2);                        
            } else if (data_type==1) {
                a_item['recommend_date'] = a_row['recommend_date'];
                a_item['category'] = a_row['category'];
                a_item['asset'] = a_row['asset'];
                a_item['target_price'] = a_row['target_price'];
                a_item['title'] = a_row['title'];
                a_item['author'] = a_row['author'];
                a_item['company'] = a_row['company'];
                a_item['win_ratio_t20'] = (a_row['t20_t0']*100).toFixed(2);                    
                a_item['win_ratio_t60'] = (a_row['t60_t0']*100).toFixed(2);                    
                a_item['win_ratio_t120'] = (a_row['t120_t0']*100).toFixed(2);                    
            }

            if (category=='전체') {
                a_table_items.push(a_item);
            } else {
                if (category==a_item['category']) {
                    a_table_items.push(a_item);    
                }
            }
            
            if (! a_categories.includes(a_item['category'])) {
                a_categories.push( a_row[10] );

                var a_item2 = {value:a_row[10], text:a_row[10]};
                dic_category.push(a_item2);
            }   

        });
            

        let dic_result = {table:a_table_items, category:dic_category};
        return dic_result;

    }


    static getIndustryList(list,category,data_type=0) {
        console.log('getIndustryList=',list);

        let a_table_items = [];
        let a_categories = [];
        let dic_category = [{value:'전체', text:'전체'}];


        list.forEach(function(a_row) {
            var a_item = {};
            if (data_type==0) {
                a_item['recommend_date'] = a_row[2];
                a_item['category'] = a_row[3];
                a_item['title'] = a_row[4];
                a_item['opinion'] = a_row[5];
                a_item['opinion2'] = a_row[6];
                a_item['author'] = a_row[8];
                a_item['company'] = a_row[9];
                a_item['pages'] = a_row[10];
            } else if (data_type==1) {
                a_item['recommend_date'] = a_row['recommend_date'];
                a_item['category'] = a_row['category'];
                a_item['asset'] = a_row['asset'];
                a_item['target_price'] = a_row['target_price'];
                a_item['title'] = a_row['title'];
                a_item['author'] = a_row['author'];
                a_item['company'] = a_row['company'];
                a_item['win_ratio_t20'] = (a_row['t20_t0']*100).toFixed(2);                    
                a_item['win_ratio_t60'] = (a_row['t60_t0']*100).toFixed(2);                    
                a_item['win_ratio_t120'] = (a_row['t120_t0']*100).toFixed(2);                    
            }

            if (category=='전체') {
                a_table_items.push(a_item);
            } else {
                if (category==a_item['category']) {
                    a_table_items.push(a_item);    
                }
            }
            
            if (! a_categories.includes(a_item['category'])) {
                a_categories.push( a_row[10] );
                var a_item2 = {value:a_row[10], text:a_row[10]};
                dic_category.push(a_item2);
            }   
        });
            

        let dic_result = {table:a_table_items, category:dic_category};
        return dic_result;

    }


    static toTimestamp(src_date,is_utc=false) {
        //var a_date = src_date.substring(5,7) + '/' + src_date.substring(8,10) + '/' + src_date.substring(0,4) + ' 01:00:00';
        //var a_date = Moment(src_date,'YYYY-MM-DD');
        //console.log('toTimestamp : a_date=',src_date);
        //var datum = Date.parse(a_date);
        
        var a_date = null;
        var new_date = src_date;

        if (is_utc) {
            if (src_date.length>10) {
                new_date = moment(src_date+'Z').format('YYYY-MM-DD HH:mm:ss');
            } else {
                new_date = moment(src_date+' 00:00:00Z').format('YYYY-MM-DD HH:mm:ss');
            }
        }

        if (new_date.length>10) {
            a_date = new Date(new_date.substring(0,4),new_date.substring(5,7)-1,new_date.substring(8,10),new_date.substring(11,13),new_date.substring(14,16),new_date.substring(17,19));
        } else {
            a_date = new Date(new_date.substring(0,4),new_date.substring(5,7)-1,new_date.substring(8,10),'01','00','00');
        }
        
        //console.log('toTimestamp : a_date=',src_date,src_date.substring(11,13),src_date.substring(14,16),a_date);

        if (! is_utc) {
            var timezone_offset = new Date().getTimezoneOffset() * 60000;
            a_date = a_date - timezone_offset;
        }
        
        return a_date;
    }


    static navHome(a_this) {
        logger.log.debug("CommonFunc.navHome");
        
        //store.getters.nav.add(a_this.$route);
        let dic_param = { name:'home', path:'home', query:{} };
        a_this.$router.push(dic_param);
    }

    static navBack(a_this) {
        a_this.$router.back();
    }

    static navMarket(a_this) {
        logger.log.debug("CommonFunc.navMarket - ",a_this.$route);
        
        store.getters.nav.add(a_this.$route);
        let dic_param = {name:'market',path:'market',query:{}};
        a_this.$router.push(dic_param);
    }

    static navSignin(a_this,is_redirect=false) {
        logger.log.debug("CommonFunc.navSignin - ",a_this.$route);
        
        let dic_param = {name:'signin'};
        if (is_redirect) {
            dic_param.params = { path:a_this.$route.name, query:a_this.$route.query };
        }
            
        a_this.$router.push(dic_param);
    }

    static navActivationNotification(a_this) {
        logger.log.debug("CommonFunc.navActivationNotification - ",a_this.$route);
        
        let dic_param = {name:'user_activation_notification'};            
        a_this.$router.push(dic_param);
    }

    static navResetPassword(a_this) {
        logger.log.debug("CommonFunc.navResetPassword - ",a_this.$route);
        
        store.getters.nav.add(a_this.$route);

        let dic_param = {name:'reset_password', params:{ path:a_this.$route.name, query:a_this.$route.query }};
        a_this.$router.push(dic_param);
    }

    static navResetNotification(a_this) {
        logger.log.debug("CommonFunc.navResetNotification - ",a_this.$route);    

        let dic_param = {name:'reset_notification', params:{}};
        a_this.$router.push(dic_param);
    }

    static navNotification(a_this) {
        logger.log.debug("CommonFunc.navNotification - ",a_this.$route);    
        
        store.getters.nav.add(a_this.$route);
        let dic_param = {name:'notification', params:{}};
        a_this.$router.push(dic_param);
    }

    static navProfile(a_this,username) {
        logger.log.debug("CommonFunc.navProfile - ",username);
        
        store.getters.nav.add(a_this.$route);
        //CommonFunc.setAppData('selected_author',author);
        let dic_param = { name:'profile', path:'profile', query:{ username:username } };
        a_this.$router.push(dic_param);
    }

    static navPortfolioIndexView(a_this) {
        store.getters.nav.add(a_this.$route);
        let dic_param = { name:'portfolio_index', path:'portfolio_index', query:{} };
        a_this.$router.push(dic_param);    
    }

    static navPortfolioView(a_this,user) {        
        store.getters.nav.add(a_this.$route);
        let dic_param = { 
            name:'portfolio', path:'portfolio', 
            query:{ username:user.username} 
        };
        a_this.$router.push(dic_param);    
    }

    static navPortfolio(a_this,username,portfolio_id) {
        store.getters.nav.add(a_this.$route);
        let dic_param = { 
            name:'portfolio_detail', path:'portfolio_detail', 
            query:{ username:username, portfolio_id:portfolio_id} 
        };
        a_this.$router.push(dic_param);    
    }

    static navHolder(a_this,asset_id,symbol) {
        store.getters.nav.add(a_this.$route);
        let dic_param = { 
            name:'asset_holder', path:'asset_holder', 
            query:{ id:asset_id, symbol:symbol} 
        };
        a_this.$router.push(dic_param);    
    }

    static navTweetDetail(a_this,id) {
        logger.log.debug("CommonFunc.navTweetDetail - ",a_this.$route);
        store.getters.nav.add(a_this.$route);
        let dic_param = { name:'tweet_detail', path:'tweet_detail', query: {id:id} };            
        a_this.$router.push(dic_param);
    }

    static navReview(a_this,symbol,page_id) {
        let dic_param = {
            name: "assetreview",path: "assetreview", query: { symbol:symbol, id: page_id },
        };
        
        logger.log.debug("CommonFunc.navReview - ",dic_param);
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    
    static navError404(a_this) {
        let dic_param = {
            name: "error_404",path: "error_404", query: {},
        };
        logger.log.debug("navError404 : dic_param=",dic_param);
        a_this.$router.push(dic_param);
    }

    static navBlog(a_this,category,symbol,page_id) {
        let dic_param = {
            name: "blog",path: "blog", query: { category:category, symbol:symbol, id: page_id },
        };        
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }
    
    static navBlogDetail(a_this,page_id) {
        let dic_param = {
            name: "blog_detail",path: "blog_detail", query: { page_id: page_id }, meta: {transition:'zoom'} 
        };
        
        logger.log.debug("navBlogDetail : dic_param=",dic_param);
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navQADetail(a_this,page_id) {
        let dic_param = {
            name: "assetqa_detail",path: "assetqa_detail", query: { id: page_id },
        };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navQA(a_this,symbol,id) {
        let dic_param = {
            name: "assetqa",path: "assetqa", query: {symbol:symbol, id:id},
        };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navFeeds(a_this) {
        let dic_param = {
            name: "feeds",path: "feeds", query: {},
        };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navTweetWriter(a_this,asset_id) {
        let dic_param = {
            name: "tweet_writer",path: "tweet_writer", query: { id: asset_id },
        };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navBlogWriter(a_this,a_post) {
        store.getters.nav.add(a_this.$route);

        let dic_param = { name:'blog_writer', params:{post:a_post} };
        a_this.$router.push(dic_param);
    }

    static navAsset(a_this,symbol,page_id) {
        logger.log.debug("CommonFunc.navAsset - ",symbol);

        //store.getters.nav.add(a_this.$route);
        let dic_param = { name:'asset', path:'asset', query:{ symbol:symbol, id: page_id } };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navAssetIndex(a_this) {
        logger.log.debug("CommonFunc.navAssetIndex");

        //store.getters.nav.add(a_this.$route);
        let dic_param = { name:'asset_index', path:'asset_index', query:{} };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navAssetDetail(a_this,symbol,page_id) {
        let dic_param = {
            name: "asset_detail",path: "asset_detail", query: { symbol:symbol, id: page_id},
        };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }
    
    static navInstrument(a_this,asset) {
        logger.log.debug("CommonFunc.navInstrument - ",asset);
        
        const a_code = LocalStorageService.findCode(asset);

        let a_selected = CommonFunc.getAppData('selected');
        if (! a_selected) {
            a_selected = {};
        }
        
        a_selected['asset'] = asset;
        a_selected['category'] = a_code.category;
        a_selected['name'] = a_code.name;

        CommonFunc.setAppData('selected',a_selected);

        let dic_param = {name:'kinstrument', params:{ param_asset:asset }};
        a_this.$router.push(dic_param);
    }

    static navSector(a_this,category) {
        logger.log.debug("CommonFunc.navSector - ",category);
        
        CommonFunc.setAppData('selected_sector',category);

        let dic_param = {name:'sector', params:{ param_category:category }};
        a_this.$router.push(dic_param);
    }

    static openInstrument(parent,asset) {
        logger.log.debug("CommonFunc.openInstrument - ",asset);
        
        let route = parent.$router.resolve({path: '/kinstrument', query: {'query_asset':asset}});

        let a_selected = CommonFunc.getAppData('selected');
        if (! a_selected) {
            a_selected = {};
        }
        
        const a_code = LocalStorageService.findCode(asset);

        a_selected['asset'] = asset;
        a_selected['category'] = a_code.category;
        a_selected['name'] = a_code.name;

        CommonFunc.setAppData('selected',a_selected);
        CommonFunc.openLink(route.href);
    }

    static openLink(url) {
        window.open(url, "_blank");          
    }

    static setAppData(key,value) {
        store.commit(Actions.SET_GLOBAL_DATA,{key:key,value:value});
        return value;
    }

    static getAppData(key) {
        //console.log("Common.getAppData=",store.getters.data);
        if (store.getters.data.hasOwnProperty(key)) { 
            return store.getters.data[key];
        }
        //console.log("fail to find");
        return null;
    }

    static setComponent(key,value) {
        console.log("Common.setComponent=",key,value);
        store.commit(Actions.SET_COMPONENT,{key:key,value:value});        
    }

    static getComponent(key) {
        console.log("Common.getComponent=",store.getters.components);
        if (store.getters.components.hasOwnProperty(key)) { 
            return store.getters.components[key];
        }
        console.log("fail to find");
        return null;
    }

    static getIndustryName(industry_code) {
        const json_industry = {
            "U005":"음식료품","U006":"섬유,의복","U007":"종이,목재","U008":"화학","U009":"의약품",
            "U010":"비금속광물","U011":"철강,금속","U012":"기계","U013":"전기,전자","U014":"의료정밀","U015":"운송장비",
            "U016":"유통업","U017":"전기가스업","U018":"건설업","U019":"운수창고","U020":"통신업","U021":"금융업",
            "U022":"은행","U024":"증권","U025":"보험","U026":"서비스업","U027":"제조업",

            "U212":"(코스닥)기타","U215":"(코스닥)IT종합","U224":"(코스닥)제조","U226":"(코스닥)건설","U227":"(코스닥)유통",
            "U229":"(코스닥)운송","U231":"(코스닥)금융","U237":"(코스닥)오락,문화","U241":"(코스닥)통신방송서비스",
            "U242":"(코스닥)IT SW","U243":"(코스닥)IT HW",
            "U256":"(코스닥)음식료,담배","U258":"(코스닥)섬유,의류","U262":"(코스닥)종이,목재","U263":"(코스닥)출판,매체복제",
            "U265":"(코스닥)화학","U266":"(코스닥)제약","U267":"(코스닥)비금속","U268":"(코스닥)금속","U270":"(코스닥)기계,장비",
            "U272":"(코스닥)일반전기전자","U274":"(코스닥)의료,정밀기기",
            
            "U275":"(코스닥)운송장비,부품","U277":"(코스닥)기타제조",
            "U351":"(코스닥)통신서비스","U352":"(코스닥)방송서비스","U353":"(코스닥)인터넷",
            "U354":"(코스닥)디지털콘텐츠","U355":"(코스닥)소프트웨어","U356":"(코스닥)컴퓨터서비스","U357":"(코스닥)통신장비",
            "U358":"(코스닥)정보기기","U359":"(코스닥)정보기기","U360":"(코스닥)IT부품"
        }

        return json_industry;

    }

    static getColumnDic(columns,needles,execludes=[]) {
        let dic_columns = {};
        let column_index = 0;
        columns.forEach(a_column => {
            if (needles.length==0) {
                dic_columns[a_column] = column_index;    
            } else {
                needles.forEach(a_needle => {
                    if (a_column.includes(a_needle)) {
                        if (execludes.length==0) {
                            dic_columns[a_column] = column_index;
                        } else {
                            let found = false;
                            console.log('getColumnDic : found ->',a_column,excludes);                        
                            execludes.forEach(a_exclude => {
                                if (a_column.indexOf(a_exclude)>-1) {
                                    found = true;
                                }
                            });
                            if (! found) {
                                dic_columns[a_column] = column_index;    
                            }
                        }
                        
                    }    
                })    
            }
            column_index += 1;
        });

        return dic_columns;
    }

    static getKeys(json_data) {
        let keys = [];
        for (var a_key in json_data) {
            keys.push(a_key);
        }
        return keys;
    }

    static addPostfix(arr,postfix) {
        let values = [];
        arr.forEach(a_item => {
            values.push( a_item+postfix );
        });
        return values;
    }

    static getListForTable(json_data) {
        //console.log('getReportList=',list);

        let a_table_items = [];
          
          let dic_columns = {};
          let column_index = 0;
          json_data.columns.forEach(a_column => {
              dic_columns[a_column] = column_index;
              column_index += 1;
          });

        json_data.values.forEach(a_row => {
          var a_item = {};
          
          for (var a_key in dic_columns) {
              a_item[a_key] = a_row[ dic_columns[a_key] ];
          }      
          a_table_items.push(a_item);
        });
            
        return a_table_items;
    }

    static getColumnValue(values,column_index) {
        let data = [];
        values.forEach(item => {
            data.push(item[column_index]);
        });
        return data;
    }

    static getMinMaxInSeries(series) {
        let a_min = 10000000000000;
        let a_max = -99999999;
        series.forEach(a_item => {
            
            //console.log('a_item=',a_item);

            if (a_item.y>a_max) {
                a_max = a_item.y;
            }
            if (a_item.y<a_min) {
                a_min = a_item.y;
            }
        });

        return {min:a_min, max:a_max};
    }

    static getAssetInSector(category,format_number=false) {
        const codes = CommonFunc.getAppData('code');
        //logger.log.debug('MCTable.updateList : code=',codes);

        let rows = [];
        for (let a_code in codes) {
            //logger.log.debug('MCTable.updateList : a_code=',a_code);
            if (codes[a_code].category ==category) {
                let a_row = codes[a_code];
                a_row.asset = a_code;
                if (format_number) {
                    a_row.price = CommonFunc.formatNumber(a_row.price,0,true);
                    a_row.mc = CommonFunc.formatNumber(a_row.mc,0,true);    
                }
                rows.push(a_row);
            }
        };        
        return rows;
    }
    
    static loadCode() {
        
        const a_code = CommonFunc.getAppData('code');
        if ( a_code) {
            return new Promise(function(resolve,reject) {
                resolve();
            });
        }        
        
        return new Promise(function(resolve,reject) {
            const dic_param = {};
            MoaBackendAPI.getCode(dic_param,function(response) {
                let g_code = response.data.data.values;

                logger.log.debug("CommonFunc.loadCode - response",g_code);
                CommonFunc.setAppData('code',g_code);
                
                //a_this.$emit('onLoadCode');

                resolve();

            },function(err) {
                logger.log.error("Common.loadCode - error",err);
                reject();
            });
        });
    
    }

    static range(start,end,step=1,to_str=true) {
        let array = [];
        for (let i = start; i < end; ++i) {
            if (!(i % step)) {
                if(to_str) {
                    array.push(String(i));
                } else {
                    array.push(i);
                }
            
          }
        }
        return array;
    }

    static getMinMaxExt(datum) {
        let a_max = -999999;
        let a_min = 99999999999;

        datum.forEach(a_data => {
            let a_minmax = CommonFunc.getMinMaxInSeries(a_data);
            if (a_minmax.max>a_max) {
                a_max = a_minmax.max;
            }
            if (a_minmax.min<a_min) {
                a_min = a_minmax.min;
            }
        });
        //console.log('getMinMaxExt=',Math.max(maxs),mins);

        return { max:a_max, min:a_min };
    }

    static getKeyValue(obj) {
        let keys = [];
        let values = [];

        for (let key in obj) {
            keys.push(key);
            values.push( obj[key] );
        }
        return {key:keys,value:values};
    }

    static repeatLastData(data,days=1) {
        let a_data = data[data.length-1];
        data.push( {x: CommonFunc.addDays(a_data.x,days,true), y:a_data.y} )
        return data;
    }

    static round(value,places) {
        return +(Math.round(value + "e+" + places)  + "e-" + places);
    }    

    static getPageHeader(title,asset,a_date) {
        const a_code = LocalStorageService.findCode(asset);            
        const a_mc = Math.round(a_code.mc/100000000);
        //this.updateHeader(a_code.category,a_code.name,asset,a_date, Math.round(a_code.mc/100000000));
        let heading = title + " : ";

        if (a_date.length>0) {
            heading += a_date + " , ";
        }
        heading += a_code.category + " ( " + a_code.name + " - " + asset + "  , MC = " + a_mc.toLocaleString() + " 억원 )";
        
        return heading;
    }

    static getChartData(json_data,a_asset,column='',column_date='trade_date',is_float=true,dtype=0,idecimal=3) {
                
        let data_price = [];
        let values = [];
        let dic_columns = CommonFunc.getColumnDic(json_data[a_asset].columns,[],[]);
        let column_index = dic_columns[column];
        let date_index = dic_columns[column_date];
        
        let is_utc = false;
        if (column_date.indexOf('utc')>-1) {
            is_utc = true;
        }
        //logger.log.debug('getChartData : date_index= , is_utc',date_index,is_utc);

        json_data[a_asset].values.forEach(a_item => {
            let a_value = a_item[column_index]; 
            if (dtype==1) {
                a_value = a_value - 0.5;
            }
            
            a_value = CommonFunc.round(a_value,idecimal);

            if (dtype==2) {
                if (a_value==0) {
                    return;
                }
            }

            let a_data = {x: CommonFunc.toTimestamp(a_item[date_index],is_utc), y:a_value}
            data_price.push(a_data);
            values.push(a_value);
        });    
                
        return {data:data_price, values:values};
    }

    static getOHCLVData(json_data,a_asset,column_date='trade_date',columns=['open','high','low','close']) {
                
        let dic_columns = CommonFunc.getColumnDic(json_data[a_asset].columns,[],[]);
        let date_index = dic_columns[column_date];
        
        //logger.log.debug('getChartData : date_index=',date_index);
        let data_price = [];
        json_data[a_asset].values.forEach(a_item => {
            //let a_value = a_item[column_index]; 
            //a_value = CommonFunc.round(a_value,3);
            let a_data = [CommonFunc.toTimestamp(a_item[date_index]), a_item[dic_columns[columns[0]]], a_item[dic_columns[columns[1]]], a_item[dic_columns[columns[2]]],a_item[dic_columns[columns[3]]] ];
            data_price.push(a_data);
        });    
                
        return data_price;
    }


    static getBBEventData(json_data,a_asset,column,column_date='trade_date',columns=['close','upper','lower']) {
                
        let dic_columns = CommonFunc.getColumnDic(json_data[a_asset].columns,[],[]);
        let date_index = dic_columns[column_date];
        let column_index = dic_columns[column];

        //logger.log.debug('getChartData : date_index=',date_index);
        
        let event_up = [];
        let event_down = [];

        let a_value = 0;
        let a_upper = 0;
        let a_lower = 0;

        json_data[a_asset].values.forEach(a_item => {
            //let a_value = a_item[column_index]; 
            //a_value = CommonFunc.round(a_value,3);
            a_value = a_item[dic_columns[columns[0]]];
            a_upper = a_item[dic_columns[columns[1]]];
            a_lower = a_item[dic_columns[columns[2]]];
            
            if (a_value>a_upper) {
                event_up.push( {x: CommonFunc.toTimestamp(a_item[date_index]), y:a_item[column_index]} )
            }
            if (a_value<a_lower) {
                event_down.push( {x: CommonFunc.toTimestamp(a_item[date_index]), y:a_item[column_index]} )
            }

        });    
                
        return {up:event_up, down:event_down}
    }

    static getChartDataExt(json_data,a_asset,columns,column_date='trade_date',is_float=true,dtype=0) {
                
        let data_price = [];
                    
        let dic_columns = CommonFunc.getColumnDic(json_data[a_asset].columns,[],[]);
        //let column_index = dic_columns[column];
        let date_index = dic_columns[column_date];
        
        //logger.log.debug('getChartData : date_index=',date_index);

        json_data[a_asset].values.forEach(a_item => {
            
            let values = [];
            columns.forEach(a_column => {
                let a_value = a_item[dic_columns[a_column]]; 
                if (dtype==1) {
                    a_value = a_value - 0.5;
                }
                values.push(a_value);
            });

            a_value = CommonFunc.round(a_value,3);
            let a_data = {x: CommonFunc.toTimestamp(a_item[date_index]), y:values}
            data_price.push(a_data);
        });    
                
        return {data:data_price};
    }    


    static getChartDataFromIndex(data,start_index) {
        let new_data = [];
        if (start_index<0) {                
            start_index = data.length + start_index - 1;
            if (start_index>data.length) {
                start_index = data.length-1;
            }
        }
        
        //console.log('start_index=',data.length,start_index);

        for (var index=0;index<data.length;index++) {
            if (index>start_index) {
                new_data.push( data[index] );
            }
        }
        return new_data;
    }

    static isEmptyObject(value)
    {
        if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
            return true;
        }
        
        return false;

    }    

    static getChartOption(series,yaxis=null,height=null) {
        let a_option = {
            chart: {
                zoomType: 'x',
                panning: true,
                panKey: 'shift'
            },           
            tooltip: {
                xDateFormat: '%Y/%m/%d',
                shared: true,
                split: false,
                enabled: true,
                followPointer: true,
                followTouchMove: false,
            },    
            title: {text:''},
            xAxis: { type: 'datetime' },                
            yAxis: [
                {opposite:false, show:true, endOnTick:false, title:{text:''} },
                {opposite:true, show:true, endOnTick:false, title:{text:''}, gridLineWidth:0 },    
                {opposite:true, show:true, endOnTick:false, title:{text:''}, min:0.8, gridLineWidth:0 },
            ],
            series: series
        }
        if (yaxis) {
            a_option.yAxis = yaxis;
        }

        if (height) {
            a_option.chart.height = height;
        }

        return a_option;
    }  

    static showInnerLoading(a_this,visible) {
        if (visible) {
            a_this.visible = true;
            a_this.showSimulatedReturnData = false;
            return;
        }
        a_this.visible = false;
        a_this.showSimulatedReturnData = true;
    }

    static isUpperCase(str) {
        return str === str.toUpperCase();
    }

    
    static formatArrayToJson(data) {
        let items = [];
        for (let index=0;index<data['values'].length;index++) {
            let a_item = {};
            for (let index2=0;index2<data['columns'].length;index2++) {
                a_item[data['columns'][index2]] = data['values'][index][index2];
            }
            items.push(a_item);
        }
        return items;
    }

    static safeGetJsonValue(data,row_index,col_index) {
        if (row_index>=data.length) {
            return null;
        }
        return data[row_index][col_index];
    }

    static safeGetNumericValue(value) {
        if (CommonFunc.isEmptyObject(value)) {
            return 0;
        }
        return value;
    }

    static getCWatchValueAndColor(value) {
        let a_value = Math.round(value*100) - 90;
        let a_color="green";
        let a_icon="info";
        if (a_value<0) {
            a_value = 1;
            a_color = "green";
        } else if (a_value>5) {
            a_color = "red";
            a_icon = "warning";
        }
        
        return {value:a_value, color:a_color, icon:a_icon};
    }

    static safeSplit(value,needle) {
        if (value.length==0) {
            return [''];
        }

        return value.split(needle);
    }


    static milifyNumber(x,decimal=0) {
        
        if (isNaN(x)) {
            return x;
        }
            
        //console.log("milify=",x);

        let a_value = null;

        if(x < 1) {
            return CommonFunc.formatNumber(x,decimal,false);
        } else if(x < 99999) {            
            return CommonFunc.formatNumber(x,decimal,true);
        }
    
        if(x < 1000000) {            
            a_value = Math.round(x/1000);
            return CommonFunc.formatNumber(a_value,0) + "K";
        }
        if( x < (1000*1000*100)) {
            a_value = x/1000000;
            return CommonFunc.formatNumber(a_value,2) + "M";
        }

        if (x < (1000*1000*1000*100)) {
            a_value = x/(1000*1000*1000);
            return CommonFunc.formatNumber(a_value,2) + "B";
        }

        console.log("milify--1",x);

        a_value = x/(1000*1000*1000*1000);
        a_value = CommonFunc.formatNumber(a_value,2) + "T";
        //console.log("milify--2",a_value);
        return a_value;
    }    

    static showOkMessage(a_this,msg) {
        a_this.$q.notify({
            color: 'green-4', textColor: 'white', icon: 'cloud_done',message: msg
        });
    }

    static showErrorMessage(a_this,msg) {
        a_this.$q.notify({
            color: 'red-4', textColor: 'white', icon: 'warning',message: msg
        });
    }

    static getURLQuery(url) {
        var qs = url.substring(url.indexOf('?') + 1).split('&');
        for(var i = 0, result = {}; i < qs.length; i++){
            qs[i] = qs[i].split('=');
            result[qs[i][0]] = decodeURIComponent(qs[i][1]);
        }
        return result;
    }

    static getBucketKey(filename) {
        var tokens = filename.split(".");
        var today = new Date();
        var a_date = tokens[0] + "_" + today.getFullYear()+(today.getMonth()+1)+today.getDate()+"_"+today.getHours()+today.getMinutes()+today.getSeconds()+"."+tokens[1];
        return a_date;
    }

    static resizeImage(img, maxWidth, maxHeight, degrees=0) {
        
        return new Promise((resolve, reject) => {
            var imgWidth = img.width,
                imgHeight = img.height;
            
            var ratio = 1,
                ratio1 = 1,
                ratio2 = 1;

            ratio1 = maxWidth / imgWidth;
            ratio2 = maxHeight / imgHeight;
            
            // Use the smallest ratio that the image best fit into the maxWidth x maxHeight box.
            if (ratio1 < ratio2) {
                ratio = ratio1;
            } else {
                ratio = ratio2;
            }
            var canvas = document.createElement("canvas");
            var canvasContext = canvas.getContext("2d");
            var canvasCopy = document.createElement("canvas");
            var copyContext = canvasCopy.getContext("2d");
            var canvasCopy2 = document.createElement("canvas");
            var copyContext2 = canvasCopy2.getContext("2d");
            canvasCopy.width = imgWidth;
            canvasCopy.height = imgHeight;
            copyContext.drawImage(img, 0, 0);
            
            // init
            canvasCopy2.width = imgWidth;
            canvasCopy2.height = imgHeight;
            copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);
            
            
            var rounds = 1;
            var roundRatio = ratio * rounds;
            for (var i = 1; i <= rounds; i++) {
                // tmp
                canvasCopy.width = imgWidth * roundRatio / i;
                canvasCopy.height = imgHeight * roundRatio / i;
            
                copyContext.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvasCopy.width, canvasCopy.height);
            
                // copy back
                canvasCopy2.width = imgWidth * roundRatio / i;
                canvasCopy2.height = imgHeight * roundRatio / i;
                copyContext2.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvasCopy2.width, canvasCopy2.height);
            
            } // end for
            
            canvas.width = imgWidth * roundRatio / rounds;
            canvas.height = imgHeight * roundRatio / rounds;
            canvasContext.drawImage(canvasCopy2, 0, 0, canvasCopy2.width, canvasCopy2.height, 0, 0, canvas.width, canvas.height);
                        
            if (degrees == 90 || degrees == 270) {
                canvas.width = canvasCopy2.height;
                canvas.height = canvasCopy2.width;
            } else {
                canvas.width = canvasCopy2.width;
                canvas.height = canvasCopy2.height;
            }
            
            canvasContext.clearRect(0, 0, canvas.width, canvas.height);
            if (degrees == 90 || degrees == 270) {
                canvasContext.translate(canvasCopy2.height / 2, canvasCopy2.width / 2);
            } else {
                canvasContext.translate(canvasCopy2.width / 2, canvasCopy2.height / 2);
            }
            canvasContext.rotate(degrees * Math.PI / 180);
            canvasContext.drawImage(canvasCopy2, -canvasCopy2.width / 2, -canvasCopy2.height / 2);        
            
            //var dataURL = canvas.toDataURL();
            //const JPEG_QUALITY=0.5;
            //var dataURL = canvas.toDataURL('image/jpeg', JPEG_QUALITY).replace('data:image/jpeg;base64,', '');

            const MIME_TYPE = "image/jpeg";
            const QUALITY = 0.7;
                        
            canvas.toBlob(blob => {
                    resolve(blob);
                },
                MIME_TYPE,
                QUALITY                
            );
            
        });

    }

    static minifyDatetime(value,dtype=0) {
        if (dtype==0) {
            return moment(value,"YYYY-MM-DDThh:mm:ss").fromNow();
        } else if (dtype==1) {
            return moment(value,"LLL").fromNow();
        } else if (dtype==2) {
            return moment(value,"YYYY-MM-DDThh:mm:ss").format('YYYY-MM-DD hh:mm:ss');
        }
    }

    static getCurrentDatetime(dtype=0) {        
        let today = new Date();
        let dateStr = null;

        if (dtype==0) {
            return today;
        } else if (dtype==1) {
            dateStr = moment(moment.now()).format("MMMM D, YYYY, h:mm:ss a");
        } else if (dtype==2) {
            dateStr = moment(moment.now()).format("YYYY-MM-DD, hh:mm:ss");
        }
        //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        //var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        //var dateTime = date+' '+time;        
        //June 19, 2021, 3:10 p.m.        

        return dateStr;
    }

    static updateRatingCount(_this,response) {
        if ((response.data.status=="ok") || (response.data.ret==0) ) {
            _this.like_count = response.data.data.like_count;
            _this.dislike_count = response.data.data.dislike_count;
        }
    }
    
    static shortenString(value,max_length) {
        if (CommonFunc.isEmptyObject(value)) {
            return '';
        }

        if (value.length<max_length) {
            return value;
        } 

        return value.substring(0, max_length - 3) + " ..." ;            
    }

    static strpos(haystack, needle, offset) 
    {
        var i = (haystack+'').indexOf(needle, (offset || 0));
        return i === -1 ? false : i;
    }

    static substrInBetween(str, startDelimiter, endDelimiter) {
        //logger.log.debug(">>> substrInBetween",str);

        var contents = [];
        var startDelimiterLength = startDelimiter.length;
        var endDelimiterLength = endDelimiter.length;
        let startFrom = 0;
        let contentStart = 0;
        let contentEnd = 0;
        
        while(false !== (contentStart = CommonFunc.strpos(str, startDelimiter, startFrom))) 
        {
            contentStart += startDelimiterLength;
            contentEnd = CommonFunc.strpos(str, endDelimiter, contentStart);
            if(false === contentEnd) 
            {
                break;
            }
            contents.push( str.substr(contentStart, contentEnd - contentStart) );
            startFrom = contentEnd + endDelimiterLength;
        }
    
        return contents;
    }


    static addLimitOffsetToQuery(url, reqParam) {
        if ( (reqParam.hasOwnProperty("limit")) && (reqParam.limit) ) {
            if (url.indexOf('?')==-1) {
                url += "?";
            } else {
                url += "&";   
            }
            url = url + "limit=" + reqParam.limit + "&offset=" + reqParam.offset;
        }    
        return url;
    }

    static copyToClipboard(a_this,value) {
        const el = document.createElement('textarea');  
        el.value = value;
        el.setAttribute('readonly', '');                
        el.style.position = 'absolute';                     
        el.style.left = '-9999px';                      
        document.body.appendChild(el);                  

        logger.log.debug("CommonFunc.copyUrl - url=",el.value);

        const selected =  document.getSelection().rangeCount > 0  ? document.getSelection().getRangeAt(0) : false;
        el.select();                                    
        document.execCommand('copy');                   
        document.body.removeChild(el);                  
        if (selected) {                                 
            document.getSelection().removeAllRanges();    
            document.getSelection().addRange(selected);   
        }

        CommonFunc.showOkMessage(a_this,'Copy to clipboard');
    }

    static copyUrl(a_this,link_url) {
        const value = window.location.host+link_url;
        CommonFunc.copyToClipboard(a_this,value);        
    }    

    static checkButtonPermission(a_this,is_signin,is_delete) {
        const _this=this;

        return new Promise(function(resolve,reject) {        
            
            if (is_signin) {

                if (! store.getters.me.isLoggedIn()) {

                    store.getters.components.getComponent('confirmDialog').show('Please login first',function(value) {
                        if (! value) {
                            resolve(0);
                            return;
                        } else {
                            resolve(0);
                            store.getters.nav.add(this.$route);
                            CommonFunc.navSignin(a_this);
                        }                    
                    });                                
                } else {
                    resolve(1);
                }
            }

            else if (is_delete) {

                store.getters.components.getComponent('confirmDialog').show('Do you want to delete?',function(value) {
                    if (! value) {
                        resolve(0);
                    } else {
                        resolve(1);
                    }                    
                });
            
            } else {
                resolve(1);
            }

        });

    }

    static getPerfColor(value) {
        if (value>0) {
            return "color:#c10015;"
        }
        return "color:#005dde;";
    }

    static isNumeric(str) {
        if (typeof str != "string") return true // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
    }    

    static addHashTag(str,tags,addBR="<br><br>") {
        let ret = str;
        let tag_count = 0;
        for (let index=0;index<tags.length;index++) {
            let tag = tags[index];
            if (! tag) {
                continue;
            }
            if (ret.search('#'+tag)==-1) {
                if ( (addBR.length>0) && (tag_count==0) ) {
                    ret += addBR;
                }
                ret += " #"+tag+" ";
                tag_count += 1;
            }
        }
        return ret;
    }

    static addUrlParams() {

    }
}

