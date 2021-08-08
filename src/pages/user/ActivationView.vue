<template>
    
    <div class="q-pa-md">
        <div>
            <CTitle :title="$t('page.registration.title')" :desc="$t('page.registration.desc')"></CTitle>
        </div>            
        
        <div class="text-center">
             <div>           
                <q-icon name="check_circle_outline" class="text-positive" style="font-size: 6em;" />
            </div>    
            <div class="gSubTitleLG">
                {{v_user.username}}
            </div>

            <div class="gPageTitle">
                <span>{{ $t('page.registration.complete.title') }} </span>                
                <div class="q-py-md">
                    {{ $t('page.registration.complete.desc') }}
                </div>
            </div>
<!--            
                <p class="q-pa-md" style="line-height:32px;"> {{ $t('page.registration.complete.desc') }}</p>
-->
            <div>
                <q-btn color="primary" :label="$t('button.go_login')" @click="onClick" />
            </div>

        </div>

    </div>

</template>

<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import NavFunc from 'src/util/NavFunc';
import logger from "src/error/Logger";

import UserModel from "src/models/UserModel";

import CTitle from 'components/CTitle';


export default {
    name:'AvtivationView',
    components: {
        CTitle,
    },
    created() {

    },
    mounted() {
        logger.log.debug("AvtivationView.mounted");
        this.setUser(this.$route.query);
    },
    data() {
        return {
            v_user: new UserModel()
        }
    },

    methods: {
        setUser(query) {
            this.v_user.id = query.id;
            this.v_user.username = query.username;
            this.v_user.token = query.token;
        },

        onClick() {
            logger.log.debug("AvtivationView.click");
            NavFunc.navSignin(this);
        }
    }
};
</script>

<style scoped>

</style>