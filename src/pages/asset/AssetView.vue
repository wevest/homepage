<template>

    <div class="q-pa-md">
        <div class="col">
            <CTitle ttype='title' :title="v_page_title" desc=""></CTitle>          
        </div>

        <div class="col">
            <!--
            <q-btn label="Write" @click="onClickWriteBlog" />
            -->
            <BlogList ref='blogList' title="Market Trend" maxLength="10" moreCaption="More" 
                :category="g_asset.category" :symbol="g_asset.symbol" :objectId="g_asset.object_id"
            />
            
        </div>


        <div class="col">
                                    
            <AssetQuestionList ref="questionList" title="Question List" maxLength="10" moreCaption="More"
                :symbol="g_asset.symbol" :objectId="g_asset.object_id"
                @onClickQuestionRating="onClickQuestionRating"
            >
            </AssetQuestionList>

        </div>

        <div class="col">                
            <AssetReviewList ref="reviewList" 
                moreCaption="More" maxLength="10" title="Review List"
                :category="g_asset.symbol" :objectId="g_asset.object_id" 
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
import CMSAPI from 'src/services/cmsService';
import logger from "src/error/Logger";

import {PostPageModel,QuestionPageModel,AssetReviewPageModel,AssetReviewPageListModel} from "src/models/PageModel";

import CTitle from 'components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';

import BlogList from 'components/lists/BlogList';
import AssetQuestionList from 'components/lists/AssetQuestionList';
import AssetReviewList from 'components/lists/AssetReviewList';

import CAssetChart from 'src/pages/asset/CAssetChart';
import CAssetInfoTable from 'src/pages/asset/CAssetInfoTable';
//import AssetReviewForm from 'src/pages/asset/component/AssetReviewForm';




