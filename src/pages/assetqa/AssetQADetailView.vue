<template>
    <!-- QA Detailed Page-->
    <div class="q-ma-md">
        <div>
            <div>
                <div class="gPageTitle">
                    <q-icon class="qIcon" name="help_outline" />&nbsp;
                    <span>{{ v_question.title }}</span>
                </div>

                <div class="row q-pb-sm">
                    <WSubinfo
                        :username="v_question.owner.display_name"
                        :pub_date="v_question.pub_date"
                        like_count="-1"
                        dislike_count="-1"
                    />

                    <q-space />

                    <WCommandBar
                        :data="v_question"
                        :isOwner="v_question.is_owner"
                        shareBtn=""
                        updateBtn="update"
                        deleteBtn="delete"
                        @onClickUpdate="onClickUpdate"
                        @onClickDelete="onClickDelete"
                    />
                </div>
            </div>

            <q-separator size="1px" />

            <div class="gPageContent q-my-xl">
                <div class="gBodyLG" v-html="v_question.body"></div>
                    <!--                
                        <Viewer 
                            ref="toastViewer"
                            :value="v_question.body"
                            :options="editorOptions"
                            :visible="v_show_editor"
                            previewStyle="vertical"
                        />
                    -->
            </div>

        <!--
            <WRatingButton ref="ratingButton" likeCaption="도움돼요" dislikeCaption="도움 안돼요"
                @onClickRating="onClickQuestionVote" />

        -->

            <div>
                <QuestionCommentBox
                    ref="commentBox"
                    :question="v_question"
                    :contentType="v_content_type"
                />
            </div>

        </div>

        <q-separator class="gSeparator" />

        <div class="q-my-sm" v-if="!v_question.closed">
            <WWriterButton
                placeholder="Please share your knowledges"
                @onClickWrite="onClickAnswer"
            />
        </div>

        <q-separator class="gSeparator" />
        <div>
            <AssetAnswerList
                ref="answerList"
                @onClickAnswerRating="onClickAnswerRating"
                @onClickQuestionAccept="onClickQuestionAccept"
                @onClickAnswerUpdate="onClickAnswerUpdate"
            >
            </AssetAnswerList>
        </div>

    </div>
</template>

        
<script>
import "codemirror/lib/codemirror.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/vue-editor";

import { CONST } from "src/data/const";
import { store } from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import {
  QuestionPageModel,
  AnswerPageModel,
  AnswerPageListModel,
} from "src/models/PageModel";
import { AnswerCommentListModel } from "src/models/CommentModel";

import WSubinfo from "components/WSubinfo";
import WCommandBar from "components/WCommandBar.vue";
import WRatingButton from "components/WRatingButton";
import WWriterButton from "components/WWriterButton";
import CommentForm from "components/comments/comment-form.vue";

import AssetAnswerList from "src/pages/assetqa/component/AssetAnswerList";
import QuestionCommentBox from "src/pages/assetqa/component/QuestionCommentBox.vue";

