<template>
    <div class="q-pa-md">

        <div>
            <CTitle :title="$t('page.inbox.title')" :desc="$t('page.inbox.desc')"></CTitle>
        </div>            


        <div class="col">
            <div v-if="v_thread.items.length>0">
                <q-list separator>
                    <q-item class="avatar" clickable v-for="(a_thread,index) in v_thread.items" :key="index">
                        <q-item-section top avatar>
                            <WAvatar :avatar="a_thread.sender.avatar_thumb" :username="a_thread.sender.username" />
                        </q-item-section>                        

                        <q-item-section @click="onClickMessage(index,a_thread)">
                            <q-item-label>{{a_thread.subject}}</q-item-label>
                            <q-item-label caption lines="2">{{a_thread.last_message}}</q-item-label>
                        </q-item-section>

                        <q-item-section side bottom>
                            <q-item-label class="gCaption" caption>{{v_updated_at(a_thread.sent_at)}}</q-item-label>
                            <!-- <q-icon name="star" color="yellow" /> -->
                        </q-item-section>
                        <q-item-section side bottom>

                            <WCommandBar :data="a_thread" :isOwner="true" 
                                shareBtn="" updateBtn="" deleteBtn="delete" 
                                @onClickDelete="onClickDelete" 
                            />
<!--
                            <q-btn class="gt-xs" size="12px" flat dense round icon="delete_outline" @click="onClickDelete(a_thread)" />
-->
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>

            <div class="NoMessageBox" v-if="v_no_message">
                <q-icon name="email" style="color: #666666; font-size: 100px;" />
                <div class="Message">No Messages!!!</div>
            </div>

<!--
            <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn fab icon="add" color="accent" @click="onClickWrite" />
            </q-page-sticky>
-->
        </div>

        <MessageWriterDialog ref="messageWriter" />

    </div>

</template>

<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import WCommandBar from "components/WCommandBar.vue";
import MessageWriterDialog from 'components/dialogs/MessageWriterDialog';

import {MessageThreadModel, MessageThreadListModel, MessageModel, MessageListModel} from "src/models/MessageModel";

import WAvatar from "components/WAvatar.vue";
import CTitle from 'components/CTitle';



export default {
    components: {
        CTitle,
        WAvatar,
        WCommandBar,
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

        v_no_message: false,
    }),
    mounted() {
        //console.log("HomeView.mounted - ");
        logger.log.debug("MessageView.mounted - params=",this.$route.params, this.v_message);
        
        this.refresh();
    },

    methods: {     
        showNoMessage(value) {
            this.v_no_message = value;
        },

        refresh: function() {
            const _this = this;
            
            this.v_thread.load().then(response=> {
                logger.log.debug("MessageView.refresh : response=",response);    
                if (response.count>0) {
                    _this.showNoMessage(false);
                } else {
                    _this.showNoMessage(true);
                }
            });

        },

        onClickWrite() {
            logger.log.debug("onClickWrite");
            this.$refs.messageWriter.show(this.v_message);
        },

        onClickMessage(index,thread) {
            logger.log.debug("onClickMessage: thread=",thread);
            this.g_thread = thread;
            
            let dicQuery = { id:thread.uuid, username:thread.username, subject:thread.subject };

            store.getters.nav.add(this.$route);            
            let dic_param = { name:'message_detail', path:'message_detail', query:dicQuery };
            this.$router.push(dic_param);
        },

        onClickDelete(thread) {
            logger.log.debug("onClickDelete: thread=",thread);

            const _this=this;
            thread.remove().then(response=>{
                _this.v_thread.removeThread(thread.id);
                CommonFunc.showOkMessage(_this,'Message Deleted');
            }).catch(err=>{
                CommonFunc.showErrorMessage(_this,"Message error");
            });

        }
    },

}

</script>



<style scope> 
.avatar {
    margin:-6px 0px 8px 0px;
}

.NoMessageBox {
    padding-top:100px;
    text-align:center;
}

.Message {
    font-size:18px;
    color:#666666;
}
</style>
