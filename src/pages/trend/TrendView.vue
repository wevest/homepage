<template>

    <div class="q-pa-md">

      <div class="row">
        <div class="col">
            <CTitle ttype='title' :title="$t('page.trend.title')" :desc="$t ('page.trend.desc')"></CTitle>          
            <CTrendChart ref='indexTrendChart'></CTrendChart>
        </div>      
      </div>

    </div>

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
import logger from "src/error/Logger";

import { LoadingBar } from 'quasar';
import CTrendChart from 'src/pages/trend/CTrendChart';
import CTitle from 'components/CTitle';


export default {
    components: {
        CTitle,
        LoadingBar,
        CTrendChart
    },
    data: function() {
        return {
            g_data: null,
            g_data_summary: null,
            g_period: 30,

            g_widget_overall: {
                'overall': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'Crypto', arrow:'angle-up' },
                'btc': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'BTC', arrow:'angle-up' },
                'alt': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'ALT', arrow:'angle-up' },
            },
            g_widget_exchange: {
                'upbit': {
                    'major': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'Major', arrow:'angle-up' },            
                    'korean': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'한국코인', arrow:'angle-up' },
                    'chinese': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'중국코인', arrow:'angle-up' },                        
                    'defi': { color:'bg-primary', startVal:0, endVal:0, label:'DEFI', arrow:'angle-up' },
                    'misc': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'잡코인', arrow:'angle-up' },
                    'nft': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'NFT', arrow:'angle-up' },
                },
                'bithumb': {
                    'major': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'Major', arrow:'angle-up' },            
                    'korean': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'한국코인', arrow:'angle-up' },
                    'chinese': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'중국코인', arrow:'angle-up' },                        
                    'defi': { color:'bg-primary', startVal:0, endVal:0, label:'DEFI', arrow:'angle-up' },
                    'misc': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'잡코인', arrow:'angle-up' },
                    'nft': { 'ret':0, 'index':0, color:'bg-primary', startVal:0, endVal:0, label:'NFT', arrow:'angle-up' },
                }
            },
            g_options: {
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.',
                prefix: '',
                suffix: '%'
            },
            
            v_page: {title: this.$t('page.trend.title'), desc:'' },
            
            v_visible_table: false,

        }

    },


    created() {
        //console.log("HomeView.created");
    },
    mounted() {
        //console.log("HomeView.mounted - ");
        this.refresh();
    },
    updated() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        updatePageHeader(json_data) {
            const dic_columns = CommonFunc.getColumnDic(json_data['upbit']['btc'].columns,[],[]);
            let watch_date = json_data['upbit']['btc'].values[json_data['upbit']['btc'].values.length-1][dic_columns['trade_date']];
            this.v_page.desc = watch_date;
        },

        refresh() {
            const _this = this;
        
            //this.$q.loadingBar.start();

            let funcs = [
                this.loadDailyOverviewData(),
                //this.loadDailySummaryData('upbit')
                //this.$refs.tvChart.update('gaia_crypto_trend_upbit'),
                //this.$refs.momentumTable.update('D','',3)
                //this.$refs.riskChart.update(),this.$refs.trendChart.update('U001'),this.$refs.trendKosdaq.update('U201')
            ];
            Promise.all(funcs).then(function() {
                //this.$q.loadingBar.stop();
            });

        },

        loadDailyOverviewData(ioffset=180) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                let a_start_date = CommonFunc.addDays(a_today, ioffset*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {start_date:a_start_date, end_date:a_end_date, freq:'d'};
                logger.log.debug("DailyView.loadDailyOverviewData - dic_param=",dic_param);

                APIService.getCryptoIndexData(dic_param,function(response) {
                    _this.g_data = response.data.data;
                    logger.log.debug("DailyView.loadDailyOverviewData - response",_this.g_data);
                    //logger.log.debug("HomeView.search - json_data",_this.g_json_data);
                    //_this.updateWidget('g_widget_overall',_this.g_data,'binance');
                    //_this.updateWidget('g_widget_upbit',_this.g_data,'upbit');
                    _this.updatePageHeader(_this.g_data);
                    _this.$refs.indexTrendChart.update(_this.g_data);
                    //_this.$refs.sectorTable.update(_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("DailyView.loadDailyOverviewData - error",err);
                    reject();
                });
            });            
        },


        loadDailySummaryData(exchange) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                let a_start_date = CommonFunc.addDays(a_today, 30*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {start_date:a_start_date, end_date:a_end_date, freq:'D', exchange:exchange};
                logger.log.debug("HomeView.getCryptoMarketDailySummary - dic_param=",dic_param);

                APIService.getCryptoMarketDailySummary(dic_param,function(response) {
                    _this.g_data_summary = response.data.data;
                    logger.log.debug("HomeView.getCryptoMarketDailySummary - response",_this.g_data_summary);
                    _this.updateAssetTable(_this.g_data_summary);
                    //logger.log.debug("HomeView.search - json_data",_this.g_json_data);
                    //_this.$refs.sectorTable.update(_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("HomeView.getCryptoMarketDailySummary - error",err);
                    reject();
                });
            });            
        },

        updateAssetTable(json_data) {

            let dic_columns = CommonFunc.getColumnDic(json_data['summary'].columns,[],[]);

            let a_table_items = [];
            
            let row_index = json_data['summary'].values.length-2;
            for (var col_index=0;col_index<json_data['summary'].columns.length;col_index++) {
                var a_column = json_data['summary'].columns[col_index];
                if (a_column.search('_')>-1) {
                    continue;
                }
                
                var a_item = { 
                    trade_date: json_data['summary'].values[row_index][dic_columns['trade_date']],
                    token: a_column,
                    price: json_data['summary'].values[row_index][dic_columns[a_column]],
                    volume: json_data['summary'].values[row_index][dic_columns[a_column+'_volume']],
                    volume_ret: json_data['summary'].values[row_index][dic_columns[a_column+'_volume_ret']],
                    volume_z: json_data['summary'].values[row_index][dic_columns[a_column+'_volume_zscore']],
                    ret: json_data['summary'].values[row_index][dic_columns[a_column+'_ret']],
                    rank_pct: json_data['summary'].values[row_index][dic_columns[a_column+'_rank']],                    
                };                 
                      
                a_table_items.push(a_item);                
            }

            //this.$refs.momentumTable.update('D','',3)
            this.$refs.assetTable.setData(a_table_items);

            logger.log.debug('asset_table=',a_table_items);

            return a_table_items;
        },

        updateWidget(obj,json_data,exchange) {
            let data = json_data[exchange];
            //logger.log.debug('data=',data);
            let dic_columns = CommonFunc.getColumnDic(data['overall'].columns,[],[]);            
            //logger.log.debug('dic_columns=',dic_columns);
            let column_index = dic_columns['index_ret'];
            let column_index2 = dic_columns['price_avg'];
            let widget = this[obj];

            for (let a_category in widget) {
                //console.log('category=',a_category);
                let a_value = data[a_category].values[data[a_category].values.length-1][column_index];
                let a_index = data[a_category].values[data[a_category].values.length-1][column_index2];                

                widget[a_category]['index'] = a_index;
                widget[a_category]['endVal'] = parseFloat(CommonFunc.formatNumber(a_value*100,4));
                if (a_value>0) {
                    widget[a_category]['color'] = 'bg-success';
                    widget[a_category]['arrow'] = 'angle-up';
                } else {
                    widget[a_category]['color'] = 'bg-danger';
                    widget[a_category]['arrow'] = 'angle-down';
                }                
            }
        },

        showChart(asset,dates,a_date) {
            logger.log.debug('HomeView.showChart=',asset);        
            //this.items_52w = json_list;
            this.$refs.chartWinner.update('gaia_crypto_trend_upbit',asset,dates);
        },


        onLoad(progress) {
            logger.log.debug('onLoad - ',progress);
        },

        onClickCategory(exchange,category) {
            //console.log('onClickCategory - ',category);
            if (exchange=='upbit') {
                this.$refs.csectorUpbitChart.update(this.g_data[exchange],category);
            } else {
                this.$refs.csectorBithumbChart.update(this.g_data[exchange],category);                
            }
            
        },

        onClickTimeframe(atype,ioffset) {
            logger.log.debug('onClickTimeframe - ',atype,ioffset);            
            this.loadDailyOverviewData(ioffset);
        }

    },

}

</script>
