//import api from '@/services/api'
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";

//import logger from "@/error/Logger";


export default class Services{

    constructor(){
		
    }
  
    static loadMarketWinner(a_period=350,n_top=40) {
            
        return new Promise(function(resolve,reject) {        
            /*
            let g_data = CommonFunc.getAppData('winnerData');
            if (g_data) {
                resolve(g_data);
            }
            */  
            
            let g_data = null;
            let a_today = CommonFunc.getToday(false);
            let a_start_date = CommonFunc.addDays(a_today, parseInt(a_period)*-1 );

            //logger.log.debug("RecommendView.updateRecommendList - this",this.g_period,a_start_date);
            //CommonFunc.getAppData('spinner').show();

            let dic_param = {start_date:a_start_date, n_top:n_top, thresh:1.5};
            MoaBackendAPI.getWinner(dic_param,function(response) {
                g_data = response.data.data;
                //CommonFunc.setAppData('winnerData',g_data);
                logger.log.debug("Services.loadMarketWinner - response",g_data);
                
                resolve(g_data);

            },function(err) {
                logger.log.error("Services.loadMarketWinner - error",err);
                reject();
            });
        });

    }


    static loadCryptoWinner(a_table='upbit',a_period=350,n_top=40) {
            
        return new Promise(function(resolve,reject) {        
            let a_name = 'cryptoWinnerData' + a_table;

            let g_data = CommonFunc.getAppData(a_name);
            if (g_data) {
                resolve(g_data);
            }
                
            let a_today = CommonFunc.getToday(false);
            let a_start_date = CommonFunc.addDays(a_today, parseInt(a_period)*-1 );

            //logger.log.debug("RecommendView.updateRecommendList - this",this.g_period,a_start_date);

            CommonFunc.getAppData('spinner').show();

            let dic_param = {start_date:a_start_date, n_top:n_top, table:a_table};
            MoaBackendAPI.getCryptoWinnerData(dic_param,function(response) {
                g_data = response.data.data;
                CommonFunc.setAppData(a_name,g_data);
                logger.log.debug("Services.loadCryptoWinner - response",g_data);
                
                resolve(g_data);

            },function(err) {
                logger.log.error("Services.loadCryptoWinner - error",err);
                reject();
            });
        });
    }
    
    
    static loadRVTrend(a_period,a_freq='D',n_top=40) {
            
        return new Promise(function(resolve,reject) {        
            
            let g_data = CommonFunc.getAppData('rvTrendData');
            if (g_data) {
                resolve(g_data);
            }
                
            let a_today = CommonFunc.getToday(false);
            let a_start_date = CommonFunc.addDays(a_today, parseInt(a_period)*-1 );

            //logger.log.debug("RecommendView.updateRecommendList - this",this.g_period,a_start_date);

            CommonFunc.getAppData('spinner').show();

            let dic_param = {start_date:a_start_date, end_date:a_today, n_top:n_top, freq:a_freq};
            MoaBackendAPI.getPVTrendData(dic_param,function(response) {
                g_data = response.data.data;
                CommonFunc.setAppData('rvTrendData',g_data);
                logger.log.debug("Services.loadRVTrend - response",g_data);
                
                resolve(g_data);

            },function(err) {
                logger.log.error("Services.loadRVTrend - error",err);
                reject();
            });
        });

    }

}
