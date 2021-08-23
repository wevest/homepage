<template>
    
    <div class="q-ma-md">



    </div>

</template>

<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'components/CTitle';

export default {
    name: 'SwapView',
    components: {
        CTitle,
        WWriterToolbar,
        TipTap
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data() {
        return {
            g_data: '',
            g_page_id: null,
            g_category_id: null,
            
            
        }
    },

    created() {
        logger.log.debug("BlogWriterView.created");
    },
    mounted() {        
        logger.log.debug("BlogWriterView.mounted : params=",this.$route.params);
    },
    updated() {
    },
    
    methods: {
        prepare() {},


    }

};
</script>


<style scoped>

</style>