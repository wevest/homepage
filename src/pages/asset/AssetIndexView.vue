<template>
    
    <div class="q-ma-md">
        <CTitle ttype='title' :title="$t('page.asset_index.title')" :desc="$t('page.asset_index.desc')"></CTitle>

        <AssetList ref='assetList' title="Asset List" />

    </div>

</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AssetList from 'components/lists/AssetList';
import CTitle from 'components/CTitle';

export default {
    name:'assetIndexView',
    components: {
        CTitle,
        AssetList
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data() {
        return {

        }
    },

    mounted() {
        logger.log.debug("AssetIndexView.mounted");
        this.refresh();
    },
    methods: {

        refresh() {
            this.loadAssetList();
        },

        loadAssetList() {
            this.$refs.assetList.update(20,null);
        }
    }
};

</script>
