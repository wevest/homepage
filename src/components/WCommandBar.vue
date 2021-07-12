<template>
    
    <div class="row q-col-gutter-x-sm">
        <q-icon 
            class="gCommentBtnMD"        
            v-if="shareBtn.length>0"               
            :size="size"
            name="share" 
            @click="onClickShare" />

        <q-icon 
            class="gCommentBtnMD"
            v-if="(v_me.loggedIn) && (! isOwner) && (copyBtn.length>0) "
            :size="size"
            name="content_copy" 
            @click="onClickCopy" />

        <q-icon 
            class="gCommentBtnMD"
            v-if="(v_me.loggedIn) && (isOwner) && (updateBtn.length>0) "
            :size="size"
            name="mode_edit_outline"
            @click="onClickUpdate" />

        <q-icon
            class="gCommentBtnMD"
            v-if="(v_me.loggedIn) && (isOwner) && (deleteBtn.length>0) "
            :size="size"
            name="delete_outline" 
            @click="onClickDelete" />

    </div>                  

</template>


<script>
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";



export default {
	props: {
        data: {
            default: null,
        },
        isOwner: {
            type:Boolean,
            default: false,
        },
        size: {
            default: '20px'
        },
        shareBtn: {
            type:String,
            default: ''
        },
        updateBtn: {
            type:String,
            default: ''
        },
        deleteBtn: {
            type:String,
            default: ''
        },
        copyBtn: {
            type:String,
            default: ''
        },
        moreBtn: {
            type:String,
            default: ''
        },
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    methods: {

        addToMyPortfolio: function(jsonPortfolio) {
            logger.log.debug("WCommandBar.addToMyPortfolio : portfolio=",jsonPortfolio);
            
            const _this=this;
            
            let portfolio = new PortfolioItemModel();
            portfolio.assign(jsonPortfolio);
            portfolio.portfolio_id = -1;
            portfolio.description += '\r\n Copied from ' + this.v_user.username;

            portfolio.addToServer().then(response=>{
                logger.log.debug("WCommandBar.onClickAddToMyPortfolio : response=",response);    
                if (response.data.ret==0) {
                    CommonFunc.showOkMessage(_this,'portfolio added');
                } else {
                    CommonFunc.showErrorMessage(_this,response.data.msg);
                }
                
            }).catch(err=>{
                logger.log.error("WCommandBar.onClickAddToMyPortfolio : err=",err);    
            });
        },


        onClickShare() {
            this.$emit("onClickShare",this.data);
        },
        
        onClickDelete() {
            logger.log.debug("WCommandBar.onClickDelete");

            const _this=this;
            store.getters.components.getComponent('confirmDialog').show('Do you want to delete?',function(value) {
                logger.log.debug("WCommandBar.onClickDelete - confirm=",value,_this.$route);
                if (! value) return;

                _this.$emit("onClickDelete",_this.data);
            });

        },

        onClickUpdate() {
            logger.log.debug("WCommandBar.onClickUpdate");

            this.$emit("onClickUpdate",this.data);
        },

        onClickCopy() {
            logger.log.debug("WCommandBar.onClickCopy");

            this.$emit("onClickCopy",this.data);
        },

    }

};

</script>


<style scoped>




</style>
        