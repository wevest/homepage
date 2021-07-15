<template>

    <div>               
        
        <CommentForm ref="commentForm" type="comment"
            :contentType="v_content_type" :post="v_post"
            @onClickCommentSave="onClickCommentSave" />

        <CommentTree ref="commentTree" 
            :data-list="v_items" 
            :contentType="v_content_type" :post="v_post"
            @onClickCommentReply="onClickCommentReply"
            @onClickLoadMore="onClickLoadMore"
            @onClickRate="onClickRate"                    
        />
        
    </div>

</template>


<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import CommentForm from "components/comments/comment-form.vue";
import CommentTree from "components/comments/comment-tree.vue";
import LoadMore from "src/components/LoadMore";


export default {
    name: 'CommentBox',
	props: {
        post: {
            required:true,
            default: null,
        },
        items: {
            required:true,
            default: null,
        },
        contentType: {
            required:true,
            type:String,
            default: "",
        },
    },    
    components: {
        CommentForm,
        CommentTree,
        LoadMore
    },    
    mixins: [],
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data() {
        return {
            v_content_type: this.contentType,
            v_post: this.post,                        
            v_items: this.items,
        }
    },
    created() {
        logger.log.debug("CommentBox.created");
    },
    beforeMount() {
        logger.log.debug("CommentBox.beforeMounted");    
    },
    mounted() {
        logger.log.debug("CommentBox.mounted");

        //this.refresh();
        //this.updateRead(this.v_query.portfolio_id);
        //this.$refs.portfolioChart.update(this.v_portfolio);
    },
    beforeDestroy() {
        logger.log.debug("CommentBox.beforeDestroy");
        //this.$parent.$parent.$refs.header.setBackArrow(false,this);
    },

    methods: {
        update(post,comments) {
            logger.log.debug("CommentBox.update : comments=",comments);
            this.v_post = post;
            this.v_items = comments;
        },

        setPageParameter(next_url) {
            logger.log.debug('CommentBox.setPageParameter - ',next_url);
            this.$refs.commentTree.setPageParameter(next_url);
        },

        onClickCommentSave: function(payload) {            
            logger.log.debug('onClickCommentSave - ',payload);
            CommonFunc.showOkMessage(this,'Comments posted');  
        },


        onClickCommentReply: function(payload) {
            logger.log.debug('onClickCommentReply - ',payload);
            CommonFunc.showOkMessage(this,'Comments posted');  
        },

        onClickRate: function(dic_payload) {
            const _this = this;
            logger.log.debug("BlogPage.onClickRate=",dic_payload);

            let dic_param = {comment: dic_payload.data.id, flag:dic_payload.rate};
            this.v_post.comments.vote(dic_param).then( response => {
                CommonFunc.showOkMessage(_this,'Comments rate updated');
            });
        },

        onClickLoadMore: function() {

        }
    }
};
</script>


<style scoped>
</style>
