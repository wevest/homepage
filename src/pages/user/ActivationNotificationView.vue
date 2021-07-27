<template>
    
    <div class="q-ma-sm">
        <div>
            <CTitle :title="$t('page.activation.title')" :desc="$t('page.activation.desc')"></CTitle>
        </div> 
        <div class="q-pt-xs text-center">
            <div>           
                <q-icon name="mail_outline" class="text-positive" style="font-size: 6em;" />
            </div>
            <h6 class="gSubTitleLG q-pb-md"> {{ $t('page.activation.mail_sent.title') }}</h6>
            <div>
                <p class="q-pa-md" style="line-height:32px;">메일함에서 <span >(info@wevest.com)</span> 인증 메일을 확인 바랍니다.
                    이메일의 인증 버튼을 선택하면 회원가입이 완료됩니다. </p>
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