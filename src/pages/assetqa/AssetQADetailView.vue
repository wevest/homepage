<template>
<!-- Blog Question Page 질문 페이지와 코멘트 목록 -->
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <div>       
                    <!-- <q-icon v-if="v_question.closed" name="done" /> -->
                    <!-- <q-icon v-else name="add" /> -->

                    <div class="gPageTitleBox gPageTitle">  
                        <q-icon
                            class="gPageIcon" 
                            name="help_outline" />                       
                            <span>{{ v_question.title }}</span> 

                        <q-icon 
                            class="DoneAddBtn float-right" 
                            name="done_all"
                            v-if="v_question.closed" />
                    </div>

                    <div class="row globalUDRBox">  
                        
                        <WSubinfo :username="v_question.owner.username" :pub_date="v_question.pub_date" :like_count="v_question.like_count" :dislike_count="v_question.dislike_count" />
                        
                        <q-space />

                        <WCommandBar :data="v_question" :isOwner="v_question.is_owner" 
                            shareBtn="share" updateBtn="update" deleteBtn="delete" 
                            @onClickShare="onClickShare" 
                            @onClickUpdate="onClickUpdate" 
                            @onClickDelete="onClickDelete" 
                        />

                    </div>                                 
                </div>
                        
                <q-separator size="1px" />                                                

                <div class="gPageContent">
                    <Viewer 
                        ref="toastViewer"
                        :value="v_question.body"
                        :options="editorOptions"
                        :visible="v_show_editor"
                        previewStyle="vertical"
                    />
                </div>

                <WRatingButton ref="ratingButton" likeCaption="도움돼요" dislikeCaption="도움 안돼요"
                    @onClickRating="onClickQuestionVote" />

            </div>
        </div>

        <q-separator class="gSeparator" />

        <div v-if="! v_question.closed">     
            <WWriterButton placeholder="Please share your knowledges" @onClickWrite="onClickAnswer" />
        </div>

        <q-separator class="gSeparator" />

        <div class="row">
            <div class="col">
                <AssetAnswerList ref="answerList" 
                    @onClickAnswerRating="onClickAnswerRating"
                    @onClickQuestionAccept="onClickQuestionAccept"
                    @onClickAnswerUpdate="onClickAnswerUpdate"
                > 
                </AssetAnswerList>
            </div>
        </div>

    </div>
          
</template>

        
<script>
import 'codemirror/lib/codemirror.css'; 
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from "@toast-ui/vue-editor";

import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import {QuestionPageModel, AnswerPageModel, AnswerPageListModel} from "src/models/PageModel";

import WSubinfo from 'components/WSubinfo';
import WCommandBar from "components/WCommandBar.vue";
import WRatingButton from 'components/WRatingButton';
import WWriterButton from 'components/WWriterButton';

import AssetAnswerList from 'src/pages/assetqa/component/AssetAnswerList';


export default {
    name:'assetView',
    components: {
        Viewer,
        AssetAnswerList,
        WRatingButton,
        WSubinfo,
        WCommandBar,
        WWriterButton
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
    },
    mounted: function() {
        logger.log.debug("AssetQAView.mounted - param=",this.$route.query);
        
        this.v_question.id = this.$route.query.id;
        //this.v_question.id = 24;
        this.refresh();
    },

    methods: {
        setContent(content) {
            this.$refs.toastViewer.invoke('setMarkdown', content);
        },

        setPageID: function(page_id) {
            this.v_answer.id = page_id;
        },

        refresh() {
            logger.log.debug("AssetQAView.refresh");
            
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
                _this.setContent(_this.v_question.body);
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
                a_post.setContentType(CONST.CONENT_TYPE_ASSET_ANSWER);

                store.getters.nav.add(this.$route);

                let dic_param = {
                    name: "assetqa_answer_writer",path: "assetqa_answer_writer", params: {post:a_post},
                };
                this.$router.push(dic_param);                    
                return;
            }
            
            const _this=this;
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
                    CommonFunc.showOkMessage(_this,'Answer accepted ');
                } else {
                    CommonFunc.showErrorMessage(_this,response.data.msg);    
                }
                
            }).catch(err=>{
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

        onClickUpdate: function() {
            logger.log.debug('AssetQAView.onClickUpdate');

            /*
            let a_post = new QuestionPageModel();
            a_post.question_id = this.v_question.id;
            a_post.title = this.v_question.title;
            a_post.setContentType(CONST.CONENT_TYPE_ASSET_ANSWER);
            */

            store.getters.nav.add(this.$route); 

            let params = {post:this.v_question};
            let dic_param = { name:'assetqa_question_writer', params:params };
            this.$router.push(dic_param);
        },

        onClickDelete: function() {
            logger.log.debug('AssetQAView.onClickDelete');

            const _this=this;
            store.getters.components.getComponent('confirmDialog').show('Do you want to delete?',function(value) {
                if (! value) return;

                _this.v_question.remove().then(response=>{
                    logger.log.debug('AssetQAView.onClickDelete : response=',response);
                    CommonFunc.showOkMessage(_this,'Question Deleted');
                    CommonFunc.navBack(_this);

                }).catch(err=>{
                    CommonFunc.showErrorMessage(_this,err.data.msg);    
                });

            });
        },

        onClickAnswerUpdate: function(answer) {
            logger.log.debug('AssetQAView.onClickAnswerUpdate : answer=',answer);
            this.$refs.answerWriter.show(answer);
        },

        onClickShare:function(question) {
            let a_url = CommonFunc.navQADetail(this,question.id,true);
            logger.log.debug("WCommandBar.onClickShare : url=",a_url);
            
            CommonFunc.copyUrl(this,a_url);
        }

    },

}
</script>


<style scope>


.pageAnswerBox {
    margin:15px 0px;
}
.pageAnswerBtn {
    color:#555555;
    width:100px;
}

.DoneAddBtn {
    font-size:30px;
    padding-top:5px;
    color:green;
}

.globalUDRBox {
   padding:0px 0px 10px 0px;
}

.toolBtn {
    color:#555555;
    width:40px;
    margin-left:5px;
}


</style>
 

