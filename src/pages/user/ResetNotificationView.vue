<template>
    
    <div class="q-ma-md">
        <div>
            <CTitle :title="$t('page.reset_notification.title')" :desc="$t('page.reset_notification.desc')"></CTitle>
        </div>            
        <div>
            Your password reset link has been sent to your email
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
    name:'ResetNotificationView',
    components: {
        CTitle,
    },
    created() {

    },
    mounted() {
        logger.log.debug("ResetNotificationView.mounted");        
    },
    data() {
        return {
            
        }
    },

    methods: {
        onClick() {
            logger.log.debug("ResetNotificationView.click");
            CommonFunc.navHome(this);
        }
    }

};

</script>

<style scoped>

</style>