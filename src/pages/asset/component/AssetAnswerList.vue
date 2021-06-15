<template>
<!-- comment page -->
    <div class="row">
        <div class="col">
            <div class="gcomment" v-for="(a_answer,index) in v_answers" :key="index">
                <div class="row gAnswerBox">
                    <div>
                        <q-avatar class="gAnswerAvatar">
                            <q-img :src="a_answer.user.avatar_thumb" v-if="a_answer.user.avatar_thumb.length>0" />
                            <q-icon v-else name="person" size="50px" />
                        </q-avatar>
                    </div>
                    <div class="gAnswerUserDatetime">
                        <span class="gAnswerUser">{{a_answer.user.username}}&nbsp;님 답변</span>
                        <br>
                        <span class="gAnswerDatetime">{{a_answer.pub_date}}</span>        
                    </div>
                    <q-space />
                    <div class="gAnswerAcceptBox">
                        <span>
                            <q-btn class="AnswerAcceptBtn"
                                dense
                                size="15px"
                                label="Accept" 
                                @click="onClickAccept(a_answer)" /> 
                        </span>                                
                    </div>
                </div>

                <q-separator />

                <div class="gAnswerContent" @click="onClickQuestion(a_question)">
                    <div v-html="a_answer.content">  </div>
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

                <div v-if="a_answer.comments.length>0">
                    
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
                                        <q-img :src="a_comment.api_owner.avatar_thumb" v-if="a_comment.api_owner.avatar_thumb.length>0" />
                                        <q-icon v-else name="person" size="50px" />                                    
                                    </q-avatar>
                                </div>
                                <div class="col gCommentUserDateBox">
                                    <div class="gCommentUserName">
                                        <span>{{ a_comment.api_owner.username}}</span>
                                    </div>
                                    <div class="gCommentDatetime">
                                        <span>{{ a_comment.pub_date}}</span>
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
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import CMSAPI from 'src/services/cmsService';
import logger from "src/error/Logger";
import CommentTree from "components/comments/comment-tree.vue";
import CommentForm from "components/comments/comment-form.vue";


export default {
    name:'assetAnswerList',
    components: {
        CommentTree,
        CommentForm
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

        v_answers: [],
        v_visible_loadmore: false,
      }
    },

    mounted: function() {
        //logger.log.debug("AssetQAView.mounted - param=",this.$route.params);
        this.g_question_id = 24;
        //this.loadAssetAnswerComment(this.g_question_id);
    },
    
    methods: {

        loadAssetAnswer: function(question_id) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                let dic_param = {};
                logger.log.debug("AssetList.loadAssetPage - dic_param=",dic_param);

                CMSAPI.getAssetPage(dic_param,function(response) {
                    _this.g_data.answers = response.data;
                    logger.log.debug("AssetList.loadAssetPage - response",_this.g_data.answers);
                    _this.updateAssetPage(_this.g_data.answers.results);
                    resolve();
                },function(err) {
                    logger.log.error("AssetList.loadAssetPage - error",err);
                    reject();
                });
            });            
        },
        
        loadAssetAnswerComment: function(question_id) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let dic_param = {question_id:_this.g_question_id};
                logger.log.debug("AssetList.loadAssetAnswerComment - dic_param=",dic_param);

                CMSAPI.getAssetAnswerComment(dic_param,function(response) {
                    _this.g_data.comments = response.data;
                    logger.log.debug("AssetList.loadAssetAnswerComment - response",_this.g_data.comments);
                    _this.appendAssetAnswerComments(_this.g_data.comments.results);
                    resolve();
                },function(err) {
                    logger.log.error("AssetList.loadAssetAnswerComment - error",err);
                    reject();
                });
            });            
        },
        
        updateAssetAnswer:function(answers) {
            logger.log.debug("updateAssetAnswer=",answers);

            let v_answers = [];
            for (let index=0; index<answers.length;index++) {
                let a_answer = {
                    id:answers[index].id, 
                    title:answers[index].title,
                    pub_date: CommonFunc.minifyDatetime(answers[index].pub_date),
                    content: answers[index].answer_text,
                    user: answers[index].api_owner,
                    question_id: answers[index].question_id,
                    closed: answers[index].closed,
                    like_count: answers[index].like_count,
                    dislike_count: answers[index].dislike_count,
                    comments: [],
                };
                v_answers.push(a_answer);
            }

            this.loadAssetAnswerComment(this.g_question_id);

            this.v_answers = v_answers;
        },

        appendAssetAnswerComments: function(comments) {
            logger.log.debug('appendAssetAnswerComments : comments=',comments);

            let v_answers = this.v_answers;
            for (let index=0; index<comments.length;index++) {

                let a_found = -1;
                for (let index2=0; index2<v_answers.length;index2++) {
                    //logger.log.debug("appendAssetAnswerComments : answer_id =",v_answers[index2].id);
                    console.log("appendAssetAnswerComments : answer_id =",v_answers[index2].id,comments[index].answer_id);
                    if (v_answers[index2].id==comments[index].answer_id) {
                        a_found = index2;
                        logger.log.debug("appendAssetAnswerComments : found=",a_found);    

                        break;
                    }
                }

                if (a_found>-1) {
                    logger.log.debug("appendAssetAnswerComments : v_answers=",v_answers[a_found]);
                    v_answers[a_found].comments.push( comments[index] );
                }
            }
            logger.log.debug("Answers-comments=",v_answers);
            this.v_answers = v_answers;
        },

        update: function(json_data) {
            this.g_data = json_data;
                        
            if (this.g_data.next) {
                this.v_visible_loadmore = true;
            } else {
                this.v_visible_loadmore = false;
            }

            this.updateAssetAnswer(json_data.results);
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
                object_pk:this.v_post.id, token:MoaConfig.auth.token,
                name:MoaConfig.auth.username,  email:'', followup:'FALSE', reply_to:0,
                comment:payload.comments,                
            };

            logger.log.debug('onClickCommentSave - ',payload,dic_param);
            this.postComment(dic_param);
        },

        onClickCommentReply: function(payload) {
            let dic_param = {content_type:"blog.postpage",
                object_pk:this.v_post.id, token:MoaConfig.auth.token,
                name:MoaConfig.auth.username,  email:'', followup:'FALSE', reply_to:payload.data.id,
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
                token:MoaConfig.auth.token, api_owner:MoaConfig.auth.id 
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
            
            
            let dic_param = {id:jsonComment.id,method:'vote',value:value, token:MoaConfig.auth.token};
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


.boxAnswerRating {
    padding: 5px 0px;
    text-align:center;
}
.boxAnswerCommentItem {
    padding: 5px 0px 11px 0px;
    border-bottom:1px solid #cccccc;
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