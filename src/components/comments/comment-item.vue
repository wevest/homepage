<template>
    <dl>
        <dt>
            <div class="gCommentItem">
              
                <div class="row q-gutter-sm">
                    <div class="gCommentAvatar">
                
                        <WAvatar :avatar="data.user_avatar" :username="data.user_name" />
<!--
                        <q-avatar @click="onClickAvatar(data.user_name)">
                            <q-img v-if="data.user_avatar && data.user_avatar.length>0" :src="data.user_avatar" />
                            <q-icon v-else name="person" color="black" size="34px" />
                        </q-avatar>
-->
                    </div>
                    <div>
                        <span class="gCommentUser">{{ data.user_name }}</span>
                        <br>
                        <time class="gCommentDatetime">{{ getMinifiedDatetime(data.submit_date) }}</time>
                    </div>

                    <q-space />

                        <div> 
                            <q-icon
                                class="deleteBtn" 
                                name="delete" 
                                @click="onClickDelete(data)" 
                                v-if="v_is_owner(data) && (! data.is_removed)" />
                        </div>

                </div>

                <div class="boxMessage">
                    <p class="gCommentText">
                        {{ data.comment }}                    
                    </p>
                    <!--
                    <span v-if="data.replyToUser">//@{{ data.replyToUser.user_name }}:{{data.replyToUser.comment}}</span>
                    -->
                </div>

                <div class="gCommentReplyBox">
                    <div class="row">
                        <div v-if="data.level==0">
                            <q-btn 
                                class="gCommentReplyBtn"
                                flat
                                dense                    
                                type="text"                                
                                @click="replyHandler('editorContainer')" 
                                v-if="data.children && data.children.length==0">
                                Reply
                            </q-btn>
                            <q-btn
                                class="gCommentReplyBtn"
                                flat
                                size="15px"                  
                                type="text"
                                color="grey-8"
                                @click="toggleExpandPanel"
                                v-if="data.children && data.children.length" 
                            >
                              {{
                                  isExpanded
                                      ? `Collapse`
                                      : `${replyCount} Reply`
                              }}
                              <i
                                  :class="
                                      !isExpanded
                                          ? 'el-icon-arrow-down'
                                          : 'el-icon-arrow-up'
                                  "
                              ></i>
                          </q-btn>
                        </div>

                        <q-space />
                        
                        <div class="RatingBtnBox">
                            <!--
                            <q-icon name="edit" @click="onClickEdit(data)" v-if="v_is_owner(data)" />
                            -->
                            <span>                              
                                <q-icon 
                                    class="gCommentRatingBtn"                                                                    
                                    name="thumb_up_off_alt"
                                    @click="onClickLike('like',data)" />
                                    <span class="gCommentRatingCount">{{ data.like_count }}</span>
                            </span>&nbsp;
                              
                            
                            <span>
                                <q-icon 
                                    class="gCommentRatingBtn"                                                             
                                    name="thumb_down_off_alt"
                                    @click="onClickLike('dislike',data)"> 
                                </q-icon>
                                <span class="gCommentRatingCount">{{ data.dislike_count }}</span>
                            </span>
                        </div>


                    </div>
                </div>
                 <q-separator />
                <div class="editor-container editor-box" ref="editorContainer"></div>            
            </div>
            
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



export default {
    name: "CommentItem",
    components: {
        WAvatar,
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

        onClickLike(rate,item) {
            logger.log.debug("CommentItem.onClickLike",item);
            let dic_payload = {rate:rate, data:item};
            this.$messageTree.$emit("onClickRate", dic_payload);
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


   
.editor-box {
    margin-top:15px;
}

.RatingBtnBox {
    padding-top:7px;

}

.deleteBtn {
   font-size:18px;
   color:#777777;
}

</style>