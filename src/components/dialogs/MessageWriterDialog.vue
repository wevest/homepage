<template>
    
    <q-dialog v-model="v_show">
        <q-card class="MessageCard">

            <q-card-section class="MessageAvatarBox">
                <q-avatar class="MesageAvatar" size="80px">
                    <q-img basic :src="v_message.to_avatar" />
                </q-avatar>
            </q-card-section>
            
            <q-card-section class="UsernameBox">            
                <div class="text-h6 MessageUsername">{{v_message.to_username}}</div>
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
                <q-btn class="MessageButton" label="Send" @click="onClickSend" />
                <q-btn class="MessageButton" label="Close" @click="onClickClose" />                
            </q-card-actions>

        </q-card>
    </q-dialog>
    
</template>


<script>
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import AuthService from 'src/services/authService';

import {MessageThreadModel, MessageThreadListModel, MessageModel, MessageListModel} from "src/models/MessageModel";


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

        sendMessage: function() {
            const _this = this;

            this.v_message.sendMessage().then( response => {
                CommonFunc.showOkMessage(_this,'Message sent');
            });
        },

        show: function(v_message) {
            logger.log.debug("MessageWriteDialog.show");
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
    padding:70px 0px 0px 0px;
}

.UserameBox {
    padding-top:5px;
}
.MessageUsername {
    text-align:center;
    font-size:25px;
    color:#000000;

}

.ProfileMessage {
    text-align:center;
    color:#8c8c8c;
}

.MessageButton {
    width:100px;
}
</style>