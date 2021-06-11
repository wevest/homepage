<template>
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.profile.title')" :desc="$t('page.profile.desc')"></CTitle>
            </div>
        </div>

        <q-card style="text-align: center;"> 
            <q-card-actions align="right">
                <q-btn color="primary" @click="onClickEdit">
                    Edit
                </q-btn>
            </q-card-actions>
                        
            <q-item-section>
                <div>
                    <q-avatar size="20rem" square>
                        <img :src="v_user.avatar">        
                    </q-avatar>
                    <form>
                        <q-btn fab id="pick-avatar" color="primary" label="change" class="btnAvatar" @click="onClickChangeProfile" />                                                
                        <AvatarCropper
                            ref="avatar" 
                            :labels="v_labels"
                            :uploadHandler="uploadAvatarHandler" 
                            @uploading="handleUploading"
                            @uploaded="handleUploaded"
                            @completed="handleCompleted"
                            @error="handlerError"        
                            trigger="#pick-avatar"
                            upload-url="" />
                    </form>
                    <img :src="v_img" />
                    <img :src="v_img_thumb" />
                </div>


            </q-item-section>

            <q-card-section>
                <div class="text-h6">{{ v_user.username }}</div>
                <div class="row">
                    <div class="col-6">
                        <q-input v-model="v_user.first_name" label="first name" :readonly="! v_edit" /> 
                    </div>
                    <div class="col-6">
                        <q-input v-model="v_user.last_name" :readonly="! v_edit" />
                    </div>
                </div>
            </q-card-section>

            <q-card-section>
                <q-input filled type="textarea" v-model="v_user.biography" :readonly="! v_edit" />
            </q-card-section>

            <q-card-actions align="center">
                    <q-btn color="primary" label="Message" @click="onClickMessage" />
                    <q-btn color="primary" label="Endorsement" @click="onClickEndorsement" />
            </q-card-actions>

            <q-card-actions v-if="v_edit" align="center">
                <q-btn flat color="primary" label="Save" @click="onClickSave" />
            </q-card-actions>


            <q-card-section horizontal>
                <div class="col-4">
                    <div> 
                        <span class="titleNumber"> {{ v_user.coin }} </span>
                    </div>
                    <div> 
                        <span class="titleNumber"> coin </span>
                    </div>
                </div>
                <div class="col-4">
                    <div> 
                        <span class="titleNumber"> {{ v_user.like_count }} </span>
                        
                    </div>
                    <div> like count </div>
                </div>
                <div class="col-4">
                    <div class="align-center"> 
                        <span class="titleNumber"> {{ v_user.dislike_count }} </span>
                    </div>
                    <div> dislike count </div>
                </div>                
            </q-card-section>

        </q-card>


        <div class="row">
            <div class="col-3">
                like Count
            </div>
            <div class="col-3">
                subscriber Count
            </div>
            <div class="col-3">
                blog Count
            </div>
            <div class="col-3">
                comments Count
            </div>
        </div>

        <div class="row q-gutter-sm">
            <div class="col">
                <CTitle :title="$t('page.profile.blog')" :desc="$t('page.profile.blog')"></CTitle>
                <BlogList ref='blogList'></BlogList>
            </div>
        </div>

        <div class="row q-gutter-sm">
            <div class="col">
                <CTitle :title="$t('page.profile.gift')" :desc="$t('page.profile.gift')"></CTitle>
            </div>
        </div>

    </div>

</template>

<script>
import AWS from 'aws-sdk';
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';

import UserModel from "src/store/UserModel";

import AvatarCropper from "vue-avatar-cropper";
import CTitle from 'components/CTitle';
import BlogList from 'components/BlogList';


