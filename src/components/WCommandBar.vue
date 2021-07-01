<template>
    
    <div class="boxCommandBar">        
        <q-icon         
            v-if="shareBtn.length>0"   
            flat name="share" 
            @click="onClickShare" />
        <q-icon 
            v-if="(isOwner) && (updateBtn.length>0) "
            flat name="build"
            @click="onClickUpdate" />
        <q-icon
            v-if="(isOwner) && (deleteBtn.length>0) "
            flat name="delete" 
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
}


</style>
        