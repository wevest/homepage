<template>
    <div :class="v_class">    
        <div class="row">
            <div>
                {{ title }}
            </div>
            <q-space v-if="loadMoreCaption.length>0" />
            <div>                
                <q-btn :label="loadMoreCaption" @click="onClickMore" v-if="loadMoreCaption.length>0" />
            </div>
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
            default: 'description',
        },
        loadMoreCaption: {
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
        onClickMore: function() {
            this.$emit("onClickTitleMore",{});
        }
    }
}
</script>            



<style scoped>
/* box-shadow: 5px 5px 5px; */
</style>