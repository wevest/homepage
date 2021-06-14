<template>
    <div>
    </div>
</template>


<script>
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";


export default {
    name: 'UserPortfolio',
    props: ['user'],
    components: {
        
    },    
    mixins: [],
    data() {
        return {
            visible: false,
            //user: store.getters.moa.user,
            labels: {'submit': 'Upload', 'cancel': 'Cancel'},
            emailMsg:"Please type valid email address"
        }
    },
    created() {
        logger.log.debug("MyProfile.created");
    },
    beforeMount() {
        logger.log.debug("MyProfile.beforeMount");
    },
    mounted() {
        logger.log.debug("MyProfile.mounted");
        this.$parent.$parent.$refs.header.setBackArrow(true,this);
        this.profile = store.getters.moa.user.profile;
        this.avatarUrl = store.getters.moa.user.firebase.photoURL;
        this.getProfile();
    },
    beforeDestroy() {
        logger.log.debug("MyProfile.beforeDestroy");
        this.$parent.$parent.$refs.header.setBackArrow(false,this);
    },

    methods: {
        show() {
            this.visible = true;
        },
        hide() {
            this.visible = false;
        },
        validateState(ref) {
            //logger.log.debug("validateState",ref,this.veeFields[ref]);
            if ( this.veeFields[ref] && (this.veeFields[ref].dirty || this.veeFields[ref].validated))
            {
                return !this.veeErrors.has(ref)
            }
            return null;
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
        updateProfile() {
            const _this = this;
            AuthService.updateProfile(this.user,this.profile)
            .then( (p)=> {
                logger.log.debug("MyProfile.onClickUpdate - completed");
                _this.$parent.$parent.$refs.completeAlert.show();
            }).catch( (error) => {
                logger.log.error("MyProfile.onClickUpdate",error);
            });
        },
        updatePhoto() {
            const _this = this;
            AuthService.updatePhoto(this.user,this.profile)
            .then( (p)=> {
                logger.log.debug("MyProfile.updatePhoto - completed");
                _this.$parent.$parent.$refs.completeAlert.show();
            }).catch( (error) => {
                logger.log.error("MyProfile.updatePhoto",error);
            });
        },
        getAvatarUrl() {
            const _this = this;
            return new Promise(function(resolve,reject) {
                _this.user.getAvatarUrl()
                .then((url)=> {
                    _this.avatarUrl = url;
                    logger.log.debug("MyProfile.updateAvatarUrl",url,_this.user);            
                }).catch( (error)=> {
                    logger.log.error("MyProfile.updateAvatarUrl",error);
                    _this.avatarUrl = null;
                });

            });
        },
        getProfile() {
            const _this = this;
            AuthService.getProfile(this.user)
            .then( (profile)=> {
                logger.log.debug("getProfile",);
                _this.profile = profile;
            }).catch( (error) => {
                logger.log.error("getProfile",erro);
            });
        },



        onSubmit() {
            logger.log.debug("MyProfile.onSubmit");
        },
        onClickUpdate: function() {
            logger.log.debug("MyProfile.onClickUpdate",this.user);
            this.updateProfile();
        },
        onClickCancel: function() {
            logger.log.debug("MyProfile.onClickCancel");
            this.hide();
        }

    }
};
</script>



<style scoped>

::placeholder{
  color:rgba(255, 255, 255, 0.2);
}


.myProfile{
  height: 100%;
  width:100%;
  position: fixed;
  z-index: 1200;
  top: 0;
  left: 0;
  overflow-x: hidden;
  padding-top: 60px;
  transition: 0.5s;
  background-color: #36393e;
}

.modal-content{
  background: #ffffff !important;
  color:#000 !important;
}
</style>
