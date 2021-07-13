<template>

    <div>
        <span class="q-pr-sm">                              
            <q-icon 
                class="gRatingBtnSM"                                                                    
                name="thumb_up_off_alt"
                @click="onClickRate('like')" />
                <span class="gRatingCountSM">{{ likeCount }}</span>
        </span>
                    
        <span>
            <q-icon 
                class="gRatingBtnSM"                                                             
                name="thumb_down_off_alt"
                @click="onClickRate('dislike')"> 
            </q-icon>
            <span class="gRatingCountSM">{{ dislikeCount }}</span>
        </span>
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
        likeCount: {
            default:-1,
        },
        dislikeCount: {
            default:-1,
        },
        likeCaption: {
            type:String,
            default: "도움이 돼요",
        },
        dislikeCaption: {
            type:String,
            default: "도움이 안 돼요",
        },
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    methods: {
        onClickRate(value) {

            if (this.v_me.isLoggedIn()) {
                logger.log.debug("WRatingSmallButton.onClickRate : value=",value);
                const dic_param = {value:value, data:this.data};
                this.$emit("onClickRating",dic_param);
                return;
            }

            const _this=this;
            store.getters.components.getComponent('confirmDialog').show('Please login first',function(value) {
                logger.log.debug("AssetQAView.onClickAnswer - confirm=",value,_this.$route);
                if (! value) return;
                CommonFunc.navSignin(_this);                
            });            

        }
    }

};
</script>


<style scoped>



</style>
