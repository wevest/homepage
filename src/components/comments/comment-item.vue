<template>
    <dl>
        <dt>
            <div class="boxCommentMessage">
              
                <div class="row q-gutter-sm">
                  <div class="avatar-wrapper">
                
                      <q-avatar>
                          <img :src="data.user_avatar" />
                      </q-avatar>
                  </div>
                  <div>
                      <span class="nickname">{{ data.user_name }}</span>
                      <br>
                      <time class="submit_date">{{ data.submit_date }}</time>
                  </div>
                </div>

                <div class="boxMessage">

                  <p class="content">
                      {{ data.comment }}                    
                      <span v-if="data.replyToUser">//@{{ data.replyToUser.user_name }}:{{data.replyToUser.comment}}</span>
                  </p>
                </div>

                <div class="boxFooterAction">
                    <div class="row">
                      <div v-if="data.level==0">

                          <q-btn
                                class="reply-btn" 
                                type="text" 
                                flat
                                size="15px"
                                color="grey-8"
                                @click="replyHandler('editorContainer')" 
                                v-if="data.children.length==0">
                                Reply
                          </q-btn>
                          <q-btn
                              class="reply_count"   
                              color="grey-8"
                              size="15px"                  
                              flat
                              v-if="data.children && data.children.length"
                              type="text"
                              @click="toggleExpandPanel"
                          >
                              {{
                                  isExpanded
                                      ? `Collapse`
                                      : `${replyCount} Reply Count`
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
                      <div>
                          <span class="thumb-button">
                              
                              <q-icon
                                  class="q-pa-md poll_count"
                                  size="18px"
                                  color="grey-8"
                                  name="thumb_up"
                                  @click="onClickLike('like',data)"
                              ></q-icon>
                              <span class="poll_count">                                                  
                                  {{ likeCount }}
                                </span>
                              
                              <q-icon 
                                  class="q-pa-md poll_count"
                                  size="18px"
                                  color="grey-8"
                                  name="thumb_down"
                                  @click="onClickLike('dislike',data)"
                              ></q-icon>
                              <span class="poll_count">
                                  {{ dislikeCount }}
                                </span>
                          </span>
                      </div>
                    </div>
                </div>
            
                <div class="editor-container" ref="editorContainer"></div>            
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
import logger from "src/error/Logger";
import CommonFunc from 'src/util/CommonFunc';



function dateFormat(createdDate) {
    if (!createdDate instanceof Date) {
        return;
    }

    const isPositiveInteger = Date.now() - createdDate > 0 ? "前" : "后";
    const pastSeconds = Math.floor(Math.abs(Date.now() - createdDate) / 1000);

    switch (true) {
        case pastSeconds >= 3600 * 24 * 30:
            return createdDate.toLocaleString();

        case pastSeconds >= 3600 * 24:
            return (
                Math.floor(pastSeconds / 3600 / 24) + " Days" + isPositiveInteger
            );
        case pastSeconds >= 3600:
            return (
                Math.floor(pastSeconds / 3600) + " Hours" + isPositiveInteger
            );
        case pastSeconds >= 60:
            return Math.floor(pastSeconds / 60) + " Minutes" + isPositiveInteger;

        case pastSeconds >= 0:
            return "Seconds";
    }
}

export default {
    name: "CommentItem",
    components: {
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
    data() {
        return {
            isExpanded: this.$messageTree.expandLayer > this.level,
            hasEditor: false,
        };
    },
    computed: {
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
        dateFormat,
    },
    props: {
        data: {
            type: Object,
            default: () => ({}),
        },
    },
    methods: {
        loadMore() {
            const payload = { ...this.data };
            delete payload.children;
            this.$emit("load-more", payload);
        },

        getFlagCount(flag) {
          let count = 0;
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

            if (!this.$refs[target].contains(this.$editor)) {                
                //this.$messageTree.setOwnerMessage(this.data);
                this.$messageTree.showEditor(this.data);
                this.$refs[target].appendChild(this.$editor);
            }
            
            //console.log("replyHandler - 1");
            if (this.$messageTree.editorType === "default") {
              //console.log("replyHandler - 2");
                this.$nextTick(() => {
                    // this.$messageTree.$refs.textarea.focus()
                });
            } else {
                //console.log("replyHandler - 3");

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
    },
};
</script>


<style scoped>

dt {
    .avatar-wrapper {
        margin-right: 8px;
    }
    .boxMessage {
        width: 100%;
        font-size: 14px;
        time {
            color:#999999;
            vertical-align: middle;
        }

        .boxFooterAction {
            justify-content: space-between;
            align-items: center;
        }

    }
}
.nickname {
    color:#000;
    font-size:14px;
    font-weight:500;
}

.content {
    margin-top:16px;
}
.submit_date {
     color:#999999;
    font-size:12px;
}

.boxCommentMessage {
  padding-bottom:10px;
  border-bottom:1px solid #cccccc;
}

dd.reply-container {
    background: #fafbfc;
    padding: 0px 15px 0px 15px;
    margin-top: 10px;
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

.thumb-button {
    height:10px;
}

.poll_count {
    vertical-align:middle;
    font-size:15px;
    font-weight:600;
    color:#777777;
    padding-right:2px;
}

.reply-btn {
    height:12px;
}

.reply_count {
    height:12px;
    }


/*

.wrap-collabsible {
  margin-bottom: 1.2rem 0;
}

input[type='checkbox'] {
  display: none;
}

.lbl-toggle {
  display: block;

  font-weight: bold;
  font-family: monospace;
  font-size: 1.2rem;
  text-transform: uppercase;
  text-align: center;

  padding: 1rem;

  color: #A77B0E;
  background: #FAE042;

  cursor: pointer;

  border-radius: 7px;
  transition: all 0.25s ease-out;
}

.lbl-toggle:hover {
  color: #7C5A0B;
}

.lbl-toggle::before {
  content: ' ';
  display: inline-block;

  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 5px solid currentColor;
  vertical-align: middle;
  margin-right: .7rem;
  transform: translateY(-2px);

  transition: transform .2s ease-out;
}

.toggle:checked + .lbl-toggle::before {
  transform: rotate(90deg) translateX(-3px);
}

.collapsible-content {
  max-height: 0px;
  overflow: hidden;
  transition: max-height .25s ease-in-out;
}

.toggle:checked + .lbl-toggle + .collapsible-content {
  max-height: 100vh;
}

.toggle:checked + .lbl-toggle {
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.collapsible-content .content-inner {
  background: rgba(250, 224, 66, .2);
  border-bottom: 1px solid rgba(250, 224, 66, .45);
  border-bottom-left-radius: 7px;
  border-bottom-right-radius: 7px;
  padding: .5rem 1rem;
}

.q-item {
    min-height: 0px;
    padding:0px;
}
*/

</style>