export default {
    components: {
        CTitle,
        BlogList,
        AvatarCropper
    },
    props: {},

    data: () => ({
        g_data: null,
        g_userid:8,
        v_user: new UserModel(),
        v_edit: false,
        v_img: null,
        v_img_thumb: null,

        v_labels: {'submit': 'Upload', 'cancel': 'Cancel'},
    }),

    mounted: function() {
        //console.log("HomeView.mounted - ");
        this.refresh();
    },
    methods: {        
        refresh: function() {
            const _this = this;
                    
            let funcs = [
                this.loadUserProfile(this.g_userid),
                this.loadBlogList(this.g_userid)
            ];
            Promise.all(funcs).then(function() {

            });
        },

        updateUserModel:function(obj) {
            let v_user = new UserModel();
            
            v_user.id = obj.id;
            v_user.username = obj.username;
            v_user.first_name = obj.first_name;
            v_user.last_name = obj.last_name;
            v_user.title = obj.title;
            v_user.biography = obj.biography;
            v_user.avatar = obj.avatar;
            v_user.avatar_thumb = obj.avatar_thumb;
            v_user.coin = obj.coin;
            v_user.like_count = obj.like_count;
            v_user.dislike_count = obj.dislike_count;
            v_user.date_joined = obj.date_joined;

            this.v_user = v_user;
        },

        loadUserProfile: function(user_id) {
            const _this = this;
            
            let dic_param = {'id':user_id};
            return new Promise(function(resolve,reject) {
                AuthService.getUserProfile(dic_param,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("ProfileView.loadUserProfile - response",_this.g_data);
                    _this.updateUserModel(_this.g_data.results[0]);

                    resolve();
                },function(err) {
                    logger.log.error("ProfileView.loadUserProfile - error",err);
                    reject();
                });
            });            
        },

        updateUserProfile: function(v_user) {
            const _this = this;
            
            let dic_param = v_user;
            dic_param.token = MoaConfig.auth.token;
            logger.log.debug("updateUserProfile.dic_param=",dic_param);

            return new Promise(function(resolve,reject) {
                AuthService.updateUserProfile(dic_param,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("ProfileView.updateUserProfile - response",_this.g_data);
                    CommonFunc.showOkMessage(_this,'Profile updated');
                    resolve();
                },function(err) {
                    logger.log.error("ProfileView.updateUserProfile - error",err);
                    CommonFunc.showErrorMessage(_this,'Profile failed');
                    reject();
                });
            });            
        },

        updateUserPhoto: function(images) {
            const _this = this;
            this.v_user.avatar_thumb = images[0].url;
            this.v_user.avatar = images[1].url;
            this.updateUserProfile(this.v_user).then( function() {

            });
        },

        loadBlogList: function(user_id) {
            this.$refs.blogList.updateByUser(user_id);
        },

        updateAvatar: function(url) {
            this.v_user.avatar_url = url;
            this.updateUserProfile(this.v_user);
        },


        handleUploaded(resp) {
            logger.log.debug("handleUploaded",resp);
            this.user.photo = resp.relative_url;
        },
        handleUploading(form, xhr) {
            //form.append('foo', 'bar')
            logger.log.debug("handleUploading",form,xhr);
        },
        handleCompleted(response, form, xhr) {
            // xhr.status
        },
        handlerError(message, type, xhr) {
          if (type == 'upload') {
            // xhr.response...
          }
        },
        uploadAvatarHandler(cropper) {
            let _this = this;
            let avatar = this.$refs.avatar;
            logger.log.debug("ProfileView.uploadAvatarHandler",cropper,avatar);

            const outputMimes = 'image/jpeg';
            const outputQuality = 0.7;

            //cropper.getCroppedCanvas(this.outputOptions).toBlob(
            cropper.getCroppedCanvas(avatar.outputOptions).toBlob(
                blob => {
                    let form = new FormData();
                    //let xhr = new XMLHttpRequest();
                    let data = Object.assign({}, avatar.uploadFormData);
                    for (let key in data) {
                        form.append(key, data[key]);
                    }
                    form.append(avatar.uploadFormName, blob, avatar.filename);
                    
                    _this.processAvatarPhoto(cropper,blob);
                },
                outputMimes,
                outputQuality
            );
        },

        upload:function(s3,key,data) {
            
            return new Promise(function(resolve,reject) {
                s3.upload( {
                    Key: key, 
                    Bucket: MoaConfig.s3.bucket, 
                    Body: data, 
                    ACL:'public-read', 
                }, function(err,response) {
                    if (err) {
                        console.error("uploadAvatar:",err);
                        CommonFunc.showErrorMessage(_this,'Fail to upload image to s3');
                        resolve('');
                    }
                    console.log("upload.err=",err);
                    console.log("upload=",response);
                    resolve(response.Location);
                }
            )});
        },


        blobToImage:function(blob) {
            return new Promise(function(resolve,reject) {
                let image = document.createElement('img');
                image.src = URL.createObjectURL(blob);
                image.onload = function() {
                    //console.log("blogToImage");
                    resolve(image);
                }            
            });
        },

        processAvatarPhoto:async function(cropper,blob_avatar) {
            // check the following link
            // https://solve-programming.tistory.com/29    
            // https://day0404.tistory.com/entry/Nuxtjs-Toast-Ui-Editor-%EC%A0%81%EC%9A%A9

            const _this = this;

            let image_avatar = await this.blobToImage(blob_avatar);
            //console.log("process-0",image_avatar);
            console.log("process-1",blob_avatar);
            let blob_avatar_thumb = await CommonFunc.resizeImage(image_avatar,MoaConfig.setting.thumbNailWidth,MoaConfig.setting.thumbNailHeight,0);
            console.log("process-2",blob_avatar_thumb);

            const s3 = new AWS.S3({
                accessKeyId: MoaConfig.s3.key,
                secretAccessKey: MoaConfig.s3.secret 
            });
            
            let files = [];
            files.push( { key:"avatar_thumb_"+_this.v_user.username+".jpeg", data:blob_avatar_thumb, url:''} );
            files.push( { key:"avatar_"+_this.v_user.username+".jpeg", data:blob_avatar, url:''} );

            for (let index=0;index<files.length;index++) {                    
                let a_url = await _this.upload(s3,files[index].key, files[index].data);
                files[index].url = a_url;
            }
            console.log("files=",files);
            
            this.updateUserPhoto(files);
            return files;
        },



        onClickEdit: function() {
            logger.log.debug("onClickEdit - edit=",this.v_edit);
            this.v_edit = ! this.v_edit;
        },

        onClickSave: function() {
            logger.log.debug("onClickSave");
            this.updateUserProfile(this.v_user);
        },

        onClickChangeProfile: function() {
            logger.log.debug("onClickChangeProfile");
        },

        onClickMessage: function() {
            logger.log.debug("onClickMessage");
        },

        onClickEndorsement: function() {
            logger.log.debug("onClickEndorsement");
        },

    },

}

</script>


<style scope> 

.titleNumber {
  font-size:16px;  
}

.btnAvatar {
    text-align:right;
    top: 0; 
    right: 12px; 
    transform: translateY(-50%);
}

</style>
