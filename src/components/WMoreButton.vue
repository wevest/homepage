<template>

    <q-btn-dropdown unelevated dense dropdown-icon="more_vert">
        <q-list separator>
            <q-item clickable v-close-popup v-for="(a_caption, index) in v_captions" :key="index">
                <q-item-section>
                    <q-btn flat :label="a_caption" @click="onClickButton(a_caption)" />
                </q-item-section>
            </q-item>
        </q-list>

    </q-btn-dropdown>

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
        buttons: {
            type:String,
            default: "",
        },
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_captions() {
            if (this.buttons.length==0) {
                return null;
            }

            return this.buttons.split("|");
        }
    },
    data () {
        return {
            v_color_like:'',
            v_color_dislike:'',
            v_ripple: '{center:true}'
        }
    },
    methods: {
        onClickButton(caption) {
            logger.log.debug("WMoreButtons.onClickButton : caption=",caption);
            this.$emit("onClick",{data:this.data,caption:caption});
        }
    }

};

</script>
