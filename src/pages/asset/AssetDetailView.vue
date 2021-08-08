<template>

    <div class="q-ma-md">
        <div>
            <CTitle ttype='title' :title="v_asset.symbol" desc="" 
                loadMoreCaption="" @onClickTitleMore="onClickTitleMore"></CTitle>         
<!--            
            <div class="q-mb-lg">
                <WCommandBar :data="v_asset" :isOwner="v_is_owner" 
                    shareBtn="share" updateBtn="" deleteBtn="" copyBtn="copy"
                    @onClickShare="onClickShare" 
                    @onClickCopy="onClickCopy" 
                />
            </div>
-->
        </div>
<!--
        <div class="q-mb-xl">
            <CTitle ttype='subtitle' title="Basic Info" desc=""></CTitle>
            <InfoTable ref="infoTable" :data="v_asset" />
        </div>
        <q-separator class="gSeparator" />        
-->

        <div class="q-my-md">
<!--            
            <CTitle ttype='subtitle' :title="$t('page.asset_detail.price_chart.title')" :desc="$t('page.asset_detail.price_chart.desc')" class="gNoBoxMargin"></CTitle>
-->            
            <ChartTimeframe class="q-mt-md" period='all' @onClick="onClickTimeframe" selected='y1'></ChartTimeframe>
            <WAssetChart ref="assetChart"
                :tableTitle="$t('page.asset_detail.price_data.title')" :tableDesc="$t('page.asset_detail.price_data.title')"
            />
        </div>
        
    </div>

</template>

<script>
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import DataService from 'src/services/dataService';
import logger from "src/error/Logger";

import {AssetModel} from "src/models/AssetModel";

import CTitle from 'components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';
import WAssetChart from 'components/WAssetChart';
import CAssetInfoTable from 'src/pages/asset/component/CAssetInfoTable';

import PriceSummaryBox from 'src/pages/asset/component/PriceSummaryBox';
import InfoTable from "src/pages/asset/component/InfoTable";
import WCommandBar from "components/WCommandBar.vue";

import BlogList from 'components/lists/BlogList';


