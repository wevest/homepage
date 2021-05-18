import logger from "src/error/Logger";
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';


export default class DataService{

    constructor(){
        
    }

    static rowsToJson(list,columns) {
        var jsons = [];

        //var columns = ['id','reg_date','recommend_date','category','title','opinion','opinion2','opinion_type','author','company','pages'];
        for (var index=0; index<list.length; index++) {
            var a_data = {};
            for (var index2=0; index2<columns.length; index2++) {
                a_data[columns[index2]] = list[index][index2];
            }
            jsons.push(a_data);
        }
            
        return jsons;
    }

    static industryToJson(list) {
        const columns = ['id','reg_date','recommend_date','category','title','opinion','opinion2','opinion_type','author','company','pages'];
        var jsons = DataService.rowsToJson(list, columns);            
        return jsons;
    }

    static industryChartToJson(list) {
        const columns = ['recommend_date','category'];
        var jsons = DataService.rowsToJson(list, columns);            
        return jsons;
    }

    static jw52ToJson(list) {
        const columns = ['id','reg_date','date','asset','name','category','price','selected'];
        var jsons = DataService.rowsToJson(list, columns);            
        return jsons;
    }

    static jw52PortfolioToJson(list) {
        const columns = ['id','reg_date','jw52_date','category','name','asset','jw52_price','points','long_signal','short_signal','data','selected','itype'];
        var jsons = DataService.rowsToJson(list, columns);            
        return jsons;
    }

    static getUnique(json_list,column) {
        var values = [];
        for (var index=0; index<json_list.length; index++) {
            var a_value = json_list[index][column];
            if (! values.includes(a_value)) {
                values.push(a_value);
            }
        }
        return values;        
    }

    static getCategoryNameFromWinnerData(json_data,asset) {
        //logger.log.debug("WinnerTable.getCategoryName - asset = ",asset);
        let dic_found = {category:'', name:''};
        for (let a_index in json_data.top.values) {
            let a_item = json_data.top.values[a_index];
            //logger.log.debug("WinnerTable.getCategoryName - item = ",a_item);    
            if (a_item[1]==asset) {
                if (asset=='A214320') {
                    //logger.log.debug("WinnerTable.getCategoryName - found = ",asset,a_item);        
                }
                dic_found.category = a_item[0];
                dic_found.name = a_item[2];
                break;
            }
        };
        //logger.log.debug("WinnerTable.getCategoryName - ret = ",dic_found);        
        return dic_found;
    }

    static addCodeInfoToWinnerData(json_data,dic_data,n_top) {
        //const _this = this;
        //logger.log.debug("DataService.addCodeInfoToWinnerTable - dic_data=",dic_data);

        let a_range = CommonFunc.range(0,n_top,1,true);

        let items = [];
        dic_data.forEach(a_item => {
            //console.log('a_itemn=',a_item);
            //['0','1','2','3','4','5','6','7','8','9'].forEach( a_index => {
            a_range.forEach( a_index => {                                    
                const dic_return = DataService.getCategoryNameFromWinnerData(json_data,a_item[a_index]);
                a_item[a_index+'_category'] = dic_return.category;
                a_item[a_index+'_name'] = dic_return.name;
            });
            items.push(a_item);                
        });
        return items;
    }

    static getWinnerTable(json_data,n_top=30) {
        console.log("getWinnerTable.json_date=",json_data);

        /*
        let a_table = CommonFunc.getAppData('winnerTable');
        if (a_table) {
            return a_table;
        }

        if (!json_data) {
            json_data = CommonFunc.getAppData('winnerData');
            if (! json_data) {
                return null;
            }
        }
        */
        
        let dic_asset = CommonFunc.getListForTable(json_data.asset);
        let json_assets = DataService.addCodeInfoToWinnerData(json_data,dic_asset,n_top);
        //logger.log.debug("DataService.getWinnerTable - assets = ",json_assets);
        
        CommonFunc.setAppData('winnerTable',json_assets);
        //this.items_asset = json_assets;
        return json_assets;
    }

    static getWinnerDates(appdata_name,asset,n_top=30,column_date='date') {
        let items_asset = CommonFunc.getAppData(appdata_name);
        let a_range = CommonFunc.range(0,n_top,1,true);

        let dates = [];

        if (! items_asset) {
            return dates;
        }        

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

    static getCrisisData(json_data) {
        let data_price = [];
        let data_points = [];
        let data_raw_points = [];
        json_data['risk'].values.forEach(item => {
            //categories.push(CommonFunc.toTimestamp(item[0]));
            let a_data = {x: CommonFunc.toTimestamp(item[0]), y:item[1]}
            data_price.push(a_data);

            data_raw_points.push( {x: CommonFunc.toTimestamp(item[0]), y:item[2]} );

            if (item[2]!=0) {              
                let a_size = 7;
                if (item[2]==-1) {
                    a_size = 12
                }
                //let a_point = { x: CommonFunc.toTimestamp(item[0]), y: item[1], marker: { size:a_size } }
                let a_point = { x: CommonFunc.toTimestamp(item[0]), y: item[1] }
                data_points.push( a_point );
            }

            //data_points.push(item[2]);
        });
        
        return {price: data_price, point:data_points, raw_point:data_raw_points}
    }

    static loadCryptoWatchData(ioffset=30) {
        return new Promise(function(resolve,reject) {
            let a_today = CommonFunc.getToday(false);
            let a_start_date = CommonFunc.addDays(a_today, ioffset*-1 );
            
            let dic_param = { freq:'1H',start_date:a_start_date, symbol:'BTC', itype:'overall' };
            logger.log.debug("DataService.loadCryptoWatchData - dic_param=",dic_param);

            MoaBackendAPI.getCryptoWatchData(dic_param,function(response) {
                resolve(response.data.data);
            },function(err) {
                logger.log.error("DataService.loadOverviewData - error",err);
                reject();
            });
        });            
    }


    static loadCryptovcData() {
            
        return new Promise(function(resolve,reject) {        

            let dic_param = {};
            MoaBackendAPI.getCryptovcData(dic_param,function(response) {
                let g_data = response.data.data;
                //CommonFunc.setAppData('winnerData',g_data);
                logger.log.debug("Services.loadCryptovcData - response",g_data);                
                resolve(g_data);

            },function(err) {
                logger.log.error("Services.loadCryptovcData - error",err);
                reject();
            });
        });

    }    
}
