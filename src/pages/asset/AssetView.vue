<template>

    <div class="q-pa-md">
        <div class="col">
            <CTitle ttype='title' :title="v_page_title" desc=""></CTitle>          
        </div>

        <div @click="onClickPrice">
            <PriceSummaryBox ref="priceBox" :data="v_asset" @onClick="onClickPrice" />
        </div>

<!--
        <div>
            <q-expansion-item
                expand-separator
                icon=""
                header-class="gSubTitle"
                label="Base Info"
                @show="onClickInfo">

                <InfoTable ref="infoTable" :data="v_asset" />
            </q-expansion-item>
        </div>

        <div>
            <q-expansion-item
                expand-separator
                header-class="gSubTitle"
                label="Show Chart"
                @show="onClickChart">

                <ChartTimeframe period='all' :onclick="onClickTimeframe" selected='y1'></ChartTimeframe>
                <CAssetChart ref="assetChart"></CAssetChart>

                <q-toggle v-model="v_visible_table" label="Show Table" class="q-mb-md center" />

                <q-slide-transition>
                    <div v-show="v_visible_table" class="q-my-md">
                        <PriceDataTable ref="dataTable" />                    
                    </div>
                </q-slide-transition>                

            </q-expansion-item>
        </div>
-->
        <q-separator class="gSeparator" />

        <WWriterButton placeholder="What's your in minds?" @onClickWrite="onClickWrite" />

        <q-separator class="gSeparator" />

        <div>
            <BlogList ref='blogList' :title="$t('page.asset.bloglist.title')" :desc="$t('page.asset.bloglist.desc')"
                maxLength="10" moreCaption="More" 
                :category="v_asset.object_category" :symbol="v_asset.symbol" :objectId="v_asset.object_id"
            />
            
        </div>


        <div class="col">
                                    
            <AssetQuestionList ref="questionList" :title="$t ('page.asset.questionlist.title')" :desc="$t('page.asset.questionlist.desc')" 
                maxLength="10" moreCaption="More"
                :symbol="v_asset.symbol" :assetId="v_asset.object_id"
                @onClickQuestionRating="onClickQuestionRating"
            >
            </AssetQuestionList>

        </div>

        <div class="col">                
            <AssetReviewList ref="reviewList" 
                moreCaption="More" maxLength="10" :title="$t ('page.asset.priceforecast.title')" :desc="$t('page.asset.priceforecast.desc')" 
                :category="v_asset.symbol" :assetId="v_asset.object_id" 
                @onClickRating="onClickReviewRating"> 
            </AssetReviewList>
        </div>

    </div>

</template>

<script>
import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";

import {AssetModel} from "src/models/AssetModel";
import {PostPageModel,QuestionPageModel,AssetReviewPageModel,AssetReviewPageListModel} from "src/models/PageModel";

import CTitle from 'components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';
import WWriterButton from 'components/WWriterButton';

import BlogList from 'components/lists/BlogList';
import AssetQuestionList from 'components/lists/AssetQuestionList';
import AssetReviewList from 'components/lists/AssetReviewList';

import CAssetChart from 'src/pages/asset/CAssetChart';
//import CAssetInfoTable from 'src/pages/asset/CAssetInfoTable';
//import AssetReviewForm from 'src/pages/asset/component/AssetReviewForm';
import PriceSummaryBox from 'src/pages/asset/component/PriceSummaryBox';
import PriceDataTable from 'src/pages/asset/component/PriceDataTable';
import InfoTable from "src/pages/asset/component/InfoTable";



