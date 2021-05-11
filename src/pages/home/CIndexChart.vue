<template>

    <div class="example">
<!--
        <highcharts :constructorType="'stockChart'" class="hc" :options="chartOptions" ref="chart"></highcharts>
-->        
        <CTitle ttype='subtitle' :title="$t('chart.home_scaled.title')" :desc="$t('chart.home_scaled.desc')"></CTitle>
        <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>
        
        <CTitle ttype='subtitle' :title="$t('chart.home_tick.title')" :desc="$t('chart.home_tick.desc')"></CTitle>        
        <highcharts class="hc" :options="g_chart['chart2']" ref="chart2"></highcharts>

    </div>

</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'src/components/CTitle';


export default {
    name: 'CIndexChart',
    components: {
        CTitle
    },
    data: function () {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",
            //lineWidth: [2,2,2,2,2,2,2,2,2],

            g_chart: {
                'chart1': { series: [], },
                'chart2': { series: [], },
            },
        }
    },

    methods: {
    
        updateIndexChart: function(json_data,title) {
            let data_binance = CommonFunc.getChartData(json_data['binance'],'overall','index_cumsum','trade_date',false,0);
            let data_upbit = CommonFunc.getChartData(json_data['upbit'],'overall','index_cumsum','trade_date',false,0);
            let data_bithumb = CommonFunc.getChartData(json_data['bithumb'],'overall','index_cumsum','trade_date',false,0);
            let data_kimchi = CommonFunc.getChartData(json_data['kpremium'],'overall','price_avg','trade_date',false,0);

            //let data_z = this.getData(json_data.asset,'tv_zscore','',dates,false);
            //console.log('binance_price=',data_binance.data);            

            let series = [
                { name: this.$t('name.binance'),type: 'line', yAxis:0, data: data_binance.data},
                { name: this.$t('name.upbit'),type: 'line', yAxis:0, data: data_upbit.data},
                { name: this.$t('name.bithumb'),type: 'line', yAxis:0, data: data_bithumb.data},
                { name: this.$t('name.kpremium'),type: 'area', yAxis:1, opacity:0.4, marker:{enabled:false}, data: data_kimchi.data },
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            let a_option = CommonFunc.getChartOption(series);
            
            let a_minmax = CommonFunc.getMinMaxExt([data_kimchi.data]);
            a_option.yAxis[1] = {min: 0.9, max:a_minmax.max, show:true, opposite:true, gridLineWidth:0};
            this.g_chart['chart1'] = a_option;
        },

        updateTickTrinChart: function(json_data,title) {            
            let data_binance = CommonFunc.getChartData(json_data['binance'],'overall','tick','trade_date',false,1);
            let data_upbit = CommonFunc.getChartData(json_data['upbit'],'overall','tick','trade_date',false,1);
            let data_bithumb = CommonFunc.getChartData(json_data['bithumb'],'overall','tick','trade_date',false,1);

            let data_binance2 = CommonFunc.getChartData(json_data['binance'],'overall','trin','trade_date',false,1);
            let data_upbit2 = CommonFunc.getChartData(json_data['upbit'],'overall','trin','trade_date',false,1);
            let data_bithumb2 = CommonFunc.getChartData(json_data['bithumb'],'overall','trin','trade_date',false,1);

            let series = [
                //{ name: 'binance',type: 'line', data: data_binance.data},
                { name: this.$t('name.upbit'),type: 'bar', yAxis:0,  data: data_upbit.data},
                { name: this.$t('name.bithumb'),type: 'bar',  yAxis:0, data: data_bithumb.data},
                { name: this.$t('name.binance'),type: 'bar', yAxis:0, data: data_binance.data},
                { name: this.$t('name.trin'),type: 'area',  yAxis:1, opacity:0.3, marker:{enabled:false}, data: data_upbit2.data},
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);
            this.g_chart['chart2'] = CommonFunc.getChartOption(series) ;

        },


        getCEData: function(json_data,exchange,column) {
            let dic_freq = {};
            let dic_column = CommonFunc.getColumnDic( json_data['ce'][exchange].columns ,[],[]);

            json_data['ce'][exchange].values.forEach(a_item => {
                dic_freq[ a_item[dic_column['cvalue']] ] = a_item[dic_column[column]];
            });

            logger.log.debug('getChartData : dic_freq=',dic_freq);
            return dic_freq;
        },

        update: function(json_data) {
            logger.log.debug('CIndexChart.update : =',json_data);

            this.updateIndexChart(json_data,'Scaled Index Chart ');            
            this.updateTickTrinChart(json_data,'Buying Power');
        }
    }
  }
</script>
