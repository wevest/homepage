<template>
<!-- comment page -->
    <div class="row">
        <div class="col">
            <div class="gcomment" v-for="(a_answer,index) in v_answers.items" :key="index">
                <div class="row gAnswerBox">
                    <div>
                        <q-icon name="done" v-if="a_answer.answered" />
                        <q-icon v-else name="money" />
                    </div>

                    <div>
                        <WAvatar :avatar="a_answer.owner.avatar_thumb" :username="a_answer.owner.username" />
                    </div>
                    <div class="gAnswerUserDatetime">
                        <span class="gAnswerUser">{{a_answer.owner.username}}&nbsp;님 답변</span>
                        <br>
                        <span class="gAnswerDatetime">{{ v_updated_at(a_answer.pub_date) }}</span>        
                    </div>
                    <q-space />
                    <div class="gAnswerAcceptBox">
                        <span v-if="! v_question.closed">
                            <q-btn class="AnswerAcceptBtn"
                                dense
                                size="15px"
                                label="Accept" 
                                @click="onClickAccept(a_answer)" /> 
                        </span>                                
                    </div>
                </div>

                <q-separator />

                <div class="gAnswerContent">
                    <div v-html="a_answer.answer_text">  </div>
                </div>
                    <div class="gAnswerRatingBox">              
                        <q-btn 
                            class="gAnswerRatingBtn" 
                            icon="thumb_up" 
                            dense
                            flat 
                            @click="onClickRating(1,a_answer)" />&nbsp;                            
                        <span class="gAnswerRatingCount">{{a_answer.like_count}}</span>&nbsp;
                
                        <q-btn 
                            class="gAnswerRatingBtn"
                            icon="thumb_down"                            
                            dense
                            flat 
                            @click="onClickRating(-1,a_answer)" />&nbsp; 
                        <span class="gAnswerRatingCount">{{a_answer.dislike_count}}</span>  
                </div>

                <q-separator size="2px" />


                <div v-if="a_answer.comments && a_answer.comments.length>0">
                    
                    <div class="CommentBox">
                        <span class="Comments">Comments :</span> 
                            <span class="CommentsCount"> {{a_answer.comments.length}}</span>
                    </div>
                    
                    <div>
                        <q-input filled type="textarea" v-model="v_comment" />
                        <div class="row CommentSaveBtnBox">
                            <q-space />
                            <q-btn class="CommentSaveBtn" label="Save" @click="onClickSaveComment(a_answer)" />
                        </div>
                    </div>

                    <q-separator size="2px" />

                    <div>
                        <div class="gCommentBox" v-for="(a_comment,index2) in a_answer.comments" :key="index2">
                            <div class="row gCommentAvatarBox">
                                <div class="gCommentAvatar">
                                    <q-avatar>
                                        <q-img :src="a_comment.owner.avatar_thumb" v-if="a_comment.owner.avatar_thumb.length>0" />
                                        <q-icon v-else name="person" size="50px" />                                    
                                    </q-avatar>
                                </div>
                                <div class="col gCommentUserDateBox">
                                    <div class="gCommentUserName">
                                        <span>{{ a_comment.owner.username}}</span>
                                    </div>
                                    <div class="gCommentDatetime">
                                        <span>{{ v_updated_at(a_comment.pub_date) }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="gCommentText">
                                <p> {{ a_comment.comment_text}} </p>
                            </div>
                            
                            <div class="row">

                            <q-space />

                            <div class="gCommentRatingBox">
                                <q-icon 
                                    class="gCommentRatingBtn"
                                    name="thumb_up"
                                    @click="onClickLike('like',a_comment)" />&nbsp;
                                    <span class="gCommentRatingCount"> {{ a_comment.like_count}} </span>&nbsp;
                                <q-icon 
                                    class="gCommentRatingBtn"
                                    name="thumb_down"                                                                                                   
                                    @click="onClickLike('like',a_comment)" />&nbsp;
                                    <span class="gCommentRatingCount"> {{ a_comment.dislike_count}} </span>
                            </div>                          

                        </div>
                    </div>
                </div>
            </div>                
            
            </div>

        </div>

        <div v-if="v_visible_loadmore">>
            <q-btn label="load More" @click="onClickLoadMore" />
        </div>
                
    </div>
    
  
</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import CMSAPI from 'src/services/cmsService';
import logger from "src/error/Logger";
import CommentTree from "components/comments/comment-tree.vue";
import CommentForm from "components/comments/comment-form.vue";

import WAvatar from "components/WAvatar.vue";

import {AnswerCommentListModel} from "src/models/CommentModel";
import {QuestionPageModel, AnswerPageListModel} from "src/models/PageModel";

export default {
    name:'assetAnswerList',
    components: {
        WAvatar,
        CommentTree,
        CommentForm
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
    data () {
      return {
        g_data: {
            answers: null,
            comments: null,
        },
        g_question_id: null,

        v_comments: [],
        v_comment: null,
        
        v_question: new QuestionPageModel(),
        v_answers: new AnswerPageListModel(),
        v_answers_comments: new AnswerCommentListModel(),

        v_visible_loadmore: false,
      }
    },

    mounted: function() {
        //logger.log.debug("AssetQAView.mounted - param=",this.$route.params);
        //this.g_question_id = 24;
        //this.loadAssetAnswerComment(this.g_question_id);
    },
    
    methods: {
        setQuestionPage(question) {
            this.v_question = question;
        },

        update: function(question_id) {                        
            
            const _this=this;
            this.v_answers.load(question_id).then(response=>{                
                _this.v_answers_comments.load(question_id).then( resp => {
                    logger.log.debug("update");
                    _this.v_answers.addComments(_this.v_answers_comments);
                }).catch( err => {

                });

            }).catch(err=>{

            });

        },

        addAnswer(response) {
            logger.log.debug("assetAnswerList.addAnswer : response=",response);
            this.v_answers.addFirst(response.data);
        },



        onClickRating: function(value,json_question) {
            logger.log.debug('onClickRating : json_question = ',json_question);
            //let dic_param = {'rtype':rtype, 'obj':json_review};
            json_question.value = value;
            this.$emit("onClickAnswerRating",json_question);
        },

        onClickAsset: function(asset) {
          logger.log.debug('onClickBlog : asset = ',asset);
          
          let dic_param = { name:'asset', path:'asset', params:{ symbol:asset } };          
          this.$emit("onClickAsset",dic_param);          
        },

        onClickQuestion: function(jsonObject) {
            logger.log.debug('onClickQuestion - ',jsonObject);
            this.$emit("onClickQuestion",jsonObject);          
        },

        onClickLoadMore: function() {
            logger.log.debug('onClickLoadMore');
            this.$emit("onClickLoadmore",{});
        },

        onClickAccept: function(jsonObject) {
            logger.log.debug('onClickAccept - ',jsonObject);
            this.$emit("onClickQuestionAccept",jsonObject);          
        },

        onClickCommentSave: function(payload) {            
            let dic_param = {content_type:"blog.postpage",
                object_pk:this.v_post.id, 
                token:store.getters.token,
                name:this.v_me.username,  
                email:'', followup:'FALSE', reply_to:0,
                comment:payload.comments,                
            };

            logger.log.debug('onClickCommentSave - ',payload,dic_param);
            this.postComment(dic_param);
        },

        onClickCommentReply: function(payload) {
            let dic_param = {content_type:"blog.postpage",
                object_pk:this.v_post.id, 
                token:store.getters.token,
                name:this.v_me.username,  
                email:'', followup:'FALSE', reply_to:payload.data.id,
                comment:payload.comments,                
            };

            logger.log.debug('onClickCommentReply - ',payload,dic_param);
            this.postComment(dic_param);
        },


        onEditorFocus: function(event) {
            logger.log.debug("BlogPage.onEditorFocus=",event);
            this.$refs.commentForm.v_comments = "";
            this.$refs.commentForm.v_rows= "5";
            //contentInput
        },

        onEditorFocusOut: function(event) {
            logger.log.debug("BlogPage.onEditorFocusOut=",event);
            this.$refs.commentForm.v_comments = "";
            this.$refs.commentForm.v_rows= "1";
            //contentInput
        },

        onClickSaveComment: function(jsonAnswer) {
            const _this = this;

            logger.log.debug("AssetAnswerList.onClickSaveComment=",jsonAnswer);
            
            let dic_param = { 
                question_id: jsonAnswer.question_id,
                answer_id:jsonAnswer.id, comment_text: this.v_comment, 
                token:store.getters.token, api_owner:this.v_me.id 
            };
            CMSAPI.postAssetAnswerComment(dic_param,function(response) {
                _this.g_data = response.data;
                logger.log.debug("AssetList.onClickSaveComment - response",_this.g_data);
                CommonFunc.showOkMessage(_this,"Comments Posted");
            },function(err) {
                logger.log.error("AssetList.onClickSaveComment - error",err);
                CommonFunc.showErrorMessage(_this,"Comments Posted");
            });

        },

        onClickVoteComment: function(value,jsonComment) {
            const _this = this;

            logger.log.debug("AssetAnswerList.onClickVoteComment=",jsonComment);
            
            
            let dic_param = {id:jsonComment.id,method:'vote',value:value, token:store.getters.token};
            CMSAPI.voteAssetAnswerComment(dic_param,function(response) {
                //_this.g_data = response.data;
                logger.log.debug("AssetList.onClickSaveComment - response",response);
                CommonFunc.showOkMessage(_this,"Comments Posted");
            },function(err) {
                logger.log.error("AssetList.onClickSaveComment - error",err);
                CommonFunc.showErrorMessage(_this,"Comments Posted");
            });

        },

        onClickLike: function(comment) {
            logger.log.debug("AssetAnswerList.onClickLike=",comment);
        }

    }
}
</script>


<style scope>






.boxAnswerContent {
    padding:10px;
}


.CommentBox {
    margin: 8px 0px 3px 0px;
    padding-bottom:10px;
   
}

.Comments {
    font-size:16px;
    color:#000000;
    }
.CommentsCount {
    font-size:20px;
    color:green;
    }


.CommentSaveBtnBox {
    padding:10px 0px;;
    }
.CommentSaveBtn {
    color:#555555;
    width:100px;
}

.AnswerAcceptBtn {
    width:100px;
    color:#555555;
}

</style>