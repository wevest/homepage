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
                    <q-form dense
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
                    <SignupBox ref="signupBox" :data="v_user" />
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
import SignupBox from "src/pages/user/component/SignupBox";

export default {
    components: {
        CBigLabel,
        CTitle,
        EditDialog,
        SignupBox
    },
    setup() {
        return {
            isPwd: ref(true),
            isPassword: ref(true),
        }
    },
    props: {},
    computed: {
        v_me() {
            return store.getters.me;
        }
    },
    data: () => ({
        //lang: this.$i18n.locale,

        isPwd:true,

        v_tab: 'signin',            
        v_user: {
            username:'', email:'', password:'', password2:'', default_lang:'en', 
            stay_loggedin:true, emailValid: false, code: '',
            //password:'alpine12!'
        },
        v_error: { 
            username: {error:false, msg:''},
            password: {error:false, msg:''},
            email: {error:false, msg:''},
        },
        v_lang: ['en','kr'],
        v_loading_signup: false
    }),

    mounted() {
        logger.log.debug("SigninView.mounted - params=",this.$route.params);
        //this.refresh();
        this.prepare();
        this.fillUserdata();

    },
    methods: {
        prepare() {},

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

        onSignIn() {
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

                CommonFunc.navHome();
                
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