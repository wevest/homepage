<template>


    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle ttype='title' :title="v_page.title" :desc="v_page.desc"></CTitle> 
                <q-tabs v-model="v_tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
                    <q-tab name="upbit" :label="$t('name.upbit')" @click="onClickTab('upbit')" />
                    <q-tab name="bithumb" :label="$t('name.bithumb')" @click="onClickTab('bithumb')" />
                </q-tabs>              
            </div>
        </div>

        <div class="row">
            <div class="col">                
                <CSectorSummaryTable ref="sectorTable"></CSectorSummaryTable>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <CTitle :title="g_sector" desc=''></CTitle> 
                <CSectorChart ref="sectorChart"></CSectorChart>

                <CTitle ttype='subtitle' title="sector_details"></CTitle> 
                <CSectorCryptoTable ref="scTable"></CSectorCryptoTable>
            </div>
        </div>

    </div>

</template>

<script>
//import {FormWizard, TabContent} from 'vue-form-wizard';
import CSectorChart from 'src/pages/sector/CSectorChart';
import CSectorSummaryTable from 'src/pages/sector/CSectorSummaryTable';
import CSectorCryptoTable from 'src/components/CSectorCryptoTable';

import CTitle from 'components/CTitle';

import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import DataService from 'src/services/dataService';
import logger from "src/error/Logger";

export default {
    components: {
        CTitle,
        CSectorChart,
        CSectorSummaryTable,
        CSectorCryptoTable
    },
    props: {},

    data: function() {
        return {
            g_data: null,
            g_period: 30,
            
            g_sector: '',
            v_tab:'upbit',        
            v_page: {title:this.$t('page.sector.title'), desc:''}
        }
    },

    created: function () {
        //console.log("HomeView.created");
    },
    mounted: function() {                
        this.g_sector = this.$route.params.sector;
        if (this.$route.params.exchange) {
            this.v_tab = this.$route.params.exchange;
        }
        logger.log.debug("SectorView.mounted - params",this.$route.params);

        this.refresh(this.g_sector);
    },
    
    methods: {

        updatePageHeader: function(json_data) {
            const dic_columns = CommonFunc.getColumnDic(json_data[this.v_tab]['btc'].columns,[],[]);
            let watch_date = json_data[this.v_tab]['btc'].values[json_data[this.v_tab]['btc'].values.length-1][dic_columns['trade_date']];
            this.v_page.desc = watch_date;
        },

        refresh: function(sector) {
            const _this = this;
        
            //CommonFunc.getAppData('spinner').show();
            let funcs = [
                this.loadDailyOverviewData(sector,200)
            ];
            Promise.all(funcs).then(function() {
                //CommonFunc.getAppData('spinner').hide();
            });

        },

        loadDailyOverviewData: function(sector,ioffset=360) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                let a_start_date = CommonFunc.addDays(a_today, ioffset*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {start_date:a_start_date, end_date:a_end_date, freq:'d'};
                logger.log.debug("SectorView.loadDailyOverviewData - dic_param=",dic_param);

                MoaBackendAPI.getCryptoIndexData(dic_param,function(response) {
                    _this.g_data = response.data.data;
                    logger.log.debug("SectorView.loadDailyOverviewData - response",_this.g_data);
                    //logger.log.debug("HomeView.search - json_data",_this.g_json_data);
                    //_this.updateWidget('g_widget_overall',_this.g_data,'binance');
                    //_this.updateWidget('g_widget_upbit',_this.g_data,'upbit');
                    //_this.updateWidget('g_widget_bithumb',_this.g_data,'bithumb');
                    //_this.$refs.dailyIndexChart.update(_this.g_data);
                    
                    _this.updatePageHeader(_this.g_data);                    
                    _this.updateSectorSummaryTable(_this.g_data,_this.v_tab);
                    _this.updateSectorChart(_this.g_data,_this.v_tab,sector);

                    resolve();
                },function(err) {
                    logger.log.error("SectorView.loadDailyOverviewData - error",err);
                    reject();
                });
            });            
        },

        loadSectorAssetData: function(exchange,sector) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                let a_start_date = CommonFunc.addDays(a_today, 100*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {start_date:a_start_date, end_date:a_end_date, freq:'d', exchange:exchange, sector:sector};
                logger.log.debug("SectorView.loadSectorAssetData - dic_param=",dic_param);

                MoaBackendAPI.getSectorAssetData(dic_param,function(response) {
                    _this.g_data_asset = response.data.data;
                    logger.log.debug("SectorView.loadSectorAssetData - response",_this.g_data_asset);                                        
                    
                    _this.updateSectorTable(_this.g_data_asset,_this.tab);

                    resolve();
                },function(err) {
                    logger.log.error("SectorView.loadDailyOverviewData - error",err);
                    reject();
                });
            });            
        },

        updateSectorTable: function(json_data,exchange) {
            this.$refs.scTable.update(json_data,exchange);
        },

        updateSectorSummaryTable: function(json_data,exchange) {
            logger.log.debug('UpbitWinnerView.updateSectorSummaryTable=',exchange,json_data);
            this.$refs.sectorTable.update(json_data,exchange);
        },

        showChart: function(asset,dates,a_date) {
            logger.log.debug('UpbitWinnerView.showChart=',asset);
            this.$refs.chartWinner.update(this.g_table,asset,dates);
            this.$refs.momentumTable.update('D',asset,100);

            this.heading = 'Upbit Market Winner - ' + a_date + ' , ' + asset;
        },

        updateSectorChart: function(json_data,exchange,sector) {
            if (! sector) {
                sector = "korean";
            }
            
            logger.log.debug('SectorView.updateSectorChart - ',exchange,sector);

            this.g_sector = this.$t('category.'+sector);
            this.$refs.sectorChart.update(json_data,exchange,sector);
            this.loadSectorAssetData(exchange,sector);
        },

        onClickExchange:function(value) {
          console.log('CTopTable.onClick - ',value);
          //this.showReportList(this.g_exchange,this.g_sector,value);
        },

        onClickSector:function(value) {
          console.log('CTopTable.onClick - ',value);
          //this.showReportList(this.g_exchange,this.g_sector,value);
        },

        onClickChartTimeframe: function(value) {
            console.log('CTopTable.onClickChartTimeframe - ',value);      
            this.loadDailyOverviewData(value);
        },

        onClickSectorChart: function(sector) {
            console.log('CTopTable.onClickSectorChart - ',sector);      
            this.updateSectorChart(sector);
        },

        onClickTab: function(exchange) {
            this.updateSectorSummaryTable(this.g_data,this.tab);
            this.updateSectorChart('korean');
        }
    },

}


</script>