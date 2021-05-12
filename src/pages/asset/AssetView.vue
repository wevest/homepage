<template>

    <div class="q-pa-md">
        <div class="row">
            <div class="col">
                <CTitle ttype='title' :title="$t('page.asset.title')" :desc="$t('page.asset.desc')"></CTitle>          
            </div>
        </div>

<!--
        <div class="row">
            <div class="col">

                <q-select
                    filled
                    v-model="g_asset"
                    use-input
                    hide-selected
                    fill-input
                    input-debounce="0"
                    :options="options"
                    @filter="filterFn"
                    hint="Minimum 2 characters to trigger filtering"
                >
                    <template v-slot:no-option>
                    <q-item>
                        <q-item-section class="text-grey">
                        No results
                        </q-item-section>
                    </q-item>
                    </template>
                </q-select>
            </div>
        </div>
-->

        <div class="row">
            <div class="col-3">
                <p class="price_big">{{ g_price['price'] }}</p>                        
            </div>
            <div class="col-9">
                <q-markup-table>
                    <tbody>
                    <tr>
                        <td class="text-left"> 
                            <span class="price_label">{{ $t('name.price_prev') }}</span>  <span class="price_tag">{{ g_price['price_prev'] }}</span>
                        </td>
                        <td class="text-left"> 
                            <span class="price_label">{{ $t('name.price_high') }}</span> <span class="price_tag">{{ g_price['price_high'] }}</span>
                        </td>
                        <td class="text-left"> 
                            <span class="price_label">{{ $t('name.volume') }}</span> <span class="price_tag padding1">{{ g_price['volume'] }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td class="text-left">
                            <span class="price_label">{{ $t('name.price_open') }}</span> <span class="price_tag">{{ g_price['price_open'] }}</span>
                        </td>
                        <td class="text-left">
                            <span class="price_label">{{ $t('name.price_low') }}</span> <span class="price_tag">{{ g_price['price_low'] }}</span>
                        </td>
                        <td class="text-left">
                            <span class="price_label">{{ $t('name.tv') }}</span> <span class="price_tag">{{ g_price['tv'] }}</span>
                        </td>
                    </tr>
                    </tbody>
                </q-markup-table>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <ChartTimeframe period='all' :onclick="onClickTimeframe" selected='y1'></ChartTimeframe>
                <CAssetChart ref="assetChart"></CAssetChart>
            </div>            
        </div>


        <div class="row">
            <div class="col">
                <CAssetInfoTable ref="assetinfoTable"></CAssetInfoTable>
            </div>
        </div>
    
    </div>

    
<!--        
        <page-title :heading=heading :subheading=subheading></page-title>

        <div class="text-center">
            <b-form-radio-group id="btnradios"
                            buttons
                            class="btn-square btn-outline-2x"
                            button-variant="outline-primary"
                            size="lg"
                            v-model="g_exchange"
                            :options="g_exchange_options"
                            @change="onClickExchange"
                            name="radioBtnOutline"/>
        </div>


        <div class="mb-3 card">
            <div class="card-body">
                    <div class="card-header-tab card-header">
                        <div class="card-header-title font-size-lg text-capitalize font-weight-normal">
                            <i class="header-icon lnr-charts icon-gradient bg-happy-green"> </i>
                            Momentum Table
                        </div>
                    </div>
                <div class="widget-chart-wrapper widget-chart-wrapper-lg opacity-10 m-0">
                    <CSectorCryptoTable ref="scTable"></CSectorCryptoTable>
                </div>
            </div>
        </div>
-->


</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import Services from 'src/services/services';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';
import CAssetChart from 'src/pages/asset/CAssetChart';
import CAssetInfoTable from 'src/pages/asset/CAssetInfoTable';
import CAssetTable from 'src/pages/asset/CAssetTable';
//import CSectorCryptoTable from 'src/components/CSectorCryptoTable';


const stringOptions = [
  '김치', '라면', '삼성', 'Apple', 'Oracle'
]

export default {
    components: {
        CTitle,
        ChartTimeframe,
        CAssetChart,
        CAssetInfoTable,
        CAssetTable,
    },
    props: {
    },

    data: () => ({
        g_data: null,
        g_vc: null,
        g_period: 30,
        g_asset: null,       
        g_freq: 'y1',
        g_price: {'price_prev':0, 'price_low':0, 'price_high':0, 'price_open':0, 'price':0, 'volume':0, 'tv':0},

        options: stringOptions,

    }),


    created: function () {
        //console.log("HomeView.created");
    },
    mounted: function() {
        //console.log("HomeView.mounted - ");
/*
        let a_selected = CommonFunc.getAppData('crypto_selected');
        console.log("InstrumentView.mounted - ",a_selected);
        if (a_selected)  {
            //this.showChart(a_selected,[],'');
        }
*/
        this.refresh();
    },
    updated: function() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        filterFn (val, update, abort) {
            if (val.length < 2) {
                abort()
                return
            }
            update(() => {
                const needle = val.toLowerCase()
                this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
            })            
        },

        refresh: function() {
            const _this = this;

            Services.loadCryptovcData().then(function(json_data) {
                _this.g_vc = json_data;
                logger.log.debug('vc=',_this.g_vc);

                let funcs = [
                    _this.loadCryptoBaseinfo('BTC'),
                    _this.loadCryptoPriceHistory('BTC'),
                ];
                Promise.all(funcs).then(function() {
                    //CommonFunc.getAppData('spinner').hide();
                });

            });

            //CommonFunc.getAppData('spinner').show();

        },
        
        updatePriceTable: function(json_data) {
            const dic_columns = CommonFunc.getColumnDic(json_data['overall'].columns,[],[]);
            this.g_price['price'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceClose']],2);
            this.g_price['price_prev'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-2 ][dic_columns['priceClose']],2);
            this.g_price['price_low'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceLow']],2);
            this.g_price['price_high'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceHigh']],2);
            this.g_price['price_open'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceOpen']],2);
            this.g_price['volume'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['total_volume_total']],0);
            
            let a_tv = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['total_volume_total']] * json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceClose']];
            this.g_price['tv'] = CommonFunc.formatNumber(a_tv,0);

        },

        loadCryptoBaseinfo: function(symbol) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                
                let dic_param = {symbol:symbol};
                logger.log.debug("AssetView.loadCryptoBaseinfo - dic_param=",dic_param);

                MoaBackendAPI.getCryptoBaseinfo(dic_param,function(response) {
                    _this.g_data = response.data.data;
                    logger.log.debug("AssetView.loadCryptoBaseinfo - response",_this.g_data);
                    //_this.$refs.assetTable.update(_this.g_data);
                    _this.$refs.assetinfoTable.update(_this.g_data,_this.g_vc);
                    resolve();
                },function(err) {
                    logger.log.error("AssetView.loadCryptoBaseinfo - error",err);
                    reject();
                });
            });            
        },

        loadCryptoPriceHistory: function(symbol) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                let a_start_date = CommonFunc.addDays(a_today, -360 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let a_freq = 'd';
                if ( (_this.g_freq=='d7') || (_this.g_freq=='d1')) {
                    a_freq = 'm';
                }
                let dic_param = {symbol:symbol,freq:a_freq,start_date:a_start_date, end_date:a_end_date, exchange:'cc',quote:'USD' };
                logger.log.debug("AssetView.loadCryptoPriceHistory - dic_param=",dic_param);

                MoaBackendAPI.getCryptoPriceHistory(dic_param,function(response) {
                    _this.g_data_price = response.data.data;
                    logger.log.debug("AssetView.loadCryptoPriceHistory - response",_this.g_data_price);
                    _this.updatePriceTable(_this.g_data_price);
                    _this.$refs.assetChart.update(_this.g_data_price);                    
                    resolve();
                },function(err) {
                    logger.log.error("AssetView.loadCryptoPriceHistory - error",err);
                    reject();
                });
            });            
        },


        loadSectorAssetData: function(exchange,sector) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                let a_start_date = CommonFunc.addDays(a_today, 100*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let dic_param = {start_date:a_start_date, end_date:a_end_date, freq:'d', exchange:exchange, sector:sector};
                logger.log.debug("SectorView.loadSectorAssetData - dic_param=",dic_param);

                MoaBackendAPI.getSectorAssetData(dic_param,function(response) {
                    _this.g_data_asset = response.data.data;
                    logger.log.debug("SectorView.loadSectorAssetData - response",_this.g_data_asset);                                        
                    _this.$refs.scTable.update(_this.g_data_asset);
                    resolve();
                },function(err) {
                    logger.log.error("SectorView.loadDailyOverviewData - error",err);
                    reject();
                });
            });            
        },


        showChart: function(asset,dates,a_date) {
            console.log('UpbitWinnerView.showChart=',asset);
            this.$refs.chartWinner.update(this.g_table,asset,dates);
            this.$refs.momentumTable.update('D',asset,100);

            this.heading = 'Upbit Market Winner - ' + a_date + ' , ' + asset;
        },

        onClickTimeframe: function(offset,timeframe) {
            console.log('CTrendView.onClickTimeframe - ',offset,timeframe);
            this.g_freq = timeframe;
            this.loadCryptoPriceHistory(this.g_symbol);
        },

        onClickExchange:function(value) {
          console.log('CTopTable.onClick - ',value);
          //this.showReportList(this.g_exchange,this.g_sector,value);
        },

        onClickSector:function(value) {
          console.log('CTopTable.onClick - ',value);
          //this.showReportList(this.g_exchange,this.g_sector,value);
        },

        onClickSectorChart: function(sector) {
            console.log('CTopTable.onClickSectorChart - ',sector);            
            this.$refs.sectorChart.update(this.g_data,'upbit',sector);
            this.loadSectorAssetData('upbit',sector);
        }
    },

}

</script>



<style scoped>

.price_big {
    margin-top: 1.2em;
    margin-left: 0.4em;
    font-size:1.8em;
    color:#e01415;
    font-weight: bold;
}

.price_label {
    font-size:1.2em;
    color:#555555;
    font-weight: bold;
    padding-right:5px;
}

.price_tag {
    font-size:1.2em;
    color:#e01415;
    margin-left:0.3em;
}

.padding1 {
    padding-left: 1.0em;
}

</style>