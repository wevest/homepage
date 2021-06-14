<template>
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle title="$t('page.message.title')" desc="$t('page.message.desc')"></CTitle>
            </div>            
        </div>
        <div class="row">
            <div class="col">
                <q-btn label="Write" @click="onClickWrite" />


            </div>
        </div>
    </div>

</template>

<script>
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';

import {PortfolioModel, ThreadListModel} from "src/store/PortfolioModel";

import CTitle from 'components/CTitle';


export default {
    components: {
        CTitle,
    },
    props: {},

    data: () => ({
        g_data: null,

        v_portfolio: new PortfolioModel(),

        v_back: false,

    }),
    computed: {
    },
    mounted: function() {
        //console.log("HomeView.mounted - ");
        console.log("MessageView.mounted - params=",this.$route.params);
        
        //this.v_message.subject = "test";
        //this.v_message.to_user = "tester1002";
        //this.v_message.body = "private message";

        this.loadPortfolio();
    },

    methods: {        

        loadPortfolio: function() {
            const _this = this;
            this.v_portfolio.load().then( response => {
                logger.log.debug("loadPortfolio : response= ",response);
            });

        },

        sendMessage: function(v_message) {
            const _this = this;
            
            let dic_param = v_message;
            dic_param.token = MoaConfig.auth.token;

            return new Promise(function(resolve,reject) {
                AuthService.postPrivateMessage(dic_param,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("MessageView.sendMessage - response",_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("MessageView.sendMessage - error",err);
                    reject();
                });
            });            
        },


        onClickWrite: function() {
            logger.log.debug("onClickWrite");
        },

        onClickSend: function() {
            logger.log.debug("onClickSend");
            this.sendMessage(this.v_message);            
        }

    },

}

</script>



<style scope> 
</style>
