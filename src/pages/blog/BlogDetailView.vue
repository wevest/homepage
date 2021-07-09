<template>
	
    <div class="q-ma-md">
        <div class="titleBox">            
            <div>
                <div class="gPageTitle">
                    <span>{{v_post.title}}</span>
                </div>
                                        
                <WSubinfo :username="v_post.api_owner.username" :pub_date="v_post.pub_date" like_count=-1 dislike_count=-1 />
            </div>    
                
            <div class="row q-py-sm">
                <div class="gRatingView">   
                    <span class="q-pr-sm">
                        <q-icon                            
                            name="sentiment_very_satisfied"  
                            size="23px" />&nbsp;
                            <span >{{v_post.like_count}}</span>
                    </span>
                    <span class="q-pr-sm">
                        <q-icon                            
                            name="sentiment_very_dissatisfied"
                            size="23px" />&nbsp;
                            <span>{{v_post.dislike_count}}</span>
                    </span>
                    <span class="q-pr-sm">
                        <q-icon                            
                            name="chat_bubble_outline" 
                            size="23px" />&nbsp;                    
                            <span >{{v_post.read_count}}</span>
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

        <div>
            <div class="q-py-xl">
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

            <WUserProfileBox ref="userProfile" 
                :data="v_post"
                :avatar="v_post.api_owner.avatar_thumb"
                :username="v_post.api_owner.username"
                :userid="v_post.api_owner.id"
                :biography="v_post.api_owner.biography"
                :isOwner="v_owner" />

            <WRatingButton ref="ratingButton" :data="v_post" />

        </div>
        
        <q-separator class="gSeparator" />
    

        <div class="q-ma-sm">
                <div class="boxCommentCount"> 
                    <span>Comments : {{v_post.comments.items.length}}</span>
                </div>

            <CommentBox ref="commentBox"             
                :contentType="v_content_type" :post="v_post" :items="v_post.comments.items" />            
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
import WUserProfileBox from 'components/WUserProfileBox';

import CommentBox from "components/comments/CommentBox.vue";


export default {
    name: 'PageBlog',
    components: {
        CTitle,
        CBigLabel,
        Viewer,
        WAvatar,
        CommentBox,
        WRatingButton,
        WSubinfo,
        WCommandBar,
        WUserProfileBox
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
            
            v_content_type:'blog.postpage',

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
        this.validateQuery();
    },
    mounted: function() {        

        logger.log.debug("BlogView.mounted - params=",this.$route.query);

        this.v_post.id=this.$route.query.page_id;
        this.refresh(this.v_post.id);
    },
    updated: function() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        validateQuery() {
            if (this.$route.query.page_id) {
                if (! CommonFunc.isEmptyObject(this.$route.query.page_id)) {
                    return;
                }                
            }   
            CommonFunc.navError404(this);
        },

        setContent(content) {
            this.$refs.toastViewer.invoke('setMarkdown', content);
        },


        refresh: function(page_id) {
            logger.log.debug("BlogView.mounted - refresh");
            
            this.loadBlogPost(page_id);
            this.loadBlogComments(page_id);
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
            logger.log.debug("BlogView.handleComments - v_post",this.v_post);
            
            this.$refs.commentBox.update(this.v_post,this.v_post.comments.items);
            this.$refs.commentBox.setPageParameter(json_data.next);
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


        onClickDelete: function() {                        
            const _this = this;
            //let dic_param = { id:this.v_post.id, token:store.getters.token};
            logger.log.debug('BlogPage.onClickDelete');
            
            this.v_post.remove().then( response => {
                CommonFunc.showOkMessage(_this,'Blog deleted');       
                CommonFunc.navBack(_this);
            }).catch(err=>{
                CommonFunc.showErrorMessage(_this,err.data.msg);
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

/* .boxRate { */
    /* text-align:center; */
    /* padding:25px 0px 7px 0px;   */
/* } */

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


.authorIntro {
  border: 1px solid #27a9e3;
  margin-left: 0px;
  margin-right: 0px;
  padding-left: 20px;
  padding-right: 20px;
  border-left: 10px solid #27a9e3;
}

</style>