export default {
    name:'assetView',
    components: {
        Viewer,
        AssetAnswerList,
        WRatingButton,
        WSubinfo,
        WCommandBar,
        WWriterButton,
        QuestionCommentBox
    },
    props: [],
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        },
    },
    data: function() {
        return {
            g_data: {
                answer:null,
            },

            v_question: new QuestionPageModel(),            
            v_answers: new AnswerPageListModel(),

            v_show_editor: false,
            v_content_type: "blog.postpage",

            editorOptions: {
                hideModeSwitch: true,
                hooks:{}
            },
            editorHtml: 'asdklfhjasdljfasdlkjfasdl;',
            editorVisible: true,            
        }
    },

    created: function () {
        //console.log("HomeView.created");
        this.validateQuery();
    },
    mounted: function() {
        logger.log.debug("AssetQAView.mounted - param=",this.$route.query);
        
        this.v_question.id = this.$route.query.id;
        //this.v_question.id = 24;
        this.refresh();
    },

    methods: {
        validateQuery() {            
            if (! CommonFunc.isEmptyObject(this.$route.query.id)) {
                return;
            }                

            CommonFunc.navError404(this);
        },

        setContent(content) {
            this.$refs.toastViewer.invoke('setMarkdown', content);
        },

        setPageID: function(page_id) {
            this.v_answer.id = page_id;
        },

        refresh() {
            logger.log.debug("AssetQAView.refresh : v_question=",this.v_question);
            
            if (! this.v_question.id) {
                return;
            }

            this.loadQuestion();
            this.loadAssetAnswer(this.v_question.id);            
        },

        loadQuestion: function() {
            const _this=this;
            this.v_question.load().then( response => {
                logger.log.debug("AssetQAView.loadQuestion : response=",response);
                //_this.setContent(_this.v_question.body);
                _this.loadQuestionComment();
            });
        },
        loadQuestionComment: function() {
            const _this=this;
            this.v_question.comments.load(this.v_question.id).then( response => {
                logger.log.debug("AssetQAView.loadQuestionComment : response=",response);
                _this.$refs.commentBox.setPageParameter(response);
            });
        },

        loadAssetAnswer: function(question_id) {
            this.$refs.answerList.setQuestionPage(this.v_question);
            this.$refs.answerList.update(question_id);    
        },

        handleAceeptAnswer: function(response) {
            logger.log.debug("AssetQAView.handleAceeptAnswer - response=",response);
            this.v_question.closed = true;
            this.$refs.answerList.updateAcceptedAnswer(response);
        },


        onClickAnswer: function() {
            logger.log.debug("AssetQAView.onClickAnswer - v_question=",this.v_question);

            if (this.v_me.isLoggedIn()) {
                let a_post = new AnswerPageModel();
                a_post.question_id = this.v_question.id;
                a_post.title = this.v_question.title;
                a_post.api_tags = this.v_question.api_tags;
                a_post.category = this.v_question.category;
                a_post.setContentType(CONST.CONENT_TYPE_ASSET_ANSWER);

                store.getters.nav.add(this.$route);

                let dic_param = {
                    name: "assetqa_answer_writer",path: "assetqa_answer_writer", params: {post:a_post},
                };
                this.$router.push(dic_param);                    
                return;
            }
            
            const _this=this;
            store.getters.nav.add(this.$route);
            store.getters.components.getComponent('confirmDialog').show('Please login first',function(value) {
                logger.log.debug("AssetQAView.onClickAnswer - confirm=",value,_this.$route);
                if (value) {
                    CommonFunc.navSignin(_this);
                }
            });
        },

        onClickQuestionVote: function(dicParam) {
            logger.log.debug("AssetQAView.onClickQuestionVote - value=",dicParam);
            
            const _this=this;
            let dic_param = {value:dicParam.value};
            this.v_question.vote(dic_param).then(response=>{
                logger.log.debug("AssetQAView.onClickQuestionVote - response=",response);
                CommonFunc.showOkMessage(_this,'Question rated');
            }).catch(err=>{
                logger.log.debug("AssetQAView.onClickQuestionVote - err=",err);
                CommonFunc.showErrorMessage(_this,err.data.msg);                
            });
        },

        onClickClear: function() {
            logger.log.debug("AssetQAView.onClickClear");
        },

        onClickClose: function() {
            logger.log.debug("AssetQAView.onClickClose");
            this.v_show_editor = false;
        },

        onClickAnswerRating: function(dic_param) {
            logger.log.debug("AssetQAView.onClickAnswerRating",dic_param);
        },

        onClickQuestionAccept: function(answer) {
            const _this = this;

            logger.log.debug("AssetQAView.onClickQuestionAccept : answer=",answer);
            
            answer.accept().then(response=>{
                logger.log.debug('AssetView.onClickAnswerRating - response = ',response);
                if (response.data.ret==0) {
                    _this.handleAceeptAnswer(response.data);
                    //CommonFunc.showOkMessage(_this,'Answer accepted ');
                } else {
                    CommonFunc.showErrorMessage(_this,response.data.msg);    
                }
                answer._this.setButtonLoading(false);                
            }).catch(err=>{
                
                answer._this.setButtonLoading(false);
                CommonFunc.showErrorMessage(_this,'Answer acception error');
            });

        },

        onAnswerAdded: function(dic_param) {
            logger.log.debug('AssetQAView.onAnswerAdded : dic_param=',dic_param);
            this.$refs.answerList.addAnswer(dic_param.response);
        },

        onQuestionAdded: function(dicParam) {
            logger.log.debug('AssetQAView.onQuestionAdded : dicParam=',dicParam);
            this.v_question.body = dicParam.response.data.body;
        },

        onClickUpdate: function () {
            logger.log.debug("AssetQAView.onClickUpdate");
            /*
                    let a_post = new QuestionPageModel();
                    a_post.question_id = this.v_question.id;
                    a_post.title = this.v_question.title;
                    a_post.setContentType(CONST.CONENT_TYPE_ASSET_ANSWER);
                    */
            store.getters.nav.add(this.$route);
            let params = { post: this.v_question };
            let dic_param = { name: "assetqa_question_writer", params: params };
            this.$router.push(dic_param);
        },
        
        onClickDelete: function () {
            logger.log.debug("AssetQAView.onClickDelete");
            const _this = this;
            this.v_question.remove().then((response) => {
                logger.log.debug("AssetQAView.onClickDelete : response=", response);
                CommonFunc.showOkMessage(_this, "Question Deleted");
                CommonFunc.navBack(_this);
            }).catch((err) => {
                CommonFunc.showErrorMessage(_this, err.data.msg);
            });
        },
        onClickAnswerUpdate: function (answer) {
            logger.log.debug("AssetQAView.onClickAnswerUpdate : answer=", answer);
            this.$refs.answerWriter.show(answer);
        },

    },
};
</script>


<style scope>
.qIcon {
  color: #00c73c;
  font-size: 50px;
  padding: 0px 0px 9px 0px;
  margin-left: -4px;
}
.Separator {
  height:10px;
  margin:5px 0px 5px 0px;
  background: #f0f1f6;
}
</style>