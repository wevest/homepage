<template>
  <div>

    <froala :tag="'textarea'" :config="v_config" v-model="v_contents"></froala>

  </div>

</template>

<script>
import AWS from 'aws-sdk';

import { CONST } from 'src/data/const';
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';

import VueFroala from 'vue-froala-wysiwyg';

import {PostPageModel} from "src/models/PageModel";

export default {
    name: 'BaseEditor',
    components: {
        VueFroala,
    },
    props: {
        contents: {
            default:null,
        },
        customSave: {
            default: '0'
        }
    },
    computed: {
        isNewPost() {
            if (this.g_page_id) {
                return false;
            }
            return true;
        }
    },
    data() {
        return {
            v_contents: this.contents,

            v_post: new PostPageModel(),
            v_confirm: false,
            v_confirm_title: 'Do you want to quit?',
            v_config: {
                charCounterCount: true,
                toolbarBottom: true,
/*                
                toolbarButtons: {
                    'moreRich': {
                        'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertFile', 'insertHR']
                    },
                },
*/                
                events: {
                    'froalaEditor.initialized': function () {
                        logger.log.debug('BaseEditor.initialized')
                    }
                }
            }
        }
    },

    created() {
        logger.log.debug("BlogWriterView.created");
    },
    mounted() {},

    updated() {},
    
    methods: {
        setContent(content) {            
            //this.$refs.toastEditor.invoke('setMarkdown', content);
            this.v_post.body = content;
        },

        getContents() {
          //let a_text = this.$refs.toastEditor.invoke('getMarkdown');
          return this.v_post.body;
        },

        setPostModel(post) {
            this.v_post.assign(post);
            this.setContent(this.v_post.body);
        },

        createThumbnail(img) {
            const resizedImage = CommonFunc.resizeImage(img,MoaConfig.setting.thumbNailWidth, MoaConfig.setting.thumbNailHeight, 0);
            return resizedImage;
        },

        showConfirm(msg) {
          this.v_confirm_title = msg;
          this.v_confirm = true;
        },

        hideConfirm() {
          this.v_confirm = false;
        },

        uploadImage(blob) {
            // check the following link
            // https://solve-programming.tistory.com/29    
            // https://day0404.tistory.com/entry/Nuxtjs-Toast-Ui-Editor-%EC%A0%81%EC%9A%A9

            const _this = this;

            //logger.log.debug("uploadImage=",blob);
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

        save(v_post,a_tag) {                        
            const _this = this;
            let a_text = this.getContents();
            
            let dic_param = {
                id: v_post.id,
                title: v_post.title,
                tags: v_post.tags, 
                category_id: v_post.category, 
                content_type: v_post.content_type,
                asset_id: v_post.asset_id,
                token:MoaConfig.auth.token,
                text: CommonFunc.addHashTag(a_text,a_tag)
            };

            if (v_post.content_type==CONST.CONENT_TYPE_ASSET_ANSWER) {
                dic_param.question_id = v_post.question_id; 
            }

            v_post.post(dic_param).then( response => {
                logger.log.debug("onClickSave : response=",response);
                _this.$emit("onPostSave",{ret:1, response:response});
            }).catch(err=>{
                _this.$emit("onPostSave",{ret:0, response:error});
            });

/*
            } else {

                CMSAPI.postBlogPost(dic_param,function(response) {
                    logger.log.debug("onClickSave : response=",response);
                    _this.$emit("onPostSave",{ret:1, response:response});
                }, function(error) {
                    _this.$emit("onPostSave",{ret:0, response:error});
                });

            }
*/

        },

        delete(v_post) {                        
            const _this = this;
            let dic_param = { id:v_post.id, token:MoaConfig.auth.token};
            logger.log.debug('onClickDelete - ',dic_param);
            CMSAPI.deleteBlogPost(dic_param,function(response) {
              _this.$emit("onPostDelete",{ret:1, response:response});
            }, function(error) {
              _this.$emit("onPostDelete",{ret:0, response:error});
            });
        },

        onClickConfirm(value) {
          this.v_confirm = false;
          this.$emit("onClickConfirm",value);
        }
    }
};
</script>


<style scoped>

</style>