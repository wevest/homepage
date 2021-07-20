<template>
    <div>
        <q-card style="text-align: center;" v-if="v_user"> 
            <q-card-actions align="right">
                
                <WMoreButton ref="moreButtons" buttons="Reset Password|User Feedback" @onClick="onClickMoreButton" />

            </q-card-actions>
                        
            <q-item-section>
                <div style="padding-top:20px;">
                    <q-avatar size="20rem" square>
                        <img :src="v_user.avatar" v-if="v_user.avatar">        
                        <q-icon v-else name="person" color="black" size="120px"/>
                    </q-avatar>
                    
                    <form>
                        <q-btn fab id="pick-avatar" color="primary" label="change" class="btnAvatar q-ml-lg" ripple
                            v-show="isOwner" :loading="v_loading_change" @click="onClickChangeProfile" />
                        
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
                </div>

            </q-item-section>

            <q-card-section>
                <div :class="v_class">
                    <div class="gUserNameLG UserName">
                        {{ v_user.title }}
                        <q-badge align="top" color="white" @click="onClickDisplayName" v-if="isOwner">
                            <q-icon style="font-size: 1.4em;" color="primary" name="mode_edit" class="q-ml-sm q-mt-xs" />
                        </q-badge>
                        <div class="gCaption"> 
                            display_name
                        </div>
                    </div>
                    <div class="gUserNameMD g-mt-xl">
                        {{ v_user.username }}
                        <div class="gCaption"> 
                            username
                        </div>
                    </div>
                </div>
            </q-card-section>

            <q-card-section>
                <div class="text-left q-ma-md">
                    <div class="q-pb-md" v-if="isOwner">
                        <div class="gTextSubTitle">
                            eMail
                        </div>

                        <q-input class="gParagraphSM" filled readonly type="text" v-model="v_user.email" />
                    </div>

                    <div class="q-mb-xs">
                        <div class="gTextSubTitle">
                            Biography
                            <q-badge align="top" color="white" @click="onClickBiography" v-if="isOwner">
                                <q-icon color="primary" name="mode_edit" class="" />                        
                            </q-badge>
                        </div>
                        <q-input class="gParagraphSM" filled readonly type="textarea" v-model="v_user.biography" />
                    </div>
                </div>

    <!--                
                <div class="row" style="padding-top:14px;">
                    <div class="col-2"></div>
                    <div class="col-4">
                        <q-input 
                            v-model="v_user.first_name" 
                            label="First name"
                            dense
                            label-color="teal-10"
                            :readonly="! v_edit" /> 
                    </div>
                    <div class="col-4">
                        <q-input 
                            v-model="v_user.last_name" 
                            label="Last name"
                            dense
                            label-color="teal-10"
                            :readonly="! v_edit" />
                    </div>
                    <div class="col-2"></div>
                </div>
            <q-card-actions v-if="v_edit" align="center">
                <q-btn color="primary" label="Save" @click="onClickSave" />
            </q-card-actions>
    -->                
            </q-card-section>
            
        </q-card>
    
        <EditDialog ref="dialogEdit" title="Edit" @onSave="onSaveEdit" />
        <ResetPasswordDialog ref="passwordDialog" />

    </div>

</template>

<script>
import AWS from 'aws-sdk';
import {MoaConfig} from 'src/data/MoaConfig';
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import UserModel from "src/models/UserModel";

import AvatarCropper from "vue-avatar-cropper";
import WMoreButton from "src/components/WMoreButton";
import EditDialog from "src/components/dialogs/EditDialog";
import ResetPasswordDialog from "src/components/dialogs/ResetPasswordDialog";

