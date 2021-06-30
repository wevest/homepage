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
                <div class="row">
                    <div>
                        <span class="gPageTitle">{{v_post.title}}</span>
                        <br>
                        <span class="gPageDatetime">{{v_post.api_owner.username}}</span>&nbsp;
                        <span class="gPageDatetime">{{v_updated_at(v_post.pub_date)}}</span>
                    </div>    
                </div>
                <div class="boxRate q-pa-md">
                    <div class="float-left q-gutter-sm">   
                        <span>
                            <q-icon 
                            class="RatingBtn"
                            name="thumb_up_off_alt"  
                            size="23px" />&nbsp;
                            <span class="RatingCount">{{v_post.like_count}}</span>
                        </span>
                        <span>
                            <q-icon 
                            class="RatingBtn"
                            name="thumb_down_off_alt"
                            size="23px" />&nbsp;
                            <span class="RatingCount">{{v_post.dislike_count}}</span>
                        </span>
                        <span>
                            <q-icon 
                            class="RatingBtn"
                            name="chat_bubble_outline" 
                            style="font-size: 1.5rem;" 
                            color="grey-8"/>&nbsp;                            
                            <span class="RatingCount">{{v_post.read_count}}</span>
                        </span>
                    </div>

                    <div class="float-right q-gutter-sm">

                        <q-btn 
                            outlined
                            size="9px"
                            color="primary"
                            icon="checklist"
                            label="Share" 
                            @click="onClickShare(v_post)" />

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
                    </div>

                </div>

            </div>
        </div>

        <div class="row">
            <div class="col body-content">
                <Viewer 
                    ref="toastViewer"
                    :value="v_post.body"
                    :options="editorOptions"
                    :visible="editorVisible"
                    previewStyle="vertical"
                    height="200px"
                />
                <p> {{ v_post.tags }} </p>
                
                <blockquote class="blockquote"> 
                    <div class="row postOwnerBox">
                        <div class="gPageAvatar">
                            <WAvatar :avatar="v_post.api_owner.avatar_thumb" :username="v_post.api_owner.username" />
                        </div>&nbsp;&nbsp;    
                        
                        <div>
                            <span class="username"> {{v_post.api_owner.username}}</span><br>
                            <!-- <span>First name : {{v_post.api_owner.first_name}}</span> -->
                            <!-- <span>Last name : {{v_post.api_owner.last_name}}</span> -->
                            <span class="biography"> {{v_shorten(v_post.api_owner.biography)}}</span>
                        </div>
                    </div>
                </blockquote> 
                <div class="boxRate-parent">
                    <div class="q-pa-md q-gutter-sm boxRate">
                        <q-btn 
                            push
                            class="rateButton"
                            flat
                            size="13px" 
                            icon="thumb_up_off_alt" 
                            label="" 
                            @click="onClickBlogRate(1)"/>
                        <q-btn
                            push
                            class="rateButton"
                            flat
                            size="13px"
                            icon="thumb_down_off_alt"
                            label=""
                            @click="onClickBlogRate(-1)" />
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
                    <span>Comments : {{v_post.comments.items.length}}</span>
                </div>

                <CommentForm ref="commentForm" type="comment"
                    :contentType="v_conent_type" :post="v_post"
                    @onClickCommentSave="onClickCommentSave" />
<!--                
                    @onEditorFocus="onEditorFocus" @onEditorFocusOut="onEditorFocusOut" />
-->
                <CommentTree ref="commentTree" 
                    :data-list="v_post.comments.items" 
                    :contentType="v_conent_type" :post="v_post"
                    @onClickCommentReply="onClickCommentReply"
                    @onClickLoadMore="onClickLoadMore"
                    @onClickRate="onClickRate"                    
                />
            </div>
        </div>

        <BlogWriterDialog ref="blogWriter" @onBlogAdded="onBlogAdded" @onBlogDeleted="onBlogDeleted" />
    </div>

</template>

<script>
import 'codemirror/lib/codemirror.css'; 
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from "@toast-ui/vue-editor";

import { CONST } from 'src/data/const';
import { MoaConfig } from 'src/data/MoaConfig';
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import {PostPageModel,CommentModel,CommentListModel} from "src/models/PageModel";

import CTitle from 'components/CTitle';
import CBigLabel from 'components/CBigLabel';
import WAvatar from "components/WAvatar.vue";
import BlogWriterDialog from 'components/dialogs/BlogWriterDialog';
import CommentForm from "components/comments/comment-form.vue";
import CommentTree from "components/comments/comment-tree.vue";


