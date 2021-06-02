<template>
    
    <div class="q-ma-md">

        <div class="row">
            <div class="col">
                <div>
                    <h5>{{v_post.title}}</h5>
                    <p>{{v_post.pub_date}}</p>
                    <q-btn label="Save" @click="onClickSave" />
                    <q-btn label="Update" @click="onClickUpdate" />
                    <q-btn label="Delete" @click="onClickDelete" />
                </div>

            </div>
        </div>

        <div class="row">
            <div class="col">
                <q-input v-model="v_post.title" label="Title" />
                <Editor 
                    ref="toastuiEditor"
                    :value="v_post.text"
                    :options="editorOptions"
                    :visible="editorVisible"
                    previewStyle="vertical"
                    height="200px"
                    mode="wysiwyg"
                    initialEditType="wysiwyg"
                />
                <q-input v-model="v_post.tags" label="Tags" />
            </div>
        </div>

        <div class="row">
            <div class="col">
                <q-btn label="comment" @click="onClickComment" />
                <q-input v-model="v_post.comment" label="Comments" />
            </div>
        </div>

        <BlogEditor ref="blogEditor" />

    </div>

</template>

<script>
import 'codemirror/lib/codemirror.css'; 
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';
import { Viewer } from "@toast-ui/vue-editor";


import { MoaConfig } from 'src/data/MoaConfig';
import { CONST } from 'src/data/const';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';

import CTitle from 'components/CTitle';
import CBigLabel from 'components/CBigLabel';
import BlogList from 'components/BlogList';
import BlogEditor from 'components/BlogEditor';
import ChartTimeframe from 'components/ChartTimeframe';
import PortfolioTable from 'pages/cryptovc/PortfolioTable';


export default {
  name: 'PageBlog',
  components: {
      CTitle,
      CBigLabel,
      ChartTimeframe,
      PortfolioTable,
      BlogList,
      Editor,
      BlogEditor
  },

  data: function () {
    return {
        g_data: '',
        g_page_id: null,
        
        v_post: {
            title:'Title', text:'body text', tags:'crypto,btc,eth', category:'1', comment:'comments'
        },
          
        
        v_page: {title:this.$t('page.cryptovc.title'), desc:''},
        //v_post: {title:null,header_image_url:null, pub_date:null},
    
        
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
        //this.loadBlogList();
        
        if (this.$route.params.page_id) {
            this.g_page_id = this.$route.params.page_id;
            logger.log.debug("BlogView.mounted - page_id",this.g_page_id);            
            this.refresh(this.g_page_id);
        }
                        
    },
    updated: function() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        setBlogPage: function() {

        },

        loadBlogList: function() {
            this.$refs.blogList.update('test');
        },

        refresh: function(page_id) {
            const _this = this;
        
            let funcs = [            
                //this.loadCalendarEffectData('1h'),
                this.loadBlogPost(page_id),
                //this.loadCryptoTopAssetData('1h')
            ];
            Promise.all(funcs).then(function() {
                
            });

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
                    logger.log.debug("CWatchView.loadBlogPost - response",_this.g_data);
                    _this.updatePost(_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("CryptovcView.loadBlogPost - error",err);
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

        updatePost: function(post) {
            this.v_post.title = post.title;
            this.v_post.pub_date = post.pub_date;
        },

        navAsset:function(symbol) {
          let dic_param = { name:'asset', params:{ symbol:symbol } };
          this.$router.push(dic_param);
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
            logger.log.debug('onClickComment - ');
            let dic_param = {content_type:"blog.postpage",
                object_pk:6, name:"tester", followup:'FALSE', 
                reply_to:0, email:'test@gmail.com', comment:'This is comment222'
            };

            logger.log.debug('onClickComment - ',dic_param);

            CMSAPI.postBlogComment(dic_param,function(response) {
            //CMSAPI.likeBlogPost(dic_param,function(response) {
            
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