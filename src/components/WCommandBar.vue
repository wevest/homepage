<template>
    
    <div class="row q-col-gutter-x-sm boxCommandBar">
        <q-icon         
            v-if="shareBtn.length>0"               
            :size="size"
            name="share" 
            @click="onClickShare" />

        <q-icon 
            v-if="(v_me.loggedIn) && (isOwner) && (updateBtn.length>0) "
            :size="size"
            name="mode_edit_outline"
            @click="onClickUpdate" />

        <q-icon
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
        size: {
            default: '20px'
        }
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    methods: {
        onClickShare() {
            this.$emit("onClickShare",this.data);
        },
        
        onClickDelete() {
            logger.log.debug("WCommandBar.onClickDelete");

            const _this=this;
            store.getters.components.getComponent('confirmDialog').show('Do you want to delete?',function(value) {
                logger.log.debug("AssetQAView.onClickAnswer - confirm=",value,_this.$route);
                if (! value) return;

                _this.$emit("onClickDelete",_this.data);
            });

        },

        onClickUpdate() {
            logger.log.debug("WCommandBar.onClickUpdate");

            this.$emit("onClickUpdate",this.data);
        },

    }

};

</script>


<style scoped>

.boxCommandBar {    
    font-size:20px;
    color:grey;
/*    
    padding:0px 10px;
*/    
}

.boxCommandBtn {
    /* padding-right:10px; */
}
</style>
        