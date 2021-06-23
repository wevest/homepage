<template>
    
    <div>
        <div>        
            <q-bar>
<!--                
                <q-btn flat icon="arrow_back" @click="onClickBack" />
-->                
                <div class="text-h6">{{ v_thread.username }}</div>
            </q-bar>

            <q-card>
                <q-card-section>
                    <q-chat-message v-for="(a_message,index) in v_thread.messages.items" :key="index"
                        :name="a_message.username"
                        :avatar="a_message.sender.avatar_thumb"
                        :text="[a_message.content]"
                        :stamp="v_updated_at(a_message.sent_at)"
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
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        },
    },
    data: function () {
        return {
            v_thread: new MessageThreadModel(),
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
    },
    updated: function() {},
    
    methods: {      
        setThread(thread) {
            this.v_thread = thread;
            this.v_thread.messages.load(this.v_thread.uuid).then( response=> {
                logger.log.debug("MessageDetailView.Mounted - response=",response);
            });
        },

        setPageTitle(messages) {

        },


        handleReply: function() {
            const _this=this;

            this.v_thread.sendReply(this.v_reply.content).then( response => {
                _this.v_thread.messages.addMessage(response);
                _this.v_reply.content = '';
                CommonFunc.showOkMessage(_this,'Message updated');
            });

        },

        handleEdit: function() {
            const _this=this;

            this.v_thread.editReply(this.v_reply.uuid,this.v_reply.thread_id,this.v_reply.content).then( response => {
                logger.log.debug("handleEdit=",response);
                _this.v_reply.content = '';
                CommonFunc.showOkMessage(_this,'Message updated');
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
            logger.log.debug("onClickChat : message =",message);
            
            if (message.sender.id==this.v_me.id) {
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