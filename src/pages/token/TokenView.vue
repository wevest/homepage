<template>

    <div class="q-pa-md responsive">
        <div class="row">
            <div class="col">
                <CTitle ttype='title' :title="$t('page.token.title')" :desc="$t ('page.token.desc')" 
                        extraCaption="Add" @onClickTitleExtra="onClickAdd">
                </CTitle>          
            </div>
        </div>
        <div class="row q-mb-xs">
            <q-space />
            <div class="gBoarder2 q-px-sm q-mr-xs">
                 0x6f259637dcD74C...
            </div>
            <div>
                <q-btn size="12px" dense flat color="grey-8" icon="content_copy" />
            </div>
            <div class="">
                <q-btn size="12px" dense color="grey-8" flat icon="more_vert">
                    <q-menu>
                    <q-list style="min-width: 150px">
                        <q-item clickable v-close-popup @click="onItemClick">
                        <q-item-section>
                            <q-item-label>{{ $t('button.information') }}</q-item-label>
                        </q-item-section>
                        </q-item>

                        <q-item clickable v-close-popup @click="onItemClick">
                        <q-item-section>
                            <q-item-label>{{ $t('button.document') }}</q-item-label>
                        </q-item-section>
                        </q-item>

                        <q-item clickable v-close-popup @click="onItemClick">
                        <q-item-section>
                            <q-item-label>{{ $t('button.code') }}</q-item-label>
                        </q-item-section>
                        </q-item>
                    </q-list>
                    </q-menu>
                </q-btn>
            </div>
        </div>
        <div class="gBoarder q-pa-md">
            <div class="row justify-between">
                <div>
                    <q-select  style="width: 200px" outlined v-model="model" :options="options" label="USDT" />
                </div>
                <div class="q-mt-sm text-h6">
                    0.0
                </div>
            </div>
        </div>
        <div class="q-mt-sm gBoarder q-pa-md">
            <div class="q-pb-sm text-subtitle2">{{ $t('page.token.utilization.title') }}</div>
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
        </div>
        <div class="row gBoarder q-pa-md q-my-sm">
            <div class="q-pb-sm text-subtitle2">{{ $t('page.token.position.title') }}</div>
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
        <div class="gBoarder q-pa-md">
            <div class="q-pb-sm text-subtitle2">{{ $t('page.token.leverage.title') }}</div>
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
        <div class="q-mt-md">
            <q-btn class="full-width" rounded color="primary" outline :label="$t('button.connectWallet')"/>
        </div>

    <q-separator class="q-my-lg" color="orange" size="10px" inset />
    
    <!-- Connect-a-wallet-dialog-START : -->
        <q-card>
            <q-card-section>
                <div class="row justify-between">
                    <div class="text-h6">
                        {{ $t('dialog.token.connectWallet.title') }}
                    </div>
                    <div>
                        <q-btn flat icon="close" />
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                <div class="gBoarder q-pa-md" style="background-color: #F8F9F9"> 
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
    <!-- Connect-a-wallet-dialog-END -->
    <q-separator class="q-my-lg" color="orange" size="10px" inset />

    <!-- Confirm-Buy-dialog-START-->
        <q-card>
            <q-card-section class="row justify-between">
                <div class="text-h6">
                     {{ $t('dialog.token.confirmLong.title') }}
                </div>
                <div class=""> 
                    <q-btn flat icon="close" />
                </div>
            </q-card-section>
            <q-card-section>
                <div class="gBoarder q-px-md">
                    <div class="row q-py-sm"> 
                        <div>Symbol</div>
                        <q-space />
                        <div>BTCUSDT Perpetual</div>
                    </div>
                    <div class="row q-py-sm"> 
                        <div>Price</div>
                        <q-space />
                        <div>49763.08 USDT</div>       
                    </div>
                    <div class="row q-py-sm"> 
                        <div>Amount</div>
                        <q-space />
                        <div>1012.45 USDT</div>
                    </div>
                    <div class="row q-py-sm"> 
                        <div>Cost</div>
                        <q-space />
                        <div>331.95 USDT</div>
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                    <q-checkbox v-model="right" label="Don't show again. You can change this in (Futures-Preference)." />
            </q-card-section>
            <q-card-actions align="center">
                <div class="q-mb-md">
                    <q-btn class="q-pa-xs" rounded color="primary" :label="$t('button.confirmLong')" />
                </div>
            </q-card-actions>
            
        </q-card>
    <!-- Confirm-Buy-dialog-END-->
    <q-separator class="q-my-lg" color="orange" size="10px" inset />
    <!-- Confirm-Short-dialog-START-->
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
                <div class="gBoarder q-px-md">
                    <div class="row q-py-sm"> 
                        <div>Symbol</div>
                        <q-space />
                        <div>BTCUSDT Perpetual</div>
                    </div>
                    <div class="row q-py-sm"> 
                        <div>Price</div>
                        <q-space />
                        <div>49763.08 USDT</div>       
                    </div>
                    <div class="row q-py-sm"> 
                        <div>Amount</div>
                        <q-space />
                        <div>1012.45 USDT</div>
                    </div>
                    <div class="row q-py-sm"> 
                        <div>Cost</div>
                        <q-space />
                        <div>331.95 USDT</div>
                    </div>
                </div>
            </q-card-section>
            <q-card-section>
                    <q-checkbox v-model="right" label="Don't show again. You can change this in (Futures-Preference)." />
            </q-card-section>
            <q-card-actions align="center">
                <div class="q-mb-md">
                    <q-btn class="q-pa-xs" rounded color="primary" :label="$t('button.confirmShort')" />
                </div>
            </q-card-actions>
        </q-card>
    <!-- Confirm-Short-dialog-END-->
    <q-separator class="q-my-lg" color="orange" size="10px" inset />
    
    <!-- 발행완료-dialog-END -->
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
                        <span class="gCaption">position:</span> LONG 
                    </div>
                </div>
            </q-card-section>
            <q-card-actions align="center">
                        <div class="q-py-lg">
                            <q-btn class="q-pa-xs" rounded color="primary" :label="$t('button.completePosition')" />
                        </div>
            </q-card-actions>
        </q-card>
        <!-- 발행완료-dialog-END -->
        <q-separator class="q-my-lg" color="orange" size="10px" inset />

        <!-- 토큰생성완료-page Start-->
        <div class="q-pa-md">
            <div class="gBoarder">
                <div class="row q-mt-md justify-center gSubTitleLG">
                        <div class="q-mr-sm">wETH</div>
                        <div class="q-mr-sm" >3x</div>
                        <div>LONG</div>
                </div>
                <div class="q-mx-lg issuance">
                    <div class="gBoarder2 q-pa-md">
                        <div class="row"> 
                            <div>{{ $t('dialog.token.roi.title') }}</div>
                            <q-space />
                            <div>36%</div>
                        </div>
                        <div class="row">
                            <div>ETH price</div>
                            <q-space />
                            <div>$3,800</div> 
                        </div> 
                    </div>
                    <div class="gBoarder2 q-pa-md">
                        <div class="row"> 
                            <div>{{ $t('dialog.token.totalAmount.title') }}</div>
                            <q-space />
                            <div>$16,800</div>
                        </div>
                        <div class="row">
                            <div>{{ $t('dialog.token.valuationLoss.title') }}</div>
                            <q-space />
                            <div>$180</div> 
                        </div> 
                    </div>
                    <div class="gBoarder2 q-pa-md">
                        <div class="row"> 
                            <div>{{ $t('dialog.token.totalPurchase.title') }}</div>
                            <q-space />
                            <div>$15,000</div>
                        </div>
                        <div class="row">
                            <div>{{ $t('dialog.token.principal.title') }}</div>
                            <q-space />
                            <div>$500</div> 
                        </div> 
                    </div>
                    <div class="gBoarder2 q-pa-md">
                        <div class="row"> 
                            <div>{{ $t('dialog.token.purchasePrice.title') }}</div>
                            <q-space />
                            <div>$3,500</div>
                        </div>
                        <div class="row">
                            <div>{{ $t('dialog.token.risk.title') }}</div>
                            <q-space />
                            <div>2.5%</div> 
                        </div> 
                    </div>
                </div>
                <div class="q-my-lg text-center">
                    <q-btn color="primary" :label="$t('button.new')"/>
                </div>
            </div>
        </div>
        <!-- 토큰생성완료-page End -->
    </div>
