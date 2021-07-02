<template>
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle title="$t('page.profile.title')" desc="$t('page.profile.desc')"></CTitle>
            </div>
        </div>

        <q-card style="text-align: center;"> 
            <q-card-actions align="right">
                <q-btn color="primary" @click="onClickPortfolio2" label="Portfolio" />
<!--
                <q-btn color="primary" @click="onClickBack" v-show="v_back" label="Back" />
-->                
                <q-btn color="primary" @click="onClickEdit" v-show="isOwner" label="Edit" />
            </q-card-actions>
                        
            <q-item-section>
                <div>
                    <q-avatar size="20rem" square>
                        <img :src="v_user.avatar" v-if="v_user.avatar">        
                        <q-icon v-else name="person" color="black" size="120px"/>
                    </q-avatar>
                    
                    <form>
                        <q-btn fab id="pick-avatar" color="primary" label="change" class="btnAvatar" 
                            v-show="isOwner" @click="onClickChangeProfile" />
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

            <q-card-section class="boxNumber1">
                <div class="text-h6">{{ v_user.username }}</div>
                <div class="row">
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
            </q-card-section>

            <q-card-section>
                <q-input filled type="textarea" v-model="v_user.biography" :readonly="! v_edit" />
            </q-card-section>

            <q-card-actions v-if="v_edit" align="center">
                <q-btn color="primary" label="Save" @click="onClickSave" />
            </q-card-actions>
        </q-card>

        <q-card style="text-align: center;">
            <q-card-section class="boxNumber">
                <div class="row boxNumber2">                    
                    <div class="col-6 roiBox">
                        <div> 
                            <span class="roiCount"> {{ v_roi }} % </span>
                        </div>
                        <div> 
                            <span class="valueDesc"> $ {{ v_evaluated_value }} </span>
                        </div>
                    </div>
                    <div class="col-6 countBox">
                        <div class="align-center"> 
                            <span class="roiCount"> {{ v_user.portfolio.item_count }} </span>
                        </div>
                        <div> 
                            <span class="valueDesc">portfolio item count </span>
                        </div>
                    </div>                
                </div>
            </q-card-section>
        </q-card>

            <!-- <q-card-actions class="boxNumber2" align="center"> -->
                    <!-- <q-btn color="primary" label="Message" @click="onClickMessage" /> -->
                    <!-- <q-btn color="primary" label="Endorsement" @click="onClickEndorsement" /> -->
            <!-- </q-card-actions> -->        

        <q-card style="text-align: center;"> 
            <q-card-section class="boxNumber3">
                <div class="row">
                    <div class="col-4" @click="onClickFollower(v_user)">
                        <div>
                            <span class="count">{{v_user.follower_count}}</span>
                        </div>
                        <div>
                            <span>Follower Count</span>
                        </div>
                    </div>
                    <div class="col-4">
                        <div>
                            <span class="count">{{v_user.like_count}}</span>
                        </div>
                        <div>
                            <span>좋아요</span>
                        </div>
                    </div>
                    <div class="col-4">
                        <div>
                            <span class="count">{{v_user.dislike_count}}</span>
                        </div>
                        <div>
                            <span>싫어요</span>
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>

            <q-card-actions class="boxNumber2" align="center">
                <div v-if="! isOwner">
                    <q-btn color="primary" label="Unfollow" @click="onClickFollow(-1)" v-if="v_user.is_following" />
                    <q-btn v-else color="primary" label="Follow" @click="onClickFollow(1)" />
                </div>
                <q-btn color="primary" label="Message" @click="onClickMessage" />
            </q-card-actions>

        <div class="row q-gutter-sm">
            <div class="col">
                <CTitle title="$t('page.profile.portfolio')" desc="$t('page.profile.portfolio')"></CTitle>
                <q-btn v-if="isOwner" class="addBtn" label="Add" @click="onClickAddPortfolio" />
                <PortfolioList ref='portfolioList' @onClickPortfolio="onClickPortfolio"></PortfolioList>
            </div>
        </div>

        <div class="row q-gutter-sm">
            <div class="col">
                <CTitle title="$t('page.profile.gift')" desc="$t('page.profile.gift')"></CTitle>
            </div>
        </div>

        <AddPortfolioDialog ref="addPortfolio" />
        <MessageWriterDialog ref="messageWriter" />

    </div>

</template>

<script>
import AWS from 'aws-sdk';
import {MoaConfig} from 'src/data/MoaConfig';
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';

import UserModel from "src/models/UserModel";
import {MessageThreadModel, MessageThreadListModel, MessageModel, MessageListModel} from "src/models/MessageModel";

import AvatarCropper from "vue-avatar-cropper";
import CTitle from 'components/CTitle';
import BlogList from 'components/lists/BlogList';
import AddPortfolioDialog from 'components/dialogs/AddPortfolioDialog';
import MessageWriterDialog from 'components/dialogs/MessageWriterDialog';
import PortfolioList from 'src/pages/user/component/PortfolioList';