export default {
    name:'assetView',
    components: {
        CTitle,
        ChartTimeframe,
        WAssetChart,
        CAssetInfoTable,
        PriceSummaryBox,
        InfoTable,
        BlogList,
        WCommandBar
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_is_owner() {
            if (! this.v_user) {
                return false;
            }
            if (this.v_me.username==this.v_user.username) {
                return true;
            }
            return false;
        },
    },
    data() {
        return {
            g_query: null,

            g_data: null,
            g_data_commit: null,
            g_vc: null,
            g_period: 30,
            g_asset: null,       
            g_freq: '1d',
            
            v_asset: new AssetModel(),
            v_page: {title:this.$t('page.asset.title'), desc:''},

            v_visible_table:true,
        }
    },

    created() {
        this.validateQuery();
    },
    mounted() {
        this.g_query = this.$route.query;
        this.setAsset(this.g_query);
        this.refresh(360);
    },
    updated() {
        //console.log("AssetView.updated - symbol=",this.symbol,this.$route.params);        
    },
    
    methods: {
        validateQuery() {
            
            if (! CommonFunc.isEmptyObject(this.$route.query.id)) {
                if (! CommonFunc.isEmptyObject(this.$route.query.symbol)) {
                    return;
                }                
            }                

            NavFunc.navError404(this);
        },

        refresh() {
            logger.log.debug('AssetDetailView.Refresh');

            //this.loadCryptoBaseinfo();
            this.loadCryptoPriceHistory(this.g_freq);
        },
        setAsset(query) {
            this.v_asset.id = query.id;
            this.v_asset.symbol = query.symbol;            
        },

        updatePriceWiget(json_data) {  
            this.$refs.priceBox.update(json_data);
        },

        updatePageHeader(json_data) {            
            const dic_columns = CommonFunc.getColumnDic(json_data['overall'].columns,[],[]);
            let a_date = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['time']];
            //let a_name = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['name']];

            this.v_page.title = this.v_asset.symbol;
            this.v_page.desc = a_date;
        },

        updatePriceChart(json_data) {
            this.$refs.assetChart.update(json_data, true);                    
        },

        loadBlogList() {
            logger.log.debug('AssetDetailView.loadBlogList - ',this.v_asset.symbol);            
            this.$refs.blogList.updateByCategory(this.v_asset.symbol);
        },

        loadCryptoBaseinfo() {
            const _this = this;

            this.v_asset.loadBaseinfo().then(resp=>{
                logger.log.debug("AssetDetailView.loadCryptoBaseinfo - resp=",resp,_this.v_asset);
            }).catch(err=>{
                logger.log.debug("AssetDetailView.loadCryptoBaseinfo - err=",err);
            });
        },


        loadCryptoPriceHistory(freq) {
            const _this = this;

            //let a_today = CommonFunc.getToday(false);
            //logger.log.debug("HomeView.loadjw52 - today=",a_today);
            //let a_start_date = CommonFunc.addDays(a_today, offset*-1 );
            //let a_end_date = CommonFunc.addDays(a_today, 1 );
            
            let dic_param = {symbol:this.v_asset.symbol,quote:'USD',freq:freq, exchange:'cc',quote:'USD' };
            logger.log.debug("AssetDetailView.loadCryptoPriceHistory - dic_param=",dic_param);

            this.v_asset.loadPriceHistory(dic_param).then(jsonResult=>{
                //_this.updatePageHeader(jsonResult);
                //_this.updatePriceWiget(jsonResult);
                _this.updatePriceChart(jsonResult);                    
            }).catch(err=>{
                logger.log.error("AssetDetailView.loadCryptoPriceHistory - error",err);
            });
        },


        loadCommitData: function(symbol) {
            const _this = this;
            this.v_asset.loadCommitData().then(jsonResult=>{
                _this.$refs.assetinfoTable.updateChart(jsonResult);
            }).catch(err=>{
                logger.log.error("AssetDetailView.loadCommitData - error",err);
            });
        },


        onClickTimeframe(dicParam) {
            logger.log.debug('AssetDetailView.onClickTimeframe - ',dicParam);
            this.g_freq = dicParam.timeframe;
            this.loadCryptoPriceHistory(this.g_freq);
        },

        onClickShare(asset) {
            let a_url = NavFunc.navAssetDetail(this,asset.symbol,asset.id,true);
            logger.log.debug("AssetDetailView.onClickShare=",asset,a_url);            
            CommonFunc.copyUrl(this,a_url);
        },

        onClickTitleMore() {
            logger.log.debug('AssetDetailView.onClickTitleMore');
        },

        onClickCopy(data) {
            logger.log.debug('AssetDetailView.onClickCopy : data=',data);
        }
    },

}

</script>



<style scoped>

.box_price {
    display: grid;
    grid-template-columns: minmax(90px, 90px) 1fr;
}

.price_box {
    text-align:center;    
}

.price_big {
    font-size:30px;
    font-weight: bold;
    color:#111111;
}    

.percent_below {
    font-size:13px;
    vertical-align:top;
}


.price_date {
    vertical-align:top;
    font-size:8px;
    color:#BBBBBB;
}
/*
.price_label {
    font:12px;
    color:#464646;
    font-weight: bold;
    padding-right:5px;
}
*/
.price_table td {
    text-align:left;
}

.score_table {
    text-align:center;
}

.box_score {
    display: grid;
    grid-template-columns: minmax(90px, 90px) 1fr;
}

.box_score_table {
    margin-top:0px;
}

.box_score_table .box_score_table_column {
    width:20px;
    padding-bottom:10px;
}

.box_score_table tr {
    height:60px;
    vertical-align: bottom;
}

.box_score_point {
    text-align:center;
    padding-top:13px;
}

.score_point {
    font-size:38px;
    font-weight:bolder; 
}

.score_label {
    font-size:18px;
    color:#000000;
}

.price_tag {
    line-height:40px;
    font-size:16px;
    color:#E71915;
}

</style>