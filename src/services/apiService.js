//import api from '@/services/api'
import {callAPI, callGetAPI, callPostAPI, callJsonRPC} from 'src/util/Http';
import {MoaConfig} from 'src/data/MoaConfig';
//import logger from "@/error/Logger";


export default class MoaBackendAPI{

  constructor(){
		
  }
  
  static getUrl(host,url) {
    return host + url;
  }

  static getAnalyst(reqParam,func,funcErr) {
      let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/analyst");
      //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
      callAPI("POST",url,{},reqParam)
      .then( (response) => {
          func(response);
      })
      .catch( (err) => {
          funcErr(err);
      });

  }

  static getPrice(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/ohlcv");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getSectorStat(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/sector/stat");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getSectorAuthorList(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/sector/author");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getAsset(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/asset");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getRecommend(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/recommend");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getWinner(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/winner");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getCode(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/code");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getIndustry(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/industry");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getJW52(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/52w");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getKospiTrend(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/trend/kospi");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getIndustryChart(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/industry/chart");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getMarketRiskData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/market/risk");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getAssetTrendData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/trend/asset");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getIndustryTrendData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/trend/industry");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getSectorTrendData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/trend/sector");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }


  static getSectorMCTrendData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/trend/market_capital");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static get52WStatData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/52w/stat");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getJW52Form(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/form/get_jw52");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getJW52List(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/form/list_jw52");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static postJW52Form(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/form/jw52");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static deleteJW52Form(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/form/delete_jw52");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getMomentumList(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/momentum");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }


  static getInvestorTrendDatat(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/trend/investor");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getMarketEventData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/market/event");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getRstrengthData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/strength");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getKvixData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/market/kvix");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }


  static getCryptoTrendData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/trend/crypto");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }


  static getPVData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/pv");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getPVTrendData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/trend/pv");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptoTVData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/tv");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptoWinnerData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/winner");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptoMomentumList(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/momentum");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getMarketOverview(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/market/overview");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getCryptoMarketOverview(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/overview");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getCryptoMarketDailyOverview(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/daily_overview");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getCryptoMarketDailySummary(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/daily_summary");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });

  }

  static getCryptoTodayData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/today");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptoIndexData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/index");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptoTopAssetData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/top_asset");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getSectorAssetData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/sector/asset");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptoCalendarEffectData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/ce");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getOSIndexData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/market/os_index");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptoWatchData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/cwatch");
    //logger.log.debug("MoaBackendAPI.validateToken - url = ",url);
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptovcData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/cryptovc");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptoBaseinfo(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/baseinfo");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptoPriceHistory(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/asset");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }


  static getCommitData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/commit");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }


  static getCryptoVCPerformanceData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/cryptovc/performance");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getCryptoVCPortfolioData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/cryptovc/portfolio");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }


  static getCryptoOracleData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/crypto/oracle");
    callAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }


  static getBlogData(reqParam,func,funcErr) {
    let url = MoaBackendAPI.getUrl(MoaConfig.urls.moa,"/api/blog/posts/");
    callAPI("GET",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  
  static getAssetData(reqParam,func,funcErr) {
    let a_method = "/api/asset/assets/";
    if (! reqParam.hasOwnProperty('limit') ) {
      a_method += "?limit=10000";
    }

    let url = MoaBackendAPI.getUrl(MoaConfig.urls.cms,a_method);
    callAPI("GET",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }


}
