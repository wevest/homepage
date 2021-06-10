<template>
  <div>
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

    <q-dialog v-model="v_confirm" persistent>
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
                <span class="q-ml-sm">{{v_confirm_title}}</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Ok" color="primary" @click="onClickConfirm('ok')" />
                <q-btn flat label="Cancel" color="primary" @click="onClickConfirm('cancel')" />
            </q-card-actions>
        </q-card>
    </q-dialog>

  </div>

</template>

<script>
import AWS from 'aws-sdk';
import 'codemirror/lib/codemirror.css'; 
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/vue-editor';

import { CONST } from 'src/data/const';
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';

import PostModel from "src/store/PostModel";

export default {
    name: 'BaseEditor',
    components: {
        Editor,
    },
    computed: {
        isNewPost: function() {
            if (this.g_page_id) {
                return false;
            }
            return true;
        }
    },
    data: function () {
        return {
            v_post: new PostModel(),
            v_confirm: false,
            v_confirm_title: 'do you want to quit?',

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
    mounted: function() {},

    updated: function() {},
    
    methods: {
        setContent(content) {
            this.$refs.toastEditor.invoke('setMarkdown', content);
        },

        setPostModel: function(post) {
            this.v_post.assign(post);
            this.setContent(this.v_post.body);
        },

        createThumbnail: function(img) {
            const resizedImage = CommonFunc.resizeImage(img,MoaConfig.setting.thumbNailWidth, MoaConfig.setting.thumbNailHeight, 0);
            return resizedImage;
        },

        showConfirm: function(msg) {
          this.v_confirm_title = msg;
          this.v_confirm = true;
        },

        hideConfirm: function() {
          this.v_confirm = false;
        },

        getContents: function() {
          let a_text = this.$refs.toastEditor.invoke('getHtml');
          return a_text;
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
                    //console.log("upload=",response);
                    resolve(response.Location);
                    return response.Location;
                });

            });
        },

        save: function(v_post) {                        
            const _this = this;
            const a_text = this.getContents();

            let dic_param = {
                id: v_post.id,
                title: v_post.title,
                tags: v_post.tags, 
                category_id: v_post.category, 
                content_type: v_post.content_type,
                parent_id: v_post.parent_id,
                token:MoaConfig.auth.token,
                text:a_text, 
            };

            if (v_post.content_type==CONST.CONENT_TYPE_ASSET_QUESTION) {

              CMSAPI.postAssetQuestion(dic_param,function(response) {
                  logger.log.debug("onClickSave : response=",response);
                  _this.$emit("onPostSave",{ret:1, response:response});
              }, function(error) {
                  _this.$emit("onPostSave",{ret:0, response:error});
              });

            } else if (v_post.content_type==CONST.CONENT_TYPE_ASSET_ANSWER) {
              dic_param.question_id = v_post.question_id; 
              logger.log.debug("save : v_post=",this.v_post);

              CMSAPI.postAssetAnswer(dic_param,function(response) {
                  logger.log.debug("onClickSave : response=",response);
                  _this.$emit("onPostSave",{ret:1, response:response});                  
              }, function(error) {
                  _this.$emit("onPostSave",{ret:0, response:error});
              });

            } else {

              CMSAPI.postBlogPost(dic_param,function(response) {
                  logger.log.debug("onClickSave : response=",response);
                  _this.$emit("onPostSave",{ret:1, response:response});
              }, function(error) {
                  _this.$emit("onPostSave",{ret:0, response:error});
              });

            }


        },

        delete: function(v_post) {                        
            const _this = this;
            let dic_param = { id:v_post.id, token:MoaConfig.auth.token};
            logger.log.debug('onClickDelete - ',dic_param);
            CMSAPI.deleteBlogPost(dic_param,function(response) {
              _this.$emit("onPostDelete",{ret:1, response:response});
            }, function(error) {
              _this.$emit("onPostDelete",{ret:0, response:error});
            });
        },

        onClickConfirm: function(value) {
          this.v_confirm = false;
          this.$emit("onClickConfirm",value);
        }
    }
};
</script>


<style scoped>

</style>