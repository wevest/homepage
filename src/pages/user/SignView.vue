<template>
    <div class="q-pa-md">


        <div class="row">
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
                    <q-tab name="signin" label="Sign In" />
                    <q-tab name="signup" label="Sign Up" />
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
                                label="Username" hint="" 
                                :error="v_error.username.error"
                                :error-message="v_error.username.msg"                                
                                :rules="[ val => val && val.length > 0 || 'Please type something']"
                                
                            />

                            <q-input
                                filled 
                                :type="isPwd ? 'password' : 'text'" 
                                v-model="v_user.password"
                                label="Password"
                                :error="v_error.password.error"
                                :error-message="v_error.password.msg"                                
                            >
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                                        class="cursor-pointer"
                                        v-on:click="isPwd = !isPwd"></q-icon>
                                </template>                                
                            </q-input>
                        
                            <q-checkbox v-model="v_user.stay_loggedin" label="Stay signed-in" />

                            <q-btn flat label="reset password" />

                            <div>
                                <q-btn label="Login" type="submit" color="primary"/>
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
                                label="Email" hint="Your email" 
                                :rules="[ val => val.length <= 50 || 'Please use maximum 50 characters']"
                                @blur="updateEmailVerification"                                
                                :error="v_error.email.error"
                                :error-message="v_error.email.msg"                                
                            >
                                <template v-slot:error>
                                    Must be a valid email address.
                                </template>                            
                            </q-input>

                            <q-input
                                filled lazy-rules required bottom-slots
                                v-model="v_user.username" id="username"
                                label="Username " hint="Name and surname" 
                                :error="v_error.username.error"
                                :error-message="v_error.username.msg"
                                :rules="[ 
                                    val => val && val.length > 0 || 'Please type something'
                                ]"
                            />

                            <q-input
                                filled required id="password" label="password"
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
                                label="confirm password" ref="fldPasswordChangeConfirm"
                                v-bind:rules="ConfirmPWD"                                
                            >
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'"
                                            class="cursor-pointer"
                                            v-on:click="isPwd = !isPwd"></q-icon>
                                </template>                                
                            </q-input>

                            <div>
                                <q-btn label="SignUp" type="submit" color="primary"/>
                            </div>                    
                        </q-form>
                    </q-tab-panel>

                </q-tab-panels>
            </div>
        </div>
        
    </div>

</template>

<script>
import { ref } from 'vue';
import {store} from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import AuthService from 'src/services/authService';
//import LocalStorageService from 'src/services/localStorage';
import logger from "src/error/Logger";

import CBigLabel from 'components/CBigLabel';
import CTitle from 'components/CTitle';

export default {
    components: {
        CBigLabel,
        CTitle,
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
                (v) => !!v || "password are different :-)",
                (v) => v == this.$refs.fldPasswordChange.value || "Password different"
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
            username:'', email:'', password:'', password2:'', 
            stay_loggedin:true, emailValid: false,
            //password:'alpine12!'
        },
        v_error: { 
            username: {error:false, msg:''},
            password: {error:false, msg:''},
            email: {error:false, msg:''},
        }
    }),

    mounted: function() {
        logger.log.debug("SigninView.mounted - params=",this.$route.params);
        //this.refresh();
        this.fillUserdata();
    },
    methods: {
        fillUserdata: function() {

            this.v_user = {
                username: CommonFunc.safeGetKeyValue(this.v_me,'username',''), 
                email: CommonFunc.safeGetKeyValue(this.v_me,'email',''), 
                password: CommonFunc.safeGetKeyValue(this.v_me,'password',''), 
                password2: CommonFunc.safeGetKeyValue(this.v_me,'password',''), 
                stay_loggedin: CommonFunc.safeGetKeyValue(this.v_me,'staySignedIn',''), 
            }

        },

        updateEmailVerification () {
            // eslint-disable-next-line
            let reg =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
            let valid = reg.test(this.v_user.email)

            if (valid) {
                console.log('email is valid');
                this.v_user.emailValid = true;
                this.v_error.email.error = false;
            } else {
                console.log('email invalid')
                this.v_user.emailValid = false
                this.v_error.email.error = true;
                this.v_error.email.msg = 'email is invalid';
            }
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
            const _this = this;
            let dic_param = {
                username:this.v_user.username,
                email:this.v_user.email,
                password:this.v_user.password, re_password:this.v_user.password2,
                emailValid:this.v_user.emailValid
            };

            this.clearErrors();
            this.v_me.signUp(dic_param).then( response => {
                CommonFunc.showOkMessage(_this,'Your account created');
                _this.navHome();
            }).catch( response=> {
                logger.log.debug("SignUp.Err : response=",response);
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

            this.v_me.signIn(dic_param).then( response => {
                logger.log.debug("SignIn.response=",response);
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

                const fields = ['username','password'];
                for (let a_key in fields) {
                    console.log('key=',a_key);
                    _this.v_error[fields[a_key]].error = true;
                    _this.v_error[fields[a_key]].msg = "Username or password is wrong";
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

        onResetSignup() {

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