export default {
    components: {
        AvatarCropper,
        WMoreButton,
        EditDialog,
        ResetPasswordDialog
    },
    props: {
        user: {
            required: true,
            default: null,
        }
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        isOwner() {
            if (this.v_user.username==this.v_me.username) {
                return true;
            }
            return false;
        },
        v_class() {
            if (this.isOwner) {
                return "";
            }
            return "q-mt-xl";
        }
    },
    data() {
		return {
            v_user: this.user,                
            
            v_mode: "",
            v_edit_button: 'Edit',
            v_loading_change: false,

            v_labels: {'submit': 'Upload', 'cancel': 'Cancel'},
        }
    },
    mounted: function() {
        //console.log("HomeView.mounted - ");
        //console.log("ProfileView.mounted - symbol=",this.$route.query);        
        //this.setUser(this.$route.query);
        //this.refresh();
    },

    methods: {        
        update: function(user) {
            logger.log.debug("ProfileBox.update : user=",user);
            this.setUser(user);
        },

        setUser: function(user) {c
            this.v_user = user;
        },

        updateUserProfile: function() {
            const _this = this;
            
            logger.log.debug("ProfileView.updateUserProfile");
            this.v_loading_change = true;
            this.v_user.updateProfile().then(response=>{
                logger.log.debug("ProfileView.updateUserProfile - response",response);
                _this.v_loading_change = false;
                CommonFunc.showOkMessage(_this,'Profile updated');
            }).catch(err=>{
                logger.log.error("ProfileView.updateUserProfile - error",err);
                _this.v_loading_change = false;
                CommonFunc.showErrorMessage(_this,'Profile update failed');
            });
        },

        updateUserPhoto: function(images) {
            this.v_user.avatar_thumb = images[0].url;
            this.v_user.avatar = images[1].url;            
            this.updateUserProfile();
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

        onClickChangeProfile: function() {
            logger.log.debug("ProfileBox.onClickChangeProfile");
        },

        onClickMessage: function() {
            logger.log.debug("ProfileView.onClickMessage");

            const _this=this;
            CommonFunc.checkButtonPermission(this,1,0).then(ret=>{
                logger.log.debug("ProfileView.onClickMessage : ret=",ret);
                if (ret==0) return;

                let v_message = new MessageThreadModel();
                v_message.to_user = _this.v_user.id;
                v_message.to_username = _this.v_user.username;
                v_message.avatar = _this.v_user.avatar;
                _this.$refs.messageWriter.show(v_message);
            });
        },

        onClickFollow: function(value) {
            logger.log.debug("onClickFollow");
                        
            const _this=this;

            CommonFunc.checkButtonPermission(this,1,0).then(ret=>{
                logger.log.debug("ProfileView.onClickFollow : ret=",ret);
                if (ret==0) return;

                _this.v_user.follow(_this.v_user.id,value).then( response => {
                    logger.log.debug("onClickFollow - response=",response);
                    
                    let msg = "Followed";
                    if (value==-1) msg = "Unfollowed";
                    CommonFunc.showOkMessage(_this,msg);

                }).catch(err=>{

                });
            });
        },


        onClickFollower: function(user) {
            logger.log.debug("onClickFollower",user);
        },

        onClickMoreFollower: function() {
            logger.log.debug("ProfileView.onClickFollower");
        },

        onClickFriend: function() {
            logger.log.debug("ProfileView.onClickFriend");
        },

        onClickMoreButton(dicParam) {
            logger.log.debug("ProfileView.onClickMoreButton : dicParam=",dicParam);
            if (dicParam.caption=='Reset Password') {
                CommonFunc.navResetPassword(this);
            }

        },

        onClickDisplayName() {
            logger.log.debug("ProfileView.onClickDisplayName");
            this.$refs.dialogEdit.setMaxlength(30);
            this.$refs.dialogEdit.show('display_name','text',this.v_user.title);
        },

        onClickBiography() {
            logger.log.debug("ProfileView.onClickBiography : ",this.v_edit);
            this.$refs.dialogEdit.setMaxlength(3000);
            this.$refs.dialogEdit.show('biography','textarea',this.v_user.biography);
        },

        onSaveEdit(dicParam) {
            logger.log.debug("ProfileView.onSaveEdit : ",dicParam);

            if (dicParam.tag=="biography") {
                this.v_user.biography = dicParam.value;
            } else if (dicParam.tag=="display_name") {
                this.v_user.title = dicParam.value;
            }
            this.updateUserProfile(this.v_user);
        }
    },

}

</script>


<style scope> 
.btnAvatar {
    text-align:right;
    top: 0; 
    right: 12px; 
    transform: translateY(-50%);
}

.UserName {
    margin: -20px 0px 30px 0px;
}

</style>
