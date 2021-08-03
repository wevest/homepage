<template>
    
    <div class="q-pa-md">
        <div>
            <CTitle :title="$t('page.activation.title')" :desc="$t('page.activation.desc')"></CTitle>
        </div> 
        <div class="q-pt-xs text-center">
            <div>           
                <q-icon name="mail_outline" class="text-positive" style="font-size: 6em;" />
            </div>
            <h6 class="gSubTitleLG"> {{ $t('page.activation.mail_sent.title') }}</h6>
            <div>
                <p class="q-pa-md" style="line-height:30px;">
                    {{ $t('page.activation.mail_sent.desc') }}                    
<!--                    
                    <span class="email_address">support@wevest.ai</span> 
-->                    
                </p>
            </div>
            <div class="q-pt-xs">
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
.email_address {
    color: #0000FF;
}
</style>