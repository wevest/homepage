<template>

    <div class="q-pa-md">
        <div class="row">
            <div class="col">
                <CTitle ttype='title' :title="v_page.title" :desc="v_page.desc"></CTitle>          
            </div>
        </div>
        
        <div class="row">
            <div class="col">
                <CTitle ttype='subtitle' title="Ratings and Score" desc=""></CTitle>          
                <div class="box_score">
                    <div class="box_score_point">
                        <span class="score_point"> {{ v_score.avg }} </span>
                        <br><span class="price_label">{{ $t('name.cryptovc') }}</span> 
                        <br><span class="price_tag">{{ v_score.vc }}</span>
                    </div>
                    <div>
                        <q-markup-table flat class="box_score_table">
                            <tbody>
                                <tr>
                                    <td class="box_score_table_column"> 
                                        <span class="caption_color">{{ $t('name.dev_score') }}</span> 
                                    </td>
                                    <td>
                                        <q-slider
                                            v-model="v_score.dev" :min="0" :max="5" :step="1"
                                            label :label-value="v_score.dev"  readonly dense
                                            label-always color="purple" />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="box_score_table_column"> 
                                        <span class="price_label caption_color">{{ $t('name.price_score') }}</span> 
                                    </td>
                                    <td>
                                        <q-slider
                                            v-model="v_score.price" :min="0" :max="5" :step="1"
                                            label :label-value="v_score.price"   readonly dense
                                            label-always color="purple" />
                                    </td>
                                </tr>
                                <tr>
                                    <td class="box_score_table_column"> 
                                        <span class="price_label caption_color">{{ $t('name.volume_score') }}</span> 
                                    </td>
                                    <td>
                                        <q-slider
                                            v-model="v_score.volume" :min="0" :max="5" :step="1"
                                            label :label-value="v_score.volume"  readonly dense
                                            label-always color="purple" />
                                    </td>
                                </tr>
                            </tbody>
                        </q-markup-table>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <CTitle ttype='subtitle' title="Ratings and Score" desc=""></CTitle>                      
            </div>
        </div>

        <div class="row q-pa-md">            
            <div class="col-3 price_box">
                <div class="price_big">
                    <span>{{ g_price['price'] }}</span>
                    <div :class="g_price.class">
                        <span class="percent_below">
                            <q-icon class="widget-value-icon percent_icon" :name="g_price.icon"/>
                            <span>{{ g_price['price_ret'] }}%</span>
                        </span>
                        <br><span class="price_date">{{ g_price['updated_date'] }}</span>
                    </div>
                </div>
            </div>
            <div class="col-9">
                <q-markup-table flat class="price_table">
                    <tbody>
                    <tr>
                        <td> 
                            <span class="price_label caption_color">{{ $t('name.price_prev') }}</span>  
                            <br><span class="price_tag value_color">{{ g_price['price_prev'] }}</span>
                        </td>
                        <td> 
                            <span class="price_label caption_color">{{ $t('name.price_high') }}</span>
                            <br><span class="price_tag value_color">{{ g_price['price_high'] }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td> 
                            <span class="price_label caption_color">{{ $t('name.volume') }}</span>
                            <br><span class="price_tag value_color">{{ g_price['volume'] }}</span>
                        </td>
                        <td>
                            <span class="price_label caption_color">{{ $t('name.price_open') }}</span>
                            <br><span class="price_tag value_color">{{ g_price['price_open'] }}</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <span class="price_label caption_color">{{ $t('name.price_low') }}</span> 
                            <br><span class="price_tag value_color">{{ g_price['price_low'] }}</span>
                        </td>
                        <td>
                            <span class="price_label caption_color">{{ $t('name.tv') }}</span> 
                            <br><span class="price_tag value_color">{{ Number(g_price['tv']).toLocaleString() }}</span>
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

                <q-toggle v-model="v_visible_table" label="Show Table" class="q-mb-md center" />

                <q-slide-transition>
                    <div v-show="v_visible_table">

                        <q-table
                        title=""
                        class="sticky-column-table"
                        :data="v_items"
                        :columns="v_headers"
                        row-key="name"
                        :pagination.sync="v_pagination"
                        :rows-per-page-options="[20]"
                        >
                            <template v-slot:body="props">

                                <q-tr :props="props">
                                    <q-td key="trade_date" :props="props">{{ props.row.trade_date }}</q-td>
                                    <q-td key="price" :props="props">{{ Number(props.row.price).toLocaleString() }}</q-td>
                                    <q-td key="volume" :props="props">{{ Number(props.row.volume).toLocaleString() }}</q-td>
                                </q-tr>            

                            </template>

                        </q-table>
                        
                    </div>
                </q-slide-transition>                
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
import DataService from 'src/services/dataService';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';
import CAssetChart from 'src/pages/asset/CAssetChart';
import CAssetInfoTable from 'src/pages/asset/CAssetInfoTable';
import CAssetTable from 'src/pages/asset/CAssetTable';
//import CSectorCryptoTable from 'src/components/CSectorCryptoTable';

export default {
    name:'assetView',
    components: {
        CTitle,
        ChartTimeframe,
        CAssetChart,
        CAssetInfoTable,
        CAssetTable,
    },
    props: ['symbol'],

    data: function() {
        return {
            g_data: null,
            g_data_commit: null,
            g_vc: null,
            g_period: 30,
            g_asset: null,       
            g_freq: 'y1',
            
            g_price: {'price_prev':0, 'price_low':0, 'price_high':0, 'price_open':0, 
                'price':0, 'price_ret':0, 'volume':0, 'tv':0, 
                'updated_date':'', 'icon':'arrow_drop_up', class:'text-red'},    
            
            v_page: {title:this.$t('page.asset.title'), desc:''},
            v_score: {dev:5, price:5, volume:5, vc:0, avg:5},

            v_visible_table:false,
            v_headers: [
                { name:'trade_date', label: this.$t('name.trade_date'), field: 'trade_date', align:'left', required:true  },
                { name:'price', label: this.$t('name.price'), field: 'price'},
                { name:'volume', label: this.$t('name.volume'), field: 'volume'},
            ],
            v_pagination: {
                sortBy: 'trade_date',
                descending: true,
            },
            v_items: [],         

        }
    },

    created: function () {
        //console.log("HomeView.created");
    },
    mounted: function() {
        console.log("AssetView.mounted - symbol=",this.symbol,this.$route.params);
/*
        let a_selected = CommonFunc.getAppData('crypto_selected');
        console.log("InstrumentView.mounted - ",a_selected);
        if (a_selected)  {
            //this.showChart(a_selected,[],'');
        }
*/
        this.g_asset = this.$route.params.symbol;
        this.refresh(this.g_asset);
    },
    updated: function() {
        console.log("AssetView.updated - symbol=",this.symbol,this.$route.params);
        
        if (this.$route.params.symbol) {
            this.g_asset = this.$route.params.symbol;
        }
        
        CommonFunc.setAppData('onSearchEvent',this.onSearchEvent);
    },
    
    methods: {
        refresh: function(symbol,offset=360) {
            logger.log.debug('Refresh - ',symbol,offset);

            if ( (!symbol) || ( (symbol.length)==0 ) ) {
                return
            }

            const _this = this;
            DataService.loadCryptovcData().then(function(json_data) {
                _this.g_vc = json_data;
                logger.log.debug('vc=',_this.g_vc);

                let funcs = [
                    _this.loadCommitData(symbol),
                    _this.loadCryptoBaseinfo(symbol),
                    _this.loadCryptoPriceHistory(symbol,offset)                    
                ];
                Promise.all(funcs).then(function() {
                    //CommonFunc.getAppData('spinner').hide();
                });

            });

            //CommonFunc.getAppData('spinner').show();

        },
        
        getScore: function(value) {
            if (value>0.8) {                
                //return 'A';
                return 5;
            } else if (value>0.6) {
                return 4;
                //return 'B';
            } else if (value>0.4) {
                return 3;
                //return 'C';
            } else if (value>0.2) {
                return 2;
                //return 'D';
            } else if (value==0) { 
                return 0;
            } else {
                return 1;
                //return 'F';
            }
        },

        updateScoreWidget: function(json_data) { 
            logger.log.debug("updateScoreWidget.data=",json_data);
            const dic_columns = CommonFunc.getColumnDic(json_data.columns,[],[]);
            let a_vc = json_data.values[ json_data.values.length-1 ][dic_columns['cryptovc']];
            
            this.v_score['dev'] = this.getScore(json_data.values[ json_data.values.length-1 ][dic_columns['commit_count_rank']]);
            this.v_score['price'] = this.getScore(json_data.values[ json_data.values.length-1 ][dic_columns['price_ret_rank']]);
            this.v_score['volume'] = this.getScore(json_data.values[ json_data.values.length-1 ][dic_columns['volume_sum_rank']]);
            this.v_score['vc'] = a_vc.split(",").length;
            this.v_score['avg'] = CommonFunc.formatNumber( (this.v_score['dev']+this.v_score['price']+this.v_score['volume'])/3,2);
        },

        updatePriceWiget: function(json_data) {
            logger.log.debug("data=",json_data);

            const dic_columns = CommonFunc.getColumnDic(json_data['overall'].columns,[],[]);
            const a_price = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceClose']];
            const a_price_prev = json_data['overall'].values[ json_data['overall'].values.length-2 ][dic_columns['priceClose']];

            this.g_price['price'] = CommonFunc.formatNumber(a_price,2);
            this.g_price['price_prev'] = CommonFunc.formatNumber(a_price_prev,2);
            this.g_price['price_low'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceLow']],2);
            this.g_price['price_high'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceHigh']],2);
            this.g_price['price_open'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceOpen']],2);
            this.g_price['volume'] = CommonFunc.formatNumber(json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['volume']],0);


            let a_ret = ((a_price-a_price_prev)/a_price)*100;
            
            let a_class = 'text-red';
            let a_icon = 'arrow_drop_down';
            if (a_ret>0) {
                a_class = 'text-green'
                a_icon = 'arrow_drop_up';
            }
            
            this.g_price.icon = a_icon;
            this.g_price.class = a_class;
            this.g_price['price_diff'] = CommonFunc.formatNumber(a_ret,2);
            this.g_price['price_ret'] = CommonFunc.formatNumber(a_ret,2);

            let a_tv = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['volume']] * json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['priceClose']];
            this.g_price['tv'] = CommonFunc.formatNumber(a_tv,0);
            this.g_price['updated_date'] = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['trade_date']];
        },

        updatePriceTable: function(json_data) {            
            let dic_column = CommonFunc.getColumnDic( json_data['overall'].columns ,[],[]);

            let items = [];            
            for (let index=0;index<json_data['overall'].values.length;index++) {
                
                let a_item = {
                    trade_date: CommonFunc.safeGetJsonValue(json_data.overall.values,index,dic_column['trade_date']),
                    price: CommonFunc.safeGetJsonValue(json_data.overall.values,index,dic_column['priceClose']),
                    volume: CommonFunc.safeGetJsonValue(json_data.overall.values,index,dic_column['volume']),
                };
                items.push(a_item);
            }
            //logger.log.debug('items=',items);
            this.v_items = items;
        },

        updatePageHeader: function(symbol,json_data) {            
            const dic_columns = CommonFunc.getColumnDic(json_data['overall'].columns,[],[]);
            let a_date = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['time']];
            //let a_name = json_data['overall'].values[ json_data['overall'].values.length-1 ][dic_columns['name']];

            this.v_page.title = symbol;
            this.v_page.desc = a_date;
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
                    _this.updateScoreWidget(_this.g_data);
                    _this.$refs.assetinfoTable.update(_this.g_data,_this.g_vc);
                    
                    resolve();
                },function(err) {
                    logger.log.error("AssetView.loadCryptoBaseinfo - error",err);
                    reject();
                });
            });            
        },


        loadCryptoPriceHistory: function(symbol,offset=360) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                //logger.log.debug("HomeView.loadjw52 - today=",a_today);
                if (offset==0) {
                    offset = 3000;
                }
                let a_start_date = CommonFunc.addDays(a_today, offset*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );
                
                let a_freq = 'd';
                if ( (_this.g_freq=='d7') || (_this.g_freq=='d1')) {
                    a_freq = 'm';
                }
                let dic_param = {symbol:symbol,quote:'USD',freq:a_freq,start_date:a_start_date, end_date:a_end_date, exchange:'cc',quote:'USD' };
                logger.log.debug("AssetView.loadCryptoPriceHistory - dic_param=",dic_param);

                MoaBackendAPI.getCryptoPriceHistory(dic_param,function(response) {
                    _this.g_data_price = response.data.data;
                    logger.log.debug("AssetView.loadCryptoPriceHistory - response",_this.g_data_price);
                    _this.updatePageHeader(symbol,_this.g_data_price);
                    _this.updatePriceWiget(_this.g_data_price);
                    _this.updatePriceTable(_this.g_data_price);
                    _this.$refs.assetChart.update(_this.g_data_price);                    
                    resolve();
                },function(err) {
                    logger.log.error("AssetView.loadCryptoPriceHistory - error",err);
                    reject();
                });
            });            
        },


        loadCommitData: function(symbol) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let dic_param = {symbol:symbol};
                MoaBackendAPI.getCommitData(dic_param,function(response) {
                    _this.g_data_commit = response.data.data;
                    logger.log.debug("AssetView.loadCommitData - response",_this.g_data_commit);                                        
                    _this.$refs.assetinfoTable.updateChart(_this.g_data_commit);
                    resolve();
                },function(err) {
                    logger.log.error("AssetView.loadCommitData - error",err);
                    reject();
                });
            });            
        },


        onClickTimeframe: function(offset,timeframe) {
            console.log('AssetView.onClickTimeframe - ',offset,timeframe);
            this.g_freq = timeframe;
            this.refresh(this.g_asset,offset);
        },

        onClickExchange:function(value) {
          console.log('AssetView.onClick - ',value);
          //this.showReportList(this.g_exchange,this.g_sector,value);
        },

        onClickSector:function(value) {
          console.log('AssetView.onClick - ',value);
          //this.showReportList(this.g_exchange,this.g_sector,value);
        },

        onClickSectorChart: function(sector) {
            console.log('AssetView.onClickSectorChart - ',sector);            
            this.$refs.sectorChart.update(this.g_data,'upbit',sector);
            this.loadSectorAssetData('upbit',sector);
        },

        onSearchEvent: function(value) {
            logger.log.debug('AssetView.onSearchEvent - ',value);       
            
            this.g_asset = value;
            this.refresh(this.g_asset);
        }
    },

}

</script>



<style scoped>

.price_box {
    width:90px;
    text-align:center;
    margin-top:40px;
    margin-left:-10px;

}

.price_big {
    font-size:30px;
    font-weight: bold;
    color:#111111;
}    

.percent_below {
    font-size:13px;
    vertical-align:top;
}


.price_date {
    vertical-align:top;
    font-size:10px;
    color:#BBBBBB;
}
/*
.price_label {
    font:12px;
    color:#464646;
    font-weight: bold;
    padding-right:5px;
}
*/





.price_table td {
    text-align:left;
}

.score_table {
    text-align:center;
}

.box_score {
    display: grid;
    grid-template-columns: minmax(80px, 80px) 1fr;
    ;
}

.box_score_table {
    margin-top:0px;
}

.box_score_table .box_score_table_column {
    width:20px;
    padding-bottom:10px;
}

.box_score_table tr {
    height:60px;
    vertical-align: bottom;
}

.box_score_point {
    text-align:center;
    margin-top:30px;
}

.score_point {
    font-size:38px;
    font-weight:bolder; 
}

.score_label {
    font-size:18px;
    color:#000000;
}

.price_tag {
    line-height:40px;
    font-size:16px;
    color:#E71915;
}

</style>