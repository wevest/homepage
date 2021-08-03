<template>
    <div class="q-pa-md">

        <div class="col">

            <q-tabs
                v-model="v_tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="center"
                narrow-indicator
                items-center
                style
            >
                <q-tab name="signin" :label="$t('page.login.title')" />
                <q-tab name="signup" :label="$t('page.signup.title')" />
            </q-tabs>

            <q-tab-panels v-model="v_tab" animated>
                <q-tab-panel name="signin">
                    <q-form
                        @submit.prevent="onSignIn"
                        class="q-gutter-y-md q-field--with-bottom col-width"
                    >
                        <q-input
                            filled lazy-rules
                            v-model="v_user.username"
                            :label="$t('page.login.username.title')" hint="" 
                            :error="v_error.username.error"
                            :error-message="v_error.username.msg"                                
                            :rules="[ val => val && val.length > 0 || 'Please type something']"                            
                        />

                        <q-input
                            filled 
                            :type="isPwd ? 'password' : 'text'" 
                            v-model="v_user.password"
                            :label="$t('page.login.password.title')"
                            :error="v_error.password.error"
                            :error-message="v_error.password.msg"                                
                        >
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                                    class="cursor-pointer"
                                    v-on:click="isPwd = !isPwd"></q-icon>
                            </template>                                
                        </q-input>                        

                        <q-checkbox v-model="v_user.stay_loggedin" :label="$t('page.login.signedin.title')" />
                        <q-btn class="q-ml-md" flat dense
                            :label="$t('page.login.forgot_password.title')" @click="onClickForgot" />

                        <div>
                            <q-btn :label="$t('button.login')" :loading="v_loading_signup"
                                type="submit" color="primary"/>
                        </div>                    
                    </q-form>
                </q-tab-panel>

                <q-tab-panel name="signup">
                    <q-form
                        @submit.prevent="onSignUp"
                        class="q-gutter-y-md q-field--with-bottom col-width"
                    >
                        <q-input
                            filled required bottom-slots 
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
                            filled lazy-rules required bottom-slots
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
                            :type="isPwd ? 'password' : 'text'" 
                            v-model="v_user.password" ref="fldPasswordChange"
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
                            filled
                            :type="isPwd ? 'password' : 'text'" 
                            v-model="v_user.password2"
                            :label="$t('page.signup.password_confirm.title')" ref="fldPasswordChangeConfirm"
                            v-bind:rules="ConfirmPWD"                                
                        >
                            <template v-slot:append>
                                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                                        class="cursor-pointer"
                                        v-on:click="isPwd = !isPwd"></q-icon>
                            </template>                                
                        </q-input>
                        

                        <q-select class="gParagraphSM" ref="langSelect" filled
                            v-model="v_user.default_lang" :options="v_lang" 
                            label="Default Language" />

                        <div>
                            <q-btn :label="$t('button.signup')" :loading="v_loading_signup"
                                type="submit" color="primary" />
                        </div>                    
                    </q-form>
                </q-tab-panel>

            </q-tab-panels>
        </div>

        <EditDialog ref="dialogEdit" 
            :title="$t('dialog.password_edit.title')" :desc="$t('dialog.password_edit.desc')" 
            @onSave="onSaveEdit" />
    </div>

</template>

<script>
//import { ref } from 'vue';
import {store} from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import AuthService from 'src/services/authService';
import logger from "src/error/Logger";

import CBigLabel from 'components/CBigLabel';
import CTitle from 'components/CTitle';
import EditDialog from "src/components/dialogs/EditDialog";


