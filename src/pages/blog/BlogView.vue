<template>
    
    <div class="q-ma-md">
<!--
        <div class="row">
            <div class="col">
                <BlogList ref='blogList'></BlogList>
            </div>
        </div>
-->
        <div class="row">
            <div class="col">
                <div>
                    <h5 class=blog-title>{{v_post.title}}</h5>
                </div>
                <div class="blog-date">
                    <span>{{v_post.pub_date}}</span>
                </div>    
                <div class="boxRate q-pa-md">
                    <div class="float-left q-gutter-sm">   
                        <span>
                            <q-icon 
                            name="thumb_up"  
                            size="23px"
                            color="light-green-14"/>
                            <span class="poll-number">{{v_post.like_count}}</span>
                        </span>
                        <span>
                            <q-icon 
                            name="thumb_down"
                            size="23px"
                            color="deep-orange-9"/>
                            <span class="poll-number">{{v_post.dislike_count}}</span>
                        </span>
                        <span>
                            <q-icon name="thumb_up" style="font-size: 1.5rem;" />
                            <span class="poll-number">{{v_post.read_count}}</span>
                        </span>
                    </div>

                    <div class="float-right q-gutter-sm">
                        <q-btn 
                            outlined
                            size="9px"
                            color="primary"
                            icon="mode"
                            label="Write" 
                            @click="onClickWrite" />

                        <q-btn 
                            v-if="v_post.is_owner"
                            outlined
                            size="9px"
                            color="primary"
                            icon="mode"
                            label="Update" 
                            @click="onClickUpdate" />

                        <q-btn 
                            outlined
                            size="9px"
                            color="primary"
                            icon="checklist"
                            label="TEst" 
                            @click="onClickTest" />
                    </div>

                </div>

            </div>
        </div>

        <div class="row">
            <div class="col body-content">
                <Viewer 
                    ref="toastViewer"
                    :value="v_post.text"
                    :options="editorOptions"
                    :visible="editorVisible"
                    previewStyle="vertical"
                    height="200px"
                />
                <p> {{ v_post.tags }} </p>
                <div class="boxRate-parent">
                <div class="q-pa-md q-gutter-sm boxRate">
                    <q-btn 
                        push
                        class="rateButton"
                        rounded
                        size="13px"
                        color="primary" 
                        icon="thumb_up" 
                        label="" 
                        @click="onClickBlogRate('like')"/>
                    <q-btn
                        push
                        class="rateButton"
                        rounded
                        size="13px"
                        color="indigo"
                        icon="thumb_down"
                        label=""
                        @click="onClickBlogRate('dislike')" />
                </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
<!--                
                <q-btn label="comment" @click="onClickComment" />
                <q-input v-model="v_post.comment" label="Comments" />
-->                
                <div class="boxCommentCount"> 
                    <span>Comments : {{v_comments_count}}</span>
                </div>

                <CommentForm ref="commentForm" @onClickCommentSave="onClickCommentSave" 
                    @onEditorFocus="onEditorFocus" @onEditorFocusOut="onEditorFocusOut" />
                <CommentTree ref="commentTree" :data-list="v_comments" 
                    @onClickCommentReply="onClickCommentReply"
                    @onClickLoadMore="onClickLoadMore"
                    @onClickRate="onClickRate"                    
                />
<!--
                <comment-list
                    :commentableId="tmp"
                    :commentableType="test"
                    :isReadOnly="v_comments_readonly"
                    v-model="v_comments"
                />                
-->
            </div>
        </div>

    </div>

</template>

<script>
import 'codemirror/lib/codemirror.css'; 
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from "@toast-ui/vue-editor";

import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';

import CTitle from 'components/CTitle';
import CBigLabel from 'components/CBigLabel';
import CommentForm from "components/comments/comment-form.vue";
import CommentTree from "components/comments/comment-tree.vue";


