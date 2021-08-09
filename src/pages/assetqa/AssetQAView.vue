<template>

    <div class="q-pa-md">
        <div>
            <CTitle ttype='title' :title="$t('page.assetqa.title')" :desc="$t('page.assetqa.desc')"></CTitle>
        </div>

        <div>
            <WWriterButton :placeholder="$t('name.qa_writing')" @onClickWrite="onClickWrite" />
        </div>
        
        <q-separator class="gSeparator" />

        <div>

            <AssetQuestionList ref="questionList" :title="$t('page.assetqa.questionlist.title')" maxLength="20000" moreCaption=""
                :symbol="g_asset.symbol" :assetId="g_asset.object_id"
                @onClickQuestionRating="onClickQuestionRating">
            </AssetQuestionList>

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
import WWriterButton from 'components/WWriterButton';
import AssetQuestionList from 'components/lists/AssetQuestionList';


export default {
    name:'assetView',
    components: {
        CTitle,
        WWriterButton,
        AssetQuestionList,
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

            g_asset: {
                symbol:null,
                object_id: null
            },                        
        }
    },

    created() {
        //console.log("HomeView.created");
        logger.log.debug("AssetQAView.created - query=",this.$route.query);

        this.validateQuery();
        
        this.g_asset.symbol = this.$route.query.symbol;
        this.g_asset.object_id = parseInt(this.$route.query.id);
    },
    mounted() {
        //this.g_asset.symbol = 'BTC';
        //this.g_asset.object_id = 20;
        this.refresh(this.g_asset);
    },
    updated() {
        logger.log.debug("AssetQAView.updated - query=",this.$route.query);                
        //CommonFunc.setAppData('onSearchEvent',this.onSearchEvent);
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

        refresh(symbol,offset=360) {
            logger.log.debug('Refresh - ',symbol,offset);

            this.loadAssetQuestionData();                    

        },
        
        updatePageHeader(symbol,json_data) {            
            const dic_columns = CommonFunc.getColumnDic(json_data['overall'].columns,[],[]);
            let a_date = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['time']];
            //let a_name = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['name']];

            this.v_page.title = symbol;
            this.v_page.desc = a_date;
        },

        loadAssetQuestionData() {
            let dic_param = {'asset_id':this.g_asset.object_id};
            this.$refs.questionList.update(dic_param);
        },


        onClickQuestionRating(question) {
            logger.log.debug('AssetView.onClickQuestionRating - ',question);
            
            const _this = this;
            let dic_param = {id:question.id, value:question.value, method:'vote'};            
            question.vote(dic_param).then( response => {
                CommonFunc.showOkMessage(_this,"done");
            }).catch( err => {
                logger.log.debug('onClickQuestionRating - ',err);
            });            
        },

        onClickLoadmore() {
            logger.log.debug('AssetView.onClickLoadmore');
        },

        onQuestionAdded(dic_param) {
            logger.log.debug('AssetView.onQuestionAdded : dic_param=',dic_param);
            this.$refs.questionList.addQuestion(dic_param.response);
        },

        onClickWrite() {
            logger.log.debug('AssetQAView.onClickWrite');

            let a_post = new QuestionPageModel();
            a_post.category = this.g_asset.symbol;
            a_post.asset_id = this.g_asset.object_id;
            a_post.setContentType(CONST.CONENT_TYPE_ASSET_QUESTION);
            
            store.getters.nav.add(this.$route);

            let dic_param = {
                name: "assetqa_question_writer",path: "assetqa_question_writer", params: {post:a_post},
            };
            this.$router.push(dic_param);        
        },

    },

}

</script>



<style scoped>

</style>