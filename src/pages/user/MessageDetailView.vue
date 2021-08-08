<template>
    
    <div>
        <div class="q-ma-md">
            <div class="boxTitle">
                <div class="text-h6 text-center">{{ v_thread.username }}</div>
            </div>


            <q-scroll-area :style="v_message_style" ref="messageList">
                <q-chat-message 
                    v-for="(a_message,index) in v_thread.messages.items" 
                    v-if="! a_message.deleted"
                    :key="index"
                    :name="a_message.username"
                    :avatar="a_message.sender.avatar_thumb"
                    :text="[a_message.content]"
                    :stamp="v_updated_at(a_message.sent_at)"
                    :sent="a_message.is_sender"
                    @click="onClickChat(a_message)"
                />
            </q-scroll-area>

            <div class="boxInput">
                <div class="row no-wrap">
                    <q-input filled ref="txtMessage" type="textarea" v-model="v_reply.content" label="Message" class="fit" />                
                    <q-btn dense flat icon="send" @click="onClickReply" />
                </div>
            </div>

        </div>    


        <q-dialog v-model="v_buttons" 
            position="bottom"
            persistent
            transition-show="slide-up"
            transition-hide="slide-down"        
        >
            <q-card class="cardCommand">
                 <q-card-actions align="stretch" vertical>
                    <q-btn label="Edit" @click="onClickEdit" v-if="v_is_mine" />
                    <q-btn label="Delete" @click="onClickDelete" v-if="v_is_mine" />
                    <q-btn label="Copy" @click="onClickCopy" />
                    <q-btn label="Cancel" @click="onClickCancel" />
                 </q-card-actions>
            </q-card>
        </q-dialog>

    </div>

</template>



<script>
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
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

            v_height:0,
            v_width:0,
            v_message_style: '',
        }
    },

    created: function () {
        this.validateQuery();
        window.addEventListener('resize', this.handleResize);        
    },
    
    beforeMounted: function() {},
    mounted: function() {
        logger.log.debug("MessageDetailView.Mounted - query=",this.$route.query);        
                
        this.setThread(this.$route.query);
        this.setChatMessageHeight(window.innerHeight);
        this.load(this.v_thread.uuid);
    },
    updated: function() {},
    destroyed:function() {
        // console.log("beforeDestroy...");
        window.removeEventListener('resize', this.handleResize);
    },    
    methods: {
        validateQuery() {                        
            if (! CommonFunc.isEmptyObject(this.$route.query.username)) {
                if (! CommonFunc.isEmptyObject(this.$route.query.id)) {
                    return;
                }                
            }                
            NavFunc.navError404(this);
        },        

        setChatMessageHeight(windowHeight) {
            const toolbarHeight=50;
            const titleHeight=40;
            const inputHeight=100;

            let a_height = windowHeight-toolbarHeight-titleHeight-inputHeight-90;
            
            logger.log.debug("handleResize:height=",windowHeight,a_height);
            
            this.v_message_style = "height:" +a_height.toString()+"px;";
        },

        setThread(query) {
            this.v_thread.uuid = query.id;
            this.v_thread.username = query.username;
            this.v_thread.subject = query.subject;
        },

        setScrollPosition(value) {
            logger.log.debug("MessageDetailView.setScrollPosition - value=",value);
            //this.$refs.messageList.setScrollPercentage(percent);
            this.$refs.messageList.setScrollPosition(value);
        },

        load(id) {
            const _this=this;

            this.v_thread.messages.load(id).then( response=> {
                logger.log.debug("MessageDetailView.load - response=",response);
                _this.setScrollPosition(100000);
            });
        },
        setMode(mode) {
            this.v_reply.mode=mode;
        },
        clearReply() {
            this.v_reply.content = '';
            this.setMode("new");
        },

        handleResize(event) {
            this.v_width = window.innerWidth;
            
            if (this.v_height!=window.innerHeight) {
                this.v_height = window.innerHeight;                
                this.setChatMessageHeight(this.v_height);
            }
        },

        handleReply: function() {
            const _this=this;

            this.v_thread.sendReply(this.v_reply.content).then( response => {
                _this.v_thread.messages.addMessage(response);
                _this.clearReply();                                
                CommonFunc.showOkMessage(_this,'Message updated');

                setTimeout( () => {
                    _this.setScrollPosition(100000);
                },350);

            });

        },

        handleEdit: function() {
            const _this=this;

            this.v_thread.editReply(this.v_reply.uuid,this.v_reply.thread_id,this.v_reply.content).then( response => {
                logger.log.debug("handleEdit=",response);
                _this.clearReply();
                CommonFunc.showOkMessage(_this,'Message updated');
            });
            
        },

        handleDelete: function() {
            const _this=this;

            this.v_thread.deleteReply(this.v_selected.uuid,this.v_selected.thread_id).then( response => {
                logger.log.debug("handleDelete=",response);
                CommonFunc.showOkMessage(_this,'Message deleted');
            });
            this.setButtonVisible(false);
        },

        setButtonVisible:function(value) {
            this.v_buttons = value;
        },

        onClickSave: function() {                        
            if (! this.validate(this.v_post)) {
                return;
            }

            this.$refs.baseEditor.save(this.v_post);
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
            this.setButtonVisible(true);
        },


        onClickDelete: function(message) {
            logger.log.debug("onClickDelete=",message);

            const _this = this;
            store.getters.components.getComponent('confirmDialog').show('Do you want to delete?',function(value) {
                logger.log.debug("AssetQAView.onClickAnswer - confirm=",value,_this.$route);
                _this.handleDelete();
            });
        },

        onClickEdit: function() {                        
            this.setMode("edit");
            this.v_reply.thread_id = this.v_selected.thread_id;
            this.v_reply.content = this.v_selected.content;
            this.v_reply.uuid = this.v_selected.uuid;
            this.v_buttons = false;

            logger.log.debug("onClickEdit.v_reply=",this.v_reply);            
        },

        onClickCopy: function() {
            logger.log.debug("onClickCopy=");

            if (this.v_selected) {
                CommonFunc.copyToClipboard(this,this.v_selected.content);
            }
            
            this.setButtonVisible(false);
        },

        onClickCancel: function() {
            logger.log.debug("onClickCancel=");
            this.setButtonVisible(false);
        },


    }
};
</script>


<style scoped>

.boxTitle {
    height: 40px;
}

.boxInput {
    height:100px;
    margin:10px 0px 10px 0px;
}


.cardCommand {
    width:200px;
}



</style>