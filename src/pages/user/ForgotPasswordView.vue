<template>


    <div class="q-pa-xl">

        <div>
            <CTitle :title="$t('page.forgot_password.title')" :desc="$t('page.forgot_password.desc')" />
            <div class="gCaption">
                {{ $t('page.forgot_password.rules.title') }}
            </div>
        </div>

        <div class="q-my-md" v-if="v_tab=='input'">

            <q-form
                ref="formPassword"
                class="q-gutter-y-md q-field--with-bottom col-width"
                @submit.prevent="onClickSave"                    
            >

                <div>

                    <q-input
                        filled required 
                        type="email" id="email"
                        v-model="v_input.email"
                        :label="$t('page.signup.email.title')" hint="" 
                        :rules="[ val => (val) && (val.length <= 50) || 'Please use maximum 50 characters']"
                        @blur="verifyEmail"
                        :error="v_error.email.error"
                        :error-message="v_error.email.msg">
                        <template v-slot:error>
                            Must be a valid email address.
                        </template>                            
                    </q-input>

                    
                    <q-input
                        filled maxlength="6" type="number"
                        v-model="v_input.code"
                        :label="$t('page.signup.code.title')" ref="fldCode"
                        :error="v_error.code.error"
                        :error-message="v_error.code.msg"
                    >
                        <template v-slot:append>                        

                            <q-btn :label="v_button_send" :loading="v_loading_token"
                                :disable="! v_button_send_enabled" color="primary" 
                                @click="onClickResend" />

                        </template>    

                    </q-input>
                    
                    <div class="text-center">
                        <WTimer ref="authTimer" class="q-mx-sm" :caption="$t('page.forgot_password.expire.title')" 
                            :visible="v_show_password" @onTimeout="onTimeout"/>
                    </div>

                </div>
            </q-form>

            <q-slide-transition>
                <div v-if="v_show_password">
                    <div>
                        <q-input v-model="v_input.new_password" type="password" 
                            :label="$t('page.change_pwd.new.title')" 
                            ref="fldPasswordChange"
                            :rules="[ val => val && val.length > 8 || $t('page.change_pwd.new.error') ]" 
                            :error="v_error.password.error"
                            :error-message="v_error.password.msg"
                        />

                        <q-input 
                            v-model="v_input.new_password2" type="password" 
                            ref="fldPasswordChangeConfirm"                             
                            :label="$t('page.change_pwd.confirm.title')"
                            :error="v_error.password2.error"
                            :error-message="v_error.password2.msg"
                        />

                    </div>

                    <div class="q-gutter-md text-center">
<!--                        
                        <q-btn outline v-close-popup>{{ $t('button.cancel') }}</q-btn>
-->
                        <q-btn color="primary" @click="onClickSave" :disable="v_button_update_disable">
                            {{ $t('button.update') }}
                        </q-btn>
                    </div>
                </div>
            </q-slide-transition>


        </div>

            

        <div v-if="v_tab=='done'">

            <div class="text-center">
                <q-icon 
                    class="q-my-md" name="task_alt" style="font-size: 7em; color: #4caf50;" />

                <div class="q-my-md gPageTitle">
                    {{ $t('dialog.reset_password.title') }}
                </div>
                <div class="gParagraphSM">
                    {{ $t('dialog.reset_password.password_changed.title') }}
                </div>    
                <div class="gParagraphSM">
                    {{ $t('dialog.reset_password.password_complete.title') }}
                </div>
                <q-btn class="q-mt-xl" color="primary" label="Sign in" @click="onClickSignin" />
            </div>
        </div>


    </div>

</template>

<script>
import {MoaConfig} from 'src/data/MoaConfig';
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CTitle from 'components/CTitle';
import WTimer from "components/WTimer";

import AuthService from 'src/services/authService';