export default {
    name:'assetView',
    components: {
        CTitle,
        AssetQuestionList,
        ChartTimeframe,
        CAssetChart,
        PriceSummaryBox,
        PriceDataTable,
        AssetReviewList,
        InfoTable,
        BlogList,
        WWriterButton
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_page_title() {
            return this.v_asset.symbol
        }
    },
    data: function() {
        return {
            g_data: {
                base:null,
                commit: null,
                review: null,
                vc: null,
                question:null,
                blog:null,
                chart: null,
            },
            g_period: 30,
            g_freq: 'y1',
                                
            v_visible_table:false,
            v_items: [],         

            v_asset: new AssetModel(),
        }
    },

    created: function () {
        //console.log("HomeView.created");
        console.log("AssetView.created - query=",this.$route.query);
        
        this.validateQuery();

        this.v_asset.symbol = this.$route.query.symbol;
        this.v_asset.object_category = CONST.ASSETPAGE_CATEGORY+this.v_asset.symbol;
        this.v_asset.object_id = parseInt(this.$route.query.id);
    },
    mounted: function() {
        //this.g_asset.symbol = 'BTC';
        //this.g_asset.object_id = 20;

        this.refresh(360);
    },
    updated: function() {
        console.log("AssetView.updated - query=",this.$route.query);        
        //CommonFunc.setAppData('onSearchEvent',this.onSearchEvent);
    },
    
    methods: {
        validateQuery() {
            
            if (! CommonFunc.isEmptyObject(this.$route.query.id)) {
                if (! CommonFunc.isEmptyObject(this.$route.query.symbol)) {
                    return;
                }                
            }                

            CommonFunc.navError404(this);
        },

        refresh: function(offset=360) {
            logger.log.debug('Refresh - ',offset);

            
            this.loadPriceTicker();
            this.loadAssetReviewData();            
            this.loadAssetQuestionData();                    
            this.loadBlogList();
        },
        
        updateScoreWidget: function(json_data) { 
            logger.log.debug("updateScoreWidget.data=",json_data);
            const dic_columns = CommonFunc.getColumnDic(json_data.columns,[],[]);
            let a_vc = json_data.values[ json_data.values.length-1 ][dic_columns['cryptovc']];
            
            this.v_score['dev'] = this.getScore(json_data.values[ json_data.values.length-1 ][dic_columns['commit_count_rank']]);
            this.v_score['price'] = this.getScore(json_data.values[ json_data.values.length-1 ][dic_columns['price_ret_rank']]);
            this.v_score['volume'] = this.getScore(json_data.values[ json_data.values.length-1 ][dic_columns['volume_sum_rank']]);
            this.v_score['vc'] = a_vc.split(",").length;
            this.v_score['avg'] = CommonFunc.formatNumber( (this.v_score['dev']+this.v_score['price']+this.v_score['volume'])/3,2);
        },

        updatePageHeader: function(symbol,json_data) {            
            const dic_columns = CommonFunc.getColumnDic(json_data['overall'].columns,[],[]);
            let a_date = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['time']];
            //let a_name = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['name']];

            this.v_page.title = symbol;
            this.v_page.desc = a_date;
        },

        updatePriceChart:function(json_data) {
            this.$refs.assetChart.update(json_data);                    
        },

        updatePriceTable: function(json_data) {            
            this.$refs.dataTable.update(json_data);
        },

        loadCryptoBaseinfo: function() {
            const _this = this;

            this.v_asset.loadBaseinfo().then(resp=>{
                logger.log.debug("AssetView.loadCryptoBaseinfo - resp=",resp,_this.v_asset);
            }).catch(err=>{
                logger.log.debug("AssetView.loadCryptoBaseinfo - err=",err);
            });
                
        },

        loadPriceTicker() {
            const _this=this;
            this.v_asset.getPriceTicker().then(resp=>{
                logger.log.debug("AssetView.loadPriceTicker - resp=",resp,_this.v_asset);
            }).catch(err=>{
                logger.log.debug("AssetView.loadPriceTicker - err=",err);
            });

        },

        loadPriceHistory: function(offset=360,force=false) {
            const _this = this;
            
            
            if ( (!force) && (this.g_data.chart)) {
                return;
            }

            let a_today = CommonFunc.getToday(false);
            if (offset==0) {
                offset = 3000;
            }
            let a_start_date = CommonFunc.addDays(a_today, offset*-1 );
            let a_end_date = CommonFunc.addDays(a_today, 1 );
            
            let a_freq = 'd';
            if ( (_this.g_freq=='d7') || (_this.g_freq=='d1')) {
                a_freq = 'm';
            }
            let dic_param = {symbol:this.v_asset.symbol,quote:'USD',freq:a_freq,start_date:a_start_date, end_date:a_end_date, exchange:'cc',quote:'USD' };
            logger.log.debug("AssetDetailView.loadCryptoPriceHistory - dic_param=",dic_param);

            this.v_asset.loadPriceHistory(dic_param).then(jsonResult=>{
                _this.g_data.chart = jsonResult;
                _this.updatePriceTable(jsonResult);
                _this.updatePriceChart(jsonResult);                    
            }).catch(err=>{
                logger.log.error("AssetDetailView.loadCryptoPriceHistory - error",err);
            });

        },


        loadCommitData: function(symbol) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let dic_param = {symbol:symbol};
                MoaBackendAPI.getCommitData(dic_param,function(response) {
                    _this.g_data.commit = response.data.data;
                    logger.log.debug("AssetView.loadCommitData - response",_this.g_data.commit);
                    _this.$refs.assetinfoTable.updateChart(_this.g_data.commit);
                    resolve();
                },function(err) {
                    logger.log.error("AssetView.loadCommitData - error",err);
                    reject();
                });
            });            
        },


        loadAssetReviewData: function() {
            let dic_param = {'asset_id':this.v_asset.object_id};
            this.$refs.reviewList.update(dic_param);
        },

        loadAssetQuestionData: function() {
            let dic_param = {'asset_id':this.v_asset.object_id};
            this.$refs.questionList.update(dic_param);
        },

        loadBlogList: function() {
            console.log('AssetView.loadBlogList - ',this.v_asset.object_category);
            this.$refs.blogList.updateByCategory(this.v_asset.object_category);
        },


        onClickTimeframe: function(offset,timeframe) {
            console.log('AssetView.onClickTimeframe - ',offset,timeframe);
            this.g_freq = timeframe;
            this.loadPriceHistory(offset,true);
        },

        onClickExchange:function(value) {
          console.log('AssetView.onClick - ',value);
          //this.showReportList(this.g_exchange,this.g_sector,value);
        },

        onClickSector:function(value) {
          console.log('AssetView.onClick - ',value);
          //this.showReportList(this.g_exchange,this.g_sector,value);
        },

        onClickSectorChart: function(sector) {
            console.log('AssetView.onClickSectorChart - ',sector);            
            this.$refs.sectorChart.update(this.g_data,'upbit',sector);
            this.loadSectorAssetData('upbit',sector);
        },

        onClickReviewSave: function(dic_param) {                        
            logger.log.debug('AssetView.onClickReviewSave - ',dic_param);       
            this.$refs.reviewList.addReview(dic_param.response.data);
            return;


            dic_param.object_id = this.g_asset.object_id;
            dic_param.category = this.g_asset.symbol;                                
            let a_review = new AssetReviewPageModel();
            a_review.save(dic_param).then( response => {
                logger.log.debug('AssetView.onClickReviewSave - response = ',response);
                _this.$refs.reviewList.addReview(response.data);
                CommonFunc.showOkMessage(_this,'review posted');
            }).catch( er => {

            });
        },

        onClickReviewRating: function(review) {
            logger.log.debug('AssetView.onClickReviewRating - ',review);
            
            const _this = this;
            review.vote().then(response => {
                logger.log.debug('onClickReviewRating - ',response);
                CommonFunc.showOkMessage(_this,review.method);
            }).catch( err => {

            });
        },

        onClickQuestionRating: function(question) {
            logger.log.debug('AssetView.onClickQuestionRating - ',question);
            
            const _this = this;
            let dic_param = {id:question.id, value:question.value, method:'vote'};            
            question.vote(dic_param).then( response => {
                CommonFunc.showOkMessage(_this,"done");
            }).catch( err => {
                logger.log.debug('onClickQuestionRating - ',err);
            });            
        },


        onTabChange: function(newValue,oldValue) {
            logger.log.debug('AssetView.onTabChange',newValue);

            if (newValue=="qa") {
                this.loadAssetQuestionData();
            }

            if (newValue=="review") {
                this.loadAssetReviewData();                
            }

            if (newValue=="blog") {
                const category = CONST.ASSETPAGE_CATEGORY+this.v_asset.symbol;
                this.$refs.blogList.update(null,category);
            }
        },

        onClickWriteBlog: function() {
            logger.log.debug('AssetView.onClickWriteBlog');
            //this.navBlogWriter();

            let a_post = new PostPageModel();
            a_post.category = this.v_asset.symbol;
            a_post.setContentType(CONST.CONENT_TYPE_ASSETPAGE);

            this.$refs.blogWriter.show(a_post);
        },

        onFocusReviewForm: function(event) {
            logger.log.debug('AssetView.onFocusReviewForm');
            this.$refs.reviewForm.v_rows = "5";
        },

        onFocusoutReviewForm: function(event) {
            logger.log.debug('AssetView.onFocusoutReviewForm');
            this.$refs.reviewForm.v_rows = "1";
        },

        onClickBlog: function(param) {
            logger.log.debug('AssetView.onClickBlog',this.$route);			
			CommonFunc.navBlog(this,param.page_id);
        },

        onBlogAdded: function(dic_param) {
            logger.log.debug('AssetView.onBlogAdded : dic_param=',dic_param);
            this.$refs.blogList.addBlog(dic_param.response);
        },

        onBlogDeleted: function(post) {
            logger.log.debug('AssetView.onBlogDeleted : post=',post);
            this.$refs.blogList.deleteBlog(post.id);
        },

        onQuestionAdded: function(dic_param) {
            logger.log.debug('AssetView.onQuestionAdded : dic_param=',dic_param);
            this.$refs.questionList.addQuestion(dic_param.response);
        },

        onClickMoreReview: function() {
            logger.log.debug('AssetView.onClickMoreReview');
            store.getters.nav.add(this.$route);
            CommonFunc.navReview(this,this.v_asset.symbol,this.v_asset.object_id);
        },

        onClickChart: function(evt) {
            logger.log.debug('AssetView.onClickChart : evt=',evt);
            this.loadPriceHistory();
        },

        onClickInfo: function(evt) {
            logger.log.debug('AssetView.onClickInfo : evt=',evt);
            this.loadCryptoBaseinfo();
        },

        onClickPrice: function(dicParam) {
            logger.log.debug('AssetView.onClickPrice');
            store.getters.nav.add(this.$route);
            CommonFunc.navAssetDetail(this,this.v_asset.symbol,this.v_asset.object_id);
        },

        onClickWrite: function() {
            logger.log.debug('AssetView.onClickWrite');
            CommonFunc.navTweetWriter(this,this.v_asset.object_id)
        },

    },

}

</script>



<style scoped>

</style>