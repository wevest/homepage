<template>
    <div class="q-pa-md">

        <div class="row q-gutter-sm">
            <div class="col">
                <CBigLabel ref='label_btc' title="abc"></CBigLabel>
            </div>
            <div class="col">
                <CBigLabel ref='label_nyse' title="abc"></CBigLabel>                
            </div>
            <div class="col">
                <CBigLabel ref='label_gold' title="abc"></CBigLabel>
            </div>
        </div>
        <div class="row q-gutter-sm">    
            <div class="col q-mt-md">
                <CBigLabel ref='label_wti' title="abc"></CBigLabel>
            </div>
            <div class="col q-mt-md">
                <CBigLabel ref='label_bond' title="abc"></CBigLabel>
            </div>
            <div class="col q-mt-md">
                <CBigLabel ref='label_usd' title="abc"></CBigLabel>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.world.title')" :desc="$t('page.world.desc')"></CTitle>
                <OverviewScaledChart ref="overviewScaledChart"></OverviewScaledChart>
            </div>
        </div>

    </div>

</template>

<script>
/*
import PageTitle from "../Layout/Components/PageTitleMoa.vue";
import LayoutWrapper from '../Layout/Components/LayoutWrapper';
import DemoCard from '../Layout/Components/DemoCard';
//import {FormWizard, TabContent} from 'vue-form-wizard';

import TrendChart from '@/view/component/TrendChart';
import AssetChart from '@/view/component/AssetChart';
import OverviewHeatmap from '@/view/component/OverviewHeatmap.vue';
*/
import OverviewScaledChart from 'src/pages/world/OverviewScaledChart.vue';
//import RiskChart from 'src/pages/world/RiskChart';

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
        OverviewScaledChart,
    },
    props: {
        param_author: {
            type: String,
            default: ''
        }
        
    },
    watch: {
        '$route': 'onLoad'
    },

    data: () => ({
        //lang: this.$i18n.locale,

        g_data: null,
        g_period: 30,
        g_author: '',
        g_market_overview: null,
        g_asset_last: {
            'Gold': { 'ret':0, 'index':0, color:'bg-primary', arrow:'angle-up' },
            'WTI': { 'ret':0, 'index':0, color:'bg-primary', arrow:'angle-up'},
            'NYSE': { 'ret':0, 'index':0, color:'bg-primary', arrow:'angle-up'},
            'Bond': { 'ret':0, 'index':0, color:'bg-primary', arrow:'angle-up'},
            'Dollar': { 'ret':0, 'index':0, color:'bg-primary', arrow:'angle-up'},
        },

        paginationSync: { descending: true, rowsPerPage: 50},
        rowsPerPage: [10, 20, 30, 40, 50],        

        headers_52w: [
          {
            text: 'Date',
            align: 'left',
            value: 'date'
          },
          { text: 'Category', value: 'category' },
          { text: 'Name', value: 'name' },
          { text: 'Asset', value: 'asset' },
          { text: 'Price', value: 'price' },
        ],
        items_52w: [],

        fields: [ '시간', '순위', '적중율(%)', '수익율(%)', '누적 수익율(%)' ],
        items: [],

        fields_list: [ '추천일', '섹터', '종목코드', '목표주가', '보고서제목', '1개월수익율' ,'3개월수익율','6개월수익율'],
        items_list: [],

        fields_asset: [ 
            {key:'asset', label:'종목코드', formatter: (value, key, item) => {
                //console.log('formatter=',value);
                return value;
            }},
            {key:'name',label:'이름'}, 
            {key:'최초추천일'}, 
            {key:'최고목표가(원)'}, {key:'보고서수'}
        ],
        items_asset: [],
    }),


    created () {
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
        test() {
            logger.log.debug("HomeView.test=");
            this.showChart('A051910');
            //this.getFilteredData('A051910');
        },

        refresh() {
            const _this = this;
        
            //CommonFunc.getAppData('spinner').show();            
            let funcs = [
                _this.loadMarketOverview()
            ];
            Promise.all(funcs).then(function() {
                //CommonFunc.getAppData('spinner').hide();
            });
        },


        loadMarketOverview(ioffset=360) 
        {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                let a_start_date = CommonFunc.addDays(a_today, ioffset*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let a_period = 'W';
                if (ioffset<190) {
                    a_period='D';
                }
                let dic_param = {start_date:a_start_date, end_date:a_end_date, period_type:a_period};
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

        updateBiglabels(data) {            
            let dic_columns = CommonFunc.getColumnDic(data.asset['btc'].columns,[],[]);            
            for (var asset in data.asset) {            
                let a_index = data.asset[asset].values[data.asset[asset].values.length-1][dic_columns['close']];
                let a_ret = data.asset[asset].values[data.asset[asset].values.length-1][dic_columns['ret']];
                let a_upper = data.asset[asset].values[data.asset[asset].values.length-1][dic_columns['upper']];
                let a_lower = data.asset[asset].values[data.asset[asset].values.length-1][dic_columns['lower']];
                let a_tag = null;
                if (a_index>a_upper) {
                    a_tag = 'upper_breakout';
                } else if (a_index<a_lower) {
                    a_tag = 'lower_breakout';
                }
                let a_label = {title:this.$t('name.'+asset), value:a_index, value_pct_change: a_ret, tag:this.$t(a_tag), zscore:a_upper-a_lower };
                logger.log.debug(a_label);
                this.$refs['label_'+asset].update(a_label);
            }
            
        },

        updateMarketOverview(data) {
            this.updateBiglabels(data);
            this.$refs.overviewScaledChart.update(data);
        },


        navSector(category) {
            logger.log.debug("SearchAnalyst.navSector - ",category);
            CommonFunc.navSector(this,category);
        },

        navInstrument(asset,date,category,name,price) {
            logger.log.debug("SearchAnalyst.navInstrument - ",category);
            let a_data = {asset:asset, jw52_date:date, name:name, category:category, jw52_price:price};
            CommonFunc.setAppData('asset',a_data);
            CommonFunc.navInstrument(this,asset);
        },

        reload(offset) {
            this.loadMarketOverview(offset);
        },

        onLoad(progress) {
            logger.log.debug('onLoad - ',progress);
        },

    },

}


</script>
