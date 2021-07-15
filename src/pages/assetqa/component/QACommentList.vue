<template>
    
    <div>
        <q-expansion-item
            v-model="v_expanded"
            :label="v_caption"
            header-class="text-primary text-center"
        >

            <div class="q-my-md">
                <CommentForm ref="commentEditor" type="comment"
                    :contentType="contentType" :post="data" save="custom"
                    @onClickCommentSave="onClickSaveComment" />
            </div>                                    

            <div v-if="data.comments.items && data.comments.items.length>0">
                <div class="gCommentBox q-py-md" v-for="(a_comment,index2) in data.comments.items" :key="index2">
                    <div class="row">
                        <div class="q-pr-md">
                            <WAvatar :avatar="a_comment.owner.avatar_thumb" :username="a_comment.owner.username" />
                        </div>
                        <div class="col">
                            <div class="gUserNameSM q-pt-sm"> {{a_comment.owner.username}} </div>
                            <WSubinfo username="" :pub_date="a_comment.pub_date" like_count="-1" dislike_count="-1" />
                        </div>
                        
                        <q-space />

                        <div v-if="v_is_owner(a_comment)"> 

                            <WCommandBar :data="{answer:data,comment:a_comment}" :isOwner="v_is_owner(a_comment)" 
                                shareBtn="" updateBtn="" deleteBtn="delete" 
                                @onClickDelete="onClickDeleteComment" 
                            />
    
                        </div>

                    </div>
                    
                    <div class="q-pt-md gBodySM">
                        <p> {{ a_comment.comment_text}} </p>
                    </div>
                    
                    <div>

                        <WRatingSmallButton ref="ratingButton" 
                            :data="a_comment" :likeCount="a_comment.like_count" :dislikeCount="a_comment.dislike_count" 
                            @onClickRating="onClickVoteComment" />

                    </div>            
                    
                </div>
                <q-separator size="1px" v-if="data.comments.items" />
            </div>

            <LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />
        
        </q-expansion-item>

    </div>

</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";
import LoadMore from "src/components/LoadMore";

import WAvatar from "components/WAvatar.vue";
import WSubinfo from 'components/WSubinfo';
import WCommandBar from "components/WCommandBar.vue";
import WRatingSmallButton from 'components/WRatingSmallButton';
import CommentForm from "components/comments/comment-form.vue";

import {AnswerCommentListModel} from "src/models/CommentModel";
import {QuestionPageModel, AnswerPageListModel} from "src/models/PageModel";


export default {
    name:'AnswerCommentList',
    components: {
        WAvatar,
        WSubinfo,
        LoadMore,
        WCommandBar,     
        WRatingSmallButton,   
        CommentForm
    },
	props: {
        data: {
            required: false,
            default: null,
        },
        contentType: {
            required: false,
            default: null,
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
        v_is_owner() {
            return (comment) => {
                if (this.v_me.id==comment.owner.id) {
                    return true;
                }
                return false;
            }
        },
        v_caption() {
            if (this.v_expanded) {
                return "Collapse";
            }
            return "Expand";
        }
    },

    data() {
        return {
            v_data: this.data,
            v_expanded: false,
        }
    },

    methods: {
        setPageParameter: function(response) {
            //logger.log.debug("AssetAnswerList.setPageParameter:response=",response);
            this.$refs.loadMore.setPageParameter(response.data.next);
        },

        loadComments: function() {
            const _this=this;

            logger.log.debug("AssetAnswerList.loadComments");    
            
			const a_limit = this.$refs.loadMore.v_next.limit;
			const a_offset = this.$refs.loadMore.v_next.offset;
            
            this.v_data.loadComment(a_offset,a_limit).then( response => {                    
                logger.log.debug("AssetAnswerList.loadAnswerComments : resp=",response);                    
                _this.setPageParameter(response);
            }).catch( err => {

            });

        },

        //onClickDeleteComment: function(answer,comment) {
        onClickDeleteComment: function(data) {
            logger.log.debug("AssetAnswerList.onClickDeleteComment:data=",data);
            
            const _this=this;            
            data.comment.remove().then(response=>{
                logger.log.debug("AssetAnswerList.onClickDeleteComment : response=",response);
                data.answer.comments.delete(data.comment.id);                
                //_this.$emit("onCommentDelete",{answer:data.answer,comment:data.comment});
                CommonFunc.showOkMessage(_this,"Comment Deleted");
            }).catch(err=>{
                logger.log.debug("AssetAnswerList.onClickDeleteComment : err=",err);
                CommonFunc.showErrorMessage(_this,"Comment Deleted Error");
            });
        },

        onClickVoteComment: function(dicParam) {
            const _this = this;

            logger.log.debug("AssetAnswerList.onClickVoteComment=",dicParam);
                                    
            let dic_param = {method:'vote',value:-1};

            if (dicParam.value=="like") {
                dic_param.value = 1;
            }
            
            let comment = dicParam.data;
            comment.vote(dic_param).then(response=>{
                logger.log.debug("AssetList.onClickVoteComment - response",response);
                CommonFunc.showOkMessage(_this,"Comments Voted");
            }).catch(err=>{
                logger.log.error("AssetList.onClickVoteComment - error",err);
                CommonFunc.showErrorMessage(_this,"Comments Voting Error");
            });

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

        onClickLoadMore: function() {
            logger.log.debug("AssetAnswerList.onClickLoadMore");
            this.loadComments();
        }
    }

};

</script>
<style scoped>

</style>