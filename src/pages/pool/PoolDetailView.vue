<template>
    <div class="q-pa-md gResponsive">
          <div class="row">
            <div class="col">
                <CTitle :title="$t('page.poolDetail.title')" :desc="$t('page.poolDetail.desc')"
                        extraCaption="">
                </CTitle>
            </div>
        </div>
        <div class="row q-my-xl justify-center">
            <div class="q-ma-sm">
                <q-icon size="40px" name="paid" />
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
                <q-btn color="red" :label="$t('button.removeLiquidity')" @click="onClickRemove" />
            </div>
        </div>     
        <div class="gBoarder1-1 q-mb-md"> 
            <div class="gPageSubTitle q-mb-md">
                 {{  $t ('page.poolDetail.liquidity.title') }}
            </div>
            <div class="gBigValue gBoarder2 text-right">
                $1231
            </div>
        </div>
        
        <div class="gBoarder1-1"> 
            <div class="gPageSubTitle q-mb-md">
                {{  $t ('page.poolDetail.fee.title') }}
            </div>
            <div class="gBigValue gBoarder2 text-right">
                $3.70
            </div>
        </div>        
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
            this.$refs.addDialog.showExt();
        },

        onClickRemove() {
            this.$refs.addDialog.showRemove();
        }

    }
}

</script>

<style scoped>

</style>