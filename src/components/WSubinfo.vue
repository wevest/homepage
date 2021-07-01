<template>
    
    <div class="row gPageUDRBox gPageUserDateInfo">
        <div>
            <span> {{ username }} </span>
        </div>
        <div :style="v_style">
            <span class="material-icons">
                alarm
            </span>&nbsp;
            <span>
                {{ v_updated_at(pub_date) }} 
            </span>
        </div>
        <div style="padding-left:20px;" v-if=" (v_like_count>-1) && (v_dislike_count>-1)">
            <q-icon name="thumb_up_off_alt" />
            <span>
                {{ like_count }}
            </span>&nbsp;
            <q-icon name="thumb_down_off_alt" />
            <span> 
                {{ dislike_count }} 
            </span>
        </div>
    </div>

</template>

<script>
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";
import WAvatar from "components/WAvatar.vue";


export default {
	props: {
        username: {
            type:String,
            default: "",
        },
        pub_date: {
            type:String,
            default: "",
        },
        like_count: {
            default: 0,
        },
        dislike_count: {
            default: 0,
        },
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        },
        v_like_count() {
            if (typeof this.like_count == "number") {
                return this.like_count;
            }
            return parseInt(this.like_count);
        },
        v_dislike_count() {
            if (typeof this.dislike_count == "number") {
                return this.dislike_count;
            }
            return parseInt(this.dislike_count);
        },
        v_style() {
            if ( (this.username.length>0) ) {
                return "padding-left:20px;";
            }
            return "";
        }
        
    },
    data() {    
        return {
            v_disabled:false,
        }
    },
    methods: {

    },
};

</script>
