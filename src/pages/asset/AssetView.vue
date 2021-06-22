<template>

    <div class="q-pa-md">
        <div class="row">
            <div class="col">
                <CTitle ttype='title' :title="v_page.title" :desc="v_page.desc"></CTitle>          
            </div>
        </div>
        
        <div class="row">
            <div class="col">
                <CTitle ttype='subtitle' title="Ratings and Score" desc=""></CTitle>          
                <div class="box_score">
                    <div class="box_score_point">
                        <span class="score_point"> {{ v_score.avg }} </span>
                        <br><span class="price_label">{{ $t('name.cryptovc') }}</span> 
                        <br><span class="price_tag">{{ v_score.vc }}</span>
                    </div>
                    <div>
                        <q-markup-table flat dense class="box_score_table">
                            <tbody>
                                <tr>
                                    <td class="box_score_table_column"> 
                                        <span class="caption_color">{{ $t('name.dev_score') }}</span> 
                                    </td>
                                    <td style="padding-top:30px;">
                                        <q-slider
                                            v-model="v_score.dev" :min="0" :max="5" :step="1"                                            
                                            label :label-value="v_score.dev" readonly dense
                                            label-always color="purple" />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="box_score_table_column"> 
                                        <span class="price_label caption_color">{{ $t('name.price_score') }}</span> 
                                    </td>
                                    <td>
                                        <q-slider
                                            v-model="v_score.price" :min="0" :max="5" :step="1"
                                            label :label-value="v_score.price"   readonly dense
                                            label-always color="purple" />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="box_score_table_column"> 
                                        <span class="price_label caption_color">{{ $t('name.volume_score') }}</span> 
                                    </td>
                                    <td>
                                        <q-slider
                                            v-model="v_score.volume" :min="0" :max="5" :step="1"
                                            label :label-value="v_score.volume"  readonly dense
                                            label-always color="purple" />
                                    </td>
                                </tr>
                            </tbody>
                        </q-markup-table>
                    </div>
                </div>
            </div>
        </div>
    

        <div class="row">
            <div class="col">

                <q-tabs v-model="v_tab" class="text-black tab_bgcolor" active-color="primary" indicated-color="primary" align="justify" dense>
                    <q-tab name="review" :label="$t('name.review')" />
                    <q-tab name="blog" :label="$t('name.info')"  />
                    <q-tab name="qa" :label="$t('name.qa')"  />
                </q-tabs>

                <q-tab-panels
                    v-model="v_tab"
                    animated dense           
                    vertical
                    keep-alive            
                    transition-prev="jump-up" transition-next="jump-up"
                    @transition="onTabChange"
                >
                    <q-tab-panel name="review" class="q-pa-none">
                        
                        <AssetReviewForm ref="reviewForm" @onClickReviewSave="onClickReviewSave" 
                            @onEditorFocus="onFocusReviewForm"
                            @onEditorFocusOut="onFocusoutReviewForm"
                        > 
                        </AssetReviewForm>
                        <AssetReviewList ref="reviewList" 
                            @onClickRating="onClickReviewRating" 
                            @onClickAvatar="onClickReviewAvatar"
                            @onClickLoadmore="onClickLoadmore"> 
                        </AssetReviewList>

                    </q-tab-panel>

                    <q-tab-panel name="blog" class="q-pa-none">
                        <q-btn label="Write" @click="onClickWriteBlog" />
                        <BlogList ref='blogList'></BlogList>
                    </q-tab-panel>

                    <q-tab-panel name="qa" class="q-pa-none">
                        
                        <q-btn label="Question" @click="onClickWriteQuestion" />

                        <AssetQuestionList ref="questionList" 
                            @onClickQuestion="onClickQuestion"
                            @onClickQuestionRating="onClickQuestionRating"
                        >
                        </AssetQuestionList>

<!--                        
                        <WEditor ref="weditor" @> </WEditor>
                        <q-btn label="Save" @click="onClickSaveQuestion" />
-->

                    </q-tab-panel>

                </q-tab-panels>

            </div>
        </div>

        <BlogWriterDialog ref="blogWriter"> </BlogWriterDialog>
        <QuestionWriterDialog ref="questionWriter"> </QuestionWriterDialog>

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
import BlogList from 'components/BlogList';
import BlogWriterDialog from 'components/dialogs/BlogWriterDialog';
import QuestionWriterDialog from 'components/dialogs/QuestionWriterDialog';

import CAssetChart from 'src/pages/asset/CAssetChart';
import CAssetInfoTable from 'src/pages/asset/CAssetInfoTable';
import AssetReviewForm from 'src/pages/asset/component/AssetReviewForm';
import AssetReviewList from 'src/pages/asset/component/AssetReviewList';
import AssetQuestionList from 'src/pages/asset/component/AssetQuestionList';
import WEditor from 'src/pages/asset/component/WEditor';




