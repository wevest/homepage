<template>

    <div>
        <q-chip v-for="(a_option, index) in v_options" :key="index" :icon="a_option.icon">
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
    },
    computed: {},
    data() {
        return {
            v_options: this.data,
        }
    },
    methods: {

    }
}
</script>            



<style scoped>

.ctitle {
/*    border-bottom: 1px solid #ccc; */
    margin-bottom: 0.0rem;    
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 0.0rem;    
}

.ctitle, .title {
    text-transform: uppercase;
    color: rgba(13, 27, 62, 0.7);
    font-weight: bold;
    font-size: 1.0rem;
}

</style>