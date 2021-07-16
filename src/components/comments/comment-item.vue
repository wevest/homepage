<template>
    <dl>
        <dt>
            <div class="q-my-md">
                <div class="boxCommentItem">
                    <div class="Avatar">                
                        <WAvatar :avatar="data.user_avatar" :username="data.user_name" />
                    </div>
                    <div class="boxCommentData q-pt-sm q-ml-md">

                        <div class="row">
                            <div>
                                <div class="gUserNameSM">
                                    <span>{{ data.user_name }}</span>
                                </div>
                                
                                <div>
                                    <WSubinfo username="" :pub_date="data.submit_date" like_count="-1" dislike_count="-1" />
                                </div>

                            </div>

                            <q-space />

                            <div v-if="v_is_owner(data) && (! data.is_removed)">                         
                                <WCommandBar :data="data" :isOwner="v_is_owner(data)" 
                                    shareBtn="" updateBtn="" deleteBtn="delete" 
                                    @onClickDelete="onClickDelete" />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p class="gCommentMD q-pt-md">
                        {{ data.comment }}                    
                    </p>
                    <!--
                    <span v-if="data.replyToUser">//@{{ data.replyToUser.user_name }}:{{data.replyToUser.comment}}</span>
                    -->
                </div>
                <q-space />
                
                <div class="row">      
                    <div class="q-pb-sm">
                        <WRatingSmallButton ref="ratingButton" 
                            :data="data" :likeCount="data.like_count" :dislikeCount="data.dislike_count" 
                            @onClickRating="onClickLike" />
                    </div>                

                    <div class="q-ml-md" v-if="data.level==0">
                        <q-btn 
                            class="gButtonSM" flat dense type="text"                                
                            @click="replyHandler('editorContainer')" 
                            v-if="data.children && data.children.length==0">
                            Reply
                        </q-btn>
                        <q-btn
                            class="gButtonSM" flat dense type="text"
                            @click="toggleExpandPanel"
                            v-if="data.children && data.children.length" >
                            {{
                                isExpanded ? `Collapse` : `${replyCount} Reply`
                            }}
                            <i
                                :class="
                                    !isExpanded ? 'el-icon-arrow-down' : 'el-icon-arrow-up'
                                "
                            ></i>
                        </q-btn>
                    </div>
                    
                </div>
                <div class="editor-container" ref="editorContainer"></div>
            </div>    
            <q-separator />
            
        </dt>

        
        <q-expansion-item v-model="isExpanded" v-if="replyCount" dense dense-toggle label="" label-lines="0"
            icon="" expand-icon="1" expanded-icon="1" header-class="1" header-style="display:none;">

            <dd class="reply-container" ref="messageTreeContainer">
                <comment-list :dataList="data.children"></comment-list>
                <div class="editor-container" ref="editorContainer2"></div>
            </dd>

        </q-expansion-item>
        
    </dl>
</template>


<script>
import {store} from "src/store/store";
import logger from "src/error/Logger";
import CommonFunc from 'src/util/CommonFunc';

import WAvatar from "src/components/WAvatar";
import WSubinfo from 'components/WSubinfo';
import WCommandBar from "components/WCommandBar.vue";
import WRatingSmallButton from 'components/WRatingSmallButton';

