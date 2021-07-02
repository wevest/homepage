<template>
    
    <div class="row boxCommandBar">        
        <q-icon         
            v-if="shareBtn.length>0"   
            class="boxCommandBtn"
            name="share" 
            @click="onClickShare" />

        <q-icon 
            v-if="(isOwner) && (updateBtn.length>0) "
            class="boxCommandBtn"
            name="mode_edit_outline"
            @click="onClickUpdate" />
        <q-icon
            v-if="(isOwner) && (deleteBtn.length>0) "
            class="boxCommandBtn"
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
        }
    },
    methods: {
        onClickShare() {
            this.$emit("onClickShare",this.data);
        },
        
        onClickDelete() {
            logger.log.debug("WCommandBar.onClickDelete");
            this.$emit("onClickDelete",this.data);
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
    padding:0px 10px;
}

.boxCommandBtn {
    padding-right:10px;
}
</style>
        