export default {
    components: {
        CBigLabel,
        CTitle,
        EditDialog
    },
    setup() {
        return {
            isPwd: ref(true),
            isPassword: ref(true),
        }
    },
    props: {},
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
    data: () => ({
        //lang: this.$i18n.locale,

        g_data: null,
        g_period: 30,
        g_author: '',
        isPwd:true,

        showError: false,

        v_tab: 'signin',
        v_user: {
            username:'', email:'', password:'', password2:'', default_lang:'en', 
            stay_loggedin:true, emailValid: false, 
            //password:'alpine12!'
        },
        v_error: { 
            username: {error:false, msg:''},
            password: {error:false, msg:''},
            email: {error:false, msg:''},
        },
        v_lang: ['en','kr'],
        v_loading_signup:false,
    }),

    mounted() {
        logger.log.debug("SigninView.mounted - params=",this.$route.params);
        //this.refresh();
        this.fillUserdata();
    },
    methods: {
        fillUserdata() {

            this.v_user = {
                username: CommonFunc.safeGetKeyValue(this.v_me,'username',''), 
                email: CommonFunc.safeGetKeyValue(this.v_me,'email',''), 
                password: CommonFunc.safeGetKeyValue(this.v_me,'password',''), 
                password2: CommonFunc.safeGetKeyValue(this.v_me,'password',''), 
                stay_loggedin: CommonFunc.safeGetKeyValue(this.v_me,'staySignedIn',''), 
                default_lang: CommonFunc.safeGetKeyValue(this.v_me,'default_lang','en'), 
            }

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

        navHome: function() {
            let dic_param = { name:'home', params:{} };
            this.$router.push(dic_param);
        },

        clearErrors: function() {
            const keys = Object.keys(this.v_error);
            for (let index=0;index<keys.length;index++) {
                this.v_error[keys[index]].error = false;
                this.v_error[keys[index]].msg = '';
            }

        },

        onSignUp: function() {
            logger.log.debug("SignView.onSignup");

            if (!this.updateEmailVerification()) return;
            if (!this.updateUsernameVerification()) return;
            
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

        onSignIn: function() {
            const _this = this;
            let dic_param = this.v_user;
            
            this.clearErrors();
            
            this.v_loading_signup = true;
            this.v_me.signIn(dic_param).then( response => {
                logger.log.debug("SignIn.response=",response);

                _this.v_loading_signup = false;
                CommonFunc.showOkMessage(_this,'Signed in');

                // if it is redirected, then move to the redirected url
                if (_this.$route.params.hasOwnProperty('path')) {
                    const dic_param = {
                        name:_this.$route.params.path, 
                        query:_this.$route.params.query 
                    };
                    _this.$router.push(dic_param);                    
                    return;
                }

                _this.navHome();
                
            }).catch( err => {                
                logger.log.debug("SignIn.err=",err);
                
                _this.v_loading_signup = false;

                const fields = ['username','password'];
                for (let a_key in fields) {
                    logger.log.debug('key=',a_key);
                    _this.v_error[fields[a_key]].error = true;
                    _this.v_error[fields[a_key]].msg = this.$t("page.login.input.error");
                }

            });                
                
        },


        onResetSignin () {
            this.name = null
            this.age = null
            this.accept = false
        },

        onSubmitSignup () {
            logger.log.debug("signup");
            if (this.v_user.password!=this.v_user.password2) {

            }
        },

        onClickForgot() {
            logger.log.debug("SignView.onClickForgot");
            this.$refs.dialogEdit.show('email','text','');
        },




        onSaveEdit(dicParam) {
            const _this=this;
            logger.log.debug("SignView.onSaveEdit:dicParam=",dicParam);
            
            let dicReq = {email: dicParam.value};

            AuthService.forgotPassword(dicReq,function(resp) {
                logger.log.debug("SignView.onSaveEdit:resp=",resp);
                
                if (resp.data.ret!=0) {
                    const a_dialog = store.getters.components.getComponent('alertDialog');
                    a_dialog.show('Error',resp.data.msg);
                    return;
                }

                CommonFunc.navResetNotification(_this);

            },function(err) {
                logger.log.error("SignView.onSaveEdit:err=",err);
                
            });

        }

    },

}

</script>


<style scope> 
.col-width {
  /* width: 550px;   */
  /* min-width: 500px; */
  max-width: 500px;
  width: auto;
  margin:0 auto;
  padding-bottom: 20px;
}  

</style>