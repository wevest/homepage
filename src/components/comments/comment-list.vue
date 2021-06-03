<template>

    <div class="comment-list">
        <ul>
            <li v-for="(item,index) in dataList" :key="index">
                <comment-item :data="item"></comment-item>
            </li>
        </ul>

        <div class="column" v-if="v_visible_loadmore">
            <q-btn @click="onClickLoadMore" label="LoadMore" />
        </div>        
    </div>

    

</template>


<script>
// Components

export default {
    name: "CommentList",
    components: {
        //CommentItem
         CommentItem: () => import('components/comments/comment-item')
    },

    props: {
        dataList: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            v_visible_loadmore:false,
        }        
    },
    methods: {
        showLoadmore: function() {
            this.v_visible_loadmore = true;
        },
        hideLoadmore: function() {
            this.v_visible_loadmore = false;
        },

        onClickLoadMore: function() {
            console.log("onClickLoadMore");
            this.$emit("onClickMore",{});
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