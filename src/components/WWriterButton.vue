<template>
    
    <div class="row q-pt-md boxWriteButton" @click="onClickWrite">
        <div>
        
            <WAvatar :avatar="v_me.avatar_thumb" :username="v_me.username" />
        
        </div>        
        <div class="commentBox">        
                        
            <q-input class="gCaption" outlined readonly dense :placeholder="v_placeholder" />
            
        </div>
        

    </div>

</template>

<script>
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";
import WAvatar from "components/WAvatar.vue";

export default {
	components: {
		WAvatar,
	},
	props: {
        placeholder: {
            type:String,
            default: "What is on your minds?",
        },    
    },
    computed: {
        v_me() {
            return store.getters.me;
        }
    },
	data() {
		return {
            v_placeholder: this.placeholder,
        }
    },
    mounted() {
        logger.log.debug("WWriterButton.mounted");
        this.prepare();
    },

    methods: {
        prepare() {
            logger.log.debug("WWriterButton.prepare");
            if (! this.v_me.isLoggedIn()) {
                this.v_placeholder = "Please login first to write something";
            }
        },

        onClickWrite() {
            logger.log.debug("WWriterButton.onClickWrite");
            this.$emit("onClickWrite",{});
        }
    }

}

</script>

<style scoped>

.boxWriteButton {    
    display:flex;
    }

.commentBox {    
    flex-grow:1;
    padding:12px 0px 12px 12px;
}

</style>
        