export default {
    name: 'PageBlog',
    components: {
        CTitle,
        CBigLabel,
        Viewer,
        CommentTree,
        CommentForm
    },
    data: function () {
        return {
            g_data:null,
            g_page_id: null,
            g_data_comments: null,

            v_post: {            
                title:'Title', text:'body text', tags:'crypto,btc,eth', category_id:'1', category_name:'',
                comment:'comments',like_count:0, dislike_count:0, read_count:0, is_owner:false
            },
                    
            v_page: {title:this.$t('page.cryptovc.title'), desc:''},
            //v_post: {title:null,header_image_url:null, pub_date:null},
            
            v_comments: [],
            v_comments_readonly:false,
            v_comments_count: 0,

            editorOptions: {
                hideModeSwitch: true,
                initialValue: 'This is initialValue.',            
                hooks:{      
                    addImageBlobHook: (blob, callback) => {
                        const uploadedImageURL = this.uploadImage(blob);
                        callback(uploadedImageURL, "alt text");
                        return false;
                    }
                }
            },
            editorHtml: 'asdklfhjasdljfasdlkjfasdl;',
            editorVisible: true,            
        }
    },

    created: function() {
        console.log("BlogView.created");
    },
    mounted: function() {        

        /*
        if (this.$route.params.page_id) {
            this.g_page_id = this.$route.params.page_id;
            logger.log.debug("BlogView.mounted - page_id",this.g_page_id);            
            this.refresh(this.g_page_id);
        }
        */

        //this.$refs.commentTree.showEditor();

        this.g_page_id=12;
        this.refresh(this.g_page_id);
    },
    updated: function() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        setContent(content) {
            this.$refs.toastViewer.invoke('setMarkdown', content);
        },

        toTreeData: function(flat) {
            // Create root for top-level node(s)
            let root = [];
            // Cache found parent index
            let map = {};

            flat.forEach(node => {
                //console.log("node=",node);
                // No parentId means top level
                node.level = 1;
                if ( (!node.parent_id) || (node.id==node.parent_id) ) {
                    node.level = 0;
                    return root.push(node);
                }
                
                // Insert node as child of parent in flat array
                let parentIndex = map[node.parent_id];
                if (typeof parentIndex !== "number") {
                    parentIndex = flat.findIndex(el => el.id === node.parent_id);
                    map[node.parent_id] = parentIndex;
                }
                
                if (!flat[parentIndex].children) {
                    return flat[parentIndex].children = [node];
                }
                
                flat[parentIndex].children.push(node);
            });
            
            console.log("toTreeData=",root);
            return root;
        },


        refresh: function(page_id) {
            const _this = this;
        
            let funcs = [            
                //this.loadCalendarEffectData('1h'),
                this.loadBlogPost(page_id),
                this.loadBlogComments(page_id),
                //this.loadCryptoTopAssetData('1h')
            ];
            Promise.all(funcs).then(function() {
                
            });

        },
        
        handlePostPage: function(post) {
            this.v_post = post;
            this.v_post.comment = "comments";
            
            if (post.owner.id==MoaConfig.auth.id) {
                this.v_post.is_owner = true;
            } else {
                this.v_post.is_owner = false;
            }

            if (post.api_categories.length==0) {
                this.v_post.category_id = null;
                this.v_post.category_name = null;
            } else {
                this.v_post.category_id = post.api_categories[0].id;
                this.v_post.category_name = post.api_categories[0].name;
            }

            this.setContent(this.v_post.body);
        },

        loadBlogPost: function(page_id) {
            const _this = this;
            if (! page_id) {
                return;
            }

            return new Promise(function(resolve,reject) {
                //logger.log.debug("CWatchView.loadCryptoWatchData - dic_param=",dic_param);
                CMSAPI.getPostData(page_id,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("BlogView.loadBlogPost - response",_this.g_data);
                    _this.handlePostPage(_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("BlogView.loadBlogPost - error",err);
                    reject();
                });
            });            
        },
        
        loadBlogComments: function(page_id,limit=null,offset=null) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                //logger.log.debug("CWatchView.loadCryptoWatchData - dic_param=",dic_param);
                let dic_config = {content_type:'blog-postpage' , id:page_id, limit:limit, offset:offset};
                CMSAPI.getComments(dic_config,function(response) {
                    logger.log.debug("BlogView.loadBlogComments - response",response.data);                    
                    _this.g_data_comments = response.data;
                    _this.handleComments(_this.g_data_comments);
                    resolve();
                },function(err) {
                    logger.log.error("BlogView.loadBlogComments - error",err);
                    reject();
                });
            });            
        },
        
        handleComments: function(json_data) {
            //console.log("nodes=",nodes);
            if (! CommonFunc.isEmptyObject(json_data.next)) {
                this.$refs.commentTree.showLoadMore();
            } else {
                this.$refs.commentTree.hideLoadMore();
            }
            this.v_comments_count = json_data.count;
            
            let comments = this.toTreeData(json_data.results);            
            this.v_comments = this.v_comments.concat(comments); 
        },


        navWriter:function(mode) {
          let params = {category_id:this.v_post.category_id};
            if (mode=="new") {
                params.page_id = null;
            } else {
                params.page_id = this.v_post.id;
            }
          let dic_param = { name:'blog_writer', params:params };
          this.$router.push(dic_param);
        },

        appendComments: function(dic_param,response) {
            logger.log.debug("appendComments=",response);

            
            let a_comment = {
                allow_reply:true, 
                comment:response.data.comment, 
                flags:[],
                id:response.data.id,
                is_removed:false,
                level:0,
                permalink:'',
                submit_date:response.data.timestamp,
                user_avatar:'',
                user_moderator:'',
                user_name:dic_param.username,
                user_url:'',
            };

            //is it reply?
            if (dic_param.reply_to==0) {
                a_comment.parent_id = response.data.id;
                this.v_comments.unshift(a_comment);
                return;
            } 
            
            let v_comments = [...this.v_comments];
            for (let index=0; index<v_comments.length;index++) {
                if (v_comments[index].id==a_comment.parent_id) {
                    
                    let a_item = v_comments[index];
                    if (! a_item.hasOwnProperty("children")) {
                        a_item.children = [];
                    }

                    a_comment.parent_id = dic_param.reply_to;
                    a_comment.level = 1;

                    a_item.children.unshift(a_comment);
                    v_comments[index] = a_item;
                    this.v_comments = v_comments;
                    break;
                }
            }
        },

        postComment: function(dic_param) {
            const _this = this;

            CMSAPI.postBlogComment(dic_param,function(response) {
                logger.log.debug("postComment=",response);
                CommonFunc.showOkMessage(_this,'comments posted');
                _this.appendComments(dic_param,response);
            }, function(err) {
                console.log("error-",err);
            });
        },


        onClickBlogRate: function(rate) {
            const _this = this;
            let dic_param = {id:this.g_data.id, method:rate, token:MoaConfig.auth.token};
            CMSAPI.likeBlogPost(dic_param,function(response) {
                logger.log.debug('onClickBlogRate - ',response);
                CommonFunc.showOkMessage(_this,'Liked');
            }, function(err) {
                logger.log.debug('onClickBlogRate - ',err);
            });          
        },

        onClickTest: function() {            
            logger.log.debug('onClickTest - ');
            //console.log( this.$refs.toastuiEditor.invoke('getHtml') );
            let dic_param = {content_type:'blog-postpage',pk:'6'};
            CMSAPI.getComments(dic_param,function(response) {
                logger.log.debug('getComments - ',response);
            });
            
        },

        onClickSave: function() {                        
            const _this = this;
            const a_text = this.$refs.toastuiEditor.invoke('getHtml');

            this.v_post.category_id = 1;
            let dic_param = {title:this.v_post.title,tags:this.v_post.tags, 
                category_id:this.v_post.category_id, text:a_text, token:MoaConfig.auth.token};
            logger.log.debug('onClickSave - ',dic_param);
            CMSAPI.postBlogPost(dic_param,function(response) {
                CommonFunc.showOkMessage(_this,'Blog posted');

            }, function(response) {

            });
        },

        onClickUpdate: function() {                        
            const _this = this;
            const a_text = this.$refs.toastuiEditor.invoke('getHtml');

            this.v_post.category_id = 1;
            let dic_param = { id:4, title:this.v_post.title,tags:this.v_post.tags, 
                category_id:this.v_post.category_id, text:a_text, token:MoaConfig.auth.token};
            logger.log.debug('onClickUpdate - ',dic_param);
            CMSAPI.postBlogPost(dic_param,function(response) {
                CommonFunc.showOkMessage(_this,'Blog updated');

            }, function(response) {

            });
        },

        onClickDelete: function() {                        
            const _this = this;
            let dic_param = { id:9, token:MoaConfig.auth.token};
            logger.log.debug('onClickDelete - ',dic_param);
            CMSAPI.deleteBlogPost(dic_param,function(response) {
                CommonFunc.showOkMessage(_this,'Blog deleted');

            }, function(response) {

            });
        },

        onClickComment: function() {
            const _this = this;

            logger.log.debug('onClickComment - ');
            let dic_param = {content_type:"blog.postpage",
                object_pk:this.v_post.id, token:MoaConfig.auth.token,
                name:MoaConfig.auth.username,  email:'', followup:'FALSE', reply_to:2,
                comment:'This is reply2',                
            };

            logger.log.debug('onClickComment - ',dic_param);

            CMSAPI.postBlogComment(dic_param,function(response) {
                CommonFunc.showOkMessage(_this,'comments posted');
            });

        },

        onClickWrite: function() {
            logger.log.debug('onClickWrite - ');
            this.navWriter("new");
        },

        onClickUpdate: function() {
            logger.log.debug("BlogPage.onClickUpdate");
            this.navWriter("update");
        },

        onClickCommentSave: function(payload) {            
            let dic_param = {content_type:"blog.postpage",
                object_pk:this.v_post.id, token:MoaConfig.auth.token,
                name:MoaConfig.auth.username,  email:'', followup:'FALSE', reply_to:0,
                comment:payload.comments,                
            };

            logger.log.debug('onClickCommentSave - ',payload,dic_param);
            this.postComment(dic_param);
        },

        onClickCommentReply: function(payload) {
            let dic_param = {content_type:"blog.postpage",
                object_pk:this.v_post.id, token:MoaConfig.auth.token,
                name:MoaConfig.auth.username,  email:'', followup:'FALSE', reply_to:payload.data.id,
                comment:payload.comments,                
            };

            logger.log.debug('onClickCommentReply - ',payload,dic_param);
            this.postComment(dic_param);
        },

        onClickLoadMore: function() {
            logger.log.debug("BlogPage.onClickLoadMore!!!",this.g_data_comments.next);
            
            if (! this.g_data_comments.next) {
                return;
            }

            const dic_query = CommonFunc.getURLQuery(this.g_data_comments.next);
            this.loadBlogComments(this.g_page_id,dic_query.limit,dic_query.offset);
        },

        onClickRate: function(dic_payload) {
            const _this = this;
            logger.log.debug("BlogPage.onClickRate=",dic_payload);

            let dic_param = {comment: dic_payload.data.id, flag:dic_payload.rate, token:MoaConfig.auth.token};
            CMSAPI.postCommentFeedback(dic_param,function(response) {
                CommonFunc.showOkMessage(_this,'Comments rate updated');
            
            }, function(response) {

            });            
        },

        onEditorFocus: function(event) {
            logger.log.debug("BlogPage.onEditorFocus=",event);
            this.$refs.commentForm.v_comments = "";
            this.$refs.commentForm.v_rows= "5";
            //contentInput
        },

        onEditorFocusOut: function(event) {
            logger.log.debug("BlogPage.onEditorFocusOut=",event);
            this.$refs.commentForm.v_comments = "";
            this.$refs.commentForm.v_rows= "1";
            //contentInput
        }

    }

};
</script>


<style scoped>
.blog-title {
    margin:0px auto 1px;
    color:#000;
}

.poll-number {
    padding-left:5px;
}
.blog-date {
    font-size:11px;
    font-weight:600;
    color:#888;
    padding:1px  5px;
}

.body-content {
    font-size:17px;
    color:#888
}

.blog-write {
    float:right;
    color:#202020; 
    border-radius:3px;
    font-size:10px;
    
}
.boxRate-parent {
    text-align:center;
    margin:0 auto;    
}

.boxRate {
    /* width:400px; */
    /* margin:0 auto; */    
    /* text-align:center;  */
    /* margin:0 auto; */
    padding:15px 0px 15px 0px;
    
}

.rateButton {
    width:70px;
}

.boxCommentCount {
    padding:10px;
} 

.boxCommentCount span {
    color:#222;
    font-size:20px;
    font-weight:500;
}

</style>