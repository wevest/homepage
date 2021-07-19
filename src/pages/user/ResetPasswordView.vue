<template>

    <div class="q-pa-xl">
        <div>
            <CTitle :title="$t('Inbox')" :desc="$t('page.message.desc')"></CTitle>
            <div class="gCaption">
                1. Password must at leatst 8 chars
            </div>
        </div>

        <div class="q-my-md">

            <q-form
                ref="formPassword"
                @submit.prevent="onClickSave"
                class="q-gutter-y-md q-field--with-bottom col-width"
            >

                <div>
                    <q-input lazy-rules v-model="v_password" type="password" label="Current Password" maxlength
                        :rules="[ val => val && val.length > 8 || 'Please type password at least 8 ']" />
                    <q-input lazy-rules v-model="v_new_password" type="password" label="New Password" 
                        ref="fldPasswordChange"
                        :rules="[ val => val && val.length > 8 || 'Please type password  at least 8']" />
                    <q-input lazy-rules v-model="v_new_password2" type="password" label="Confirm" 
                        ref="fldPasswordChangeConfirm" v-bind:rules="v_confirm" />
                </div>

            </q-form>

        </div>

        <div class="q-gutter-md text-center">
            <q-btn outline v-close-popup>Cancel</q-btn>
            <q-btn color="primary" @click="onClickSave">&nbsp;Save&nbsp;</q-btn>
        </div>

        <div>
            your password is reset
        </div>
    </div>

</template>

<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CTitle from 'components/CTitle';

export default {
    name: 'ResetPasswordDialog',
    components: {
        CTitle
    },
    props: {
        title: { required:false, type:String, default: 'Reset Password'},
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_confirm() {
            return [
                (v) => !!v || "password are different :-)",
                (v) => v == this.$refs.fldPasswordChange.value || "Password different"
            ]
        },
    },
    data: function () {
        return {            
            v_show: false,
            
            v_password:'',
            v_new_password: '',
            v_new_password2: '',
        }
    },

    created: function () {},
    mounted: function() {},
    updated: function() {},
    
    methods: {      

        checkPassword(PasswordParameter) {

            let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
            let mediumPassword = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');
                        
            if(strongPassword.test(PasswordParameter)) {
                strengthBadge.style.backgroundColor = "green";
                strengthBadge.textContent = 'Strong';
            } else if(mediumPassword.test(PasswordParameter)) {
                strengthBadge.style.backgroundColor = 'blue';
                strengthBadge.textContent = 'Medium';
            } else {
                strengthBadge.style.backgroundColor = 'red';
                strengthBadge.textContent = 'Weak';
            }
        },

        validate: function() {
            if (CommonFunc.isEmptyObject(v_password)) {
                this.v_error.text.error = true;
                this.v_error.text.msg = 'Please type something';
                return false;
            }

            return true;
        },

        show: function() {
            logger.log.debug("ResetPasswordDialog.show");
            this.v_show = true;
        },

        hide: function() {
            this.v_show = false;
        },


        postProcess: function(response) {
            this.setPostID(response.data.id);
            this.v_post.saved = true;
        },

        onClickSave: function() {                        
            const _this=this;

            let dicParam = {password: this.v_password, 
                new_password:this.v_new_password, new_password2:this.v_new_password2 };

            this.$refs.formPassword.validate().then(ret=>{
                logger.log.debug('ResetPasswordDialog.onClickSave - ret=',ret);
                if (! ret) { return; }

                _this.v_me.resetPassword(dicParam).then(resp=>{
                    logger.log.debug('ResetPasswordDialog.onClickSave - resp=',resp);
                }).catch(err=>{
                    logger.log.error('ResetPasswordDialog.onClickSave - err=',err);
                });

            });
                
        },

        onClickBack: function() {
            logger.log.debug('onClickBack - ');
            this.hide();
        },
        

    }

};
</script>


<style scoped>

</style>