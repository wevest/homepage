<template>
    <div>
    
        <q-card class="q-ma-md q-pa-md">
<!--            
                <div class="text-right">
                    <q-btn flat size="16px" label="X" @click="onClickCloseTokenDialog" />
                </div>    
-->                
                <div class="row justify-center gDialogTitle">
                    <div class="q-ma-xs">wETH 3x Long</div>
                </div>
                <q-separator class="q-my-md" />
                <div class="q-mx-md">
                    <div class="row"> 
                        <div>{{ $t('dialog.asset.roi.title') }}</div>
                        <q-space />
                        <div style="color:green">+36%</div>
                    </div>
                    <div class="row q-my-sm">
                        <div>{{ $t('dialog.asset.totalAmount.title') }}</div>
                        <q-space />
                        <div>$16,800</div> 
                    </div> 
                    <div class="row q-my-sm">
                        <div>{{ $t('dialog.asset.valuationLoss.title') }}</div>
                        <q-space />
                        <div style="color:green">$180</div> 
                    </div> 
                    <div class="row q-my-sm">
                        <div>{{ $t('dialog.asset.risk.title') }}</div>
                        <q-space />
                        <div style="color:red">2.5%</div> 
                    </div> 
                    <div class="row q-my-sm">
                        <div>{{ $t('dialog.asset.purchasePrice.title') }}</div>
                        <q-space />
                        <div>$3,500</div> 
                    </div> 
                    <div class="row q-my-sm">
                        <div>{{ $t('dialog.asset.totalPurchase.title') }}</div>
                        <q-space />
                        <div>$15,000</div> 
                    </div> 
                    <div class="row q-my-sm">
                        <div>{{ $t('dialog.asset.principal.title') }}</div>
                        <q-space />
                        <div>$500</div> 
                    </div> 
                    <q-separator class="q-my-md" />
                    <div class="row justify-evenly"> 
<!--                            
                        <div class="">
                            <q-btn color="orange" :label="$t('button.stopPL')" @click="onClickPTSL" />
                        </div> 
-->                            
                        <div class="">
                            <q-btn color="red" :label="$t('button.redeem')" @click="onClickClosePosition" />
                        </div> 
                    </div>
                </div>
        </q-card>   

        <q-dialog v-model="v_dialog_sell" position="bottom">
            <q-card>
                <q-card-section>
                    <div class="row">
                        <div class="gDialogTitle">
                            {{ $t('dialog.asset.redeem.title') }}
                        </div>
                        <q-space />
                        <div class=""> 
                            <q-btn flat v-close-popup icon="close" />
                        </div>
                    </div>
                    <div class="gBoarder1 q-pa-md">
                        <div class="row q-py-sm"> 
                            <div class="gNameText">{{ $t('dialog.asset.symbol.title') }}</div>
                            <q-space />
                            <div>BTCUSDT Perpetual</div>
                        </div>
                        <div class="row q-py-sm"> 
                            <div class="gNameText">{{ $t('dialog.asset.price.title') }}</div>
                            <q-space />
                            <div>49763.08 USDT</div>       
                        </div>
                        <div class="row q-py-sm"> 
                            <div class="gNameText">{{ $t('dialog.asset.amount.title') }}</div>
                            <q-space />
                            <div>1012.45 USDT</div>
                        </div>
                        <div class="row q-py-sm"> 
                            <div class="gNameText">{{ $t('dialog.asset.cost.title') }}</div>
                            <q-space />
                            <div>331.95 USDT</div>
                        </div>
                        <div class="q-my-md">
                        <q-checkbox v-model="v_sell_check" :label="$t('dialog.asset.checkBoxMessage.title')" />
                        </div>
                        <div>
                            <q-btn class="full-width" color="primary" :label="$t('button.confirm')" @click="onClickConfirm" />
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

<!-- 청산 완료-Dialog-시작 -->
        <q-dialog v-model="v_dialog_notice" position="bottom">
            <q-card>
                <q-card-section>
                    <div class="gBoarder1 text-center"> 
                        <div class="row q-mt-md justify-center">
                            <div class="text-h6 q-ma-sm">USDT</div> 
                            <div class="text-h6 q-my-sm">$16,800</div> 
                        </div>
                        <div> 
                            {{ $t('dialog.asset.completeClosePositionMessage.title') }}
                        </div>
                        <div class="">
                            <div class="q-py-lg">
                                <q-btn color="primary" :label="$t('button.completeRedeem')" @click="onClickDone" />
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

    </div>
    
</template>


<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import NavFunc from 'src/util/NavFunc';
import logger from "src/error/Logger";

import UserModel from "src/models/UserModel";
import {PoolModel,PoolListModel} from "src/models/PoolModel";
import {AssetModel,AssetListModel} from "src/models/AssetModel";

import CTitle from 'components/CTitle';

export default {
    components: {
        CTitle,
    },
    props: {},
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data() {
        return {
            v_title: 'Title',

            v_user: new UserModel(),
            v_assets: new AssetListModel(),
            v_pools: new PoolListModel(),

            v_sell_check: false,

            v_dialog_token: false,
            v_dialog_sell: false,
            v_dialog_notice: false,

            v_labels: {'submit': 'Upload', 'cancel': 'Cancel'},
        }
    },
    mounted() {
        //console.log("HomeView.mounted - ");
        logger.log.debug("ProfileView.mounted - symbol=",this.$route.query);
        this.v_assets.addTestData();
        this.v_pools.addTestData();
        //this.setUser(this.$route.query);
        //this.refresh();
    },

    methods: {     

        onClickCloseTokenDialog() {
            this.v_dialog_token = false;
        },

        onClickPTSL() {
            NavFunc.navPTSL(this);
        },

        onClickClosePosition() {
            this.v_dialog_token = false;
            this.v_dialog_sell = true;
        },

        onClickConfirm() {
            this.v_dialog_sell = false;
            this.v_dialog_notice = true;
        },

        onClickDone() {
            this.v_dialog_notice = false;
        }        
    }
}

</script>

<style scoped>

</style>