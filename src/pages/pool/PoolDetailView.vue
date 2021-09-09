<template>
    <div class="q-pa-md">
        <div class="row q-my-xl justify-center">
            <div class="q-ma-sm">
                <q-icon size="45px" name="paid" />
            </div>   
            <div class="gBigName">
                ADA / USDT
            </div>
        </div>
        <div class="row justify-center q-my-md">
            <div class="q-ma-sm"> 
                <q-btn :label="$t('button.addLiquidity')" @click="onClickAdd" />
            </div>
            <div class="q-ma-sm"> 
                <q-btn color="red" :label="$t('button.removeLiquidity')" />
            </div>
        </div>

<!--                    
        <div class="gBoarder2 q-mb-sm q-pa-md"> 
            <div class="q-mb-sm gSubTitle">
                {{ $t('page.pool.poolRatio.title') }}
            </div>
            <div class="full-width">
                <q-btn-toggle
                v-model="v_utilization"
                toggle-color="primary"
                spread
                :options="[
                    {label: '0%', value: '0'},
                    {label: '25%', value: '25'},
                    {label: '50%', value: '50'},
                    {label: '75%', value: '75'}, 
                    {label: '100%', value: '100'} 
                    ]" />
            </div>   

            <div class="q-mt-md">
                <q-badge color="secondary">
                        Model: {{ basicModel }} (0 to 100, step 5)
                        </q-badge>
                        <q-slider
                        v-model="basicModel"
                        :step="5"
                        label-always
                        color="primary"
                        />
            </div>

        </div>
-->        
        <div class="gBoarder1-1 q-mb-md"> 
            <div class="gPageSubTitle q-mb-md">
                 {{  $t ('page.poolDetail.liquidity.title') }}
            </div>
            <div class="gBigValue gBoarder4 text-right">
                $354.28
            </div>
        </div>
        
        <div class="gBoarder1-1"> 
            <div class="gPageSubTitle q-mb-md">
                {{  $t ('page.poolDetail.fee.title') }}
            </div>
            <div class="gBigValue gBoarder4 text-right">
                $3.70
            </div>
        </div>

<!-- 유동성추가2-dialog-START-->
        
        <AddPoolDialog ref="addDialog" />
    </div>

</template>

<script>
import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import AddPoolDialog from 'src/pages/pool/components/AddPoolDialog';

export default {
    name: 'PoolDetailView',
    components: {
        CTitle,     
        AddPoolDialog   
    },
    data() {
        return {
            v_utilization:null,
        }
    },

    methods: {
        onClickAdd() {
            this.$refs.addDialog.show();
        }
    }
}

</script>

<style scoped>

</style>