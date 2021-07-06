<template>
    
    <q-btn :color="v_color" :label="v_label" :class="v_class" :icon="v_icon" 
        @click="onClick" />    

</template>

<script>
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

export default {
    name: 'WButton',
	props: {
        data: {
            default: null,
        },
        isSignin: {
            default:"0",
        },
        isDelete: {
            default:"0",
        },
        label: {
            default: null,
        },
        titleSignin: {
            type:String,
            default: 'Please login first'
        },
        titleDelete: {
            type:String,
            default: 'Do you want to delete?'
        },
        icon: {
            type:String,
            default: "",
        },
        customClass: {
            type:String,
            default: "",
        },
        customColor: {
            type:String,
            default: ""
        }
    },
    data() {
        return {
            v_title_delete: this.titleDelete,
            v_title_signin: this.titleSignin,

            //v_data: this.data,
            v_label: this.label,
            v_icon: this.icon,
            v_class: this.customClass,
            v_color: this.customColor,
            
            v_signin: this.isSignin,
            v_delete: this.isDelete,
        }
    },
    mounted() {
        logger.log.debug("WButton.onClick : mounted");
    },
    methods: {
        onClick:function() {
            logger.log.debug("WButton.onClick :v_signin=",this.v_signin);
            return;

            
            const _this=this;

            if (this.v_signin=="1") {

                store.getters.components.getComponent('confirmDialog').show(this.v_title_signin,function(value) {
                    logger.log.debug("WButton.onClick - confirm=",value,_this.$route);
                    if (! value) {
                        _this.$emit("onClick",{});
                        return;
                    }
                    CommonFunc.navSignin(_this);
                });                            
            }

            else if (this.v_delete=="1") {

                store.getters.components.getComponent('confirmDialog').show(this.v_title_delete,function(value) {
                    logger.log.debug("AssetQAView.onClickAnswer - confirm=",value,_this.$route);
                    if (! value) return;
                    _this.$emit("onClickDelete",_this.data);
                });
                
            } else {
                this.$emit("onClick",{});
            }
            
        }
    }
};

</script>

