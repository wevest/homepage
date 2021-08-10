<template>

    <div>
        <q-chip dense clickable ripple
            :icon="a_option.icon" :color="color" :text-color="textColor" :outline="! a_option.selected"
            v-for="(a_option, index) in v_options" :key="index" 
            @click="onClick(a_option)">
            {{a_option.label}}
        </q-chip>				
    </div>

</template>

<script>
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";


export default {
    name: 'WCategoryChip',
    components: {},
    props: {
        data: {
            default: null,
        },
        label: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: ''
        },
        textColor: {
            type: String,
            default: ''
        }
    },
    computed: {},
    data() {
        return {
            v_options: this.data,
        }
    },
    methods: {
        clear() {
            for (let index=0; index<this.v_options.length;index++) {
                this.v_options[index].selected = false;
            }
        },
        onClick(option) {
            logger.log.debug("WcategoryChip.onClick:option=",option);
            
            this.clear();
            option.selected = true;
            this.$emit('onClickCategory',option);
        }
    }
}
</script>            



<style scoped>

</style>