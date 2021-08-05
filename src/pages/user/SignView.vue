<template>
    <div class="q-pa-md">

        <div class="col">

            <q-tabs
                v-model="v_tab"
                dense keep-alive
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="center"
                narrow-indicator items-center style                
            >
                <q-tab name="signin" :label="$t('page.login.title')" />
                <q-tab name="signup" :label="$t('page.signup.title')" />
            </q-tabs>

            <q-tab-panels v-model="v_tab" animated>
                <q-tab-panel name="signin">
                    <SigninBox ref="signinBox" :data="v_user" />
                </q-tab-panel>

                <q-tab-panel name="signup">
                    <SignupBox ref="signupBox" :data="v_user" />
                </q-tab-panel>

            </q-tab-panels>
        </div>

    </div>

</template>

<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import CBigLabel from 'components/CBigLabel';
import CTitle from 'components/CTitle';
import SigninBox from "src/pages/user/component/SigninBox";
import SignupBox from "src/pages/user/component/SignupBox";

export default {
    components: {
        CBigLabel,
        CTitle,
        SigninBox,
        SignupBox,
    },
    props: {},
    computed: {
        v_me() {
            return store.getters.me;
        }
    },
    data: () => ({
        //lang: this.$i18n.locale,

        v_tab: 'signin',    

        v_user: {
            username:'', email:'', password:'', password2:'', default_lang:'en', 
            stay_loggedin:true, emailValid: false, code: '',
            //password:'alpine12!'
        },
        v_lang: ['en','kr'],
    }),

    mounted() {
        logger.log.debug("SigninView.mounted - params=",this.$route.params);
        //this.refresh();
        this.prepare();
    },
    methods: {
        prepare() {
            this.fillUserdata();            
            this.$refs.signinBox.setUser(this.v_user);
        },

        fillUserdata() {
            logger.log.debug("SigninView.fillUserdata");

            this.v_user = {
                username: CommonFunc.safeGetKeyValue(this.v_me,'username',''), 
                email: CommonFunc.safeGetKeyValue(this.v_me,'email',''), 
                password: CommonFunc.safeGetKeyValue(this.v_me,'password',''), 
                password2: CommonFunc.safeGetKeyValue(this.v_me,'password',''), 
                stay_loggedin: CommonFunc.safeGetKeyValue(this.v_me,'staySignedIn',''), 
                default_lang: CommonFunc.safeGetKeyValue(this.v_me,'default_lang','en'), 
            }

        },


        onResetSignin () {
            this.name = null
            this.age = null
            this.accept = false
        },

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