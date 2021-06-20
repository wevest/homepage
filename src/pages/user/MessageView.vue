<template>
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle :title="$t('채팅')" :desc="$t('page.message.desc')"></CTitle>
            </div>            
        </div>

        <div class="row">
            <div class="col">
                <q-list separator>
                    <q-item class="MessagePageBox" clickable v-for="(a_thread,index) in v_thread.items" :key="index" @click="onClickMessage(index,a_thread)">
                        <q-item-section top avatar>
                            <q-avatar>
                                <q-img :src="a_thread.sender.avatar_thumb" />
                            </q-avatar>
                        </q-item-section>                        

                        <q-item-section class="MessageBox">
                            <q-item-label>{{a_thread.subject}}</q-item-label>
                            <q-item-label caption lines="2">{{a_thread.last_message}}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            <q-item-label class="MessageDate" caption>{{v_updated_at(a_thread.sent_at)}}</q-item-label>
                            <!-- <q-icon name="star" color="yellow" /> -->
                        </q-item-section>
                    </q-item>
                </q-list>

                <q-page-sticky position="bottom-right" :offset="[18, 18]">
                    <q-btn fab icon="add" color="accent" @click="onClickWrite" />
                </q-page-sticky>

            </div>
        </div>

        <MessageWriterDialog ref="messageWriter" />

    </div>

</template>

<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';

import MessageWriterDialog from 'components/dialogs/MessageWriterDialog';

import {MessageThreadModel, MessageThreadListModel, MessageModel, MessageListModel} from "src/models/MessageModel";

import CTitle from 'components/CTitle';



export default {
    components: {
        CTitle,
        MessageWriterDialog
    },
    props: {},
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        },
    },
    data: () => ({
        g_data: { 
            threads: null,
            messages: null, 
        },
        g_thread: null,

        v_message: new MessageThreadModel(),
        v_thread: new MessageThreadListModel(),        

        v_chat: new MessageModel(),

        v_reply: {mode:'new',content:'', to_user:null, uuid:null},

        v_buttons: false,
        v_back: false,
    }),
    mounted: function() {
        //console.log("HomeView.mounted - ");
        console.log("MessageView.mounted - params=",this.$route.params, this.v_message);
        
        this.v_message.subject = "test";
        this.v_message.to_user = "11";
        this.v_message.content = "private message";


        //this.loadInboxMessages().then( threads => {
        //    _this.handleThreads(threads.results);
        //});
        this.refresh();
    },

    methods: {        
        refresh: function() {
            const _this = this;
            this.v_thread.load().then(response=> {

            });

        },

        sendMessage: function(v_message) {
            const _this = this;
            
            let dic_param = {
                token: store.getters.token, 
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
            this.$refs.messageWriter.show(this.v_message);
        },

        onClickSend: function() {
            logger.log.debug("onClickSend");
            this.sendMessage(this.v_message);            
        },

        onClickMessage: function(index,thread) {
            logger.log.debug("onClickMessage: thread=",thread);
            this.g_thread = thread;
            let dic_param = { name:'message_detail', path:'message_detail', params:{ thread:thread, back:true } };
            this.$router.push(dic_param);

        },

    },

}

</script>



<style scope> 
.MessagePageBox {
    padding:16px 0px 16px 0px;
}

.MessageBox {
    padding:0px 0px 0px 0px;
}

.MessageDate {
    color:#8C8C8C;
}
</style>
