<template>
    <div>
        <div class="row">
            <div class="col">
                <span> $123,12312,12312, </span>
            </div>
            <div>
                high chart
            </div>
        </div>

        <div class="row">
            <div class="col">
                <q-btn label="Add" @click="onClickAdd" />

                <q-table
                    title=""
                    hide-bottom
                    :data="v_portfolio.portfolio_children"
                    :columns="v_headers"
                    row-key="name"
                    :rows-per-page-options="[50]"
                    >
                        <template v-slot:body="props">

                            <q-tr :props="props">
                                <q-td key="symbol" :props="props">{{ props.row.api_asset.name }}</q-td>
                                <q-td key="price" :props="props">{{ props.row.price }}</q-td>
                                <q-td key="qty" :props="props">{{ props.row.qty }}</q-td>
                                <q-td key="updated_at" :props="props">{{ props.row.updated_at }}</q-td>
                            </q-tr>

                        </template>
                </q-table>

            </div>
        </div>

        <AddPortfolioDialog ref="addPortfolio" />

    </div>
</template>


<script>
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";
import {PortfolioModel, ThreadListModel} from "src/store/PortfolioModel";

import AddPortfolioDialog from 'components/dialogs/AddPortfolioDialog';



export default {
    name: 'PortfolioDetail',
    props: [],
    components: {
        AddPortfolioDialog
    },    
    mixins: [],
    data() {
        return {
            visible: false,
            v_portfolio: null,

            v_headers: [
                { name:'symbol', label: 'name.symbol', field: 'symbol' },
                { name:'price', label: 'name.roi', sortable:true,  field: 'price' ,
                    format: (val, row) => `${Number(val).toLocaleString()}`, 
                },
                { name:'qty', label: 'name.last_price', field: 'qty'},
                { name:'updated_at', label: 'name.homepage', field: 'updated_at'},            
            ],

        }
    },
    created() {
        logger.log.debug("MyProfile.created");
    },
    beforeMount() {
        logger.log.debug("ProfileDetailView.beforeMounted - symbol=",this.$route.params);
        this.v_portfolio = this.$route.params.portfolio;        
    },
    mounted() {
        logger.log.debug("ProfileDetailView.mounted");

        //this.$parent.$parent.$refs.header.setBackArrow(true,this);
        //this.profile = store.getters.moa.user.profile;
        //this.avatarUrl = store.getters.moa.user.firebase.photoURL;
        //this.getProfile();
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

        onClickAdd: function() {
            logger.log.debug("PortfolioDetail.onClickAdd");
            this.$refs.addPortfolio.show();
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
