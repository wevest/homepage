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
                    <h5>{{v_post.title}}</h5>
                    <p>{{v_post.pub_date}}</p>
                    <p> 
                        <span>like count {{v_post.like_count}} </span>
                        <span>dislike count {{v_post.dislike_count}} </span>
                        <span>read count {{v_post.read_count}} </span>
                    </p>
                    <q-btn label="Write" @click="onClickWrite" />
                    <q-btn label="test" @click="onClickTest" />
                </div>

            </div>
        </div>

        <div class="row">
            <div class="col">
                <Viewer 
                    ref="toastViewer"
                    :value="v_post.text"
                    :options="editorOptions"
                    :visible="editorVisible"
                    previewStyle="vertical"
                    height="200px"
                />
                <p> {{ v_post.tags }} </p>
                <div>
                    <q-btn label="Like" @click="onClickRate('like')"/>
                    <q-btn label="Dislike"  @click="onClickRate('dislike')" />    
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <q-btn label="comment" @click="onClickComment" />
                <q-input v-model="v_post.comment" label="Comments" />

                <comment-list
                    commentableType="launches"
                    :commentableId="launch.id"
                    :isReadOnly="isReadOnly"
                    v-model="v_comments"
                />                

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
import CommentList from "components/comments/comment-list.vue";


export default {
  name: 'PageBlog',
  components: {
      CTitle,
      CBigLabel,
      Viewer,
      CommentList
  },

  data: function () {
    return {
        g_data:null,
        g_page_id: null,
        
        v_post: {            
            title:'Title', text:'body text', tags:'crypto,btc,eth', category:'1', comment:'comments',
            like_count:0, dislike_count:0, read_count:0
        },
                  
        v_page: {title:this.$t('page.cryptovc.title'), desc:''},
        //v_post: {title:null,header_image_url:null, pub_date:null},
        
        v_comments: [],

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
    created: function () {
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

        this.g_page_id=4;
        this.refresh(this.g_page_id);                        
    },
    updated: function() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        setContent(content) {
            this.$refs.toastViewer.invoke('setMarkdown', content);
        },

        buildTree: function(comments,id=null,link='parent_id') {
            let data = comments.filter(item => item[link] === id).map(item => ({ ...item, children: nest(items, item.id) }));
            console.log("buildTree=",data);
            return data;
        },

        unflatten: function( array, parent, tree ){
            tree = typeof tree !== 'undefined' ? tree : [];
            parent = typeof parent !== 'undefined' ? parent : { id: 0 };
                
            var children = _.filter( array, function(child){ return child.parent_id == parent.id; });
            
            if( !_.isEmpty( children )  ){
                if( parent.id == 0 ){
                tree = children;   
                }else{
                parent['children'] = children
                }
                _.each( children, function( child ){ unflatten( array, child ) } );                    
            }
            
            return tree;
        },

        buildTree2: function(flat) {
            // Create root for top-level node(s)
            let root = [];
            // Cache found parent index
            let map = {};

            flat.forEach(node => {
                console.log("node=",node);
                // No parentId means top level
                if (!node.parent_id) {
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
            
            console.log("buildTree2=",root);
            return root;
        },

        makeTree: function(nodes, parentId) {
            return nodes
                .filter((node) => node.parent_id === parentId)
                .reduce(
                (tree, node) => [
                    ...tree,
                    {
                    ...node,
                    children: makeTree(nodes, node.id),
                    },
                ],
                [],
                )
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
        
        updatePost: function(post) {
            this.v_post = post;
            this.v_post.comment = "comments";
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
                    _this.updatePost(_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("BlogView.loadBlogPost - error",err);
                    reject();
                });
            });            
        },
        
        loadBlogComments: function(page_id) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                //logger.log.debug("CWatchView.loadCryptoWatchData - dic_param=",dic_param);
                let dic_config = {content_type:'blog-postpage' , id:page_id};
                CMSAPI.getComments(dic_config,function(response) {
                    _this.g_data_comments = response.data;
                    logger.log.debug("BlogView.loadBlogComments - response",_this.g_data_comments);
                    let nodes = _this.makeTree(_this.g_data_comments.results,null);
                    console.log("nodes=",nodes);
                    resolve();
                },function(err) {
                    logger.log.error("BlogView.loadBlogComments - error",err);
                    reject();
                });
            });            
        },
        
        uploadImage:function(blob) {
            // check the following link
            // https://solve-programming.tistory.com/29    
            // https://day0404.tistory.com/entry/Nuxtjs-Toast-Ui-Editor-%EC%A0%81%EC%9A%A9

            console.log("imagehook=",blob);

            let formData = new FormData();

            formData.append('image', blob);

            return axios('http://localhost:3001/imageupload', {

                method: 'POST',

                data: formData,

                headers : {'Content-type' : 'multipart/form-data' }

            }).then(response => {

                if (response.data) {

                if(this.state.thumbnailcheck === 0) {

                    this.setState({

                    thumbnailchekc : 1,

                    thumbnail : response.data

                    })

                }

                    return response.data;

                }

                throw new Error('Server or network error');

            });

        },

        navAsset:function(symbol) {
          let dic_param = { name:'asset', params:{ symbol:symbol } };
          this.$router.push(dic_param);
        },


        onClickRate: function(rate) {
            const _this = this;
            let dic_param = {id:this.g_data.id, method:rate, token:MoaConfig.auth.token};
            CMSAPI.likeBlogPost(dic_param,function(response) {
                logger.log.debug('onClickLike - ',response);
                CommonFunc.showOkMessage(_this,'Liked');
            }, function(err) {
                logger.log.debug('onClickLike - ',err);
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
                name:MoaConfig.auth.username,  email:'', followup:'FALSE', reply_to:0,
                comment:'This is comment222',                
            };

            logger.log.debug('onClickComment - ',dic_param);

            CMSAPI.postBlogComment(dic_param,function(response) {
                CommonFunc.showOkMessage(_this,'comments posted');
            });

        },

        onClickWrite: function() {
            logger.log.debug('onClickWrite - ');
            this.$refs.blogEditor.show();
        }
    }

};
</script>


<style scoped>

</style>