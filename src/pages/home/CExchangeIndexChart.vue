<template>
    <div class="example">
        <CTitle ttype='subtitle' :title="$t('chart.home_exchange.title')"></CTitle>
        <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>

        <CTitle ttype='subtitle' :title="$t('chart.home_exchange_tick.title')"></CTitle>        
        <highcharts class="hc" :options="g_chart['chartTick']" ref="chartTick"></highcharts>

        <CTitle ttype='subtitle' :title="$t('chart.home_exchange_sector.title')"></CTitle>        
        <highcharts class="hc" :options="g_chart['chart2']" ref="chart2"></highcharts>
    </div>
<!--
    <apexchart ref="chart3" :height="g_height" type="line" :options="chartOptions3" :series="series3"></apexchart>    
    <apexchart ref="chart4" :height="g_height" type="line" :options="chartOptions4" :series="series4"></apexchart>        
-->  
</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";
import CTitle from 'src/components/CTitle';

export default {
    name: 'CSectorChart',
    components: {
        CTitle
    },
    data: function () {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",
            g_title:"",

            g_chart: {
                'chart1': {
                    series: [],                  
                },
                'chart2': {
                    series: [],                  
                },
                'chartTick': {
                    series: [],                  
                },
            },
        }
    },


    methods: {
    
        updateIndexChart: function(json_data,exchange,title) {
            let data_index = CommonFunc.getChartData(json_data[exchange],'overall','index_cumsum','trade_date',false,0);
            let data_tv = CommonFunc.getChartData(json_data[exchange],'overall','index_tv','trade_date',false,0);

            let series = [
                { name: this.$t('category.index'),type: 'line', marker:{enabled:false}, yAxis:0, data: data_index.data},
                { name: this.$t('category.tv'),type: 'area', capacity:0.3, marker:{enabled:false}, yAxis:1, data: data_tv.data},
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            this.g_chart['chart1'] = CommonFunc.getChartOption(series) ;
        },

        updateTickChart: function(json_data,exchange) {
            let data_tick = CommonFunc.getChartData(json_data[exchange],'overall','tick','trade_date',false,1);
            let data_trin = CommonFunc.getChartData(json_data[exchange],'overall','trin','trade_date',false,1);

            let series = [
                { name: this.$t('category.tick'),type: 'bar', marker:{enabled:false}, yAxis:0, data: data_tick.data},
                { name: this.$t('category.trin'),type: 'area', capacity:0.3, marker:{enabled:false}, yAxis:1, data: data_trin.data},
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            this.g_chart['chartTick'] = CommonFunc.getChartOption(series) ;
        },

        updateSectorChart: function(json_data,exchange,title) {            
            let data_index = CommonFunc.getChartData(json_data[exchange],'overall','index_cumsum','trade_date',false,0);
            let data_major = CommonFunc.getChartData(json_data[exchange],'major','index_cumsum','trade_date',false,0);
            let data_korean = CommonFunc.getChartData(json_data[exchange],'korean','index_cumsum','trade_date',false,0);
            let data_chinese = CommonFunc.getChartData(json_data[exchange],'chinese','index_cumsum','trade_date',false,0);
            let data_nft = CommonFunc.getChartData(json_data[exchange],'nft','index_cumsum','trade_date',false,0);
            let data_defi = CommonFunc.getChartData(json_data[exchange],'defi','index_cumsum','trade_date',false,0);
            let data_misc = CommonFunc.getChartData(json_data[exchange],'misc','index_cumsum','trade_date',false,0);

            //let data_major = CommonFunc.getChartData(json_data[exchange],'major','index_cumsum','trade_date',false,0);
            
            let series = [
                { name: this.$t('category.index'),type: 'area', yAxis:0, capacity:0.4, marker:{enabled:false}, data: data_index.data},
                { name: this.$t('category.major'),type: 'line', yAxis:0, data: data_major.data},
                { name: this.$t('category.korean'),type: 'line', yAxis:0,  data: data_korean.data},
                { name: this.$t('category.chinese'),type: 'line', yAxis:0,  data: data_chinese.data},
                { name: this.$t('category.nft'),type: 'line', yAxis:0,  data: data_nft.data},
                { name: this.$t('category.defi'),type: 'line', yAxis:0,  data: data_defi.data},
                { name: this.$t('category.misc'),type: 'line', yAxis:0,  data: data_misc.data},
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            this.g_chart['chart2'] = CommonFunc.getChartOption(series) ;

        },


        update: function(json_data,exchange) {
            logger.log.debug('CExchangeIndexChart.update : =',json_data);

            this.updateIndexChart(json_data,exchange,'Scaled Index Chart ');            
            this.updateTickChart(json_data,exchange);
            this.updateSectorChart(json_data,exchange,'Sector');
        }
    }
  }
</script>
