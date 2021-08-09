<template>
    <div :class="v_class">    
        <div class="row">
            <div>
                <span>{{ title }}</span>
            </div>
            <q-space v-if="(loadMoreCaption.length>0) || (extraCaption.length>0)" />
            <div>                
                <q-btn class="gButtonSM" flat ripple
                    :label="extraCaption" @click="onClickExtra" v-if="extraCaption.length>0" />

                <q-btn class="gButtonSM" flat ripple
                    :label="loadMoreCaption" @click="onClickMore" v-if="loadMoreCaption.length>0" />
            </div>
        </div>
        <div v-if="desc.length>0">
            <span class="gCaption"> {{desc}} </span>
        </div>
    </div>
</template>


<script>
import logger from "src/error/Logger";

export default {
    name: 'CTitle',
    components: {},
    props: {
        ttype: {
            type: String,
            default: 'title',            
        },
        title: {
            type: String,
            default: '',
        },
        desc: {
            type: String,
            default: '',
        },
        loadMoreCaption: {
            type:String,
            default:""
        },
        extraCaption: {
            type:String,
            default:""
        }
    },
    computed: {
        v_class() {
            if (this.ttype=="title") {
                return "gPageTitle text-uppercase";
            }
            return "gSubTitleLG text-uppercase";
        },
    },
    data: function () {
        return {
        }
    },
    methods: {        
        onClickMore() {
            this.$emit("onClickTitleMore",{});
        },

        onClickExtra() {
            this.$emit("onClickTitleExtra",{});
        }
    }
}
</script>            



<style scoped>
/* box-shadow: 5px 5px 5px; */
</style>