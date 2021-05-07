<template>
  <div class="example">
    <CTitle ttype='subtitle' :title="$t('chart.sector_index.title')"></CTitle> 
    <ChartTimeframe period='monthly' :onclick="onClickTimeframe" selected='m6'></ChartTimeframe>
    <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>
<!--
    <apexchart ref="chart2" :height="g_height" type="line" :options="chartOptions2" :series="series2"></apexchart>            
    <apexchart ref="chart3" :height="g_height" type="line" :options="chartOptions3" :series="series3"></apexchart>    
    <apexchart ref="chart4" :height="g_height" type="line" :options="chartOptions4" :series="series4"></apexchart>    
    
-->    
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
            //let data_tv = this.getData(json_data,'tv','',[],false);
            //let data_volume_ema20 = this.getData(json_data,'overall','volume_ema20',false);            
            let data_index = CommonFunc.getChartData(json_data[exchange],category,'index_cumsum','trade_date',false,0);
            let data_category = CommonFunc.getChartData(json_data[exchange],'overall','index_cumsum','trade_date',false);
            let data_tv = CommonFunc.getChartData(json_data[exchange],category,'index_tv','trade_date',false,0);
            
            //console.log('data_price=',data_price.data);

            let series = [
                { name: this.$t('category.index'),type: 'line', yAxis:0, data: data_index.data},
                { name: this.$t('category.'+category),type: 'line', yAxis:0, data: data_category.data},
                { name: this.$t('category.volume'),type: 'bar', yAxis:1, opacity:0.4, data: data_tv.data},                
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            this.g_chart['chart1'] = CommonFunc.getChartOption(series) ;
        },



        updateTickTrinChart: function(json_data,category,title) {            
            let data_tick = this.getData(json_data,'overall','tick_ema20',false,1);
            let data_trin = this.getData(json_data,'overall','trin_ema20',false,1);
            let data_tick_sector = this.getData(json_data,category,'tick_ema20',false,1);
            let data_trin_sector = this.getData(json_data,category,'trin_ema20',false,1);

            //let data_price_ema20 = this.getData(json_data,'price_avg_ema20','',[],false);
            //let data_price_ema_90 = this.getData(json_data.asset,'tv_ewm_90','',dates,false);
            //let data_z = this.getData(json_data.asset,'tv_zscore','',dates,false);
            //console.log('data_price_ema20=',data_price_ema20);

            let series = [
                { name: 'index',type: 'bar', data: data_tick.data},                
                { name: category,type: 'bar', data: data_tick_sector.data},                
/*
                { name: 'ret_ewm20',type: 'line', data: data_ret_ema20.data},                
                { name: 'trin',type: 'line', data: data_trin.data},                
                { name: 'volume',type: 'bar', data: data_volume.data},                
                { name: 'volume_ewm20',type: 'line', data: data_volume_ema20.data},
*/                
            ];

            let a_minmax = CommonFunc.getMinMaxExt([data_tick.data,data_tick_sector.data]);
            //let a_minmax_z = CommonFunc.getMinMaxInSeries(data_z.data);
            
            let yaxis = [
                {seriesName: 'index', forceNiceScale: false, opposite:false, show:true},                
                {seriesName: category, forceNiceScale: false, opposite:false, show:false},
/*                
                {seriesName: 'ret', forceNiceScale: false, opposite:true, show:true, min:a_minmax.min,max:a_minmax.max},                
                {seriesName: 'ret_ewm20', forceNiceScale: false, opposite:true, show:true, min:a_minmax.min,max:a_minmax.max},                                
                {seriesName: 'volume', forceNiceScale: false, opposite:true, show:false, min:a_minmax.min,max:a_minmax.max},                
                {seriesName: 'volume_ewm20', forceNiceScale: false, opposite:true, show:false, min:a_minmax.min,max:a_minmax.max},
*/                
            ];

            this.chartOptions2 = { 
                annotations: { 
                    yaxis: [
                        { y: -1.0, borderColor: '#000',},
                        { y: 1.0, borderColor: '#000',},
                    ]
                },
                yaxis: yaxis,
                stroke: { dashArray: [0,0,0,5,0] },
                title: { text: title },
                zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.series2 = series;
        },

        updateReturnChart: function(json_data,category,title) {            
            let data_overall = this.getData(json_data,'overall','retCumsum',false);
            let data_btc = this.getData(json_data,'btc','retCumsum',false);
            let data_sector = this.getData(json_data,category,'retCumsum',false);            

            let series = [
                { name: 'index',type: 'line', data: data_overall.data},                
                { name: 'btc',type: 'line', data: data_btc.data},
                { name: category,type: 'line', data: data_sector.data},                
            ];

            let a_minmax = CommonFunc.getMinMaxExt([data_overall.data,data_sector.data,data_btc.data]);
            //let a_minmax2 = CommonFunc.getMinMaxExt([data_btc.data]);
            
            let yaxis = [
                {seriesName: 'index', forceNiceScale: false, opposite:false, show:true, min:a_minmax.min,max:a_minmax.max},                
                {seriesName: 'btc', forceNiceScale: false, opposite:false, show:false, min:a_minmax.min,max:a_minmax.max},
                {seriesName: category, forceNiceScale: false, opposite:false, show:false, min:a_minmax.min,max:a_minmax.max},                
            ];

            this.chartOptions3 = { 
                annotations: { 
                    yaxis: [
                        { y: -1.0, borderColor: '#000',},
                        { y: 1.0, borderColor: '#000',},
                    ]
                },
                yaxis: yaxis,
                stroke: { dashArray: [0,0,0,5,0] },
                title: { text: title },
                zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.series3 = series;
        },


        updateVolumeComparisonChart: function(json_data,title) {            
            let data_volume = this.getData(json_data,'alt','volume_ema20',false);
            let data_volume_btc = this.getData(json_data,'btc','volume_ema20',false);

            let series = [
                { name: 'volume_alt',type: 'line', data: data_volume.data},                
                { name: 'volume_btc',type: 'line', data: data_volume_btc.data},                
            ];

            let a_minmax = CommonFunc.getMinMaxExt([data_volume.data]);
            let a_minmax2 = CommonFunc.getMinMaxExt([data_volume_btc.data]);
            
            let yaxis = [
                {seriesName: 'volume_alt', forceNiceScale: false, opposite:true, show:false, min:a_minmax.min,max:a_minmax.max},                
                {seriesName: 'volume_btc', forceNiceScale: false, opposite:false, show:false, min:a_minmax2.min,max:a_minmax2.max},
            ];

            this.chartOptions4 = { 
                annotations: { 
                    yaxis: [
                        { y: -1.0, borderColor: '#000',},
                        { y: 1.0, borderColor: '#000',},
                    ]
                },
                yaxis: yaxis,
                stroke: { dashArray: [0,0,0,5,0] },
                title: { text: title },
                zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.series4 = series;
        },

        updateComparisonChart: function(json_data,title) { 
            let data_index = CommonFunc.getChartData(json_data,'overall','retCumsum','trade_date',false,0);
            let data_major = CommonFunc.getChartData(json_data,'major','retCumsum','trade_date',false,0);
            let data_korean = CommonFunc.getChartData(json_data,'korean','retCumsum','trade_date',false,0);
            let data_chinese = CommonFunc.getChartData(json_data,'chinese','retCumsum','trade_date',false,0);
            let data_nft = CommonFunc.getChartData(json_data,'nft','retCumsum','trade_date',false,0);
            let data_defi = CommonFunc.getChartData(json_data,'defi','retCumsum','trade_date',false,0);
            let data_misc = CommonFunc.getChartData(json_data,'misc','retCumsum','trade_date',false,0);


            let series = [
                { name: 'index',type: 'line', data: data_index.data},
                { name: 'Major',type: 'line', data: data_major.data},
                { name: '한국코인',type: 'line', data: data_korean.data},
                { name: '중국코인',type: 'line', data: data_chinese.data},
                { name: 'NFT',type: 'line', data: data_nft.data},
                { name: 'defi',type: 'line', data: data_defi.data},
                { name: '그외',type: 'line', data: data_misc.data},
            ];

            //let a_minmax = CommonFunc.getMinMaxExt([data_price.data]);
            //let a_minmax_index = CommonFunc.getMinMaxInSeries(data_index.data);
            
            let yaxis = [
                {seriesName: 'index', forceNiceScale: true, opposite:false, show:true},
                {seriesName: 'Major', forceNiceScale: true, opposite:false, show:false},
                {seriesName: '한국코인', forceNiceScale: true, opposite:false, show:false},
                {seriesName: '중국코인', forceNiceScale: true, opposite:false, show:false},
                {seriesName: 'NFT', forceNiceScale: true, opposite:false, show:false},
                {seriesName: 'DEFI', forceNiceScale: true, opposite:false, show:false},
                {seriesName: '그외', forceNiceScale: true, opposite:false, show:false},
            ];

            //console.log("updateAlphaChart : yaxis=",yaxis);

            this.chartOptions2 = { 
                yaxis: yaxis,
                colors:['#EA6A47', '#D32D41', '#488A99', '#6AB187','#1C4E80', '#B3C100', '#DBAE58', '#4CB5F5','#1F3F49'],
                stroke: { dashArray: [5,0,0,0,0,0] },
                title: { text: title },
                zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.series2 = series;
        },


        update: function(json_data,exchange,category) {
            logger.log.debug('CSectorChart.update : =',category,json_data);

            this.updateCategoryChart(json_data,exchange,category,'Index vs '+category);            
            //this.updateComparisonChart(json_data,'섹터별 수익율비교차트');
            //this.updateTickTrinChart(json_data,category,'Buying Power');            
            //this.updateRSChart(json_data,category,category + ' Rank Chart');
        },

        onClickTimeframe: function(value) {
            this.$parent.onClickChartTimeframe(value);
        }
    }
  }
</script>
