<template>
    
    <q-dialog v-model="v_show"
        position="top"
        persistent
        transition-show="slide-down"
        transition-hide="slide-up"

    >
        <q-card class="MessageCard">
            <q-card-section>
                <WDialogCloseButton @onClick="onClickClose" />                
            </q-card-section>

            <q-card-section class="MessageAvatarBox">
                <q-avatar size="80px">
                    <q-img basic :src="v_message.avatar" />
                </q-avatar>
            </q-card-section>
            
            <q-card-section class="boxUser">            
                <div class="text-h5 text-bold">{{v_message.to_username}}</div>
                <div class="ProfileMessage">메시지를 전달하세요!</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
<!--                
                <q-input v-model="v_message.to_user" label="TO" />
-->                
                <q-input v-model="v_message.subject" label="Subject" />
                <q-input type="textarea" v-model="v_message.content" label="Body" />
            </q-card-section>

            <q-card-actions align="center">
                <q-btn class="fit" label="Send" color="primary" @click="onClickSend" />
            </q-card-actions>

        </q-card>
    </q-dialog>
    
</template>


<script>
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import WDialogCloseButton from "src/components/WDialogCloseButton";

import {MessageThreadModel, MessageThreadListModel, MessageModel, MessageListModel} from "src/models/MessageModel";


export default {
    name: 'MessageWriterDialog',
    components: {
        WDialogCloseButton
    },
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
        
        clear() {
            this.v_message.subject = "";
            this.v_message.content = "";
        },

        sendMessage: function() {
            const _this = this;

            this.v_message.send().then( response => {
                CommonFunc.showOkMessage(_this,'Message sent');
                _this.clear();
                _this.hide();
            });
        },

        show: function(v_message) {
            logger.log.debug("MessageWriteDialog.show : ",v_message);
            this.v_message = v_message;
            this.v_show = true;
        },

        hide: function() {
            this.v_show = false;
        },


        onClickSend: function() {                        
            logger.log.debug("MessageWriteDialog.onClickSend");
            this.sendMessage();
        },


        onClickClose: function() {
            logger.log.debug("MessageWriteDialog.onClickClose");
            this.hide();
        }
    }

};
</script>


<style scoped>

.MessageCard {
    height:550px;
    width:300px;
}
.MessageAvatarBox {
    text-align:center;
    padding:20px 0px 0px 0px;
}

.boxUser {
    padding-top:25px;
    text-align:center;
}
.MessageUsername {
    font-size:25px;
    color:#000000;
}

.ProfileMessage { 
    padding-top:10px;
    color:#8c8c8c;
}

</style>