<template>


    <div class="q-pa-xl">

        <div v-if="v_tab=='reset'">
            <div>
                <CTitle :title="$t('page.change_pwd.title')" :desc="$t('page.change_pwd.desc')"></CTitle>
                <div class="gCaption">
                    {{ $t('page.change_pwd.rules.title') }}
                </div>
            </div>

            <div class="q-my-md">

                <q-form
                    ref="formPassword"
                    @submit.prevent="onClickSave"
                    class="q-gutter-y-md q-field--with-bottom col-width"
                >

                    <div>
                        <q-input lazy-rules v-model="v_password" type="password" :label="$t('page.change_pwd.current.title')" 
                            maxlength
                            :rules="[ val => val && val.length > 8 || $t('page.change_pwd.current.error') ]" 
                            v-if="v_mode=='reset_password'" />
                        <q-input lazy-rules v-model="v_new_password" type="password" :label="$t('page.change_pwd.new.title')" 
                            ref="fldPasswordChange"
                            :rules="[ val => val && val.length > 8 || $t('page.change_pwd.new.error') ]" />
                        <q-input lazy-rules v-model="v_new_password2" type="password" :label="$t('page.change_pwd.confirm.title')"
                            ref="fldPasswordChangeConfirm" v-bind:rules="v_confirm" />
                    </div>

                </q-form>

            </div>

            <div class="q-gutter-md text-center">
                <q-btn outline v-close-popup>{{ $t('button.cancel') }}</q-btn>
                <q-btn color="primary" @click="onClickSave">{{ $t('button.save') }}</q-btn>
            </div>
        
        </div>
        
        <div v-if="v_tab=='done'">

            <div class="text-center">
                <q-icon 
                    class="q-my-md" 
                    name="task_alt" 
                    style="font-size: 7em; color: #4caf50;" />

                <div class="q-my-md gPageTitle">
                    {{ $t('dialog.reset_password.password_updated.title') }}
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
                (v) => !!v || this.$t('page.change_pwd.new.error'),
                (v) => v == this.$refs.fldPasswordChange.value || this.$t('page.change_pwd.confirm.error')

            ]
        },
    },
    data: function () {
        return {            
            v_show: false,
            
            v_tab:'reset',
            v_mode: 'reset_password',
            v_token: null,
            v_password:'',
            v_new_password: '',
            v_new_password2: '',

            v_loading:false,
        }
    },

    created() {},
    mounted() {
        logger.log.debug("ResetPasswordView.mounted : params=",this.$route.query);
        this.v_mode = 'reset_password';
        if ((this.$route.query) && (this.$route.query.hasOwnProperty('token'))) {
            this.v_mode = 'forgot_password';
            this.v_token = this.$route.query.token;
        }
    },
    updated() {},
    
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


        postProcess(response) {
            this.v_tab = 'done';
        },

        onClickSave() {                        
            const _this=this;

            let dicParam = {password: this.v_password, 
                new_password:this.v_new_password, new_password2:this.v_new_password2 };
            
            if (this.v_mode=='forgot_password') {
                dicParam.token = this.v_token;
            }

            this.$refs.formPassword.validate().then(ret=>{
                logger.log.debug('ResetPasswordDialog.onClickSave - ret=',_this.v_me);
                if (! ret) { return; }

                _this.v_loading = true;
                _this.v_me.resetPassword(dicParam).then(resp=>{
                    logger.log.debug('ResetPasswordDialog.onClickSave - resp=',resp);
                    _this.postProcess(resp);
                    _this.v_loading = false;

                }).catch(err=>{
                    logger.log.error('ResetPasswordView.onClickSave - err=',err);
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
            CommonFunc.navSignin(this,false);
        }
    }

};
</script>


<style scoped>




</style>