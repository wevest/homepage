<template>
    
  <div class="q-pa-md">
        <CTitle ttype='title' :title="v_page.title" :desc="v_page.desc"></CTitle>
        
        <div class="row q-gutter-sm">
            <div class="col q-mt-md">
                <CBigLabel ref='label_btc' title="abc"></CBigLabel>
            </div>
            <div class="col q-mt-md">
                <CBigLabel ref='label_binance' title="abc"></CBigLabel>
            </div>
        
        </div>

        <div class="row q-gutter-sm">
            <div class="col q-mt-md">
                <CBigLabel ref='label_upbit' title="abc" :onclick="onClickUpbit"></CBigLabel>
            </div>
            <div class="col q-mt-md">
                <CBigLabel ref='label_bithumb' title="abc"></CBigLabel>
            </div>
        </div>
    

      <div class="row q-gutter-sm">
        <div class="col">
          <CIndexChart ref='indexChart'></CIndexChart>
        </div>      
      </div>


      <div class="row">
          <div class="col">
              <CTitle :title="$t('page.home_exchange.title')" :desc="$t('page.home_exchange.desc')"></CTitle>          

              <q-tabs v-model="tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
                <q-tab name="upbit" :label="$t('name.upbit')" @click="onClickTab('upbit')" />
                <q-tab name="bithumb" :label="$t('name.bithumb')" @click="onClickTab('bithumb')" />
              </q-tabs>              
          </div>
      </div>

      <div class="row q-gutter-sm">
          <div class="col q-mt-md">
              <CBigLabel ref='label_major' title="abc"></CBigLabel>
          </div>
          <div class="col q-mt-md">
              <CBigLabel ref='label_korean' title="abc"></CBigLabel>                
          </div>
       </div> 
      <div class="row q-gutter-sm">
          <div class="col q-mt-md">
              <CBigLabel ref='label_chinese' title="abc"></CBigLabel>
          </div>
          <div class="col q-mt-md">
              <CBigLabel ref='label_nft' title="abc"></CBigLabel>
          </div>
      </div>    
      <div class="row q-gutter-sm">    
          <div class="col q-mt-md">
              <CBigLabel ref='label_defi' title="abc"></CBigLabel>
          </div>
          <div class="col q-mt-md">
              <CBigLabel ref='label_misc' title="abc"></CBigLabel>
          </div>
      </div>

      <div class="row">
        <div class="col">
          <CExchangeIndexChart ref="exchangeChart"></CExchangeIndexChart>            
          <CTopTable ref="exchangeTop"></CTopTable>
        </div>
      </div>

  </div> 

</template>


<script>
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import MoaBackendAPI from 'src/services/apiService';
import { LoadingBar } from 'quasar';

import { scroll } from 'quasar';
const { getScrollTarget, setScrollPosition } = scroll;

import CTitle from 'components/CTitle';
import CBigLabel from 'components/CBigLabel';
import CTopTable from 'pages/home/CTopTable';
import CIndexChart from 'pages/home/CIndexChart';
import CExchangeIndexChart from 'pages/home/CExchangeIndexChart';


