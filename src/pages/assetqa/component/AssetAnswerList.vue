<template>

    <div class="col">
        <div class="gcomment" v-for="(a_answer,index) in v_answers.items" :key="index">
            <div class="row gAnswerBox">
                <div>
                    <WAvatar :avatar="a_answer.owner.avatar_thumb" :username="a_answer.owner.username" />
                </div>

                <div class="col gAnswerUserDatetime">
                    <div class="gAnswerUser">
                        {{a_answer.owner.username}}&nbsp;님 답변 
                    </div>

                    <div class="row">                        
                        
                        <WSubinfo username="" :pub_date="a_answer.pub_date" 
                            :like_count="a_answer.like_count" :dislike_count="a_answer.dislike_count" />
                    
                        <q-space />
                    
                        <WCommandBar :data="a_answer" :isOwner="a_answer.is_owner" 
                            shareBtn="" updateBtn="update" deleteBtn="delete" 
                            @onClickUpdate="onClickAnswerUpdate" 
                            @onClickDelete="onClickAnswerDelete" 
                        />
                        
                    </div>

                    <div class="gAnswerAcceptBox">
                        <span v-if="v_question.is_owner && (! v_question.closed)">
                            <q-btn class="AnswerAcceptBtn"
                                dense
                                size="15px"
                                label="Accept" 
                                @click="onClickAccept(a_answer)" /> 
                        </span>                                
                    </div>

                </div>
            </div>

            <q-separator />

            <div class="gAnswerContent">
                <div v-html="a_answer.body">  </div>

                <div class="accepted">
                    <q-icon name="done_all" v-if="a_answer.answered" />
                </div>

            </div>
            <div class="gAnswerRatingBox">              
                <WRatingButton ref="ratingButton" 
                    :data="a_answer"
                    likeCaption="도움돼요" dislikeCaption="도움 안돼요"
                    @onClickRating="onClickRating" />
            </div>

            <q-separator size="2px" />

            <div>
                
                <div class="CommentBox">
                    <span class="Comments">Comments :</span> 
                    <span class="CommentsCount"> {{a_answer.comments.length}}</span>
                </div>

                <div>
                    <CommentForm ref="commentEditor" type="comment"
                        :contentType="v_conent_type" :post="a_answer" save="custom"
                        @onClickCommentSave="onClickSaveComment" />
                </div>                                    
                
                <AnswerCommentList ref="commentList" 
                    :data="a_answer" 
                    @onCommentDelete="onClickDeleteComment" />

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
import logger from "src/error/Logger";
import LoadMore from "src/components/LoadMore";
import CommentForm from "components/comments/comment-form.vue";

import WAvatar from "components/WAvatar.vue";
import WSubinfo from 'components/WSubinfo';
import WCommandBar from "components/WCommandBar.vue";
import WRatingButton from 'components/WRatingButton';

import AnswerCommentList from "src/pages/assetqa/component/AnswerCommentList.vue";

import {AnswerCommentListModel} from "src/models/CommentModel";
import {QuestionPageModel, AnswerPageListModel} from "src/models/PageModel";

export default {
    name:'assetAnswerList',
    components: {
        WAvatar,
        LoadMore,
        WSubinfo,
        WCommandBar,
        WRatingButton,
        AnswerCommentList,
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
        v_is_owner() {
            return (comment) => {
                if (this.v_me.id==comment.owner.id) {
                    return true;
                }
                return false;
            }
        },
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,MoaConfig.setting.maxTitleLength);
            };
        }
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
        
        v_conent_type: "blog.postpage",
        v_post:null,

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
                logger.log.debug("AssetAnswerList.loadAnswers : response=",response);
                _this.v_answers_comments.load(question_id).then( resp => {                    
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

        updateAcceptedAnswer(response) {
            logger.log.debug("assetAnswerList.updateAcceptedAnswer : response=",response);            
            this.v_answers.updateAcceptance(response.answer_id);
        },



        onClickRating: function(dicParam) {
            //value,question
            logger.log.debug('onClickRating : json_question = ',dicParam);
            //let dic_param = {'rtype':rtype, 'obj':json_review};
                                    
            const _this=this;
            let question = dicParam.data;

            let dic_param = {method:'vote',value:dicParam.value};
            question.vote(dic_param).then(response=>{
                logger.log.debug('AnswerList.onClickRating : response = ',response);    
                _this.$emit("onClickAnswerRating",question);
                CommonFunc.showOkMessage(_this,'Answer post rated');
                
            }).catch(err=>{
                CommonFunc.showErrorMessage(_this,'Answer rated error');
            });
            
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

        onClickSaveComment: function(dicParam) {
            const _this = this;

            logger.log.debug("AssetAnswerList.onClickSaveComment=",dicParam, this.$refs.commentEditor[0]);
            
            let dic_param = { 
                comment_text: dicParam.comment, 
                api_owner:this.v_me.id 
            };
            dicParam.post.comment(dic_param).then(response=>{
                _this.g_data = response.data;
                logger.log.debug("AssetList.onClickSaveComment - response",_this.g_data);                
                dicParam.post.addCommentFirst(response.data.data);
                dicParam.editor.clear();
                CommonFunc.showOkMessage(_this,"Comments Posted");

            }).catch(err=>{
                logger.log.error("AssetList.onClickSaveComment - error",err);
                CommonFunc.showErrorMessage(_this,"Comments Posted");
            });

        },


        onClickVoteComment: function(value,comment) {
            const _this = this;

            logger.log.debug("AssetAnswerList.onClickVoteComment=",comment);
                        
            let dic_param = {method:'vote',value:value};            
            comment.vote(dic_param).then(response=>{
                logger.log.debug("AssetList.onClickVoteComment - response",response);
                CommonFunc.showOkMessage(_this,"Comments Posted");
            }).catch(err=>{
                logger.log.error("AssetList.onClickVoteComment - error",err);
                CommonFunc.showErrorMessage(_this,"Comments Posted");
            });

        },

        onClickAnswerUpdate:function(answer) {
            logger.log.debug("AssetAnswerList.onClickUpdate=",answer);

            store.getters.nav.add(this.$route); 

            let params = {post:answer};
            let dic_param = { name:'assetqa_answer_writer', params:params };
            this.$router.push(dic_param);
        },

        onClickAnswerDelete:function(answer) {
            logger.log.debug("AssetAnswerList.onClickAnswerDelete=",answer);

            const _this=this;

            store.getters.components.getComponent('confirmDialog').show('Do you want to delete?',function(value) {
                if (! value) return;

                _this.v_answers.remove(answer.id).then( response=> {
                    _this.$emit("onClickAnswerDelete",answer);
                    CommonFunc.showOkMessage(_this,"Answer Deleted");
                }).catch(err=>{
                    CommonFunc.showErrorMessage(_this,"Answer Deleted Error");
                });

            });

        },

        onClickDeleteComment: function(dicParam) {
            logger.log.debug("AssetAnswerList.onClickDeleteComment=",dicParam);            
            this.v_answers_comments.remove(dicParam.answer.comments,dicParam.comment.id);                
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

.accepted {
    font-size:20px;
    color:green;
}

.deleteBtn {
   color:#777777;
   font-size:14px;
}
</style>