<template>
    <div style="margin:0px;padding:0px;">
<!--
        <highcharts :constructorType="'stockChart'" class="hc" :options="chartOptions" ref="chart"></highcharts>
        <CTitle ttype='subtitle' :title="$t('page.asset.price.title')" :desc="$t('page.asset.price.desc')"></CTitle>        
        <highcharts class="box_chart" :options="g_chart['chart1']" ref="chart1"></highcharts>
-->     
        <q-skeleton v-if="!v_chart_loaded" animation="fade" square height="450px" />             
        <highcharts v-show="v_chart_loaded" class="box_chart" :options="g_chart['chart1']" ref="chart1"></highcharts>
        
    
<!--    

        <CTitle ttype='subtitle' title="시장강도"></CTitle>
        <highcharts class="hc" :options="g_chart['chart2']" ref="chart2"></highcharts>
-->

    </div>

</template>

<script>
//import {HChart} from 'highcharts-vue';
//import stockInit from 'highcharts/modules/stock';

import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'src/components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';

export default {
    name: 'CSectorChart',
    components: {
        CTitle,
        ChartTimeframe
    },
    data: function () {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",
            //lineWidth: [2,2,2,2,2,2,2,2,2],

            g_chart: {
                'chart1': {series: []},
                'chart2': {series: []},
            },

            v_chart_loaded: false,
        }
    },

    methods: {
    
        updateChart: function(json_data) {
            let data_price = CommonFunc.getChartData(json_data,'overall','priceClose','trade_date',false,0);
            let data_volume = CommonFunc.getChartData(json_data,'overall','volume','trade_date',false,0);
            let data_volume_top = CommonFunc.getChartData(json_data,'overall','top_tier_volume_total','trade_date',false,0);

            let series = [
                { name: 'price',type: 'line', yAxis:0, data: data_price.data},
                { name: 'volume',type: 'bar', yAxis:1, data: data_volume.data},
                //{ name: 'top_tier_volume',type: 'bar', yAxis:1, data: data_volume_top.data},
            ];

            let a_option = CommonFunc.getChartOption(series);
            this.g_chart['chart1'] = a_option;
            this.v_chart_loaded = true;

            logger.log.debug('CAssetChart.updateChart : =',json_data);
        },

        update: function(json_data) {
            logger.log.debug('CAssetChart.update : =',json_data);

            this.updateChart(json_data);            
        },
    }
  }
</script>