export default {
    name:'assetView',
    components: {
        CTitle,
        ChartTimeframe,
        CAssetChart,
        CAssetInfoTable,
        AssetReviewForm,
        AssetReviewList,
        AssetQuestionList,
        WEditor,
        BlogList,
        BlogWriterDialog,
        QuestionWriterDialog,        
    },
    props: ['symbol'],
    computed: {
        v_me() {
            return store.getters.me;
        },
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
                symbol:null,
                object_id: null
            },
            g_freq: 'y1',
            
            g_price: {'price_prev':0, 'price_low':0, 'price_high':0, 'price_open':0, 
                'price':0, 'price_ret':0, 'volume':0, 'tv':0, 
                'updated_date':'', 'icon':'arrow_drop_up', class:'text-red'},    
            
            v_page: {title:this.$t('page.asset.title'), desc:''},
            v_tab: 'qa',
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
    },
    mounted: function() {
        console.log("AssetView.mounted - symbol=",this.symbol,this.$route.params);
/*
        let a_selected = CommonFunc.getAppData('crypto_selected');
        console.log("InstrumentView.mounted - ",a_selected);
        if (a_selected)  {
            //this.showChart(a_selected,[],'');
        }
*/

        this.g_asset.symbol = this.$route.params.symbol;
        this.g_asset.symbol = 'BTC';
        this.g_asset.object_id = 20;

        this.refresh(this.g_asset);
    },
    updated: function() {
        console.log("AssetView.updated - symbol=",this.symbol,this.$route.params);
        
        if (this.$route.params.symbol) {
            this.g_asset.symbol = this.$route.params.symbol;
        }
        
        //CommonFunc.setAppData('onSearchEvent',this.onSearchEvent);
    },
    
    methods: {
        refresh: function(symbol,offset=360) {
            logger.log.debug('Refresh - ',symbol,offset);

            if ( (!symbol) || ( (symbol.length)==0 ) ) {
                return
            }

            //this.loadAssetReviewData();
            this.loadAssetQuestionData();
            //this.loadBlogList();

        },
        
        getScore: function(value) {
            if (value>0.8) {                
                //return 'A';
                return 5;
            } else if (value>0.6) {
                return 4;
                //return 'B';
            } else if (value>0.4) {
                return 3;
                //return 'C';
            } else if (value>0.2) {
                return 2;
                //return 'D';
            } else if (value==0) { 
                return 0;
            } else {
                return 1;
                //return 'F';
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
            let dic_param = {'object_id':this.g_asset.object_id};
            this.$refs.reviewList.update(dic_param);
        },

        loadAssetQuestionData: function() {
            let dic_param = {'parent_id':this.g_asset.object_id};
            this.$refs.questionList.update(dic_param);
        },


        loadBlogList: function() {
            console.log('AssetView.loadBlogList - ');
            const category = CONST.ASSETPAGE_CATEGORY+this.g_data.symbol;
            this.$refs.blogList.update(null,category);
        },

        navBlogWriter: function() {
            logger.log.debug('AssetView.navBlogWriter');
            let dic_param = { name:'blog_writer', params:{} };
            this.$router.push(dic_param);            
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
            const _this = this;
            
            dic_param.object_id = this.g_asset.object_id;
            dic_param.category = this.g_asset.symbol;

            logger.log.debug('AssetView.onClickReviewSave - ',dic_param);       
                        
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

        onClickQuestion: function(json_question) {
            logger.log.debug('AssetView.onClickQuestion - ',json_question);
            
            let dic_param = { name:'assetqa', params:json_question };
            this.$router.push(dic_param);            
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

        onClickLoadmore: function() {
            logger.log.debug('AssetView.onClickLoadmore');
        },

        onTabChange: function(newValue,oldValue) {
            logger.log.debug('AssetView.onTabChange',newValue);
            
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


        onClickWriteQuestion: function() {
            logger.log.debug('AssetView.onClickWriteQuestion');
            
            let a_post = new QuestionPageModel();
            a_post.category = this.g_asset.symbol;
            a_post.parent_id = this.g_asset.object_id;
            a_post.setContentType(CONST.CONENT_TYPE_ASSET_QUESTION);
            
            this.$refs.questionWriter.show(a_post);
        },

        onFocusReviewForm: function(event) {
            logger.log.debug('AssetView.onFocusReviewForm');
            this.$refs.reviewForm.v_rows = "5";
        },

        onFocusoutReviewForm: function(event) {
            logger.log.debug('AssetView.onFocusoutReviewForm');
            this.$refs.reviewForm.v_rows = "1";
        },

        onClickReviewAvatar: function(jsonUser) {
            logger.log.debug('AssetView.onClickReviewAvatar : jsonUser=',jsonUser);
            CommonFunc.navProfile(this,jsonUser.username);
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