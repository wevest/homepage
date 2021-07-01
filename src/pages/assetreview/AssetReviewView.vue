<template>
    
    <div class="q-pa-md">
        <div class="row">
            <div class="col">
                <CTitle ttype='title' :title="v_page_title" desc=""></CTitle>          
            </div>
        </div>

        <div class="row">
            <div class="col">


                <AssetReviewForm ref="reviewForm" 
                    :category="g_asset.symbol" :objectId="g_asset.object_id"
                    @onClickReviewSave="onClickReviewSave" 
                    @onEditorFocus="onFocusReviewForm"
                    @onEditorFocusOut="onFocusoutReviewForm"
                > 
                </AssetReviewForm>                

                <AssetReviewList ref="reviewList" 
                    :category="g_asset.symbol" :objectId="g_asset.object_id"
                    @onClickRating="onClickReviewRating" 
                    @onClickLoadmore="onClickLoadmore"> 
                </AssetReviewList>

            </div>
        </div>
    </div>

</template>


<script>
import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import {PostPageModel,QuestionPageModel,AssetReviewPageModel,AssetReviewPageListModel} from "src/models/PageModel";

import CTitle from 'components/CTitle';
import AssetReviewForm from 'src/pages/assetreview/component/AssetReviewForm';
import AssetReviewList from 'components/AssetReviewList';



export default {
    name:'assetView',
    components: {
        CTitle,
        AssetReviewForm,
        AssetReviewList,
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
            g_asset: {
                symbol:null,
                object_id: null
            },

            v_reviews: new AssetReviewPageListModel(),
        }
    },

    created: function () {
        //console.log("HomeView.created");
        console.log("AssetView.created - query=",this.$route.query);

        this.g_asset.symbol = this.$route.query.symbol;
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

        },


        loadAssetReviewData: function() {
            let dic_param = {'category':this.g_asset.symbol, 'object_id':this.g_asset.object_id};
            this.$refs.reviewList.update(dic_param);
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

        onClickLoadmore: function() {
            logger.log.debug('AssetView.onClickLoadmore');
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


        onFocusReviewForm: function(event) {
            logger.log.debug('AssetView.onFocusReviewForm');
            this.$refs.reviewForm.v_rows = "5";
        },

        onFocusoutReviewForm: function(event) {
            logger.log.debug('AssetView.onFocusoutReviewForm');
            this.$refs.reviewForm.v_rows = "1";
        },

    },

}

</script>



<style scoped>

</style>
