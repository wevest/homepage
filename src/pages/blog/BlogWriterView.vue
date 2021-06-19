<template>
    
    <div class="q-ma-md">

        <div class="row">
            <div>
                <q-btn label="Back" @click="onClickBack" />
            </div>
            <q-space />
            <div>
                <q-btn label="Save" @click="onClickSave" />
                <q-btn label="Delete" @click="onClickDelete" v-if="! isNewPost" />
            </div>
        </div>

        <div class="row">
            <div class="col">
                <q-input 
                    v-model="v_post.title" 
                    label="Title" 
                    :error="v_error.title.error"
                    :error-message="v_error.title.msg"
                />
                <Editor 
                    ref="toastEditor"
                    :value="v_post.text"
                    :options="editorOptions"
                    :visible="editorVisible"
                    :initialValue="editorHtml"
                    previewStyle="vertical"
                    height="400px"
                    mode="wysiwyg"
                    initialEditType="wysiwyg"
                />
                <div v-if="v_error.text.error">
                    {{v_error.text.msg}}
                </div>
                <q-input v-model="v_post.tags" label="Tags" />
            </div>
        </div>

    </div>

</template>

<script>
import AWS from 'aws-sdk';
import 'codemirror/lib/codemirror.css'; 
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';


import { store } from 'src/store/store';
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';

import {PostPageModel} from "src/models/PageModel";
import CTitle from 'components/CTitle';


export default {
    name: 'PageBlogWriter',
    components: {
        CTitle,
        Editor,
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        isNewPost: function() {
            if (this.g_page_id) {
                return false;
            }
            return true;
        }
    },
    data: function () {
        return {
            g_data: '',
            g_page_id: null,
            g_category_id: null,
            
            v_post: new PostModel(),
                    
            v_page: {title:this.$t('page.cryptovc.title'), desc:''},
            v_error: {
                title: {error:false, msg:''},
                text: {error:false, msg:''},
            },
                    
            editorOptions: {
                hideModeSwitch: true,
                hooks:{                      
                    addImageBlobHook: async (blob, callback) => {
                        const uploadedImageURL = await this.uploadImage(blob);
                        callback(uploadedImageURL, "alt text");
                        return false;                 
                    }                    
                },
            },
            editorHtml: '',
            editorVisible: true,
        }
    },

    created: function () {
        console.log("BlogWriterView.created");
    },
    mounted: function() {        
        
        this.g_page_id = this.$route.params.page_id;
        this.g_category_id = this.$route.params.category_id;
        if (this.g_page_id) {
            this.loadBlogPost(this.g_page_id);
        }
        
        this.g_category_id = 1;
        this.v_post.title = "Image Title";
        this.v_post.tags = "image,s3,bucket";
    },
    updated: function() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        setContent(content) {
            this.$refs.toastEditor.invoke('setMarkdown', content);
        },

        setPageID(page_id) {
            this.g_page_id = page_id;
        },

        createThumbnail: function(img) {
            const resizedImage = CommonFunc.resizeImage(img,MoaConfig.setting.thumbNailWidth, MoaConfig.setting.thumbNailHeight, 0);
            return resizedImage;
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
        
        handlePostPage: function(post) {
            this.v_post.assign(post);
            this.setContent(this.v_post.body);
        },

        loadBlogPost: function(page_id) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                //logger.log.debug("CWatchView.loadCryptoWatchData - dic_param=",dic_param);
                CMSAPI.getPostData(page_id,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("BlogWriterView.loadBlogPost - response",_this.g_data);
                    _this.handlePostPage(_this.g_data);
                    resolve();

                },function(err) {
                    logger.log.error("BlogWriterView.loadBlogPost - error",err);
                    reject();
                });
            });            
        },
        

        uploadImage:function(blob) {
            // check the following link
            // https://solve-programming.tistory.com/29    
            // https://day0404.tistory.com/entry/Nuxtjs-Toast-Ui-Editor-%EC%A0%81%EC%9A%A9

            const _this = this;

            console.log("uploadImage=",blob);
/*
            AWS.config.update( {
                region: MoaConfig.s3.region,
                credentials: new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: MoaConfig.s3.poolId
                })
            });
*/

            return new Promise(function(resolve,reject) {

                const s3 = new AWS.S3({
                    accessKeyId: MoaConfig.s3.key,
                    secretAccessKey: MoaConfig.s3.secret 
                });

                let file_key = CommonFunc.getBucketKey(blob.name);
                //console.log("file_key=",file_key);

                const params = {
                    Key: file_key,
                    Bucket: MoaConfig.s3.bucket,
                    Body: blob,
                    ACL:'public-read'
                };

                s3.upload( params, function(err,response) {
                    if (err) {
                        CommonFunc.showErrorMessage(_this,'Fail to upload image to s3');
                        return '';
                    }
                    console.log("upload=",response);
                    resolve(response.Location);
                    return response.Location;
                });

            });

        },

        validate: function(dic_data) {
            if (CommonFunc.isEmptyObject(dic_data.title)) {
                this.v_error.title.error = true;
                this.v_error.title.msg = 'Please type title';
                return false;
            }

            if (CommonFunc.isEmptyObject(dic_data.text)) {
                this.v_error.text.error = true;
                this.v_error.text.msg = 'Please type something';
                return false;
            }

            return true;
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
            const a_text = this.$refs.toastEditor.invoke('getHtml');

            let dic_param = {
                title:this.v_post.title,tags:this.v_post.tags, 
                category_id:this.g_category_id, text:a_text, token:store.getters.token
            };

            if (! this.isNewPost) {
                dic_param.id = this.g_page_id;
            }

            if (! this.validate(dic_param)) {
                CommonFunc.showOkMessage(_this,'Blog posted');
                return;
            }

            logger.log.debug('onClickSave - ',dic_param);

            CMSAPI.postBlogPost(dic_param,function(response) {
                logger.log.debug("onClickSave : response=",response);
                _this.setPageID(response.data.id);
                CommonFunc.showOkMessage(_this,'Blog posted');
            }, function(response) {
                CommonFunc.showErrorMessage(_this,'Blog posted');
            });
        },

/*
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
*/
        onClickDelete: function() {                        
            const _this = this;
            let dic_param = { id:9, token:store.getters.token};
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
        },

        onClickBack: function() {
            logger.log.debug('onClickBack - ');
        }
    }

};
</script>


<style scoped>

</style>