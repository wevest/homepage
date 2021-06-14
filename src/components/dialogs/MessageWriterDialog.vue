<template>
    
    <q-dialog v-model="v_show">
        <q-card>
            <q-card-section>
                <q-input v-model="v_message.to_user" label="TO" />
                <q-input v-model="v_message.subject" label="Subject" />
                <q-input type="textarea" v-model="v_message.content" label="Body" />
            </q-card-section>

            <q-card-actions>
                <q-btn label="Send" @click="onClickSend" />
                <q-btn label="Close" @click="onClickClose" />
            </q-card-actions>

        </q-card>
    </q-dialog>
    
</template>


<script>
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import AuthService from 'src/services/authService';

import {MessageThreadModel, MessageThreadListModel, MessageModel, MessageListModel} from "src/store/MessageModel";


export default {
    name: 'MessageWriterDialog',
    components: {},
    computed: {},
    data: function () {
        return {
            g_data:null,

            v_message: new MessageThreadModel(),
            v_show: false,
        }
    },

    created: function () {},
    mounted: function() {},
    updated: function() {},
    

    methods: {      
        sendMessage: function(v_message) {
            const _this = this;
            
            let dic_param = {
                token: MoaConfig.auth.token, 
                to_user:this.v_message.to_user, 
                subject:this.v_message.subject, 
                message:this.v_message.content
            };

            return new Promise(function(resolve,reject) {
                AuthService.postPrivateMessage(dic_param,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("MessageView.sendMessage - response",_this.g_data);
                    resolve(response);
                },function(err) {
                    logger.log.error("MessageView.sendMessage - error",err);
                    reject(err);
                });
            });            
        },

        handleSend: function() {
            const _this = this;

            this.sendMessage(this.v_message).then( response => {
                CommonFunc.showOkMessage(_this,'Message sent');
            });
        },

        show: function() {
            logger.log.debug("MessageDialog.show");
            this.v_show = true;
        },

        hide: function() {
            this.v_show = false;
        },


        onClickSend: function() {                        
            logger.log.debug("onClickSend");
            this.handleSend();
        },


        onClickClose: function() {
            logger.log.debug("onClickClose");
            this.hide();
        }
    }

};
</script>


<style scoped>

</style>