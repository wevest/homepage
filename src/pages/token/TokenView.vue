<template>

    <div class="q-pa-md">
        <div class="row">
            <div class="col">
                <CTitle ttype='title' :title="$t('page.borrow.title')" :desc="$t ('page.borrow.desc')" 
                        extraCaption="">
                </CTitle>          
            </div>
        </div>
        <div class="row">
            <q-space />
            <div class="gBoarder2 address">
                 0x6f259637dcD74C...
            </div>
            <div>
                <q-btn size="12px" dense flat color="grey-8" icon="content_copy" />
            </div>
            <div class="q-ml-sm">
                <WMoreButton ref="moreButtons" 
                    :buttons="v_more_buttons" 
                    @onClick="onClickMoreButton" />
            </div>
        </div>
        <div class="gBoarder1-1">
            <div class="">
                <div class="q-pb-sm gPageSubTitle">
                    {{ $t('page.borrow.targetAsset.title') }}
                </div>
                <div>
                    <q-select bg-color="grey-1" outlined v-model="v_asset" :options="v_options" label="Select" />
                </div>
                <div class="q-pb-sm q-mt-md gPageSubTitle">
                    {{ $t('page.borrow.collateralAsset.title') }}
                </div>                    
                <div>
                    <q-select bg-color="grey-1" outlined v-model="v_asset" :options="v_options" label="Select" />
                </div>
                <div class="q-mt-sm gValue2 text-right">
                   <span class="gText3">Balance: </span> <span class="gBigValue">22,222,220.00</span>
                </div>
            </div>
        </div>
        <div class="q-mt-sm gBoarder1-1 q-pa-md">
            <div class="q-pb-sm gPageSubTitle">{{ $t('page.borrow.utilization.title') }}</div>
            <div class="full-width">
                <q-btn-toggle
                v-model="v_utilization"
                toggle-color="primary"
                spread
                :options="[
                    {label: '25%', value: '25'},
                    {label: '50%', value: '50'},
                    {label: '75%', value: '75'}, 
                    {label: '100%', value: '100'} 
                    ]" />
            </div>    
            <div class="q-mt-sm gValue text-right">
               <span class="gText3">Amount: </span> <span class="gBigValue">12,220.00</span>
            </div>
        </div>
        <div class="row gBoarder1-1 q-pa-md q-my-sm">
            <div class="q-pb-sm gPageSubTitle">{{ $t('page.borrow.position.title') }}</div>
            <div class="full-width">
                <q-btn-toggle
                    v-model="v_direction"
                    spread
                    no-caps
                    toggle-color="primary"
                    color="white"
                    text-color="black"
                    :options="[
                    {label: 'LONG', value: 'long'},
                    {label: 'SHORT', value: 'short'}
                    ]"  />
            </div>
        </div>
        <div class="gBoarder1-1">
            <div class="q-pb-sm gPageSubTitle">{{ $t('page.borrow.leverage.title') }}</div>
            <div>
                <div class="text-center">
                    <q-btn-toggle
                        style="flex-wrap:wrap;justify-content:space-between;"
                        v-model="v_leverage"
                        stretch spread                 
                        padding="md"
                        toggle-color="primary"
                        color="white"
                        text-color="black"
                        :options="[
                            {label: '0.5x', value: '0.5'},
                            {label: '1x', value: '1'},
                            {label: '2x', value: '2'},
                            {label: '3x', value: '3'},
                            ]"  />
                 </div>
            </div> 
        </div>
        <div class="q-my-md">
            <q-btn class="full-width" rounded color="primary" outline :label="$t('button.create')" @click="onClickMint" />
        </div>

    
    <!-- Connect-a-wallet-dialog-START : -->
    <q-dialog v-model="v_dialog_wallet">
        <q-card>
            <q-card-section>
                <div class="row justify-between">
                    <div class="text-h6">
                        {{ $t('dialog.borrow.connectWallet.title') }}
                    </div>
                    <div>
                        <q-btn flat icon="close" />
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                <div class="gBoarder1 q-pa-md" style="background-color: #F8F9F9"> 
                    <div>
                        지갑을 연결하면 Wevest 의 <span class="terms">서비스 약관</span>에 동의하고 <span class="terms">Wevest 프로토콜 면책 조항</span>을 이해했음을 인정하는 것입니다. 
                    </div>
                </div>
            </q-card-section>
            <q-card-actions class="q-px-md" align="center" >
                    <q-btn class="full-width q-my-sm q-pa-xs" color="grey-2" text-color="primary" icon-right="paid" label="Wallet Name 1" />
                    <q-btn class="full-width q-my-sm q-pa-xs" color="grey-2" text-color="primary" icon-right="paid" label="Wallet Name 2" />
                    <q-btn class="full-width q-my-sm q-pa-xs" color="grey-2" text-color="primary" icon-right="paid" label="Wallet Name 3" />
            </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- Connect-a-wallet-dialog-END -->

    <!-- Confirm-Buy-dialog-START-->
    <q-dialog v-model="v_dialog_confirm_long">
        <q-card>
            <q-card-section class="row justify-between">
                <div class="gDialogTitle">
                     {{ $t('dialog.token.confirm.long.title') }}
                </div>
                <div class=""> 
                    <q-btn flat icon="close" v-close-popup />
                </div>
            </q-card-section>
            <q-card-section>
                <div class="gBoarder1 q-px-md">
                    <div class="row q-py-sm"> 
                        <div class="gText">Symbol</div>
                        <q-space />
                        <div class="gValue">BTCUSDT Perpetual</div>
                    </div>
                    <div class="row q-py-sm"> 
                        <div class="gText">Price</div>
                        <q-space />
                        <div class="gValue">49763.08 USDT</div>       
                    </div>
                    <div class="row q-py-sm"> 
                        <div clas="gText">Amount</div>
                        <q-space />
                        <div class="gValue">1012.45 USDT</div>
                    </div>
                    <div class="row q-py-sm"> 
                        <div class="gText">Cost</div>
                        <q-space />
                        <div class="gValue">331.95 USDT</div>
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                    <q-checkbox class="gText" v-model="v_show_confirm" :label="$t('dialog.token.confirm.checkBox.title')" />
            </q-card-section>
            <q-card-actions align="center">
                <div class="q-mb-md">
                    <q-btn class="q-pa-xs" rounded color="primary" :label="$t('button.confirm')" @click="onClickConfirm" />
                </div>
            </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- Confirm-Buy-dialog-END-->
    
    <!-- Confirm-Short-dialog-START-->
    <q-dialog v-model="v_dialog_confirm_short">
        <q-card>
            <q-card-section class="row justify-between">
                <div class="text-h6">
                     {{ $t('dialog.token.confirmShort.title') }}
                </div>
                <div class=""> 
                    <q-btn flat icon="close" />
                </div>
            </q-card-section>
            <q-card-section>
                <div class="gBoarder1 q-px-md">
                    <div class="row q-py-sm"> 
                        <div class="gText">Symbol</div>
                        <q-space />
                        <div class="gValue">BTCUSDT Perpetual</div>
                    </div>
                    <div class="row q-py-sm"> 
                        <div class="gText">Price</div>
                        <q-space />
                        <div class="gValue">49763.08 USDT</div>       
                    </div>
                    <div class="row q-py-sm"> 
                        <div class="gText">Amount</div>
                        <q-space />
                        <div class="gValue">1012.45 USDT</div>
                    </div>
                    <div class="row q-py-sm"> 
                        <div class="gText">Cost</div>
                        <q-space />
                        <div class="gValue">331.95 USDT</div>
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                    <q-checkbox v-model="v_show_confirm" label="Don't show again. You can change this in (Futures-Preference)." />
            </q-card-section>
            <q-card-actions align="center">
                <div class="q-mb-md">
                    <q-btn class="q-pa-xs" rounded color="primary" :label="$t('button.confirmShort')" />
                </div>
            </q-card-actions>
        </q-card>
    </q-dialog>

    <!-- Confirm-Short-dialog-END-->
    
    <!-- 발행완료-dialog-END -->
    <q-dialog v-model="v_dialog_done">
        <q-card>
            <q-card-section> 
                <div class="text-center"> 
                    <div class="q-py-md">
                        <span class="gCaption">Token:</span> wETH 
                    </div>
                    <div class="q-py-md"> 
                        <span class="gCaption">Reverage Ratio:</span> 3x      
                    </div>
                    <div class="q-py-md">
                        <span class="gCaption">Position:</span> LONG 
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="center">
                <div class="q-py-lg">
                    <q-btn class="q-pa-xs" rounded color="primary" :label="$t('button.completePosition')" />
                </div>
            </q-card-actions>
        </q-card>
    </q-dialog>
    
    <!-- 발행완료-dialog-END -->

    <!-- 토큰생성완료-page Start-->
    <q-dialog v-model="v_dialog_new" > 
        <q-card style="min-width: 300px">
            <q-card-section>
                <div class="row q-my-xs justify-center text-h6">
                        <div class="q-mr-sm">wETH</div>
                        <div class="q-mr-sm" >3x</div>
                        <div>LONG</div>
                </div>
                <div class="" style="min-width: 280px">
                    <div class="gBoarder1-1 q-my-sm" >
                        <div class="row"> 
                            <div class="gText">{{ $t('dialog.token.roi.title') }}</div>
                            <q-space />
                            <div class="gValue">36%</div>
                        </div>
                        <div class="row">
                            <div class="gText">ETH price</div>
                            <q-space />
                            <div class="gValue">$3,800</div> 
                        </div> 
                    </div>
                    <div class="gBoarder1-1 q-my-sm" >
                        <div class="row"> 
                            <div class="gText">{{ $t('dialog.token.totalAmount.title') }}</div>
                            <q-space />
                            <div class="gValue">$16,800</div>
                        </div>
                        <div class="row">
                            <div class="gText">{{ $t('dialog.token.evaluationPL.title') }}</div>
                            <q-space />
                            <div class="gValue">$180</div> 
                        </div> 
                    </div>
                    <div class="gBoarder1-1 q-my-sm">
                        <div class="row"> 
                            <div class="gText">{{ $t('dialog.token.totalPurchase.title') }}</div>
                            <q-space />
                            <div class="gValue">$15,000</div>
                        </div>
                        <div class="row">
                            <div class="gText">{{ $t('dialog.token.principal.title') }}</div>
                            <q-space />
                            <div class="gValue">$500</div> 
                        </div> 
                    </div>
                    <div class="gBoarder1-1 q-my-sm" >
                        <div class="row"> 
                            <div class="gText">{{ $t('dialog.token.purchasePrice.title') }}</div>
                            <q-space />
                            <div class="gValue">$3,500</div>
                        </div>
                        <div class="row">
                            <div class="gText">{{ $t('dialog.token.risk.title') }}</div>
                            <q-space />
                            <div class="gValue">2.5%</div> 
                        </div> 
                    </div>
                </div>
            </q-card-section>
            <q-card-actions class="q-mb-md" align="center">
                <q-btn color="primary" :label="$t('button.close')" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
    <!-- 토큰생성완료-page End -->

    </div>
