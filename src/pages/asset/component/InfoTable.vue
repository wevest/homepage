<template>

    <q-list bordered separator>
        
        <q-item clickable v-ripple>
            <q-item-section class="col-1 gCaption">symbol</q-item-section>
            <q-item-section>{{v_asset.symbol}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-1">Name</q-item-section>
            <q-item-section>{{v_asset.name}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-1">Description</q-item-section>
            <q-item-section>{{v_asset.description}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-1">Platform</q-item-section>
            <q-item-section>{{v_asset.platform}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onClickLink(v_asset.twitter)">
            <q-item-section class="col-1">Website</q-item-section>
            <q-item-section>{{v_asset.website}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onClickLink(v_asset.twitter)">
            <q-item-section class="col-1">Chat</q-item-section>
            <q-item-section>{{v_asset.chat}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onClickLink(v_asset.twitter)">
            <q-item-section class="col-1">Twitter</q-item-section>
            <q-item-section>{{v_asset.twitter}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="onClickLink(v_asset.twitter)">
            <q-item-section class="col-1">Source Codes</q-item-section>
            <q-item-section>{{v_asset.source_code}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-1">Circulating Supply</q-item-section>
            <q-item-section>{{v_format(v_asset.circulating_supply)}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-1">Max Supply</q-item-section>
            <q-item-section>{{v_format(v_asset.max_supply)}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-1">Total Supply</q-item-section>
            <q-item-section>{{v_format(v_asset.total_supply)}}</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
            <q-item-section class="col-1">Token Address</q-item-section>
            <q-item-section>{{v_asset.token_address}}</q-item-section>
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
