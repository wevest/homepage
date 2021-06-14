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

        <div class="row">
            <div class="col">

                <q-list separator>
                    <q-item clickable v-for="(a_thread,index) in v_thread.models" :key="index" @click="onClickMessage(index,a_thread)">
                        <q-item-section top avatar>
                            <q-avatar>
                                <q-img :src="a_thread.avatar" />
                            </q-avatar>

                        </q-item-section>                        
                        <q-item-section>
                            <q-item-label>{{a_thread.subject}}</q-item-label>
                            <q-item-label caption lines="2">{{a_thread.last_message}}</q-item-label>
                        </q-item-section>

                        <q-item-section side top>
                            <q-item-label caption>{{a_thread.sent_at}}</q-item-label>
                            <q-icon name="star" color="yellow" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
        </div>

        <MessageDialog ref="messageDialog" />

<!--        
        <div class="row">
            <div class="col">

                <q-chat-message v-for="(a_message,index) in v_messages.models" :key="index"
                    :name="a_message.username"
                    :avatar="a_message.avatar"
                    :text="[a_message.content]"
                    :stamp="a_message.sent_at"
                    :sent="a_message.is_sender"
                    @click="onClickChat(a_message)"
                />

                <q-input type="textarea" v-model="v_reply.content" label="Body" />
                <q-btn label="Reply" @click="onClickReply" />
    
            </div>

        </div>

        <q-dialog v-model="v_buttons" transition-show="fade" transition-hide="fade">
            <q-card>
                 <q-card-section>
                    <div v-if="v_reply">
                        <q-btn label="Edit" @click="onClickEdit" />
                        <q-btn label="Delete" @click="onClickDelete" />
                    </div>              
                    <div v-else>
                        <q-btn label="Copy" @click="onClickEdit" />
                    </div>          

                    <q-btn label="Cancel" @click="onClickCancel" />
                 </q-card-section>
            </q-card>
        </q-dialog>
-->

    </div>

</template>

<script>
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';

import MessageDialog from 'src/components/dialogs/MessageDialog';
import {MessageThreadModel, MessageThreadListModel, MessageModel, MessageListModel} from "src/store/MessageModel";

import CTitle from 'components/CTitle';



export default {
    components: {
        CTitle,
        MessageDialog
    },
    props: {},

    data: () => ({
        g_data: { 
            threads: null,
            messages: null, 
        },
        g_thread: null,

        v_message: new MessageThreadModel(),
        v_thread: new MessageThreadListModel(),        
        v_messages: new MessageListModel(),

        v_chat: new MessageModel(),

        v_reply: {mode:'new',content:'', to_user:null, uuid:null},

        v_buttons: false,
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

        const _this = this;
        this.loadInboxMessages().then( threads => {
            _this.handleThreads(threads.results);
        });

    },

    methods: {        
        
        handleThreads: function(threads) {
            console.log("MessageView.handleThreads ",threads);

            let v_threads = new MessageThreadListModel();
            for (let index=0; index<threads.length; index++) {
                let a_message = new MessageThreadModel( {
                    id: threads[index].id,
                    uuid: threads[index].uuid,
                    sent_at: threads[index].sent_at,
                    last_message: threads[index].last_message,
                    avatar: threads[index].sender.avatar_thumb,
                    user_id: threads[index].sender.id,
                    subject: threads[index].subject,  
                });

                v_threads.add(a_message);
            }

            console.log("MessageView.handleThreads : v_threads=",v_threads);

            this.v_thread = v_threads;
        },

        loadInboxMessages: function() {
            const _this = this;
                        
            let dic_param = {token: MoaConfig.auth.token};

            return new Promise(function(resolve,reject) {
                AuthService.getInboxMessage(dic_param,function(response) {
                    _this.g_data.threads = response.data;
                    logger.log.debug("MessageView.loadInboxMessages - response",_this.g_data.threads);
                    resolve(_this.g_data.threads);
                },function(err) {
                    logger.log.error("MessageView.loadInboxMessages - error",err);
                    reject(err);
                });
            });            
        },


        loadThreadMessages: function(uuid) {
            const _this = this;
                        
            let dic_param = {uuid:uuid, token: MoaConfig.auth.token};

            return new Promise(function(resolve,reject) {
                AuthService.getThreadMessage(dic_param,function(response) {
                    _this.g_data.messages = response.data;
                    logger.log.debug("MessageView.loadThreadMessages - response",_this.g_data.messages);
                    resolve(_this.g_data.messages);
                },function(err) {
                    logger.log.error("MessageView.loadThreadMessages - error",err);
                    reject(err);
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
        },

        onClickMessage: function(index,thread) {
            const _this = this;
            
            logger.log.debug("onClickMessage: thread=",thread);
            this.g_thread = thread;

            this.loadThreadMessages(thread.uuid).then( messages => {
                logger.log.debug("onClickMessage: messages=",messages);
                
                let v_messages = new MessageListModel();
                for (let index=0;index<messages.messages.length;index++) {
                    logger.log.debug("onClickMessage: loadThreadMessages=",index);

                    let a_message = new MessageModel({
                        uuid: messages.messages[index].uuid,
                        content: messages.messages[index].content,
                        sent_at: messages.messages[index].sent_at,
                        avatar: messages.messages[index].sender.avatar_thumb,
                        user_id: messages.messages[index].sender.id,
                        username: messages.messages[index].sender.username,
                        thread_id: messages.messages[index].thread,
                        is_sender: false
                    });
                    if (MoaConfig.auth.id==messages.messages[index].sender.id) {
                        a_message.username = "me";
                        a_message.is_sender = true;
                    }

                    v_messages.add(a_message);
                }

                _this.$refs.messageDialog.show(thread,v_messages);
            });
        },

    },

}

</script>



<style scope> 
</style>
