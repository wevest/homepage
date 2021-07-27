<template>
    
    <div class="q-ma-md">
        <div>
            <CTitle :title="$t('page.activation_notification.title')" :desc="$t('page.activation_notification.desc')"></CTitle>
        </div>            

        <div>
            <q-btn label="Go Home" @click="onClick" />
        </div>

    </div>

</template>


<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';


export default {
    name:'AvtivationNotificationView',
    components: {
        CTitle,
    },
    created() {

    },
    mounted() {
        logger.log.debug("ActivationNotificationView.mounted");        
    },
    data() {
        return {
            
        }
    },

    methods: {
        onClick() {
            logger.log.debug("ActivationNotificationView.click");
            CommonFunc.navHome(this);
        }
    }

};

</script>

<style scoped>

</style>