</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import WMoreButton from "src/components/WMoreButton";

export default {
    components: {
        CTitle,
        WMoreButton
    },
    data: function() {
        return {
            g_data: null,
            g_data_summary: null,
            g_period: 30,

            v_leverage: '3',
            v_utilization: '100',
            v_direction:'long',
            
            v_asset:null,
            v_options: ['USDT'],
            
            v_more_buttons: this.$t('button.information')+"|"+this.$t('button.document')+"|"+this.$t('button.code'),
                        
            v_dialog_confirm_long: false,
            v_dialog_confirm_short: false,
            v_dialog_done: false,
            v_dialog_new: false,
            v_dialog_wallet: false,

            v_show_confirm: true,
            
        }

    },


    created() {
        //console.log("HomeView.created");
    },
    mounted() {
        //console.log("HomeView.mounted - ");
        //this.refresh();
    },
    updated() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        updatePageHeader(json_data) {
            const dic_columns = CommonFunc.getColumnDic(json_data['upbit']['btc'].columns,[],[]);
            let watch_date = json_data['upbit']['btc'].values[json_data['upbit']['btc'].values.length-1][dic_columns['trade_date']];
            this.v_page.desc = watch_date;
        },

        refresh() {
            const _this = this;
        
            //this.$q.loadingBar.start();

            let funcs = [
                this.loadDailyOverviewData(),
                //this.loadDailySummaryData('upbit')
                //this.$refs.tvChart.update('gaia_crypto_trend_upbit'),
                //this.$refs.momentumTable.update('D','',3)
                //this.$refs.riskChart.update(),this.$refs.trendChart.update('U001'),this.$refs.trendKosdaq.update('U201')
            ];
            Promise.all(funcs).then(function() {
                //this.$q.loadingBar.stop();
            });

        },

        loadDailyOverviewData(ioffset=180) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                let a_start_date = CommonFunc.addDays(a_today, ioffset*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {start_date:a_start_date, end_date:a_end_date, freq:'d'};
                logger.log.debug("DailyView.loadDailyOverviewData - dic_param=",dic_param);

                APIService.getCryptoIndexData(dic_param,function(response) {
                    _this.g_data = response.data.data;
                    logger.log.debug("DailyView.loadDailyOverviewData - response",_this.g_data);
                    //logger.log.debug("HomeView.search - json_data",_this.g_json_data);
                    //_this.updateWidget('g_widget_overall',_this.g_data,'binance');
                    //_this.updateWidget('g_widget_upbit',_this.g_data,'upbit');
                    _this.updatePageHeader(_this.g_data);
                    _this.$refs.indexTrendChart.update(_this.g_data);
                    //_this.$refs.sectorTable.update(_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("DailyView.loadDailyOverviewData - error",err);
                    reject();
                });
            });            
        },


        onClickAdd() {
            logger.log.debug('onLoad - ');
        },
        
        onClickMint() {
            this.v_dialog_confirm_long = true;
        },

        onClickConfirm() {
            this.v_dialog_confirm_long = false;
            this.v_dialog_confirm_short = false;
            this.v_dialog_new = true;
        },

        onClickMoreButton(dicParam) {
            logger.log.debug("MainLayout.onClickMoreButton : dicParam=",dicParam);
            if ((dicParam.caption.toLowerCase()=='logout') || (dicParam.caption=='로그아웃')) {
                this.onClickSignOut();
            } else if ( (dicParam.caption.toLowerCase()=='profile') || (dicParam.caption=='프로파일')) {
				this.onClickUser();
			} else if ( (dicParam.caption.toLowerCase()=='bookmark') || (dicParam.caption=='북마크')) {
				NavFunc.navBookmark(this);
			}

        },


    },

}

</script>

<style scoped>
.responsive {
    /* 모바일 반응형 */
  max-width: 700px;
  width: auto;
  margin:0 auto;
} 

.terms {
    color: #0000FF;
}

.issuance div {
    margin:5px 0px; 
}

.address {
    margin: -6px 5px 10px 0px;
}
</style>
