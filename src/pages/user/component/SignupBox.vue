<template>
    <div>
        <q-slide-transition>
            <div class="col-width" v-if="v_show_signup1">
                <q-form
                    @submit.prevent="onSignUp"
                    class="q-field--with-bottom q-mt-md"
                >
                    <q-input
                        filled required 
                        type="email" id="email"
                        v-model="v_user.email"
                        :label="$t('page.signup.email.title')" hint="" 
                        :rules="[ val => (val) && (val.length <= 50) || 'Please use maximum 50 characters']"
                        @blur="updateEmailVerification"                                
                        :error="v_error.email.error"
                        :error-message="v_error.email.msg">
                        <template v-slot:error>
                            Must be a valid email address.
                        </template>                            
                    </q-input>

                    <q-input
                        filled lazy-rules required
                        v-model="v_user.username" id="username"
                        :label="$t('page.signup.username.title')" hint="" 
                        @blur="updateUsernameVerification"
                        :error="v_error.username.error"
                        :error-message="v_error.username.msg"
                        :rules="[ 
                            val => val && val.length > 0 || 'Please type something'
                        ]"
                    />

                    <q-input
                        filled required id="password" :label="$t('page.signup.password.title')"
                        v-model="v_user.password" ref="fldPasswordChange"
                        :type="isPwd ? 'password' : 'text'"                         
                        :error="v_error.password.error"
                        :error-message="v_error.password.msg"
                        >
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                                class="cursor-pointer"
                                v-on:click="isPwd = !isPwd"></q-icon>
                        </template>                                
                    </q-input>

                    <q-input
                        filled v-model="v_user.password2"
                        :type="isPwd ? 'password' : 'text'" 
                        :label="$t('page.signup.password_confirm.title')" ref="fldPasswordChangeConfirm"
                        v-bind:rules="ConfirmPWD"                                
                    >
                        <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                                    class="cursor-pointer"
                                    v-on:click="isPwd = !isPwd"></q-icon>
                        </template>                                
                    </q-input>
<!--
                    <q-select class="gParagraphSM" ref="langSelect" filled
                        v-model="v_user.default_lang" :options="v_lang" 
                        label="Default Language" />
-->
                    <q-btn :label="$t('button.next')" color="primary" @click="onClickSignupNav(1)" />
                </q-form>
            </div>
        </q-slide-transition>                        

        <q-slide-transition>
            <div class="col-width q-pt-xs" v-if="v_show_signup2">
                <div>
                    <div class="verifyTitle text-center gSubTitleLG q-pb-sm">
                        Verify Your Email
                    </div>    
                    <div class="q-pb-lg">
                        Enter the six digit code we send to your email address to verify your new WeVest account:
                    </div>
                    <q-input
                        filled maxlength="6" type="number" 
                        v-model="v_user.code"
                        :label="$t('page.signup.code.title')" ref="fldCode"
                        :error="v_error.code.error"
                        :error-message="v_error.code.msg"
                    >
                        <template v-slot:append>
                            
                            <WTimer ref="authTimer" class="q-mx-sm" @onTimeout="onTimeout"/>

                            <q-btn :label="v_button_send" :loading="v_loading_token"
                                :disable="! v_button_send_enabled" color="primary" 
                                @click="onClickResend" />
                        </template>
                    </q-input>
                </div>

                <div class="q-mt-lg">
                    <q-btn :label="$t('button.back')" @click="onClickSignupNav(-1)" />
                    <q-btn class="q-ml-md" :label="$t('button.signup')" :loading="v_loading_signup"
                        color="primary" @click="onClickSignUp" />
                </div>      
            
            </div>
        </q-slide-transition>   
    </div>

</template>

<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';

import WTimer from "components/WTimer";