export default {
    name: "CommentItem",
    components: {
        WAvatar,
        WSubinfo,
        WCommandBar,
        WRatingSmallButton,
        CommentList: () => import("components/comments/comment-list"),    
    },
    inject: {
        level: {
            default: 0,
        },
        $editor: "$editor",
        $messageTree: "$messageTree",
    },
    provide() {
        return {
            level: this.level + 1,
        };
    },
    props: {
        post: {
            default: null,
        },
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        return {
            isExpanded: this.$messageTree.expandLayer > this.level,
            hasEditor: false,

            //v_post: this.post,
        };
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_is_owner() {
            return (comment) => {
                
                if (! this.v_me.loggedIn) {
                    return false;
                }

                if (! this.v_me.username) {
                    return false;
                }

                if (this.v_me.username==comment.user_name) {
                    return true;
                }
                return false;
            };
        },
        replyCount() {
            return this.data.children && this.data.children.length;
        },
        likeCount() {
          return this.getFlagCount('like');
        },
        dislikeCount() {
          return this.getFlagCount('dislike');
        },
    },
    watch: {
        "$messageTree.expandLayer": function (value) {
            //console.log("value=",value);
            this.isExpanded = value > this.level;
        },
        isExpanded(value) {
            console.log("watch.value=",value);
            this.$messageTree.$emit("tree-expanded", this.data, value);
            if (!value) {
                if (! CommonFunc.isEmptyObject(this.$refs.messageTreeContainer)) {
                  if (!this.$refs.messageTreeContainer.contains(this.$editor)) {
                      return;
                  }
                  this.$editor.remove();
                }
            }
        },
    },

    mounted() {
        const _this = this;
        //console.log("comment-item.mounted : level=",this.level);
        this.isExpanded = false;

        this.$refs.editorContainer.addEventListener(
            "DOMNodeInserted",
            function (e) {
                if (e.target === _this.$editor && e.relatedNode === this) {
                    _this.hasEditor = true;
                }
            }
        );
        this.$refs.editorContainer.addEventListener(
            "DOMNodeRemoved",
            function (e) {
                if (e.target === _this.$editor && e.relatedNode === this) {
                    _this.hasEditor = false;
                }
            }
        );
    },
    updated() {
      
    },

    filters: {
        //dateFormat,
    },
    methods: {
        getMinifiedDatetime(value) {
            //console.log('getMinifiedDatetime(value)',value);
            return CommonFunc.minifyDatetime(value,1);
        },

        loadMore() {
            const payload = { ...this.data };
            delete payload.children;
            this.$emit("load-more", payload);
        },

        getFlagCount(flag) {
          let count = 0;
          //logger.log.debug("Comment-Item.getFlagCount : flag=",flag);

          for (let index=0;index<this.data.flags.length;index++) {
            if (this.data.flags[index].flag==flag) {
              count += 1;
            }
          }
          return count;
        },

        onClickLike(dicParam) {            
            logger.log.debug("CommentItem.onClickLike:dicParam=",dicParam);
            //let dic_payload = {rate:dicParam.value, data:dicParam.data};
            //this.$messageTree.$emit("onClickRate", dic_payload);

            const _this=this;            
            let dic_param = {comment: dicParam.data.id, flag:dicParam.value};
            this.post.comments.vote(dic_param).then( response => {
                dicParam._this.setColor(dicParam.value);
                //CommonFunc.showOkMessage(_this,'Comments rate updated');
            });

        },

        onClickAvatar: function(username) {
            logger.log.debug("CommentItem.onClickAvatar",username);
            CommonFunc.navProfile(this,username);
        },

/*
        replyHandler(target) {
            if (!this.$refs.editorContainer.contains(this.$editor)) {
                this.$messageTree.showEditor();
                this.$refs.editorContainer.appendChild(this.$editor);
            }
            if (this.$messageTree.editorType === "default") {
                this.$nextTick(() => {
                    // this.$messageTree.$refs.textarea.focus()
                });
            } else {
                const payload = {
                    ...this.data,
                };
                delete payload.children;
                this.$messageTree.$emit("on-reply", payload);
            }
        },
*/

        replyHandler(target="editorContainer") {
            //console.log("replyHandler - 0",this.$editor);

            if (!this.$refs[target]) {                
                return;
            }

            if (!this.$refs[target].contains(this.$editor)) {                
                //this.$messageTree.setOwnerMessage(this.data);
                this.$messageTree.showEditor(this,this.data);
                this.$refs[target].appendChild(this.$editor);
            }
            
            logger.log.debug("replyHandler - 1 : parent=",this.$parent);
            if (this.$messageTree.editorType === "default") {
                logger.log.debug("replyHandler - 2");
                
                
                this.$nextTick(() => {
                    // this.$messageTree.$refs.textarea.focus()                    
                });

                //this.$messageTree.$emit("onClickCommentReply", payload);

            } else {
                logger.log.debug("replyHandler - 3");

                const payload = {
                    ...this.data,
                };
                delete payload.children;
                
                this.$messageTree.$emit("onClickCommentReply", payload);
            }
        },

        toggleExpandPanel() {
            this.isExpanded = !this.isExpanded;
            if (this.isExpanded) {
              this.replyHandler("editorContainer2");
            }
            
        },

        onClickEdit: function(comment) {
            logger.log.debug("CommentItem.onClickEdit",comment);
        },

        onClickDelete: function(comment) {
            logger.log.debug("CommentItem.onClickDelete",comment);
            
            const _this=this;

            let dic_param = {id:comment.id};
            this.post.comments.removeComment(dic_param).then(response=>{
                logger.log.debug("CommentItem.onClickDelete : response=",response);
                CommonFunc.showOkMessage(_this,'comments deleted');                                   
            }).catch(err=>{
                CommonFunc.showErrorMessage(_this,'comments deleted failed');                
            });

        },

    },
};
</script>


<style scoped>

.boxCommentItem {
    display:flex;
}

.boxCommentData {
    flex:1 auto;
}

dt {
    .boxMessage {
        width: 100%;
        font-size: 14px;
        time {
            color:#999999;
            vertical-align: middle;
        }
    }
}

dd.reply-container {
    background: #fafbfc;
    padding: 0px 15px 0px 15px;
    margin-top: 0px;
}

.loading-more {
    user-select: none;
    text-align: center;
    font-size: 14px;
    color: #444;
    cursor: pointer;
}
.message-reply-enter,
.message-reply-leave-to {
    transform: translateX(-100%);
}
.message-reply-active {
    transition: all;
}
.message-reply-move {
    transition: all;
}
.message-reply-item {
    transition: all;
}



</style>