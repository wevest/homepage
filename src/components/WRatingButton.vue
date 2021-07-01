<template>

    <div class="row ratingBox justify-center">
        <div>
            <q-btn 
                flat
                class="rateButton"
                icon="sentiment_very_satisfied" 
                @click="onClickRate(1)" />
            <div>
                <span>{{likeCaption}}</span>
            </div>
        </div>
        <div>
            <q-btn
                flat
                class="rateButton"
                icon="sentiment_very_dissatisfied"
                @click="onClickRate(-1)" />
            <div>
                <span>{{dislikeCaption}}</span>
            </div>
        </div>        
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
                logger.log.debug("onClickRate=",value);
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
}
</script>



<style scoped>

.boxRate {
    text-align:center;
    padding:25px 0px 7px 0px;  
}

.rateButton {
    color:#616161;
    width:100px;
    font-size:18px;
}

.ratingBox {
    text-align:center;
    padding:15px;
}
</style>