export default {
    name: 'PageBlog',
    components: {
        CTitle,
        CBigLabel,
        Viewer,
        WAvatar,
        CommentTree,
        CommentForm,
        BlogWriterDialog
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        },
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,MoaConfig.setting.maxBiographyLength);
            };
        }
    },
    data: function () {
        return {
            g_data:null,
            g_data_comments: null,

            v_post: new PostPageModel(),
            //v_comments_list: new CommentListModel(),

            v_page: {title:this.$t('page.cryptovc.title'), desc:''},
            //v_post: {title:null,header_image_url:null, pub_date:null},
            v_conent_type:'blog.postpage',

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

        logger.log.debug("BlogView.mounted - params=",this.$route.params,this.$route.query);

        if (! this.$route.query.page_id) {
            return;
        }

        this.v_post.id=this.$route.query.page_id;
        this.refresh(this.v_post.id);
    },
    updated: function() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        setContent(content) {
            this.$refs.toastViewer.invoke('setMarkdown', content);
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
            logger.log.debug("handlePostPage.post=",post);

            this.v_post.assign(post);
            
            logger.log.debug("handlePostPage.v_post=",this.v_post);
                    
            this.setContent(this.v_post.body);
        },

        loadBlogPost: function(page_id) {
            if (! page_id) {
                return;
            }

            const _this = this;
            this.v_post.load(page_id).then( response => {
                _this.g_data = response.data;
                _this.handlePostPage(_this.g_data.results[0]);
            }).catch( err => {

            });

        },
        
        loadBlogComments: function(page_id,limit=null,offset=null) {
            const _this = this;

            let dic_param = {content_type:'blog-postpage' , id:page_id, limit:limit, offset:offset};
            this.v_post.comments.load(dic_param).then( response => {
                _this.g_data_comments = response.data;
                _this.handleComments(_this.g_data_comments);
            }).catch( err => {
                logger.log.error("BlogView.loadBlogComments - error",err);
            });
        },
        
        handleComments: function(json_data) {
            //console.log("nodes=",nodes);
            
            this.$refs.commentTree.setPageParameter(json_data.next);
            this.v_comments_count = json_data.count;
        },


        navWriter:function(mode) {
            let a_post = new PostPageModel();
            a_post.category = this.v_post.category_id;
            a_post.setContentType(CONST.CONENT_TYPE_BLOGPAGE);

            this.$refs.blogWriter.show(a_post);
            
/*            
            let params = {category_id:this.v_post.category_id};
            if (mode=="new") {
                params.page_id = null;
            } else {
                params.page_id = this.v_post.id;
            }
            let dic_param = { name:'blog_writer', params:params };
            this.$router.push(dic_param);
*/

        },


        onClickBlogRate: function(value) {
            const _this = this;            
            
            let dic_param = {id:this.v_post.id, value:value};            
            this.v_post.vote(dic_param).then( response => {
                
                let msg = "Liked" ;
                if (value==-1) {
                    msg = "Disliked";
                }
                CommonFunc.showOkMessage(_this,msg);

            }).catch( err=> {

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

        onClickUpdate: function() {                        
            const _this = this;
            const a_text = this.$refs.toastuiEditor.invoke('getHtml');

            this.v_post.category_id = 1;
            let dic_param = { id:4, title:this.v_post.title,tags:this.v_post.tags, 
                category_id:this.v_post.category_id, text:a_text, token:store.getters.token};
            logger.log.debug('onClickUpdate - ',dic_param);
            CMSAPI.postBlogPost(dic_param,function(response) {
                CommonFunc.showOkMessage(_this,'Blog updated');

            }, function(response) {

            });
        },

        onClickDelete: function() {                        
            const _this = this;
            let dic_param = { id:9, token:store.getters.token};
            logger.log.debug('onClickDelete - ',dic_param);
            CMSAPI.deleteBlogPost(dic_param,function(response) {
                CommonFunc.showOkMessage(_this,'Blog deleted');

            }, function(response) {

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

        onClickCommentSave: function(dic_param) {            
            logger.log.debug('onClickCommentSave - ',dic_param);
            CommonFunc.showOkMessage(this,'Comments posted');  
        },

        onClickCommentReply: function(dic_param) {
            logger.log.debug('onClickCommentReply : dic_param=',dic_param);
            CommonFunc.showOkMessage(this,'Comments posted');  
        },

        onClickLoadMore: function(dic_page) {
            logger.log.debug("BlogPage.onClickLoadMore!!!",dic_page);
            
            this.loadBlogComments(this.v_post.id,dic_page.param.limit,dic_page.param.offset);
        },

        onClickRate: function(dic_payload) {
            const _this = this;
            logger.log.debug("BlogPage.onClickRate=",dic_payload);

            let dic_param = {comment: dic_payload.data.id, flag:dic_payload.rate};
            this.v_post.comments.vote(dic_param).then( response => {
                CommonFunc.showOkMessage(_this,'Comments rate updated');
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
        },
        
        onClickShare: function(post) {
            let a_url = CommonFunc.navBlog(this,post.id,true);
            logger.log.debug("BlogPage.onClickShare=",post,a_url);            
            CommonFunc.copyUrl(this,a_url);
        },

        onBlogAdded: function() {
            logger.log.debug("BlogPage.onBlogAdded=");            
        },

        onBlogDeleted: function() {
            logger.log.debug("BlogPage.onBlogDeleted=");            
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

.blockquote {  

    border: 1px solid #D8D8D8;
    border-radius: 3px;  
    margin-left: 0px;  
    margin-right: 0px;  
    padding-left: 20px;  
    padding-right: 20px;  
    border-left: 10px solid #27a9e3;  
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
    color:#616161;
    width:40px;
}

.boxCommentCount {
    padding:10px 10px 10px 0px;
} 

.boxCommentCount span {
    color:#222;
    font-size:20px;
    font-weight:500;
}
.postOwnerBox {
    padding:15px 0px;
}

.username {
    font-size:16px;
    color:#222222;
    font-weight:bold;
}

.biography {
   font-size:14px;
   color:#222222;
}

.copyright {
    font-size:13px;
    color:#222222;
}

.separator {
    padding:30px 0px;
}

.RatingBtn {
    color:#616161;
}

.authorIntro {
  border: 1px solid #27a9e3;
  margin-left: 0px;
  margin-right: 0px;
  padding-left: 20px;
  padding-right: 20px;
  border-left: 10px solid #27a9e3;
}

</style>