export default {
    name: 'ResetPasswordDialog',
    components: {
        CTitle,
        WTimer
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
                (v) => !!v || this.$t('page.change_pwd.new.error'),
                (v) => v == this.$refs.fldPasswordChange.value || this.$t('page.change_pwd.confirm.error')
            ]
        },
        v_validate_code() {
            return [ (v) => v.length!=6 || this.$t('page.change_pwd.code') ]            
        }
    },
    data () {
        return {            
            v_show: false,                    
            v_show_password: false,
            
            v_tab:'input',

            v_input: {
                code: '',
                email:'',
                new_password: '',
                new_password2: '',
            },

            v_error: { 
                password: {error:false, msg:''},
                password2: {error:false, msg:''},
                email: {error:false, msg:''},
                code: {error:false, msg:''},
            },

            v_button_send: '',
            v_button_send_enabled: true,

            v_button_update_disable: true,
            v_loading_token: false,

            v_loading:false,
        }
    },

    created() {},
    mounted() {
        this.prepare();
    },
    updated() {},
    
    methods: {      
        prepare() {
            this.v_button_send = this.$t('button.send2');
            this.v_button_signup_disable = true;
        },
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

        setPasswordBoxVisible(value) {
            this.v_show_password = value;
        },

        validatePassword() {
            logger.log.debug("validatePassword - 1");

            if (CommonFunc.isEmptyObject(this.v_input.new_password)) {
                logger.log.debug("validatePassword - 1.1");
                this.v_error.password.error = true;
                this.v_error.password.msg = 'Please type password';
                return false;
            } else {
                this.v_error.password.error = false;
                this.v_error.password.msg = '';
            }

            logger.log.debug("validatePassword - 2");

            if (CommonFunc.isEmptyObject(this.v_input.new_password2)) {
                this.v_error.password2.error = true;
                this.v_error.password2.msg = 'Please type confirm password';
                return false;
            } else {
                this.v_error.password2.error = false;
                this.v_error.password2.msg = '';
            }

            logger.log.debug("validatePassword - 3");
            if (this.v_input.new_password!=this.v_input.new_password2) {
                this.v_error.password2.error = true;
                this.v_error.password2.msg = 'password does not match';
                return false;
            }

            logger.log.debug("validatePassword - 4");

            this.v_error.password.error = false;
            this.v_error.password.msg = '';
            this.v_error.password2.error = false;
            this.v_error.password2.msg = '';

            return true;
        },

        validateCode() {
            if (CommonFunc.isEmptyObject(this.v_input.code)) {
                this.v_error.code.error = true;
                this.v_error.code.msg = 'Please type code';
                return false;
            }

            if (this.v_input.code.length!=6) {
                this.v_error.code.error = true;
                this.v_error.code.msg = 'Please type 6-digits code';
                return false;
            }

            this.v_error.code.error = false;
            this.v_error.code.msg = '';

            return true;
        },

        verifyEmail() {
            if (! CommonFunc.verifyEmail(this.v_input.email)) {
                logger.log.debug("ForgotPasswordView.verifyEmail");

                this.v_error.email.error = true;
                this.v_error.email.msg = this.$t("page.forgot_password.email.error");
                return false;
            } 
            
            this.v_error.email.error = false;
            this.v_error.email.msg = '';
            return true;
        },

        show() {
            logger.log.debug("ResetPasswordDialog.show");
            this.v_show = true;
        },

        hide() {
            this.v_show = false;
        },


        postProcess(response) {
            if (response.data.ret==0) {
                this.v_tab = 'done';
                return
            }            

        },

        onClickResend() {
            logger.log.debug("ForgotPasswordView.onClickResend");
            
            if (!this.verifyEmail()) {                
                return;
            };

            const _this=this;
            let dicReq = {email:this.v_input.email};
            this.v_loading_token = true;
            AuthService.requestActivationCode(dicReq,function(resp) {
                logger.log.debug("ForgotPasswordView.onClickResend:resp=",resp);
                _this.v_loading_token = false;
                                
                _this.$refs.authTimer.setTime(MoaConfig.setting.authCodeTimelimit);
                
                _this.v_button_update_disable = false;
                _this.v_button_send_enabled = false;
                _this.v_button_send = _this.$t('button.resend');
                _this.v_input.code = '';

                _this.setPasswordBoxVisible(true);

            },function(err) {
                logger.log.error("ForgotPasswordView.onClickResend:err=",err);
                _this.v_loading_token = false;
                _this.v_button_signup_disable = true;
            });
        },

        onClickSave() {                        
            const _this=this;
            
            if (! this.validateCode()) return;
            if (! this.validatePassword()) return;

            this.$refs.formPassword.validate().then(ret=>{
                logger.log.debug('ForgotPasswordView.onClickSave - ret=',_this.v_me);
                if (! ret) { return; }

                _this.v_loading = true;

                let dicParam = { email: _this.v_input.email,
                    code: _this.v_input.code, 
                    new_password:_this.v_input.new_password, 
                    new_password2:_this.v_input.new_password2 };

                _this.v_me.resetPassword(dicParam).then(resp=>{
                    logger.log.debug('ForgotPasswordView.onClickSave - resp=',resp);
                    _this.postProcess(resp);
                    _this.v_loading = false;

                }).catch(err=>{
                    logger.log.error('ForgotPasswordView.onClickSave - err=',err);
                    _this.v_loading = false;
                    
                    const a_dialog = store.getters.components.getComponent('alertDialog');
                    a_dialog.show('Error','Something is wrong, please try again');
                });

            });
                
        },

        onClickBack: function() {
            logger.log.debug('onClickBack - ');
            this.hide();
        },
        
        onClickSignin() {
            logger.log.debug('ResetPasswordView.onClickSignin');
            NavFunc.navSignin(this,false);
        },

        onTimeout(dicParam) {
            logger.log.debug("SigninView.onTimeout: dicParam=",dicParam);
            this.v_button_send_enabled = true;
            this.v_button_update_disable = true;
        }

    }

};
</script>


<style scoped>




</style>