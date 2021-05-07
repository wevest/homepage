<template>
  <div class="example">
    <CTitle ttype='subtitle' :title="$t('chart.sector_index.title')"></CTitle> 
    <ChartTimeframe period='monthly' :onclick="onClickTimeframe" selected='m6'></ChartTimeframe>
    <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>
    </div>

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';

export default {
    name: 'CSectorIndexChart',
    components: {
        CTitle,
        ChartTimeframe
    },
    data: function () {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",

            g_chart: {
                'chart1': {
                    series: [],                  
                },
                'chart2': {
                    series: [],                  
                },
            },

        }
    },

    methods: {
  
        updateCategoryChart: function(json_data,exchange,category,title) {
            let data_index = CommonFunc.getChartData(json_data[exchange],category,'index_cumsum','trade_date',false,0);
            let data_category = CommonFunc.getChartData(json_data[exchange],'overall','index_cumsum','trade_date',false);
            let data_tv = CommonFunc.getChartData(json_data[exchange],category,'index_tv','trade_date',false,0);
            
            //console.log('data_price=',data_price.data);

            let series = [
                { name: this.$t('category.index'),type: 'line', yAxis:0, data: data_index.data},
                { name: this.$t('category.'+category),type: 'line', yAxis:0, data: data_category.data},
                { name: this.$t('category.volume'),type: 'bar', yAxis:1, opacity:0.4, data: data_tv.data},                
            ];

            this.g_chart['chart1'] = CommonFunc.getChartOption(series) ;
        },



        update: function(json_data,exchange,category) {
            logger.log.debug('CSectorChart.update : =',category,json_data);

            this.updateCategoryChart(json_data,exchange,category,'Index vs '+category);            
        },

        onClickTimeframe: function(value) {
            this.$parent.onClickChartTimeframe(value);
        }
    }
  }
</script>