export default {
    name:'assetView',
    components: {
        CTitle,
        ChartTimeframe,
        CAssetChart,
        CAssetInfoTable,
        AssetReviewList,
        AssetQuestionList,
        BlogList,
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_page_title() {
            return this.g_asset.symbol
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
            },
            g_period: 30,
            g_asset: {
                category:null,
                symbol:null,
                object_id: null
            },
            g_freq: 'y1',
            
            g_price: {'price_prev':0, 'price_low':0, 'price_high':0, 'price_open':0, 
                'price':0, 'price_ret':0, 'volume':0, 'tv':0, 
                'updated_date':'', 'icon':'arrow_drop_up', class:'text-red'},    
                        
            v_tab: 'review',
            v_score: {dev:5, price:5, volume:5, vc:0, avg:5},

            v_visible_table:false,
            v_headers: [
                { name:'trade_date', label: this.$t('name.trade_date'), field: 'trade_date', align:'left', required:true  },
                { name:'price', label: this.$t('name.price'), field: 'price'},
                { name:'volume', label: this.$t('name.volume'), field: 'volume'},
            ],
            v_pagination: {
                sortBy: 'trade_date',
                descending: true,
            },
            v_items: [],         

            v_reviews: new AssetReviewPageListModel(),
        }
    },

    created: function () {
        //console.log("HomeView.created");
        console.log("AssetView.created - query=",this.$route.query);
        
        this.g_asset.symbol = this.$route.query.symbol;
        this.g_asset.category = CONST.ASSETPAGE_CATEGORY+this.g_asset.symbol;
        this.g_asset.object_id = parseInt(this.$route.query.id);
    },
    mounted: function() {
        //this.g_asset.symbol = 'BTC';
        //this.g_asset.object_id = 20;

        this.refresh(this.g_asset);
    },
    updated: function() {
        console.log("AssetView.updated - query=",this.$route.query);
        
        if (this.$route.query.symbol) {
            this.g_asset.symbol = this.$route.query.symbol;
        }
        
        //CommonFunc.setAppData('onSearchEvent',this.onSearchEvent);
    },
    
    methods: {
        refresh: function(symbol,offset=360) {
            logger.log.debug('Refresh - ',symbol,offset);

            if ( (!symbol) || ( (symbol.length)==0 ) ) {
                return
            }

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

        updatePriceWiget: function(json_data) {
            logger.log.debug("data=",json_data);

            const dic_columns = CommonFunc.getColumnDic(json_data['overall'].columns,[],[]);
            const a_price = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceClose']];
            const a_price_prev = json_data['overall'].values[ json_data['overall'].values.length-2 ][dic_columns['priceClose']];

            this.g_price['price'] = CommonFunc.formatNumber(a_price,2);
            this.g_price['price_prev'] = CommonFunc.formatNumber(a_price_prev,2);
            this.g_price['price_low'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceLow']],2);
            this.g_price['price_high'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceHigh']],2);
            this.g_price['price_open'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceOpen']],2);
            this.g_price['volume'] = CommonFunc.milifyNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['volume']]);


            let a_ret = ((a_price-a_price_prev)/a_price)*100;
            
            let a_class = 'text-red';
            let a_icon = 'arrow_drop_down';
            if (a_ret>0) {
                a_class = 'text-green'
                a_icon = 'arrow_drop_up';
            }
            
            this.g_price.icon = a_icon;
            this.g_price.class = a_class;
            this.g_price['price_diff'] = CommonFunc.formatNumber(a_ret,2);
            this.g_price['price_ret'] = CommonFunc.formatNumber(a_ret,2);

            let a_tv = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['volume']] * json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceClose']];
            this.g_price['tv'] = CommonFunc.milifyNumber(a_tv);
            this.g_price['updated_date'] = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['trade_date']];
        },

        updatePriceTable: function(json_data) {            
            let dic_column = CommonFunc.getColumnDic( json_data['overall'].columns ,[],[]);

            let items = [];            
            for (let index=0;index<json_data['overall'].values.length;index++) {
                
                let a_item = {
                    trade_date: CommonFunc.safeGetJsonValue(json_data.overall.values,index,dic_column['trade_date']),
                    price: CommonFunc.safeGetJsonValue(json_data.overall.values,index,dic_column['priceClose']),
                    volume: CommonFunc.safeGetJsonValue(json_data.overall.values,index,dic_column['volume']),
                };
                items.push(a_item);
            }
            //logger.log.debug('items=',items);
            this.v_items = items;
        },

        updatePageHeader: function(symbol,json_data) {            
            const dic_columns = CommonFunc.getColumnDic(json_data['overall'].columns,[],[]);
            let a_date = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['time']];
            //let a_name = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['name']];

            this.v_page.title = symbol;
            this.v_page.desc = a_date;
        },

        loadCryptoBaseinfo: function(symbol) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                
                let dic_param = {symbol:symbol};
                logger.log.debug("AssetView.loadCryptoBaseinfo - dic_param=",dic_param);

                MoaBackendAPI.getCryptoBaseinfo(dic_param,function(response) {
                    _this.g_data.base = response.data.data;
                    logger.log.debug("AssetView.loadCryptoBaseinfo - response",_this.g_data);
                    //_this.$refs.assetTable.update(_this.g_data);
                    _this.updateScoreWidget(_this.g_data);
                    _this.$refs.assetinfoTable.update(_this.g_data,_this.g_vc);
                    
                    resolve();
                },function(err) {
                    logger.log.error("AssetView.loadCryptoBaseinfo - error",err);
                    reject();
                });
            });            
        },


        loadCryptoPriceHistory: function(symbol,offset=360) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                if (offset==0) {
                    offset = 3000;
                }
                let a_start_date = CommonFunc.addDays(a_today, offset*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let a_freq = 'd';
                if ( (_this.g_freq=='d7') || (_this.g_freq=='d1')) {
                    a_freq = 'm';
                }
                let dic_param = {symbol:symbol,quote:'USD',freq:a_freq,start_date:a_start_date, end_date:a_end_date, exchange:'cc',quote:'USD' };
                logger.log.debug("AssetView.loadCryptoPriceHistory - dic_param=",dic_param);

                MoaBackendAPI.getCryptoPriceHistory(dic_param,function(response) {
                    _this.g_data.price = response.data.data;
                    logger.log.debug("AssetView.loadCryptoPriceHistory - response",_this.g_data_price);
                    _this.updatePageHeader(symbol,_this.g_data_price);
                    _this.updatePriceWiget(_this.g_data_price);
                    _this.updatePriceTable(_this.g_data_price);
                    _this.$refs.assetChart.update(_this.g_data_price);                    
                    resolve();
                },function(err) {
                    logger.log.error("AssetView.loadCryptoPriceHistory - error",err);
                    reject();
                });
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
            let dic_param = {'category':this.g_asset.symbol, 'object_id':this.g_asset.object_id};
            this.$refs.reviewList.update(dic_param);
        },

        loadAssetQuestionData: function() {
            let dic_param = {'parent_id':this.g_asset.object_id};
            this.$refs.questionList.update(dic_param);
        },


        loadBlogList: function() {
            console.log('AssetView.loadBlogList - ',this.g_asset.category);            
            this.$refs.blogList.updateByCategory(this.g_asset.category);
        },


        onClickTimeframe: function(offset,timeframe) {
            console.log('AssetView.onClickTimeframe - ',offset,timeframe);
            this.g_freq = timeframe;
            this.refresh(this.g_asset,offset);
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
                const category = CONST.ASSETPAGE_CATEGORY+this.g_asset.symbol;
                this.$refs.blogList.update(null,category);
            }
        },

        onClickWriteBlog: function() {
            logger.log.debug('AssetView.onClickWriteBlog');
            //this.navBlogWriter();

            let a_post = new PostPageModel();
            a_post.category = this.g_asset.symbol;
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
			
            store.getters.nav.add(this.$route);            
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
            CommonFunc.navReview(this,this.g_asset.symbol,this.g_asset.object_id);
        },

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