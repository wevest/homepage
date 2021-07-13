<template>

    <div>
        <ul>
            <li v-for="(item,index) in dataList" :key="index">
                <comment-item :data="item" :post="v_post"></comment-item>
            </li>
        </ul>

        <LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />
        
        <!--
        <div class="column" v-if="v_visible_loadmore">
            <q-btn @click="onClickLoadMore" label="LoadMore" />
        </div>        
        -->

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
        setPageParameter: function(next_url) {
            this.$refs.loadMore.setPageParameter(next_url);
        },

        onClickLoadMore: function(dic_page) {
            logger.log.debug("onClickLoadMore:dic_page=",dic_page);
            
            this.$emit("onClickMore",dic_page);
        }
    }
};

</script>


<style>
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>