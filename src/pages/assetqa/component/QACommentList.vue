<template>
    
    <div>
        <div v-if="data.comments.items && data.comments.items.length>0">
            <div class="gCommentBox" v-for="(a_comment,index2) in data.comments.items" :key="index2">
                <div class="row q-py-md">
                    <div class="q-pr-md">
                        <WAvatar :avatar="a_comment.owner.avatar_thumb" :username="a_comment.owner.username" />
                    </div>
                    <div class="col">
                        <div class="q-pt-sm"> {{a_comment.owner.username}} </div>
                        <WSubinfo username="" :pub_date="a_comment.pub_date" like_count="-1" dislike_count="-1" />
                    </div>
                    
                    <q-space />

                    <div v-if="v_is_owner(a_comment)"> 


                        <WCommandBar :data="{answer:data,comment:a_comment}" :isOwner="v_is_owner(a_comment)" 
                            shareBtn="" updateBtn="" deleteBtn="delete" 
                            @onClickDelete="onClickDeleteComment" 
                        />
<!--
                        <q-icon
                            class="deleteBtn" 
                            name="delete_outline" 
                            v-if="v_is_owner(a_comment)"
                            @click="onClickDeleteComment(data,a_comment)" 
                            />
-->                                            
                    </div>

                </div>
                
                <div class="gCommentText">
                    <p> {{ a_comment.comment_text}} </p>
                </div>
                
                <div class="row">

                    <q-space />

                    <WRatingSmallButton ref="ratingButton" 
                        :data="a_comment" :likeCount="a_comment.like_count" :dislikeCount="a_comment.dislike_count" 
                        @onClickRating="onClickVoteComment" />

                </div>
            </div>
<q-separator size="1px" />
        </div>

        <LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />
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
    },
	props: {
        data: {
            required: false,
            default: null,
        },
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
    },

    data() {
        return {
            v_data: this.data,
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
        
        onClickLoadMore: function() {
            logger.log.debug("AssetAnswerList.onClickLoadMore");
            this.loadComments();
        }
    }

};

</script>
<style scoped>

</style>