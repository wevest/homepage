<template>
    
    <div>
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
                filled v-model="v_user.password"
                :type="isPwd ? 'password' : 'text'" 
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

        <EditDialog ref="dialogEdit" 
            :title="$t('dialog.password_edit.title')" :desc="$t('dialog.password_edit.desc')" 
            @onSave="onSaveEdit" />

    </div>


</template>


<script>
import {store} from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';
import EditDialog from "src/components/dialogs/EditDialog";

export default {
    components: {
        EditDialog,
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
        v_me() {
            return store.getters.me;
        }
    },
    data() {
        return {
            isPwd:true,

            v_user: this.data,
            v_loading_signup: false,
            v_error: { 
                username: {error:false, msg:''},
                password: {error:false, msg:''},
            },
        }
    },
    methods: {
        setUser(user) {
            this.v_user = user;
        },
        clearErrors() {
            const keys = Object.keys(this.v_error);
            for (let index=0;index<keys.length;index++) {
                this.v_error[keys[index]].error = false;
                this.v_error[keys[index]].msg = '';
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

                NavFunc.navHome(_this);
                
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

                NavFunc.navResetNotification(_this);

            },function(err) {
                logger.log.error("SignView.onSaveEdit:err=",err);
                
            });

        },

        onResetSignin () {
            this.name = null
            this.age = null
            this.accept = false
        },

        onClickForgot() {
            logger.log.debug("SignView.onClickForgot");
            //this.$refs.dialogEdit.show('email','text','');
            NavFunc.navForgotPassword(this);
        },

    }

};

</script>

<style scoped>

</style>