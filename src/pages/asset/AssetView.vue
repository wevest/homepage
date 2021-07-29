<template>

    <div class="q-ma-md">
        <div class="col">
            <CTitle ttype='title' :title="v_page_title" desc=""></CTitle>          
        </div>

        <div @click="onClickPrice">
            <PriceSummaryBox ref="priceBox" :data="v_asset" @onClick="onClickPrice" />
        </div>

        <div class="q-my-md">
            <PriceForecastBox ref="ratingBox" :reviews="v_reviews" title="Reviews"></PriceForecastBox>
        </div>

        <div class="row q-my-md" @click="onClickHolder">
            
            <div class="gSubTitleMD gNoMargin">
<!--                
                <q-icon name="groups" size="26px" color="primary" /> 
-->                
                <span>Holders ( {{v_asset.portfolio_count}} ) </span>
            </div>
            <q-space />
            <div>
                <q-btn dense flat icon="navigate_next" />
            </div>
        </div>

        <q-separator class="gSeparator" />

        <div>
            <q-tabs v-model="v_tab" shrink align="left" active-color="primary" class="q-my-sm" >
                <q-tab name="info" :label="$t('name.info')" />
                <q-tab name="tweet" :label="$t('name.tweet')" />
                <q-tab name="blog" :label="$t('name.blog')" />
                <q-tab name="qa" :label="$t('name.qa')" />
                <q-tab name="review" :label="$t('name.review')" />
            </q-tabs>
        </div>

        <q-tab-panels
            v-model="v_tab"
            keep-alive
            animated swipeable
            transition-prev="slide-right"
            transition-next="slide-left"
            @transition="onClickTab"
        >
            <q-tab-panel name="info" class="gNoMargin">
                <InfoTable ref="infoTable" :data="v_asset" />
            </q-tab-panel>

            <q-tab-panel name="tweet" class="gNoMargin">
                <div class="q-my-sm">
                    <WWriterButton :placeholder="$t('name.tweet_writing')" @onClickWrite="onClickWrite" />
                    <!-- What's on your mind? -->
                </div>
                <q-separator class="gSeparator" />
                <TweetList ref='tweetList' title="Tweets" maxLength="10" moreCaption="" 
                    :category="v_asset.object_category" :symbol="v_asset.symbol" :assetId="v_asset.id" />

            </q-tab-panel>

            <q-tab-panel name="blog" class="gNoMargin">
                <div class="q-my-sm">
                    <WWriterButton :placeholder="$t('name.blog_writing')" @onClickWrite="onClickWriteBlog" />
                    <!-- Please share your knowledge! -->
                </div>
                <q-separator class="gSeparator" />
                <BlogList ref='blogList' :title="$t('page.asset.bloglist.title')" :desc="$t('page.asset.bloglist.desc')"
                    maxLength="10" :moreCaption="$t('button.more')" 
                    :category="v_asset.object_category" :symbol="v_asset.symbol" :objectId="v_asset.id" />            
            </q-tab-panel>
        
            <q-tab-panel name="qa" class="gNoMargin">
                <div class="q-my-sm">
                    <WWriterButton :placeholder="$t('name.qa_writing')" @onClickWrite="onClickWriteQuestion" />
                    <!-- Please ask anything -->
                </div>
                <q-separator class="gSeparator" />
                <AssetQuestionList ref="questionList" :title="$t('page.asset.questionlist.title')" :desc="$t('page.asset.questionlist.desc')"
                    maxLength="10" :moreCaption="$t('button.more')"
                    :symbol="v_asset.symbol" :assetId="v_asset.id"
                    @onClickQuestionRating="onClickQuestionRating"
                >
                </AssetQuestionList>            
            </q-tab-panel>
            
            <q-tab-panel name="review" class="gNoMargin">
                <div class="q-my-sm">
                    <AssetReviewForm ref="reviewForm" 
                        :category="v_asset.symbol" :assetId="v_asset.id"
                        @onClickReviewSave="onClickReviewSave" 
                    > 
                    </AssetReviewForm>                
                </div>
                <q-separator class="gSeparator" />
                <AssetReviewList ref="reviewList" :title="$t('page.asset.priceforecast.title')" :desc="$t('page.asset.priceforecast.desc')" 
                    :moreCaption="$t('button.more')" maxLength="10" 
                    :category="v_asset.symbol" :assetId="v_asset.id" 
                    @onClickRating="onClickReviewRating"> 
                </AssetReviewList>
            </q-tab-panel>

        </q-tab-panels>

    </div>

