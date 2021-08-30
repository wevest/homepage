<template>

    <div class="q-mt-sm gBoxNoMargin" style="border-bottom:1px solid #cccccc;">
        <div class="row q-pa-sm">
            <q-btn ripple flat icon="highlight_off" size="14px" @click="onClickClose" />
            <q-space />
            <q-toggle 
                v-if="v_data"
                label="Public" left-label
                v-model="v_data.live"
            />            
            <q-btn :label="$t('button.save')" color="primary" flat
                :loading="v_loading"
                @click="onClickSave" />
        </div>
    </div>
    
</template>

<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';


export default {
	props: {
        data: {
            type:Object,
            default: null,
        },    
    },
    computed: {
        v_data() {
            return this.data;
        }
    },    
    data() {
        return {
            v_loading:false,
            //v_live:false,
        }
    },
    methods: {
        setLoading(value) {
            this.v_loading = value;
        },
        
        onClickClose() {
            logger.log.debug("WWriterToolbar.onClickClose");
            store.getters.nav.back(this);
        },

        onClickSave() {
            logger.log.debug("WWriterToolbar.onClickSave");
            this.$emit("onClickSave",{});
        }
    }
};

</script>