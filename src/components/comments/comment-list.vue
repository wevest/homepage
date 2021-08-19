<template>

    <div class="boxComment">
        <ul>
            <li v-for="(item,index) in dataList" :key="index">
                <comment-item 
                    :data="item" :post="v_post"
                    @onClickVote="onClickVote"
                ></comment-item>
            </li>
        </ul>

        <LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />
        
    </div>    

</template>


<script>
import logger from "src/error/Logger";
import LoadMore from "src/components/LoadMore";


export default {
    name: "CommentList",
    components: {
        CommentItem: () => import('components/comments/comment-item'),
        LoadMore,
    },

    props: {
        post: {
            default: null,
        },        
        dataList: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            v_post: this.post,            
        }        
    },
    methods: {
        setPost(post) {
            this.v_post = post;
            this.$refs.commentItem.setPost(this.v_post);
        },
        setPageParameter: function(result) {
            this.$refs.loadMore.setPageParameter(result);
        },

        onClickVote(dicParam) {
            logger.log.debug("CommentList.onClickVote:dicParam=",dicParam,this.v_post);
            
            this.$emit("onClickVote",dicParam);
        },

        onClickLoadMore(dic_page) {
            logger.log.debug("CommentList.onClickLoadMore:dic_page=",dic_page);
            
            this.$emit("onClickMore",dic_page);
        }
    }
};

</script>


<style>

.boxComment ul {
    list-style: none;
    margin: 0;
    padding: 0;
}

.boxComment ul li {
    list-style: none;
    margin: 0;
    padding: 0;
}

</style>