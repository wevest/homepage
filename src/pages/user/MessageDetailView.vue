<template>
    
    <div>
        <div>        
            <q-bar>
                <q-btn flat icon="arrow_back" @click="onClickBack" />
                <div class="text-h6">{{ v_thread.username }}</div>
            </q-bar>

            <q-card>
                <q-card-section>
                    <q-chat-message v-for="(a_message,index) in v_messages.models" :key="index"
                        :name="a_message.username"
                        :avatar="a_message.avatar"
                        :text="[a_message.content]"
                        :stamp="a_message.sent_at"
                        :sent="a_message.is_sender"
                        @click="onClickChat(a_message)"
                    />
                </q-card-section>
<!--                
                <q-card-section horizontal class="boxMessageInput">
                    <q-input filled type="textarea" v-model="v_reply.content" label="Message" class="full-width" />                    
                    <q-btn dense flat icon="send" @click="onClickReply" />
                </q-card-section>
-->
            </q-card>

            <div class="row no-wrap">
                <q-input filled type="textarea" v-model="v_reply.content" label="Message" class="fit" />                
                <q-btn dense flat icon="send" @click="onClickReply" />
            </div>
        </div>    


        <q-dialog v-model="v_buttons" transition-show="fade" transition-hide="fade">
            <q-card>
                 <q-card-section>
                    <div v-if="v_is_mine">
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

    </div>

</template>



<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import AuthService from 'src/services/authService';

import {MessageThreadModel, MessageThreadListModel, MessageModel, MessageListModel} from "src/models/MessageModel";


export default {
    name: 'MessageDialog',
    components: {},
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data: function () {
        return {
            v_thread: new MessageThreadModel(),
            v_messages: new MessageListModel(),

            v_selected: new MessageModel(),

            v_reply: {mode:'new',content:'', to_user:null, uuid:null},

            v_is_mine: false,
            v_buttons: false,
            v_show: false,
        }
    },

    created: function () {},
    beforeMounted: function() {
        logger.log.debug("MessageDetailView.beforeMounted - symbol=",this.$route.params);
        this.v_portfolio = this.$route.params.portfolio;        
    },
    mounted: function() {
        logger.log.debug("MessageDetailView.Mounted - symbol=",this.$route.params);
        
        this.setThread(this.$route.params.thread);
        this.setMessages(this.$route.params.messages);
    },
    updated: function() {},
    
    methods: {      
        setThread(thread) {
            this.v_thread = thread;
        },

        setMessages(messages) {
            this.v_messages = messages;
        },

        setPageTitle(messages) {

        },

        addMessage: function(response) {

        },

        sendReply: function(uuid,subject,message) {
            const _this = this;
            
            let dic_param = {
                token: store.getters.token, 
                subject:subject, uuid:uuid, message:message
            };

            return new Promise(function(resolve,reject) {
                AuthService.replyThreadMessage(dic_param,function(response) {
                    logger.log.debug("MessageView.sendReply - response",response);
                    resolve(response);
                },function(err) {
                    logger.log.error("MessageView.sendReply - error",err);
                    reject(err);
                });
            });            
        },

        editReply: function(uuid,thread_id,message) {
            const _this = this;
            
            let dic_param = {
                token: store.getters.token, uuid:uuid,
                thread:thread_id, sender_id:MoaConfig.auth.id, content:message
            };

            return new Promise(function(resolve,reject) {
                AuthService.editThreadMessage(dic_param,function(response) {
                    logger.log.debug("MessageView.editReply - response",response);
                    resolve(response);
                },function(err) {
                    logger.log.error("MessageView.editReply - error",err);
                    reject(err);
                });
            });            
        },

        handleReply: function() {
            const _this=this;

            this.sendReply(this.v_thread.uuid,this.v_thread.subject,this.v_reply.content).then( response => {
                let a_message = new MessageThreadModel( {
                    thread_id: response.data.thread,
                    uuid: response.data.uuid,
                    sent_at: response.data.sent_at,
                    content: response.data.content,
                    avatar: response.data.sender.avatar_thumb,
                    user_id: response.data.sender.id,
                    username: response.data.sender.username,
                    is_sender: false,
                });
                if (this.v_me.id==response.data.sender.id) {
                    a_message.username = "me";
                    a_message.is_sender = true;
                }

                _this.v_messages.add(a_message);
                _this.v_reply.content = '';
                CommonFunc.showOkMessage(_this,'Message updated');
            });
            
        },

        handleEdit: function() {
            const _this=this;

            this.editReply(this.v_reply.uuid,this.v_reply.thread_id,this.v_reply.content).then( response => {
                logger.log.debug("handleEdit=",response);
                let a_item = _this.v_messages.find({uuid:response.data.uuid});
                logger.log.debug("handleEdit.item=",a_item);
                if (a_item) {
                    a_item.content = response.data.content;
                    _this.v_reply.content = '';
                    CommonFunc.showOkMessage(_this,'Message updated');
                }
            });
            
        },


        onClickSave: function() {                        
            if (! this.validate(this.v_post)) {
                return;
            }

            this.$refs.baseEditor.save(this.v_post);
        },

        onClickBack: function() {
            logger.log.debug('onClickBack - ');
            CommonFunc.navBack(this);
        },


        onClickReply: function() {
            logger.log.debug("onClickReply=",this.v_reply);
            
            if (this.v_reply.mode=="new") {
                this.handleReply();
            } else {
                this.handleEdit();
            }            
        },

        onClickChat: function(message) {
            logger.log.debug("onClickChat=",message);
            
            if (message.user_id==this.v_me.id) {
                this.v_is_mine = true;
            } else {
                this.v_is_mine = false;
            }

            this.v_selected = message;
            this.v_buttons = true;
        },


        onClickDelete: function(message) {
            logger.log.debug("onClickDelete=",message);
        },

        onClickEdit: function() {                        
            this.v_reply.mode = "edit";
            this.v_reply.thread_id = this.v_selected.thread_id;
            this.v_reply.content = this.v_selected.content;
            this.v_reply.uuid = this.v_selected.uuid;
            this.v_buttons = false;

            logger.log.debug("onClickEdit.v_reply=",this.v_reply);            
        },

        onClickCancel: function() {
            logger.log.debug("onClickCancel=");
            this.v_buttons = false;
        },

    }

};
</script>


<style scoped>
.boxMessageInput {
    padding:8px;
}
</style>