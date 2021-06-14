<template>
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.message.title')" :desc="$t('page.message.desc')"></CTitle>
            </div>            
        </div>
        <div class="row">
            <div class="col">
                <q-btn label="Write" @click="onClickWrite" />

                <q-input v-model="v_message.to_user" label="TO" />
                <q-input v-model="v_message.subject" label="Subject" />
                <q-input type="textarea" v-model="v_message.content" label="Body" />

                <q-btn label="Send" @click="onClickSend" />

            </div>
        </div>
    </div>

</template>

<script>
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';

import {MessageThreadModel, MessageThreadListModel} from "src/store/MessageModel";

import CTitle from 'components/CTitle';



export default {
    components: {
        CTitle,
    },
    props: {},

    data: () => ({
        g_data: null,

        v_message: new MessageThreadModel(),

        v_back: false,

    }),
    computed: {
    },
    mounted: function() {
        //console.log("HomeView.mounted - ");
        console.log("MessageView.mounted - params=",this.$route.params, this.v_message);
        
        this.v_message.subject = "test";
        this.v_message.to_user = "11";
        this.v_message.content = "private message";

        this.loadInboxMessages();
    },

    methods: {        

        loadInboxMessages: function() {
            const _this = this;
                        
            let dic_param = {token: MoaConfig.auth.token};

            return new Promise(function(resolve,reject) {
                AuthService.getInboxMessage(dic_param,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("MessageView.loadInboxMessages - response",_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("MessageView.loadInboxMessages - error",err);
                    reject();
                });
            });            
        },

        sendMessage: function(v_message) {
            const _this = this;
            
            let dic_param = {token: MoaConfig.auth.token, 
                to_user:this.v_message.to_user, subject:this.v_message.subject, message:this.v_message.content
            };

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