</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';

export default {
    components: {
        CTitle,
    },
    data: function() {
        return {
            g_data: null,
            g_data_summary: null,
            g_period: 30,

            v_leverage: '3',
            v_utilization: '100',
            v_direction:'long',

            v_page: {title: this.$t('page.trend.title'), desc:'' },
            
            v_visible_table: false,

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


        loadDailySummaryData(exchange) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                let a_start_date = CommonFunc.addDays(a_today, 30*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {start_date:a_start_date, end_date:a_end_date, freq:'D', exchange:exchange};
                logger.log.debug("HomeView.getCryptoMarketDailySummary - dic_param=",dic_param);

                APIService.getCryptoMarketDailySummary(dic_param,function(response) {
                    _this.g_data_summary = response.data.data;
                    logger.log.debug("HomeView.getCryptoMarketDailySummary - response",_this.g_data_summary);
                    _this.updateAssetTable(_this.g_data_summary);
                    //logger.log.debug("HomeView.search - json_data",_this.g_json_data);
                    //_this.$refs.sectorTable.update(_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("HomeView.getCryptoMarketDailySummary - error",err);
                    reject();
                });
            });            
        },

        updateAssetTable(json_data) {

            let dic_columns = CommonFunc.getColumnDic(json_data['summary'].columns,[],[]);

            let a_table_items = [];
            
            let row_index = json_data['summary'].values.length-2;
            for (var col_index=0;col_index<json_data['summary'].columns.length;col_index++) {
                var a_column = json_data['summary'].columns[col_index];
                if (a_column.search('_')>-1) {
                    continue;
                }
                
                var a_item = { 
                    trade_date: json_data['summary'].values[row_index][dic_columns['trade_date']],
                    token: a_column,
                    price: json_data['summary'].values[row_index][dic_columns[a_column]],
                    volume: json_data['summary'].values[row_index][dic_columns[a_column+'_volume']],
                    volume_ret: json_data['summary'].values[row_index][dic_columns[a_column+'_volume_ret']],
                    volume_z: json_data['summary'].values[row_index][dic_columns[a_column+'_volume_zscore']],
                    ret: json_data['summary'].values[row_index][dic_columns[a_column+'_ret']],
                    rank_pct: json_data['summary'].values[row_index][dic_columns[a_column+'_rank']],                    
                };                 
                      
                a_table_items.push(a_item);                
            }

            //this.$refs.momentumTable.update('D','',3)
            this.$refs.assetTable.setData(a_table_items);

            logger.log.debug('asset_table=',a_table_items);

            return a_table_items;
        },

        updateWidget(obj,json_data,exchange) {
            let data = json_data[exchange];
            //logger.log.debug('data=',data);
            let dic_columns = CommonFunc.getColumnDic(data['overall'].columns,[],[]);            
            //logger.log.debug('dic_columns=',dic_columns);
            let column_index = dic_columns['index_ret'];
            let column_index2 = dic_columns['price_avg'];
            let widget = this[obj];

            for (let a_category in widget) {
                //console.log('category=',a_category);
                let a_value = data[a_category].values[data[a_category].values.length-1][column_index];
                let a_index = data[a_category].values[data[a_category].values.length-1][column_index2];                

                widget[a_category]['index'] = a_index;
                widget[a_category]['endVal'] = parseFloat(CommonFunc.formatNumber(a_value*100,4));
                if (a_value>0) {
                    widget[a_category]['color'] = 'bg-success';
                    widget[a_category]['arrow'] = 'angle-up';
                } else {
                    widget[a_category]['color'] = 'bg-danger';
                    widget[a_category]['arrow'] = 'angle-down';
                }                
            }
        },

        showChart(asset,dates,a_date) {
            logger.log.debug('HomeView.showChart=',asset);        
            //this.items_52w = json_list;
            this.$refs.chartWinner.update('gaia_crypto_trend_upbit',asset,dates);
        },


        onLoad(progress) {
            logger.log.debug('onLoad - ',progress);
        },

        onClickCategory(exchange,category) {
            //console.log('onClickCategory - ',category);
            if (exchange=='upbit') {
                this.$refs.csectorUpbitChart.update(this.g_data[exchange],category);
            } else {
                this.$refs.csectorBithumbChart.update(this.g_data[exchange],category);                
            }
            
        },

        onClickTimeframe(atype,ioffset) {
            logger.log.debug('onClickTimeframe - ',atype,ioffset);            
            this.loadDailyOverviewData(ioffset);
        }

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
</style>
