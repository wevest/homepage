<template>
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.profile.title')" :desc="$t('page.profile.desc')"></CTitle>
            </div>
        </div>

        <q-card style="text-align: center;"> 
            <q-item-section>
                <q-avatar size="20rem" square>
                    <img src="https://cdn.quasar.dev/img/avatar2.jpg">        
                </q-avatar>
                <div>
                    <div></div>
                    <q-space />
                    <q-btn label="change" @click="onClickChangeProfile" />
                </div>

                    <avatar-cropper
                        ref="avatar" 
                        :labels="v_labels"
                        :uploadHandler="uploadAvatarHandler" 
                        @uploading="handleUploading"
                        @uploaded="handleUploaded"
                        @completed="handleCompleted"
                        @error="handlerError"        
                        trigger="#pick-avatar"
                        upload-url="" />

            </q-item-section>

            <q-card-section>
                <div class="text-h6">{{ v_user.username }}</div>
                <div class="text-subtitle2">{{ v_user.first_name }} {{ v_user.last_name }}</div>
            </q-card-section>

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

            <q-card-section>
                <q-input filled type="textarea" v-model="v_user.biography" />
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


        loadBlogList: function(user_id) {
            this.$refs.blogList.updateByUser(user_id);
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
            logger.log.debug("MypageView.uploadAvatarHandler",cropper,avatar);

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
                    AuthService.uploadAvatarPhoto(_this.user.username,blob)
                    .then( (path)=> {
                        logger.log.debug("MypageView.uploadAvatarHandler - completed",path);

                        //_this.profile.photoURL = path;
                        //_this.updateAvatarUrl();
                        _this.user.getAvatarUrl()
                        .then((url)=> {
                            _this.profile.photoURL = url;
                            _this.avatarUrl = url;
                            _this.updatePhoto();
                            logger.log.debug("MypageView.updateAvatarUrl",url,_this.user);            
                        }).catch( (error)=> {
                            logger.log.error("MypageView.updateAvatarUrl",error);
                            _this.avatarUrl = null;
                        });
                        
                    });

                },

                avatar.outputMime,
                avatar.outputQuality
            );
        },

        
        onClickChangeProfile: function() {
            logger.log.debug("onClickChangeProfile");
        }
    },

}

</script>


<style scope> 

.titleNumber {
  font-size:16px;  
}

</style>
