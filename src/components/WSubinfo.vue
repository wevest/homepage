<template>

    <div class="row q-gutter-md gCaption">
        <div v-if="v_rating>-1">
<!--            
            <q-rating                        
                dense
                class="rating-icon" 
                v-model="v_rating" 
                size="1.2em" 
                icon="star_border" 
                icon-selected="star" 
                color="red-5"
            />                        
-->
            <q-icon name="arrow_circle_up" v-if="v_rating==1" />
            <q-icon name="arrow_circle_down" v-if="v_rating==-1" />

        </div>
        <div v-if="(username) && (username.length>0)">
            {{ v_shorten(username) }}
        </div>
        <div v-if="(pub_date) && (pub_date.length>0)">
             {{ v_updated_at(pub_date) }} 
        </div>
        <div v-if=" (v_like_count>-1) && (v_dislike_count>-1)">
            <q-icon name="sentiment_very_satisfied" />
            <span>
                {{ like_count }}
            </span>
            <q-icon name="sentiment_very_dissatisfied" />
            <span> 
                {{ dislike_count }} 
            </span>            
        </div>
        <div v-if="v_read_count>-1">
            <q-icon name="chat_bubble_outline" />
            <span>&nbsp;{{ read_count }}</span>
        </div>
    </div>

</template>

<script>
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";
import WAvatar from "components/w/WAvatar.vue";

export default {
	props: {
        rating: {
            default:-1,
        },
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
        read_count: {
            default: -1
        },
        dateFormat: {
            default: "1"
        }
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,15);
            }
        },
        v_updated_at() {
            return (value) => {
                if (this.dateFormat=="0") {
                    return value;
                }
                
                let ret = CommonFunc.minifyDatetime(value);
                //console.log("WSubinfo.ret=",ret);
                if (ret=="Invalid date") {
                    ret = CommonFunc.minifyDatetime(value,1);
                }
                return ret;
            };
        },
        v_rating() {
            if (typeof this.rating=="number") {
                return this.rating;
            }
            return parseInt(this.rating);
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
        v_read_count() {
            if (typeof this.read_count == "number") {
                return this.read_count;
            }
            return parseInt(this.read_count);
        },
        v_style() {
            if (! this.username) {
                return "";
            }

            if ( (this.username.length>0) ) {
                //return "padding-left:20px;";
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
