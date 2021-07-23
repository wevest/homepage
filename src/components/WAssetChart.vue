<template>
    <div style="margin:0px;padding:0px;">
<!--
        <highcharts :constructorType="'stockChart'" class="hc" :options="chartOptions" ref="chart"></highcharts>
        <CTitle ttype='subtitle' :title="$t('page.asset.price.title')" :desc="$t('page.asset.price.desc')"></CTitle>        
        <highcharts class="box_chart" :options="g_chart['chart1']" ref="chart1"></highcharts>
-->     
        <q-skeleton v-if="!v_chart_loaded" animation="fade" square height="450px" />
        <div v-show="v_chart_loaded">
            <highcharts class="box_chart" :options="g_chart['chart1']" ref="chart1"></highcharts>

            <div class="text-center q-mt-md">
                <q-toggle v-model="v_visible_table" :label="$t('button.show_table')" class="q-mb-md center" />
            </div>

            <q-slide-transition>
                <div v-show="v_visible_table" class="q-my-md">
                    
                    <CTitle ttype='subtitle' :title="v_table_title" :desc="v_table_desc"></CTitle>
                    <div class="gBoxNoMargin">
                        <WPriceDataTable ref="dataTable" />                    
                    </div>

                </div>
            </q-slide-transition>                
        </div>

    </div>

</template>

<script>
//import {HChart} from 'highcharts-vue';
//import stockInit from 'highcharts/modules/stock';

import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'src/components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';
import WPriceDataTable from 'components/WPriceDataTable';

export default {
    name: 'WAssetChart',
    components: {
        CTitle,
        ChartTimeframe,
        WPriceDataTable
    },
    props: {
        data: {
            default: null,
        },
        tableTitle: {
            type:String,
            default: '',
        },
        tableDesc: {
            type:String,
            default: '',
        },
        showTable: {
            type:String,
            default: '1'
        }
    },
    data() {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",
            
            g_chart: {
                'chart1': {series: []},
                'chart2': {series: []},
            },

            v_chart_loaded: false,

            v_visible_table: true,

            v_table_title: this.tableTitle,
            v_table_desc: this.tableDesc
        }
    },
    methods: {
    
        updateChart(json_data) {
            let data_price = CommonFunc.getChartData(json_data,'overall','priceClose','trade_date',false,0);
            let data_volume = CommonFunc.getChartData(json_data,'overall','volume','trade_date',false,0);
            let data_volume_top = CommonFunc.getChartData(json_data,'overall','top_tier_volume_total','trade_date',false,0);

            let series = [
                { name: this.$t('name.price'),type: 'line', yAxis:0, data: data_price.data},
                { name: this.$t('name.volume'),type: 'bar', yAxis:1, data: data_volume.data},
                //{ name: 'top_tier_volume',type: 'bar', yAxis:1, data: data_volume_top.data},
            ];

            let a_option = CommonFunc.getChartOption(series);
            this.g_chart['chart1'] = a_option;
            this.v_chart_loaded = true;

            logger.log.debug('WAssetChart.updateChart : =',json_data);
        },

        update(json_data,show_table=true) {
            logger.log.debug('WAssetChart.update : =',json_data);

            this.updateChart(json_data); 
            this.$refs.dataTable.update(json_data);           
            
            this.v_visible_table = show_table;
        },
    }
  }
</script>
