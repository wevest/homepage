<template>

    <q-list bordered separator>
        
        <q-item clickable v-ripple>
            <q-item-section class="col-3 itemLabel">Symbol</q-item-section>
            <q-item-section>{{v_asset.symbol}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-3 itemLabel">Name</q-item-section>
            <q-item-section>{{v_asset.name}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section top class="col-3 itemLabel">Description</q-item-section>
            <q-item-section class="gParagraphSM">{{v_asset.description}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-3 itemLabel">Platform</q-item-section>
            <q-item-section>{{v_asset.platform}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onClickLink(v_asset.website)">
            <q-item-section class="col-3 itemLabel">Website</q-item-section>
            <q-item-section class="itemLink">{{v_asset.website}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onClickLink(v_asset.chat)">
            <q-item-section class="col-3 itemLabel">Chat</q-item-section>
            <q-item-section class="itemLink">{{v_asset.chat}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onClickLink(v_asset.twitter)">
            <q-item-section class="col-3 itemLabel">Twitter</q-item-section>
            <q-item-section class="itemLink">{{v_asset.twitter}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onClickLink(v_asset.source_code)">
            <q-item-section class="col-3 itemLabel">Source Codes</q-item-section>
            <q-item-section class="itemLink">{{v_asset.source_code}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-3 itemLabel">Token Address</q-item-section>
            <q-item-section>{{v_asset.token_address}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-3 itemLabel">Circulating Supply</q-item-section>
            <q-item-section class="text-right">{{v_format(v_asset.circulating_supply)}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-3 itemLabel">Max Supply</q-item-section>
            <q-item-section class="text-right">{{v_format(v_asset.max_supply)}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-3 itemLabel">Total Supply</q-item-section>
            <q-item-section class="text-right">{{v_format(v_asset.total_supply)}}</q-item-section>
        </q-item>

    </q-list>

</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";

import {AssetModel} from "src/models/AssetModel";


export default {
    name:'infoTable',
	props: {
        data: {
            required: true,
            default: new AssetModel()
        },
    },
    computed: {
        v_format() {
            return (value) => {
                if(!value) {
                    return '';
                }
                return value.toLocaleString();
            };
        },
    },
    data() {
        return {
            v_asset: this.data,
        }
    },
    methods: {
        update(asset) {
            this.v_asset = asset;
        },

        onClickLink(link) {
            logger.log.debug("InfoTable.onClickLink:link=",link);
            CommonFunc.openLink(link);
        }
    }
};


</script>

<style scoped>

.itemLabel {
    word-wrap:break-all;
    word-break:break-word;
    color: #9e9e9e;
    font-weight: 500;
}

.itemLink {
    color: #0d47a1;
}
</style>