</template>

<script>
import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
//import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";

import {AssetModel} from "src/models/AssetModel";
import {PostPageModel,QuestionPageModel,AssetReviewPageModel,AssetReviewPageListModel} from "src/models/PageModel";

import CTitle from 'components/CTitle';
import WWriterButton from 'components/WWriterButton';

import BlogList from 'components/lists/BlogList';
import AssetQuestionList from 'components/lists/AssetQuestionList';
import AssetReviewList from 'components/lists/AssetReviewList';
import TweetList from 'components/lists/TweetList';

import AssetReviewForm from 'src/pages/asset/component/AssetReviewForm';
import PriceForecastForm from 'src/pages/asset/component/PriceForecastForm';
import PriceSummaryBox from 'src/pages/asset/component/PriceSummaryBox';
import InfoTable from "src/pages/asset/component/InfoTable";
import PriceForecastBox from "src/pages/asset/component/PriceForecastBox";


export default {
    name:'assetView',
    components: {
        CTitle,
        AssetQuestionList,
        PriceSummaryBox,
        AssetReviewList,
        InfoTable,
        BlogList,
        TweetList,
        AssetReviewForm,
        PriceForecastBox,
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
                qa:null,
                blog:null,
                chart: null,
            },
            g_period: 30,
            v_tab: 'tweet',
                                
            v_visible_table:false,
            v_items: [],         
            v_loaded: {
                blog:false,
                qa:false,
                tweet:false,
                review:false,
                info:false,
            },
            v_asset: new AssetModel(),
            v_reviews: new AssetReviewPageListModel(),
        }
    },

    created: function () {
        //console.log("HomeView.created");
        //console.log("AssetView.created - query=",this.$route.query);
        
        this.validateQuery();

        this.v_asset.symbol = this.$route.query.symbol;
        this.v_asset.object_category = CONST.ASSETPAGE_CATEGORY+this.v_asset.symbol;
        this.v_asset.id = parseInt(this.$route.query.id);
    },
    mounted: function() {
        //this.g_asset.symbol = 'BTC';
        //this.g_asset.object_id = 20;

        this.refresh();
    },
    updated: function() {
        //console.log("AssetView.updated - query=",this.$route.query);        
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

        refresh() {
            //logger.log.debug('Refresh');            
            //this.loadPriceTicker();
            
            this.loadCryptoBaseinfo();
            this.loadAssetReviewStat();            
            this.updateTab();
        },
        
        updateTab() {
            if (this.v_tab=="review") {
                if (! this.v_loaded.review) {
                    this.v_loaded.review = true;                    
                    this.loadAssetReviewData();
                }
            }
            if (this.v_tab=="qa") {
                if (! this.v_loaded.qa) {
                    this.v_loaded.qa = true;
                    this.loadAssetQuestionData();                                        
                }
            }

            if (this.v_tab=="blog") {
                if (! this.v_loaded.blog) {
                    this.v_loaded.blog = true;                    
                    this.loadBlogList();
                }
            }

            if (this.v_tab=="tweet") {
                if (! this.v_loaded.tweet) {
                    this.v_loaded.tweet = true;                    
                    this.loadTweetList();
                }
            }

            if (this.v_tab=="info") {
                if (! this.v_loaded.info) {
                    this.v_loaded.info = true;
                    //this.loadCryptoBaseinfo();
                }
            }
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

        loadCryptoBaseinfo() {
            const _this = this;

            this.v_asset.loadBaseinfo().then(resp=>{
                logger.log.debug("AssetView.loadCryptoBaseinfo - resp2=",resp,_this.v_asset);
                //call after getting cdrypto information
                _this.loadPriceTicker();
            }).catch(err=>{
                logger.log.debug("AssetView.loadCryptoBaseinfo - err=",err);
            });
                
        },

        loadPriceTicker() {
            const _this=this;
            logger.log.debug("AssetView.loadPriceTicker");
            this.v_asset.getPriceTicker().then(resp=>{
                logger.log.debug("AssetView.loadPriceTicker - resp=",resp,_this.v_asset);
            }).catch(err=>{
                logger.log.debug("AssetView.loadPriceTicker - err=",err);
            });

        },

        loadPriceHistory(offset=360,force=false) {
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
            logger.log.debug("AssetView.loadCryptoPriceHistory - dic_param=",dic_param);

            this.v_asset.loadPriceHistory(dic_param).then(jsonResult=>{
                _this.g_data.chart = jsonResult;
                _this.updatePriceTable(jsonResult);
                _this.updatePriceChart(jsonResult);                    
            }).catch(err=>{
                logger.log.error("AssetView.loadCryptoPriceHistory - error",err);
            });

        },


        loadCommitData(symbol) {
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

        loadAssetReviewData() {
            let dic_param = {'asset_id':this.v_asset.id};
            this.$refs.reviewList.update(dic_param);
        },

        loadAssetQuestionData() {
            let dic_param = {'asset_id':this.v_asset.id};
            this.$refs.questionList.update(dic_param);
        },

        loadBlogList() {
            console.log('AssetView.loadBlogList - ',this.v_asset.id);
            this.$refs.blogList.updateByAsset(this.v_asset.id);
        },

        loadTweetList() {
            console.log('AssetView.loadTweetList - ',this.v_asset.id);
            this.$refs.tweetList.updateByAsset(this.v_asset.id);
        },

        loadAssetReviewStat() {
            const _this=this;
            //let dic_param = {'category':this.g_asset.symbol, 'object_id':this.g_asset.object_id};

            this.v_reviews.loadStat(this.v_asset.id).then(resp=>{
                logger.log.debug("loadAssetReviewStat:resp=",resp);
            }).catch(err=>{

            });
        },


        onClickReviewSave(dic_param) {                        
            logger.log.debug('AssetView.onClickReviewSave - ',dic_param);       
            this.$refs.reviewList.addReview(dic_param.response.data);
            return;
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
            a_post.asset_id = this.v_asset.id;
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
            CommonFunc.navReview(this,this.v_asset.symbol,this.v_asset.id);
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
            //store.getters.nav.add(this.$route);
            CommonFunc.navAssetDetail(this,this.v_asset.symbol,this.v_asset.id);
        },

        onClickWrite: function() {
            logger.log.debug('AssetView.onClickWrite');
            CommonFunc.navTweetWriter(this,this.v_asset.id)
        },

        onClickWriteQuestion: function() {
            logger.log.debug('AssetView.onClickWrite');

            let a_post = new QuestionPageModel();
            a_post.category = this.v_asset.symbol;
            a_post.asset_id = this.v_asset.id;
            a_post.setContentType(CONST.CONENT_TYPE_ASSET_QUESTION);
            
            store.getters.nav.add(this.$route);

            let dic_param = {
                name: "assetqa_question_writer",path: "assetqa_question_writer", params: {post:a_post},
            };
            this.$router.push(dic_param);        
        },

        onClickWriteBlog: function() {
            logger.log.debug('AssetQAView.onClickWrite');

            let a_post = new PostPageModel();            
            a_post.setContentType(CONST.CONENT_TYPE_BLOGPAGE);
            a_post.category_name = this.v_asset.symbol;
            a_post.asset_id = this.v_asset.id;

            store.getters.nav.add(this.$route); 

            let dic_param = { name:'blog_writer', params:{post:a_post} };
            this.$router.push(dic_param);
        },

        onClickTab(tab) {
            logger.log.debug('AssetView.onClickTab : tab=',tab);
            this.v_tab = tab;
            this.updateTab();
        },

        onClickHolder() {
            logger.log.debug('AssetView.onClickHolder');
            CommonFunc.navHolder(this,this.v_asset.id,this.v_asset.symbol);
        },

        onSearchEvent(item) {
            logger.log.debug('AssetView.onSearchEvent : item=',item);
        }
    },

}

</script>



<style scoped>

</style>