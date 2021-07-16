<template>

    <div>
        <!--
        <div>
            <CommentForm ref="commentEditor" type="comment"
                :contentType="v_content_type" :post="v_question" save="custom"
                @onClickCommentSave="onClickSaveComment" />
        </div>                                    
        -->

        <QACommentList ref="commentList" 
            :data="v_question" :contentType="v_content_type" formType="comment" save="custom"
            @onCommentDelete="onClickDeleteComment" />
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
import {AnswerCommentListModel} from "src/models/CommentModel";

import CommentForm from "components/comments/comment-form.vue";
import QACommentList from "src/pages/assetqa/component/QACommentList.vue";


export default {
    name:'QACommentBox',
    components: {
        CommentForm,
        QACommentList
    },
	props: {
        question: {
            required: true,
            default: null,
        },
        contentType: {
            type:String,
            default: 'blog.Post'
        }
    },
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
            v_question:this.question,
            v_content_type: this.contentType,
        }
    },
    methods: {
        setPageParameter: function(response) {
            logger.log.debug("QACommentList.setPageParameter:response=",response);
            this.$refs.commentList.setPageParameter(response);
        },        

        onClickDeleteComment: function(data) {
            logger.log.debug("QuestionCommentBox.onClickDeleteComment=",data);
            return;
        },

        onClickSaveComment: function(dicParam) {
            const _this = this;

            logger.log.debug("AssetAnswerList.onClickSaveComment : dicParam=",dicParam);

            let dic_param = { 
                comment_text: dicParam.comment, 
                api_owner:this.v_me.id 
            };
            dicParam.post.comment(dic_param).then(response=>{
                logger.log.debug("AssetList.onClickSaveComment - response",_this.g_data);                
                dicParam.post.addCommentFirst(response.data.data);
                dicParam.editor.clear();
                CommonFunc.showOkMessage(_this,"Comments Posted");

            }).catch(err=>{
                logger.log.error("AssetList.onClickSaveComment - error",err);
                CommonFunc.showErrorMessage(_this,"Comments Posted");
            });

        },

    }

};
</script>