export default {
  name: 'PageIndex',
  components: {
      CTitle,
      CBigLabel,
      CTopTable,
      CIndexChart,
      CExchangeIndexChart
  },

  data: function () {
    return {
      tab:'upbit',

      v_page: {title:this.$t('page.home.title'), desc:''}
    }
  },
    created: function () {
        //console.log("HomeView.created");
    },
    mounted: function() {
        //console.log("HomeView.mounted - ");
        this.refresh();
    },
    updated: function() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        updatePageHeader: function(json_data) {
            const dic_columns = CommonFunc.getColumnDic(json_data['upbit']['btc'].columns,[],[]);
            let watch_date = json_data['upbit']['btc'].values[json_data['upbit']['btc'].values.length-1][dic_columns['trade_date']];
            this.v_page.desc = watch_date;
        },

        refresh: function() {
            const _this = this;
        
            LoadingBar.start();
            let funcs = [            
                //this.loadCalendarEffectData('1h'),
                this.loadIndexData(),
                this.loadCryptoTopAssetData('1h')
            ];
            Promise.all(funcs).then(function() {
                LoadingBar.stop();
            });

        },
        
        loadCalendarEffectData: function(freq) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                //let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                //let a_start_date = CommonFunc.addDays(a_today, -1 );
                //let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {freq:freq};
                logger.log.debug("HomeView.loadCalendarEffectData - dic_param=",dic_param);

                MoaBackendAPI.getCryptoCalendarEffectData(dic_param,function(response) {
                    _this.g_data_ce = response.data.data;
                    logger.log.debug("HomeView.loadCalendarEffectData - response",_this.g_data_ce);
                    //_this.$refs.sectorTable.update(_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("HomeView.loadCalendarEffectData - error",err);
                    reject();
                });
            });            

        },

        loadIndexData: function() {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                let a_start_date = CommonFunc.addDays(a_today, -1 );
                //let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {freq:'1h',start_date:a_start_date};
                logger.log.debug("HomeView.loadIndexData - dic_param=",dic_param);

                MoaBackendAPI.getCryptoIndexData(dic_param,function(response) {
                    _this.g_data = response.data.data;
                    logger.log.debug("HomeView.getCryptoIndexData - response",_this.g_data);
                    
                    _this.updatePageHeader(_this.g_data);
                    _this.updateWidget(_this.g_data);
                    _this.updateIndexChart(_this.g_data);

                    _this.updateExchangeWidget(_this.g_data,_this.tab);
                    _this.updateExchangeIndexChart(_this.g_data,_this.tab);
                    //_this.$refs.sectorTable.update(_this.g_data,_this.tab);
                    resolve();
                },function(err) {
                    logger.log.error("HomeView.loadOverviewData - error",err);
                    reject();
                });
            });            
        },
        

        loadCryptoTopAssetData: function(freq) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                let a_start_date = CommonFunc.addDays(a_today, 0 );
                //let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {freq:freq,start_date:a_start_date};
                logger.log.debug("HomeView.loadCryptoTopAssetData - dic_param=",dic_param);

                MoaBackendAPI.getCryptoTopAssetData(dic_param,function(response) {                    
                    _this.g_data_top = response.data.data;
                    //logger.log.debug("HomeView.loadCryptoTopAssetData - response",response.data);
                    logger.log.debug("HomeView.loadCryptoTopAssetData - response",_this.g_data_top);
                    _this.updateTopTable(_this.g_data_top,_this.tab);
                    resolve();
                },function(err) {
                    logger.log.error("HomeView.loadCryptoTopAssetData - error",err);
                    reject();
                });
            });            
        },
        

        updateWidget: function(data) {
            if (! data.hasOwnProperty('binance')) {
              return
            }

            let dic_columns = CommonFunc.getColumnDic(data['binance']['overall'].columns,[],[]);            
            let column_ret = dic_columns['index_ret'];
            let column_price = dic_columns['price_avg'];

            const exchanges = ['binance','upbit','bithumb','btc'];
            let a_category = 'overall';
            let a_ref = null;
            for (let index in exchanges) {
                let a_exchange = exchanges[index];
                
                a_ref = a_exchange;
                a_category = 'overall';
                if (a_exchange=='btc') {
                  a_exchange = 'binance';
                  a_category = 'btc';
                  a_ref = 'btc';
                }

                let a_index = data[a_exchange][a_category].values[data[a_exchange][a_category].values.length-1][column_price];
                let a_ret = data[a_exchange][a_category].values[data[a_exchange][a_category].values.length-1][column_ret];
                
                let a_label = {title:this.$t('name.'+a_ref), value:a_index, value_pct_change: a_ret};
                
                this.$refs['label_'+a_ref].update(a_label);                
            }
            
        },

        updateExchangeWidget: function(data,exchange) {
            let dic_columns = CommonFunc.getColumnDic(data[exchange]['overall'].columns,[],[]);            
            let column_ret = dic_columns['index_ret'];
            let column_price = dic_columns['price_avg'];
            
            for (let index=0; index<MoaConfig.general.SECTORS.length;index++) {
                let a_sector = MoaConfig.general.SECTORS[index];
                //console.log('sector=',a_sector);
                let a_index = data[exchange][a_sector].values[data[exchange][a_sector].values.length-1][column_price];
                let a_ret = data[exchange][a_sector].values[data[exchange][a_sector].values.length-1][column_ret];

                let a_label = {title:this.$t('category.'+a_sector), value:a_index, value_pct_change: a_ret};
                this.$refs['label_'+a_sector].update(a_label);
            }
        },

        updateIndexChart: function(data) {
            if (! data.hasOwnProperty('binance')) {
              return
            }
            this.$refs.indexChart.update(data);
        },

        updateExchangeIndexChart: function(data,exchange) {
            if (! data.hasOwnProperty('binance')) {
              return
            }
            this.$refs.exchangeChart.update(data,exchange);
        },

        updateTopTable: function(data,exchange) {
            console.log('HomeView.updateTopTable=',data);
            if (CommonFunc.isEmptyObject(data)) {
                return;
            }
            this.$refs.exchangeTop.update(data,exchange,'overall','ret');
        },

        showChart: function(asset,dates,a_date) {
            console.log('HomeView.showChart=',asset);        
            //this.items_52w = json_list;
            this.$refs.chartWinner.update('gaia_crypto_trend_upbit',asset,dates);
        },


        onLoad: function(progress) {
            console.log('onLoad - ',progress);
        },

        onClickTab: function(exchange) {
          this.updateExchangeWidget(this.g_data,this.tab);
          this.updateExchangeIndexChart(this.g_data,this.tab);
          this.updateTopTable(this.g_data_top,this.tab); 
        },

        onClickCategory: function(category) {
            //console.log('onClickCategory - ',category);
            this.$refs.csectorChart.update(this.g_data,category);
        },

        onClickUpbit: function() {
            console.log('onClickUpbit - ');
            this.scrollToElement('label_major');
        },

    }

};
</script>
