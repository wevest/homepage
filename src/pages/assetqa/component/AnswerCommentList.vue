<template>
    
    <div v-if="data.comments && data.comments.length>0">
        <div class="gCommentBox" v-for="(a_comment,index2) in data.comments" :key="index2">
            <div class="row gCommentAvatarBox">
                <div class="gCommentAvatar">
                    <WAvatar :avatar="a_comment.owner.avatar_thumb" :username="a_comment.owner.username" />
                </div>
                <div class="col gCommentUserDateBox">
                    <div> {{a_comment.owner.username}} </div>
                    <WSubinfo username="" :pub_date="a_comment.pub_date" like_count="-1" dislike_count="-1" />
                </div>
            </div>
            
            <div class="gCommentText">
                <p> {{ a_comment.comment_text}} </p>
            </div>
            
            <div class="row">

                <q-space />

                <div class="gCommentRatingBox">
                    <q-btn v-if="v_is_owner(a_comment)" label="delete" @click="onClickDeleteComment(a_answer,a_comment)" />

                    <q-icon 
                        class="gCommentRatingBtn"
                        name="thumb_up"
                        @click="onClickVoteComment(1,a_comment)" />&nbsp;
                        <span class="gCommentRatingCount"> {{ a_comment.like_count}} </span>&nbsp;
                    <q-icon 
                        class="gCommentRatingBtn"
                        name="thumb_down"                                                                                                   
                        @click="onClickVoteComment(-1,a_comment)" />&nbsp;
                        <span class="gCommentRatingCount"> {{ a_comment.dislike_count}} </span>
                </div>                          

            </div>
        </div>
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

import {AnswerCommentListModel} from "src/models/CommentModel";
import {QuestionPageModel, AnswerPageListModel} from "src/models/PageModel";


export default {
    name:'AnswerCommentList',
    components: {
        WAvatar,
        WSubinfo,
        LoadMore,
        WCommandBar,
        WRatingButton
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
    },
    data () {
      return {
            v_data: this.data,
        },
    },

    methods: {
     
        onClickDeleteComment: function(answer,comment) {
            logger.log.debug("AssetAnswerList.onClickDeleteComment=",answer,comment);
            
            const _this=this;

            store.getters.components.getComponent('confirmDialog').show('Do you want to delete?',function(value) {
                logger.log.debug("AssetQAView.onClickAnswer - confirm=",value,_this.$route);
                if (! value) return;

                comment.remove().then(response=>{
                    logger.log.debug("AssetAnswerList.onClickDeleteComment : response=",response);
                    _this.v_answers_comments.remove(answer.comments,comment.id);                
                    CommonFunc.showOkMessage(_this,"Answer comment Deleted");
                }).catch(err=>{
                    logger.log.debug("AssetAnswerList.onClickDeleteComment : err=",err);
                    CommonFunc.showErrorMessage(_this,"Answer Deleted Error");
                });
            });

        }
     
    }

};

</script>
