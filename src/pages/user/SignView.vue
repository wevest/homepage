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
                            @submit="onSubmitSignin"
                            @reset="onResetSignin"
                            class="q-gutter-md col-width"
                        >
                            <q-input
                                filled lazy-rules
                                v-model="v_user.username"
                                label="Username" hint="Name and surname" 
                                :rules="[ val => val && val.length > 0 || 'Please type something']"
                            />

                            <q-input
                                filled type="password"
                                v-model="v_user.password"
                                label="password"
                            />
                            <q-checkbox v-model="v_user.stay_loggedin" label="Stay signed-in" />

                            <div>
                                <q-btn label="Login" type="submit" color="primary"/>
                            </div>                    
                        </q-form>
                    </q-tab-panel>

                    <q-tab-panel name="signup">
                        <q-form
                            @submit="onSubmitSignup"
                            @reset="onResetSignup"
                            class="q-gutter-md"
                        >
                            <q-input
                                filled lazy-rules
                                v-model="v_user.username"
                                label="Username" hint="Name and surname" 
                                :rules="[ val => val && val.length > 0 || 'Please type something']"
                            />

                            <q-input
                                filled type="email"
                                v-model="v_user.email"
                                label="Email" hint="Your email" 
                            />

                            <q-input
                                filled type="password"
                                v-model="v_user.password"
                                label="password"
                            />

                            <q-input
                                filled type="password"
                                v-model="v_user.password"
                                label="confirm password"
                            />

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
import RiskChart from 'src/pages/risk/RiskChart';

import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import DataService from 'src/services/dataService';
import logger from "src/error/Logger";

import CBigLabel from 'components/CBigLabel';
import CTitle from 'components/CTitle';

export default {
    components: {
        CBigLabel,
        CTitle,
        RiskChart
    },
    props: {
    },

    data: () => ({
        //lang: this.$i18n.locale,
        g_data: null,
        g_period: 30,
        g_author: '',

        v_tab: 'signin',
        v_user: {username:'', email:'', password:'', password2:'', stay_loggedin:true },

    }),

    mounted: function() {
        //console.log("HomeView.mounted - ");
        //this.refresh();
    },
    methods: {

        onSubmitSignin () {
            if (this.accept !== true) {
                this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: 'You need to accept the license and terms first'
                })
            }
            else {
                this.$q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: 'Submitted'
                })
            }
        },

        onResetSignin () {
            this.name = null
            this.age = null
            this.accept = false
        },

        onSubmitSignup () {

        },

        onResetSignup() {

        }

    },

}


</script>

<style scope> 
.col-width {
  min-width: 300px;
  max-width: 300px;
  justify-content: center;
    
}
</style>
