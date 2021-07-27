<template>
    
    <div class="q-ma-md">
        <div>
            <CTitle :title="$t('page.pwd_reset.title')" :desc="$t('page.pwd_reset.desc')"></CTitle>
        </div>
        <div class="text-center">
            <div>           
                <q-icon name="check_circle_outline" class="text-positive" style="font-size: 6em;" />
            </div>                   
            <h6 class="gSubTitleLG q-pb-md">{{ $t('page.pwd_reset.mail_sent.title') }}</h6>
            <div>
                <p class="q-pa-md" style="line-height:32px;">An email has been sent to your rescue email address.
                Follow the direction in the email to reset your password</p>
            </div>
            <div class="q-pt-md">
                <q-btn :label="$t('button.go_home')" color="primary" @click="onClick" />
            </div>
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