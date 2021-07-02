<template>
    
    <div class="q-ma-md">
        <div class="row titleBox">
            <div class="col">
                
                <div>
                    <div>
                        <span class="gPageTitle">{{v_post.title}}</span>
                    </div>
                                            
                    <WSubinfo :username="v_post.api_owner.username" :pub_date="v_post.pub_date" like_count=-1 dislike_count=-1 />
                </div>    
                  
                <div class="row boxRate q-gutter-sm">
                    <div>   
                        <span>
                            <q-icon 
                                class="RatingBtn"
                                name="sentiment_very_satisfied"  
                                size="23px" />&nbsp;
                                <span class="RatingCount">{{v_post.like_count}}</span>&nbsp;
                        </span>
                        <span>
                            <q-icon 
                                class="RatingBtn"
                                name="sentiment_very_dissatisfied"
                                size="23px" />&nbsp;
                                <span class="RatingCount">{{v_post.dislike_count}}</span>&nbsp;
                        </span>
                        <span>
                            <q-icon 
                                class="RatingBtn"
                                name="chat_bubble_outline" 
                                size="23px" />&nbsp;                            
                                <span class="RatingCount">{{v_post.read_count}}</span>
                        </span>
                    </div>         

                    <q-space />

                    <WCommandBar :data="v_post" :isOwner="v_post.is_owner" 
                        shareBtn="share" updateBtn="update" deleteBtn="delete" 
                        @onClickShare="onClickShare" 
                        @onClickUpdate="onClickUpdate" 
                        @onClickDelete="onClickDelete" 
                    />
                    
                </div>                   
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div class="bodyBox">
                    <Viewer 
                        ref="toastViewer"
                        :value="v_post.body"
                        :options="editorOptions"
                        :visible="editorVisible"
                        previewStyle="vertical"
                        height="200px"
                    />
                    <p> {{ v_post.tags }} </p>
                </div>


                <div class="blockquote">
                    <div class="row">
                        <div class="gPageAvatar">
                            <WAvatar :avatar="v_post.api_owner.avatar_thumb" :username="v_post.api_owner.username" />
                        </div>
                        <div style="padding-left:15px; padding-top:10px;">
                            <span class="username"> {{v_post.api_owner.username}}</span>&nbsp;
                            <q-btn class="followBtn" icon="add_circle" label="Follow" size="13px" dense flat @click="onClickFollow(1)" v-if="! v_owner" />
                        </div>
                    </div>                    
                    <div>
                        <p class="biography"> {{v_shorten(v_post.api_owner.biography)}}</p>
                    </div>
                </div>


                <WRatingButton ref="ratingButton" @onClickRating="onClickBlogRate" />

            </div>
        </div>
        
        <q-separator class="gSeparator" />
        
        <div class="row">
            <div class="col">
                
                <div class="boxCommentCount"> 
                    <span>Comments : {{v_post.comments.items.length}}</span>
                </div>

                <CommentForm ref="commentForm" type="comment"
                    :contentType="v_conent_type" :post="v_post"
                    @onClickCommentSave="onClickCommentSave" />

                <CommentTree ref="commentTree" 
                    :data-list="v_post.comments.items" 
                    :contentType="v_conent_type" :post="v_post"
                    @onClickCommentReply="onClickCommentReply"
                    @onClickLoadMore="onClickLoadMore"
                    @onClickRate="onClickRate"                    
                />
            </div>
        </div>

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
import WCommandBar from "components/WCommandBar.vue";
import WRatingButton from 'components/WRatingButton';
import WSubinfo from 'components/WSubinfo';
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
        WRatingButton,
        WSubinfo,
        WCommandBar
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,MoaConfig.setting.maxBiographyLength);
            };
        },
        v_owner() {
            if (this.v_post.api_owner.id==this.v_me.id) {
                return true;
            }
            return false;
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

        logger.log.debug("BlogView.mounted - params=",this.$route.query);

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
            logger.log.debug("BlogView.mounted - refresh");
            
            this.loadBlogPost(page_id);
            this.loadBlogComments(page_id);
/*
            const _this = this;
        
            let funcs = [            
                //this.loadCalendarEffectData('1h'),
                this.loadBlogPost(page_id),
                
                //this.loadCryptoTopAssetData('1h')
            ];

            Promise.all(funcs).then(function() {
                
            });
*/
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
            logger.log.debug("loadBlogPost.response - 1");

            const _this = this;
            this.v_post.load(page_id).then( response => {
                logger.log.debug("loadBlogPost.response=",response);
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
            if (mode=="new") {
                a_post.id = null;
            } else {
                a_post = this.v_post;

            }

            a_post.category = this.v_post.category_id;
            a_post.setContentType(CONST.CONENT_TYPE_BLOGPAGE);

            //this.$refs.blogWriter.show(a_post);            
            store.getters.nav.add(this.$route); 

            let params = {post:a_post};
            let dic_param = { name:'blog_writer', params:params };
            this.$router.push(dic_param);
        },


        onClickBlogRate: function(dicParam) {
            const _this = this;            
            
            let dic_param = {id:this.v_post.id, value:dicParam.value};            
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

        onClickDelete: function() {                        
            const _this = this;
            //let dic_param = { id:this.v_post.id, token:store.getters.token};
            logger.log.debug('BlogPage.onClickDelete');
            
            store.getters.components.getComponent('confirmDialog').show('Do you want to delete?',function(value) {
                logger.log.debug("AssetQAView.onClickAnswer - confirm=",value,_this.$route);
                if (! value) return;

                _this.v_post.remove().then( response => {
                    CommonFunc.showOkMessage(_this,'Blog deleted');       
                    CommonFunc.navBack(_this);
                }).catch(err=>{
                    CommonFunc.showErrorMessage(_this,err.data.msg);
                });

            });

        },

        onClickWrite: function(dic_param) {
            logger.log.debug('onClickWrite - ',dic_param);
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
            let a_url = CommonFunc.navBlogDetail(this,post.id,true);
            logger.log.debug("BlogPage.onClickShare=",post,a_url);            
            CommonFunc.copyUrl(this,a_url);
        },

        onBlogAdded: function() {
            logger.log.debug("BlogPage.onBlogAdded=");            
        },

        onBlogDeleted: function() {
            logger.log.debug("BlogPage.onBlogDeleted=");            
        },

        onClickFollow: function(value) {
            logger.log.debug("BlogPage.onClickFollow=");
            
            const _this=this;
            this.v_me.follow(this.v_post.api_owner.id,value).then( response => {
                logger.log.debug("onClickFollow - response=",response);
                CommonFunc.showOkMessage(_this,'Followed');                
            }).catch(err=>{
                CommonFunc.showErrorMessage(_this,err.data.msg);
            });

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

.bodyBox {
    font-size:17px;
    color:#888;
    padding: 45px 0px 30px 0px;

}

.blockquote {  
    border: 1px solid #D8D8D8;
    border-radius: 3px;  
    border-left: 7px solid #DDDDDD;  
    padding: 12px 12px 0px 12px;  
    margin: 0px 15px 0px 15px;
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
    text-align:center;
    padding:25px 0px 7px 0px;  
}

.rateButton {
    color:#616161;
    width:100px;
    font-size:18px;
}

.ratingBox {
    text-align:center;
    padding:15px;
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
    font-size:17px;
    color:#222222;
    font-weight:bold;
    margin-right:2px;
}

.biography {
   font-size:14px;
   color:#222222;
   padding-top:10px;
}

.copyright {
    font-size:13px;
    color:#222222;
}

.followBtn {
    color:#4978F4;;
}

.separator {
    padding:15px 0px;
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