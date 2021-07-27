<template>
    
    <div class="q-ma-md">
        <div>
            <CTitle :title="$t('page.activation.title')" :desc="$t('page.activation.desc')"></CTitle>
        </div>            
        
        <div class="text-center">
            <div>
                {{v_user.username}}
            </div>

            <div>
                Congulatulation                
            </div>

            <div>
                <q-btn color="primary" label="Click here to Login" @click="onClick" />
            </div>

        </div>

    </div>

</template>

<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
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
            CommonFunc.navSignin(this);
        }
    }
};
</script>

<style scoped>

</style>