<template>
<!-- Blog Question Page 질문 페이지와 코멘트 목록 -->
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <div>       
                    <!-- <q-icon v-if="v_question.closed" name="done" /> -->
                    <!-- <q-icon v-else name="add" /> -->

                    <div class="gPageTitleBox">  
                        <q-icon
                            class="gPageIcon" 
                            name="help_outline" />                       
                            <span class="gPageTitle">{{ v_question.title }}</span> 

                        <q-icon 
                            class="DoneAddBtn float-right" 
                            name="done_all"
                            v-if="v_question.closed" />
                        <q-icon 
                            class="DoneAddBtn float-right"
                            v-else 
                            name="add" />           
                    </div>

                    <div class="row globalUDRBox">  
                        <div class="gPageUDRBox">
                            <span class="gPageUser" v-if="v_question.owner"> {{ v_question.owner.username }} </span>&nbsp;
                            <span class="gPageDatetime">{{ v_updated_at(v_question.pub_date) }} </span>&nbsp;

                            <q-icon name="thumb_up_off_alt" />&nbsp;
                            <span class="gPageRating">{{ v_question.like_count }}</span>&nbsp;
                            <q-icon name="thumb_down_off_alt" />&nbsp;
                            <span class="gPageRating">{{ v_question.dislike_count }} </span>
                        </div>

                            <q-space />

                        <div>
                            <q-btn            
                                class="toolBtn"              
                                outlined
                                size="9px"
                                icon="build"
                                @click="onClickUpdate" />

                            <q-btn
                                class="toolBtn"                            
                                outlined
                                size="9px"
                                icon="delete"
                                @click="onClickDeletePortfolio" />       
                        </div>   
                    </div>                                 
                </div>
                        
            <q-separator size="1px" />
                    
                                      
                    

                <div class="gPageContent">
                    <Viewer 
                        ref="toastViewer"
                        :value="v_question.description"
                        :options="editorOptions"
                        :visible="v_show_editor"
                        previewStyle="vertical"
                    />
                </div>

                <div class="q-pa-md q-gutter-sm gPageRatingBox">
                    <q-btn                        
                        class="gPageRatingBtn"                        
                        icon="thumb_up_off_alt"
                        dense 
                        flat 
                        @click="onClickQuestionVote(1)"/>&nbsp; 
                    <q-btn 
                        class="gPageRatingBtn"
                        icon="thumb_down_off_alt"                        
                        dense
                        flat                                                                       
                        @click="onClickQuestionVote(-1)" />
                </div>

            </div>
        </div>

        <q-separator size="10px"/>

        <div class="row" v-if="! v_question.closed">     
                <q-space />
                <div class="pageAnswerBox">                
                <q-btn 
                    class="pageAnswerBtn"
                    dense                                  
                    label="Answer" @click="onClickAnswer" />
                </div>            
        </div>

        <q-separator size="10px" />

        <div class="row">
            <div class="col">
                <AssetAnswerList ref="answerList" 
                    @onClickAnswerRating="onClickAnswerRating"
                    @onClickQuestionAccept="onClickQuestionAccept"
                > 
                </AssetAnswerList>
            </div>
        </div>

        <AnswerWriterDialog ref="answerWriter" @onAnswerAdded="onAnswerAdded"></AnswerWriterDialog>
    </div>
          
</template>

        
<script>
import 'codemirror/lib/codemirror.css'; 
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from "@toast-ui/vue-editor";
import { Editor } from '@toast-ui/vue-editor';

import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import {QuestionPageModel, AnswerPageModel, AnswerPageListModel} from "src/models/PageModel";

import AnswerWriterDialog from 'components/dialogs/AnswerWriterDialog';        
import AssetAnswerList from 'src/pages/asset/component/AssetAnswerList';


export default {
    name:'assetView',
    components: {
        Viewer,
        AnswerWriterDialog,
        AssetAnswerList
    },
    props: [],
    computed: {
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
        logger.log.debug("AssetQAView.mounted - param=",this.$route.params);
        
        this.v_question.id = this.$route.params.id;
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
                _this.setContent(_this.v_question.description);
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

            let a_post = new AnswerPageModel();
            a_post.question_id = this.v_question.id;
            a_post.title = this.v_question.title;
            a_post.setContentType(CONST.CONENT_TYPE_ASSET_ANSWER);

            //logger.log.debug("AssetQAView.onClickAnswer - a_post=",a_post);

            this.$refs.answerWriter.show(a_post);
        },

        onClickQuestionVote: function(value) {
            logger.log.debug("AssetQAView.onClickQuestionVote - value=",value);
            
            let dic_param = {value:value};
            this.v_question.vote(dic_param).then(response=>{
                logger.log.debug("AssetQAView.onClickQuestionVote - response=",response);
            }).catch(err=>{
                logger.log.debug("AssetQAView.onClickQuestionVote - err=",err);
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
 

