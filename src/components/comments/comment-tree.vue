<template>

    <div class="comment-tree">
        <div class="editor-wrapper" ref="editorEl" v-show="editorVisible">
            <slot name="editor">
                <comment-form type="reply" ref="commentForm" 
                    :contentType="v_content_type" :post="v_post"
                    @onClickClose="onClickCommentClose"
                    @onClickCommentSave="onClickCommentSave"
                > 
                </comment-form>
            </slot>
        </div>

        <comment-list ref="commentList" 
            :dataList="renderData" :post="v_post"
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
    provide() {
        const provided = { $messageTree: this }
        Object.defineProperty(provided, '$editor', {
            get: () => this.$refs.editorEl
        })
        return provided
    },

    props: {
        post: {
            default: null,
        },
        contentType: {
            type:String,
            default:'',
        },
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
    data() {
        return {
            editorVisible: false,
            Texttype: 'text',
            
            v_content_type: this.contentType,
            v_post: this.post,
        }
    },
  

    methods: {
        removeEditor() {
            this.$refs.editorEl.remove();
        },
        hideEditor() {
            this.editorVisible = false;
        },
        showEditor(item,ownerMessage=null) {
            logger.log.debug("CommentTree.showEditor : ownerMessage=",ownerMessage);
            this.editorVisible = true;
            this.$refs.commentForm.clear();
            this.$refs.commentForm.setCommentItem(item);
            this.$refs.commentForm.setOwnerMessage(ownerMessage);
        },
        setPageParameter(next_url) {
            this.$refs.commentList.setPageParameter(next_url);
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
        },
        onClickCommentClose: function() {
            logger.log.debug("CommentTree.onClickCommentClose");
            
            this.$refs.commentForm.clear();
            this.$refs.commentForm.v_comment_item.toggleExpandPanel();
            this.removeEditor();
            this.hideEditor();
        }
    }
}
</script>