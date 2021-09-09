<template>

    <div>

    <!-- 유동성추가1-코인선택-dialog-START -->

        <q-dialog v-model="v_dialog_asset">
            <q-card>
                <q-card-section>
                    <div class="q-px-md" style="min-width: 280px">
                        <div CLASS="row q-mb-sm"> 
                            <div class="gDialogTitle">
                                {{ $t('dialog.pool.tokenPick.title') }}
                            </div> 
                            <q-space />
                            <div class="text-right">
                                <q-btn size="11px" flat icon="close" v-close-popup />
                            </div> 
                        </div>
                        <div> 
                            <q-input outlined v-model="v_search" :placeholder="$t('button.searchPaste')" dense />
                        </div>
                        <q-separator class="q-my-md" />
                        <div class="">
                            <div class="row q-my-md">
                                <div class="q-mr-sm">
                                    <q-icon size="40px" name="paid" />
                                </div> 
                                <div>
                                    <div class="gText">ETH</div> 
                                    <div class="gCaption">Ethereum</div> 
                                </div> 
                                <q-space />
                                <div class="gValue">
                                    0.07354
                                </div> 
                            </div>
                            <div class="row q-my-md">
                                <div class="q-mr-sm">
                                    <q-icon size="40px" name="paid" />
                                </div> 
                                <div>
                                    <div class="gText">1INCH</div> 
                                    <div class="gCaption">1Inch</div> 
                                </div> 
                                <q-space />
                                <div class="gValue">
                                    98.14
                                </div> 
                            </div>
                            <div class="row q-my-md">
                                <div class="q-mr-sm">
                                    <q-icon size="40px" name="paid" />
                                </div> 
                                <div>
                                    <div class="gText">AAVE</div> 
                                    <div class="gCaption">AaveToken</div> 
                                </div> 
                                <q-space />
                                <div class="gValue">
                                    0
                                </div> 
                            </div>
                            <div class="row q-my-md">
                                <div class="q-mr-sm">
                                    <q-icon size="40px" name="paid" />
                                </div> 
                                <div>
                                    <div class="gText">ANT</div> 
                                    <div class="gCaption">Aragon Network Token</div> 
                                </div> 
                                <q-space />
                                <div class="gValue">
                                    0
                                </div> 
                            </div>
                        </div>
                        <div>
                            <q-btn class="full-width" text-color="primary" outline :label="$t('button.confirm')" @click="onClickAsset" />
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

    <!-- 유동성추가1-코인선택-dialog-END -->
        <q-dialog v-model="v_dialog_portion">
            <q-card>
                <q-card-section>
                    <div class="" style="min-width: 280px"> 
                        <div class="row">
                            <div class="q-my-sm gDialogTitle">
                                {{ $t('page.pool.addLiquidity.title') }}
                            </div>
                            <q-space />
                            <div>
                                <q-btn flat icon="close" v-close-popup />  
                            </div>
                        </div>
                            <q-separator class="q-my-md" />
                        <div class="q-my-sm gText2">
                            {{ $t('dialog.pool.selectCoin.title') }}
                        </div>
                        <div class="gBoarder1">
                            <div class="q-mx-xs q-my-sm"> 
                                <q-select class="full-width" bg-color="grey-1" outlined v-model="v_asset" :options="v_options" :label="$t('button.coinSelect')"  />
                            </div>
                            <div class="q-ma-sm">
                                <div class="row justify-between"> 
                                    <div class="gText">Pool Amount</div>
                                    <div class="gValue">100,000 ADA</div>
                                </div>
                                <div class="row justify-between"> 
                                    <div class="gText">Current Balance</div>
                                    <div class="gValue">100,000,000 USDT</div>
                                </div>
                            </div>
                        </div>
                        <div class="q-my-sm q-pt-sm gText2">
                            {{ $t('page.pool.poolRatio.title') }}
                        </div>
                        <div class="gBoarder1"> 
                            <div class="full-width q-pt-sm">
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
                            <div class="row justify-between q-mt-md"> 
                                <div class="gText">Deposit Amount </div>
                                <div class="gValue">~100,000 USDT</div>
                            </div>
                            <div class="q-mt-lg q-mb-md text-center">  
                                <q-btn class="full-width" label="Add" color="primary" @click="onClickAdd2" />
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

    <!-- 유동성추가2-dialog-START-->
        <q-dialog v-model="v_dialog_confirm">
            <q-card>
                <q-card-section>
                    <div class="q-ma-md" style="min-width: 280px">
                        <div class="row"> 
                            <div class="gDialogTitle"> 
                                {{ $t('dialog.pool.addLiquidity.title')}}
                            </div>
                            <q-space />
                            <div> 
                                <q-btn dense flat icon="close" v-close-popup /> 
                            </div>
                        </div>
                        <q-separator class="q-my-md" />
                        <div class="row gBoarder1"> 
                            <div class="gText2">
                                USDT <span>풀링추가 </span>
                            </div> 
                            <q-space />
                            <div class="gValue2"> $350 </div>
                        </div>   
                        <div class="text-center q-mt-lg"> 
                            <q-btn rounded color="primary" :label="$t('button.confirm')" @click="onClickConfirm" />
                        </div>        
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

    <!-- 유동성추가2-dialog-END-->


    <!-- 유동성추가3-확인을기다리는중-dialog-START-->
        <q-dialog v-model="v_dialog_progress">
            <q-card> 
                <div style="min-width: 280px">
                    <q-card-section>
                        <div class="row"> 
                            <q-space />
                            <div class="">
                                <q-btn flat icon="close" v-close-popup />
                            </div>
                        </div>
                        <div class="q-my-xl text-center">
                            <q-spinner color="primary" size="4em" />
                        </div> 
                        <div class="text-center text-bold">
                            {{ $t('dialog.pool.checking.title')}}    
                        </div>
                        <div class="row justify-center q-ma-md">
                            <div class="q-mr-md gText"> 
                                {{ $t('dialog.pool.checking.adding') }}
                            </div>
                            <div class="gValue2"> 
                                51.8775 USDT
                            </div>
                        </div>
                        <div class="text-center q-mb-md gText">  
                            {{ $t('dialog.pool.checking.desc')}}
                        </div>
                    </q-card-section>
                    <q-card-section> 
                        <div class="" align="center"> 
                            <div class="q-my-lg"> 
                                <q-icon color="primary" size="4rem" name="arrow_circle_up" />
                            </div>
                            <div class="gDialogTitle q-my-md"> 
                                제출된 거래 
                            </div>
                            <div class="q-py-md"> 
                                <q-btn text-color="primary" flat :label="$t('dialog.pool.exploreView.view')" />  
                            </div>
                            <div class="q-my-md "> 
                                <q-btn rounded color="primary" :label="$t('button.close')" @click="onClickDone" />
                            </div>
                        </div>
                    </q-card-section>
                </div>
            </q-card>
        </q-dialog>
    </div>
</template>


<script>
import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";


export default {
    
    data() {
        return {          
            v_enabled:true,  
            
            v_utilization: null,
            v_asset: null,
            v_search: null,

            v_options: ['USDT'],
            
            v_dialog_asset: false,
            v_dialog_portion: false,
            v_dialog_confirm: false,
            v_dialog_progress: false,

            v_data: [],
        }
    },
    methods: {

        show() {
            this.v_dialog_asset = true;
        },

        onClickAdd() {
            this.v_dialog_asset = true;
        },

    
        onClickPool(pool) {
            logger.log.debug("BookmarkView.onClickPool : pool=",pool);
            NavFunc.navPoolDetail(this);
        },

        onClickAsset() {
            this.v_dialog_asset = false;
            this.v_dialog_portion = true;
        },

        onClickAdd2() {
            this.v_dialog_portion = false;
            this.v_dialog_confirm = true;
        },

        onClickConfirm() {
            this.v_dialog_confirm = false;
            this.v_dialog_progress = true;
        },

        onClickDone() {
            this.v_dialog_progress = false;
        }    
    }
};

</script>


<style scoped>

</style>