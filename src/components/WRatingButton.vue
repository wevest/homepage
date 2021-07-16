<template>


    <div class="row q-pa-md justify-center text-center">
        <div class="q-pr-md">
            <q-btn 
                class="gRatingBtnMD"
                :class="v_color_like"
                flat ripple
                icon="sentiment_very_satisfied" 
                @click="onClickRate(1)" />
            <div class="gRatingCountMD">
                <span>{{likeCaption}}</span>
            </div>
        </div>
        <div class="q-pl-md">
            <q-btn
                class="gRatingBtnMD"
                :class="v_color_dislike"
                flat ripple
                icon="sentiment_very_dissatisfied"
                @click="onClickRate(-1)" />
            <div class="gRatingCountMD">
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
    data () {
        return {
            v_color_like:'',
            v_color_dislike:'',
        }
    },
    methods: {

        vote: function(dicParam) {
            const _this = this;            
            
            logger.log.debug('WRatingButton.vote : dicParam=',dicParam);

            let dic_param = {id:this.data.id, value:dicParam.value};            
            this.data.vote(dic_param).then( response => {            
                
                if (dicParam.value==1) {
                    _this.v_color_like = "text-primary";
                    _this.v_color_dislike = "";
                } else if (dicParam.value==-1) {
                    _this.v_color_like = "";
                    _this.v_color_dislike = "text-primary";
                }
                //CommonFunc.showOkMessage(_this,msg);

            }).catch( err=> {
                logger.log.error('WRatingButton.vote : err=',err);
                CommonFunc.showErrorMessage(_this,err);
            });
        },

        onClickRate(value) {

            if (this.v_me.isLoggedIn()) {
                logger.log.debug("onClickRate=",value);
                const dic_param = {value:value, data:this.data};
                this.vote(dic_param);
                //this.$emit("onClickRating",dic_param);
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




</style>