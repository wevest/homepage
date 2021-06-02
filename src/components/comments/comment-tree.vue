<template>

    <div class="comment-tree">
        <div class="editor-wrapper" ref="editorEl" v-show="editorVisible">
            <slot name="editor">
                <comment-form type="reply" ref="commentForm" @onClickCommentSave="onClickCommentSave"> </comment-form>
            </slot>
        </div>

        <comment-list ref="commentList" :dataList="renderData" 
            @onClickMore="onClickMore">
        </comment-list>
    </div>

</template>


<script>
import logger from "src/error/Logger";
import CommentForm from 'src/components/comments/comment-form'
import CommentList from 'src/components/comments/comment-list'


function normalizeData(dataList, renderLayer, level) {
    // console.log('dataList', dataList)

    dataList.forEach(item => {
        if (renderLayer === 1) {
        item.children = []
        return
        }

        if (level + 1 === renderLayer) {
        const subs = []

        ;(item.children || []).forEach(function addSub(item) {
            subs.push({ ...item, children: [] })
            ;(item.children || []).forEach(addSub)
        })

        subs.forEach((sub, index, array) => {
            const replyToUser = array.find(item => item.id === sub.parentID)

            if (replyToUser) {
            sub.replyToUser = replyToUser
            delete sub.replyToUser.replyToUser
            }
        })
        item.children = subs
        return
        }

        normalizeData(item.children || [], renderLayer, level + 1)
    })

    return dataList
}


export default {
    name: 'comment-tree',
    components: {
        CommentList,
        CommentForm
    },
    data() {
        return {
            editorVisible: false,
            Texttype: 'text'
        }
    },
  
    provide() {
        const provided = { $messageTree: this }
        Object.defineProperty(provided, '$editor', {
            get: () => this.$refs.editorEl
        })
        return provided
    },

    props: {
        dataList: {
            type: Array,
            default: () => []
        },
        renderLayer: {
            validator(value) {
                return Number.isInteger(value) && value > 0
            },
            default: 2
        },
        defaultExpandLayer: {
            validator(value) {
                return Number.isInteger(value) && value > 0
            },
            default: 2
        }
    },
    computed: {
        editorType() {
            return this.$slots.editor ? 'custom' : 'default'
        },
        expandLayer() {
        return this.defaultExpandLayer > this.renderLayer
            ? this.renderLayer
            : this.defaultExpandLayer
        },
        renderData() {
            try {
                var dataCloned = JSON.parse(JSON.stringify(this.dataList))
            } catch (error) {
                return []
            }
            return normalizeData(dataCloned, this.renderLayer, 1)
        }
    },

    methods: {
        removeEditor() {
            this.$refs.editorEl.remove();
        },
        hideEditor() {
            this.editorVisible = false;
        },
        showEditor(ownerMessage=null) {
            this.editorVisible = true;
            this.$refs.commentForm.setOwnerMessage(ownerMessage);
        },
        showLoadMore() {
            this.$refs.commentList.showLoadmore();
        },
        hideLoadMore() {
            this.$refs.commentList.hideLoadmore();
        },
        forceUpdate(comments) {
            logger.log.debug("CommentTree.forceUpdate");
            this.dataList = comments;
        },


        onClickCommentSave: function(value) {
            console.log("onClickCommentReply-",value);
            this.$emit('onClickCommentReply',value);
        },
        onClickMore: function(value) {
            logger.log.debug("CommentTree.onClickMore=",value);
            this.$emit('onClickLoadMore',value);
        },
        onClickRate: function(dic_payload) {
            logger.log.debug("CommentTree.onClickRate=",dic_payload);
        }
    }
}
</script>