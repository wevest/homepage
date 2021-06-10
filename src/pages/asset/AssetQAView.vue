<template>

    <div class="q-pa-md">

        <div class="row">
            <div class="col">

                <p> {{ v_question.title }} </p>
                <Viewer 
                    ref="toastViewer"
                    :value="v_question.content"
                    :options="editorOptions"
                    :visible="v_show_editor"
                    previewStyle="vertical"
                    height="300px"
                />
                <p> {{ v_question.tags }} </p>
                <div class="boxRate-parent">
                    <div class="q-pa-md q-gutter-sm boxRate">
                        <q-btn label="Answer" @click="onClickAnswer" />

                        <q-btn 
                            push
                            class="rateButton"
                            rounded
                            size="13px"
                            color="primary" 
                            icon="thumb_up" 
                            label="" 
                            @click="onClickBlogRate('like')"/>
                        <q-btn
                            push
                            class="rateButton"
                            rounded
                            size="13px"
                            color="indigo"
                            icon="thumb_down"
                            label=""
                            @click="onClickBlogRate('dislike')" />
                    </div>
                </div>
            </div>
        </div>

<!--
        <div class="row">
            <div class="col">
                <q-expansion-item
                    v-model="v_show_editor"
                    v-if="v_show_editor"
                    icon="" expand-icon="1" expanded-icon="1" header-class="1" header-style="display:none;"
                >
                    <Editor 
                        ref="toastEditor"
                        :value="v_answer.content"
                        :options="editorOptions"
                        :visible="editorVisible"
                        :initialValue="editorHtml"
                        previewStyle="vertical"
                        height="400px"
                        mode="wysiwyg"
                        initialEditType="wysiwyg"
                    />
                    
                    <div>
                        <q-btn label="save" @click="onClickSave" /> 
                        <q-btn label="clear" @click="onClickClear" /> 
                        <q-btn label="close" @click="onClickClose" /> 
                    </div>

                </q-expansion-item>
            </div>
        </div>
-->
        <div class="row">
            <div class="col">
                <AssetAnswerList ref="answerList" 
                    @onClickAnswerRating="onClickAnswerRating"
                    @onClickQuestionAccept="onClickQuestionAccept"
                > 
                </AssetAnswerList>
            </div>
        </div>

        <AnswerWriterDialog ref="answerWriter"> </AnswerWriterDialog>
    </div>
          
</template>

        
<script>
import 'codemirror/lib/codemirror.css'; 
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from "@toast-ui/vue-editor";
import { Editor } from '@toast-ui/vue-editor';

import { CONST } from 'src/data/const';
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import CMSAPI from 'src/services/cmsService';
import logger from "src/error/Logger";

import PostModel from "src/store/PostModel";

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

    data: function() {
        return {
            g_data: {
                answer:null,
            },

            v_question: {            
                title:'Title', content:'body text', tags:'crypto,btc,eth', 
                comment:'comments',like_count:0, dislike_count:0, read_count:0, is_owner:false
            },
            
            v_answer: {
                id:-1,
                content: 'answer'
            },
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
        this.v_question = this.$route.params;
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

            this.setContent(this.v_question.content);
            this.loadAssetAnswer(this.v_question.id);
        },

        loadAssetAnswer: function(question_id) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let dic_param = {question_id:question_id};
                logger.log.debug("AssetList.loadAssetAnswer - dic_param=",dic_param);

                CMSAPI.getAssetAnswer(dic_param,function(response) {
                    _this.g_data.answer = response.data;
                    logger.log.debug("AssetList.loadAssetAnswer - response",_this.g_data.answer);
                    _this.updateAssetAnswer(_this.g_data.answer);
                    resolve();
                },function(err) {
                    logger.log.error("AssetList.loadAssetAnswer - error",err);
                    reject();
                });
            });            
        },

        updateAssetAnswer: function(response) {
            logger.log.debug("AssetQAView.updateAssetAnswer");
            this.$refs.answerList.update(response);
        },


        onClickAnswer: function() {
            logger.log.debug("AssetQAView.onClickAnswer - v_question=",this.v_question);

            let a_post = new PostModel();
            a_post.question_id = this.v_question.id;
            a_post.title = this.v_question.title;
            a_post.setContentType(CONST.CONENT_TYPE_ASSET_ANSWER);

            logger.log.debug("AssetQAView.onClickAnswer - a_post=",a_post);

            this.$refs.answerWriter.show(a_post);
        },

        onClickSave: function() {
            logger.log.debug("AssetQAView.onClickSave");

            const _this = this;
            const a_text = this.$refs.toastEditor.invoke('getHtml');

            let dic_param = {
                question_id: this.v_question.id ,
                tags:this.v_question.tags, 
                text:a_text, 
                title: this.v_question.title,
                token:MoaConfig.auth.token,
            };

            CMSAPI.postAssetAnswer(dic_param,function(response) {
                logger.log.debug("onClickSave : response=",response);
                _this.setPageID(response.data.id);
                CommonFunc.showOkMessage(_this,'Answer posted');
            }, function(error) {
                CommonFunc.showErrorMessage(_this,'Blog posted');
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
            const _this = this;

            logger.log.debug("AssetQAView.onClickAnswerRating",dic_param);
            
            dic_param.token = MoaConfig.auth.token;
            dic_param.method = 'vote';

            CMSAPI.voteAssetAnswer(dic_param,function(response) {
                logger.log.debug('AssetView.onClickAnswerRating - response = ',response);
                CommonFunc.showOkMessage(_this,'Answer posted');
            }, function(err) {
                CommonFunc.showErrorMessage(_this,'Answer posted');
            });
        },

        onClickQuestionAccept: function(dic_param) {
            const _this = this;

            logger.log.debug("AssetQAView.onClickQuestionAccept",dic_param);
            
            dic_param.token = MoaConfig.auth.token;
            dic_param.method = 'vote';

            return;

            CMSAPI.voteAssetAnswer(dic_param,function(response) {
                logger.log.debug('AssetView.onClickAnswerRating - response = ',response);
                CommonFunc.showOkMessage(_this,'Answer posted');
            }, function(err) {
                CommonFunc.showErrorMessage(_this,'Answer posted');
            });

        }
    },

}
</script>


<style>

.body-content {
    font-size:17px;
    color:#888
}

</style>