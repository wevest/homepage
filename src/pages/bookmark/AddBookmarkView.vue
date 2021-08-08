<template>
    
    <div class="q-pa-md">
        <div>
            <CTitle ttype='title' :title="$t('page.bookmark.title')" :desc="$t('page.bookmark.desc')"></CTitle>
        </div>

        <div>

            <AssetList ref='assetList' :title="$t('page.home.asset.title')" :desc="$t('page.home.asset.desc')"
                maxLength="10" :moreCaption="$t('button.more')" ></AssetList>

        </div>

    </div>


</template>


<script>
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'components/CTitle';
import AssetList from 'components/lists/AssetList';

export default {
    name:'AddBookmark',
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
        this.refresh();
    },
    methods: {
        loadAssets(limit,offset) {
            this.$refs.assetList.update();
        },
        refresh() {
            this.loadAssets();
        }
    }

};

</script>

<style scoped>

</style>