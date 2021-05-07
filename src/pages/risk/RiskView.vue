<template>
    <div class="q-pa-md">

        <div class="row q-gutter-sm">
            <div class="col">
                <CBigLabel ref='label_crisis' title="abc"></CBigLabel>
            </div>
            <div class="col">
                <CBigLabel ref='label_vix' title="abc"></CBigLabel>                
            </div>
            <div class="col">
                <CBigLabel ref='label_kvix' title="abc"></CBigLabel>                
            </div>
        </div>

        <div class="row">
            <div class="col">
                <RiskChart ref="riskChart" v-on:notify="onUpdateWidget"></RiskChart>
            </div>
        </div>

    </div>

</template>

<script>
import RiskChart from 'src/pages/risk/RiskChart';

import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import DataService from 'src/services/dataService';
import logger from "src/error/Logger";

import CBigLabel from 'components/CBigLabel';
import CTitle from 'components/CTitle';

export default {
    components: {
        CBigLabel,
        CTitle,
        RiskChart
    },
    props: {
    },

    data: () => ({
        //lang: this.$i18n.locale,
        g_data: null,
        g_period: 30,
        g_author: '',
        g_market_overview: null,
    }),


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
        test: function() {
            logger.log.debug("HomeView.test=");
            this.showChart('A051910');
            //this.getFilteredData('A051910');
        },

        
        updateWidget: function(ntype,data) {
            if (ntype=='crisis') {
                let data_crisis = DataService.getCrisisData(data);
                let a_value = data_crisis.raw_point[ data_crisis.raw_point.length-1 ].y;
                
                let a_ret = 0.01;
                let a_tag = '';
                if (a_value!=0) {
                    a_ret = -0.01;
                    a_tag = this.$t('name.wraning');
                }
                let a_label1 = {title:this.$t('name.crisis'), value:a_value, value_pct_change: a_ret, tag:a_tag};
                this.$refs['label_crisis'].update(a_label1);
            }

            if (ntype=='vix') {
                
                let data_vix = CommonFunc.getChartData(data,'vix','close','date',false,0);

                let a_vix = data_vix.data[ data_vix.data.length-1 ].y
                let a_ret = 0.01; 
                let a_tag = '';               
                if (a_vix>30) {
                    a_ret = -0.01;
                    a_tag = this.$t('name.wraning');
                }
                
                let a_label2 = {title:this.$t('name.vix'), value:a_vix, value_pct_change: a_ret, tag:a_tag};
                this.$refs['label_vix'].update(a_label2);

                let data_kvix = CommonFunc.getChartData(data,'U545','close','date',false,0);

                let a_kvix = data_kvix.data[ data_kvix.data.length-1 ].y
                let a_ret2 = 0.01; 
                let a_tag2 = '';               
                if (a_kvix>30) {
                    a_ret2 = -0.01;
                    a_tag2 = this.$t('name.wraning');
                }
                
                let a_label3 = {title:this.$t('name.kvix'), value:a_kvix, value_pct_change: a_ret2, tag:a_tag2};
                this.$refs['label_kvix'].update(a_label3);
            }
        },

        refresh: function() {
            const _this = this;
        
            //CommonFunc.getAppData('spinner').show();
            
            let funcs = [
                _this.$refs.riskChart.update(),
                //_this.loadMarketOverview()
                //this.$refs.trendChart.update('U001'),this.$refs.trendKosdaq.update('U201')                
            ];
            Promise.all(funcs).then(function() {
                //CommonFunc.getAppData('spinner').hide();
            });
        },


        loadMarketOverview: function() 
        {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                let a_start_date = CommonFunc.addDays(a_today, -480 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {start_date:a_start_date, end_date:a_end_date, period_type:'W'};
                logger.log.debug("HomeView.loadMarketOverview - dic_param=",dic_param);

                MoaBackendAPI.getMarketOverview(dic_param,function(response) {
                    _this.g_market_overview = response.data.data;
                    logger.log.debug("HomeView.loadMarketOverview - response",_this.g_market_overview);
                    //logger.log.debug("HomeView.search - json_data",_this.g_json_data);
                    _this.updateMarketOverview(_this.g_market_overview);
                    
                    resolve();
                },function(err) {
                    logger.log.error("HomeView.loadMarketOverview - error",err);
                    reject();
                });
            });
        },

        updateMarketOverview: function(data) {         
            this.updateBiglabels(data);
            this.$refs.overviewScaledChart.update(data);
        },


        navSector: function(category) {
            logger.log.debug("SearchAnalyst.navSector - ",category);
            CommonFunc.navSector(this,category);
        },

        navInstrument: function(asset,date,category,name,price) {
            logger.log.debug("SearchAnalyst.navInstrument - ",category);
            let a_data = {asset:asset, jw52_date:date, name:name, category:category, jw52_price:price};
            CommonFunc.setAppData('asset',a_data);
            CommonFunc.navInstrument(this,asset);
        },


        onUpdateWidget: function(ntype,data) {
            console.log('onUpdateWidget - ',ntype,data);
            this.updateWidget(ntype,data);
        },

        onLoad: function(progress) {
            console.log('onLoad - ',progress);
        },

        onKeypressSearch: function(event) {
            const _this = this;
            let a_author = event.target.value;
            this.search(a_author);
        },
    },

}


</script>