export default {
    components: {
        WTimer
    },
    setup() {
        return {
            isPwd: ref(true),
            isPassword: ref(true),
        }
    },
    props: {
        data: {
            required: true,
            default: null,
        }
    },
    computed: {
        ConfirmPWD() {
            return [
                (v) => !!v || this.$t('page.signup.password.error'),
                (v) => v == this.$refs.fldPasswordChange.value || this.$t('page.signup.password_confirm.error')
                ]
        },
        v_me() {
            return store.getters.me;
        }
    },
    data() {
        return {
            isPwd:true,
            v_user: this.data,
            v_verified: false,

            v_button_send: '',
            v_button_send_enabled: true,

            v_show_signup1: true,
            v_show_signup2: false,

            v_loading_token:false,
            v_loading_signup:false,

            v_error: { 
                username: {error:false, msg:''},
                password: {error:false, msg:''},
                email: {error:false, msg:''},
                code: {error:false, msg:''},
            },

        }
    },
    mounted() {
        this.prepare();
    },
    methods: {
        prepare() {
            this.v_button_send = this.$t('button.send');
        },        
        updateEmailVerification () {
            // eslint-disable-next-line
            let reg =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
            let valid = reg.test(this.v_user.email)

            if (valid) {
                this.v_user.emailValid = true;
                this.v_error.email.error = false;
            } else {
                this.v_user.emailValid = false
                this.v_error.email.error = true;
                this.v_error.email.msg = this.$t("page.signup.email.error");
            }
            return valid;
        },
        updateUsernameVerification () {
            // eslint-disable-next-line
            let reg = /^[0-9a-zA-Z]+$/;
            let valid = reg.test(this.v_user.username)            

            if (valid) {
                this.v_user.usernameValid = true;
                this.v_error.username.error = false;
            } else {
                logger.log.debug('username invalid')
                this.v_user.usernameValid = false
                this.v_error.username.error = true;
                this.v_error.username.msg = this.$t("page.signup.username.error");
            }
            return valid;
        },
        clearErrors() {
            const keys = Object.keys(this.v_error);
            for (let index=0;index<keys.length;index++) {
                this.v_error[keys[index]].error = false;
                this.v_error[keys[index]].msg = '';
            }
        },

        onClickResend() {
            logger.log.debug("SignupBox.onClickResend");
            
            if (!this.updateEmailVerification()) {                
                this.onClickSignupNav(-1);
                return;
            };

            const _this=this;
            let dicReq = {email:this.v_user.email};
            this.v_loading_token = true;
            AuthService.requestActivationCode(dicReq,function(resp) {
                _this.v_loading_token = false;
                logger.log.debug("SignupBox.onClickResend:resp=",resp);
                
                _this.$refs.authTimer.setTime(3);
                _this.v_button_send_enabled = false;
                _this.v_button_send = _this.$t('button.resend');

            },function(err) {
                logger.log.error("SignView.onClickResend:err=",err);
                _this.v_loading_token = false;
            });
        },

        onClickSignupNav(offset) {
            logger.log.debug("SignView.onClickSignupNav : offset=",offset);
            
            if (offset==1) {

                if (!this.updateEmailVerification()) {
                    return;
                }
                if (!this.updateUsernameVerification()) {
                    return;
                }

                this.v_show_signup1 = false;
                this.v_show_signup2 = true;                
            }

            if (offset==-1) {
                this.v_show_signup2 = false;
                this.v_show_signup1 = true;                
            }
        },
        onClickSignUp() {
            logger.log.debug("SignView.onClickSignUp");

            if (!this.updateEmailVerification()) return;
            if (!this.updateUsernameVerification()) return;
            if (!this.v_verified) {
                return;
            }

            const _this = this;
            let dic_param = {
                username:this.v_user.username,
                title: this.v_user.username,
                email:this.v_user.email,
                default_lang:this.v_user.default_lang,
                password:this.v_user.password, re_password:this.v_user.password2,
                emailValid:this.v_user.emailValid
            };

            this.clearErrors();
            
            this.v_loading_signup = true;
            this.v_me.signUp(dic_param).then( response => {                
                _this.v_loading_signup = false;
				logger.log.debug("SigninView.SignUp: response=",response);
                //const a_dialog = store.getters.components.getComponent('alertDialog');
				//a_dialog.show('Success','Please check your email to activate your account!');
                CommonFunc.navActivationNotification(_this);

            }).catch( response=> {
                _this.v_loading_signup = false;
                logger.log.error("SigninView.Signup : Err=",response);
                for (let a_key in response.data) {
                    _this.v_error[a_key].error = true;
                    _this.v_error[a_key].msg = response.data[a_key][0];
                }
            });
        },

        onTimeout(dicParam) {
            logger.log.debug("SigninView.onTimeout: dicParam=",dicParam);
            this.v_button_send_enabled = true;
        }
    }
};

</script>

<style scoped>

</style>