export default {
    components: {
        CTitle,
        BlogList,
        AvatarCropper,
        AddPortfolioDialog,
        MessageWriterDialog,
        PortfolioList
    },
    props: {},
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
        v_roi() {
            if (! this.v_user.portfolio.roi) {
                return 0;
            }
            return CommonFunc.formatNumber(this.v_user.portfolio.roi,2);
        },
        v_evaluated_value() {
            if (! this.v_user.portfolio.evaluated_value) {
                return 0;
            }
            return CommonFunc.formatNumber(this.v_user.portfolio.evaluated_value,2);
        }
    },
    data: () => ({
        g_data: null,

        v_user: new UserModel(),
        v_edit: false,
        v_back: false,

        v_labels: {'submit': 'Upload', 'cancel': 'Cancel'},
    }),
    mounted: function() {
        //console.log("HomeView.mounted - ");
        console.log("ProfileView.mounted - symbol=",this.$route.query);
        
        this.setUser(this.$route.query);
        this.refresh();
    },

    methods: {        
        setUser: function(params) {
            const _this = this;

            if (params.back) {
                this.v_back = true;
            } else {
                this.v_back = false;
            }

            let username = params.username;
            if (! username) {
                username = this.v_me.username;
            }
            UserModel.loadProfile(username).then( a_user => {
                _this.v_user = a_user;

                _this.v_user.loadPortfolio().then( response => {
                    logger.log.debug("setUser=>",response);
                    _this.updatePortfolioWidget();
                });
            });
        },

        updatePortfolioWidget: function() {
            const _this = this;

            store.state.prices.load().then( response => {
                logger.log.debug("updatePortfolioWidget",response);
                _this.v_user.portfolio.calcPerformance(store.state.prices);
                _this.$refs.portfolioList.update(_this.v_user.portfolio);
            });
        },

        refresh: function() {
            const _this = this;
                    
            let funcs = [
                //this.loadUserProfile(this.v_user.username),
                //this.loadBlogList(this.v_user.id)
                //store.state.assets.load(),
            ];
            Promise.all(funcs).then(function() {

            });
        },

        updateUserProfile: function() {
            const _this = this;
            
            logger.log.debug("ProfileView.updateUserProfile");
            this.v_user.updateProfile().then(response=>{
                logger.log.debug("ProfileView.updateUserProfile - response",response);
                CommonFunc.showOkMessage(_this,'Profile updated');
            }).catch(err=>{
                logger.log.error("ProfileView.updateUserProfile - error",err);
                CommonFunc.showErrorMessage(_this,'Profile update failed');
            });
        },

        updateUserPhoto: function(images) {
            this.v_user.avatar_thumb = images[0].url;
            this.v_user.avatar = images[1].url;
            this.updateUserProfile();
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

        onClickBack: function() {
            logger.log.debug("onClickBack - back=");
            CommonFunc.navBack(this);
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

            let v_message = new MessageThreadModel();
            v_message.to_user = this.v_user.id;
            v_message.to_username = this.v_user.username;
            v_message.avatar = this.v_user.avatar;
            this.$refs.messageWriter.show(v_message);
        },

        onClickFollow: function(value) {
            logger.log.debug("onClickFollow");
            
            /*
            this.v_user.getRelation().then( response => {
                logger.log.debug("onClickFollow - response=",response);
            }).catch(err=>{

            });
            */
            
            const _this=this;
            this.v_user.follow(this.v_user.id,value).then( response => {
                logger.log.debug("onClickFollow - response=",response);
                CommonFunc.showOkMessage(_this,'Followed');                
            }).catch(err=>{

            });
            
        },

        onClickAddPortfolio: function() {
            logger.log.debug("onClickAddPortfolio");
            this.$refs.addPortfolio.show(this.v_user,null);
        },

        onClickPortfolio2: function(portfolio) {

        },

        onClickPortfolio: function(portfolio) {
            logger.log.debug("onClickPortfolio",portfolio);
            //this.$refs.addPortfolio.show();
            
            store.getters.nav.add(this.$route);
            let dic_param = { name:'portfolio_detail', path:'portfolio_detail', params:{ user:this.v_user, portfolio:portfolio, back:true } };
            this.$router.push(dic_param);
        },

        onClickFollower: function(user) {
            logger.log.debug("onClickFollower",user);
        },


    },

}

</script>


<style scope> 

.addBtn {
    margin-bottom:7px;
}

.roiCount {
  font-size:25px;  
  color:#222222;
  font-weight: bold;
}

.valueDesc {
   font-size:14px;  
   color:#8C8C8C;
}

.roiBox {
    padding-right:20px;
}

.countBox {
    padding-left:20px;
}

.btnAvatar {
    text-align:right;
    top: 0; 
    right: 12px; 
    transform: translateY(-50%);
}

.boxNumber {
    padding:16px 2px;
    margin-top:5px;
}

.boxNumber1 {
    padding:2px 16px;
}

.boxNumber2 {
    padding:16px 2px;
}

.boxNumber3 {
     padding:16px 2px;
     margin-top:5px;
}

.count {
    color:#222222;
    font-size:15px;
    font-weight:bold;
}
</style>
