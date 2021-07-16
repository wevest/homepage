<template>

    <div>
        <span class="q-pr-sm">                              
            <q-btn
                class="gRatingBtnXS" flat dense ripple
                :class="v_color_like"
                icon="thumb_up_off_alt"
                @click="onClickRate('like')" />
                <span class="gRatingCountSM">{{ likeCount }}</span>
        </span>
                    
        <span>
            <q-btn 
                class="gRatingBtnXS"  flat dense ripple
                :class="v_color_dislike"      
                icon="thumb_down_off_alt"
                @click="onClickRate('dislike')"> 
            </q-btn>
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
    data() {
        return {
            v_color_like:'',
            v_color_dislike:'',
            v_ripple: '{center:true}'
        }
    },
    methods: {
        setColor(value) {
            if (value=="like") {
                this.v_color_like = "text-primary";
                this.v_color_dislike = "";                
            } else {
                this.v_color_like = "";
                this.v_color_dislike = "text-primary";                
            }
        },
        onClickRate(value) {

            if (this.v_me.isLoggedIn()) {
                logger.log.debug("WRatingSmallButton.onClickRate : value=",value);
                const dic_param = {value:value, data:this.data, _this:this};
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
