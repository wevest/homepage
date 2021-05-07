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
    </div>

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
            let data_tick = CommonFunc.getChartData(json_data[exchange],'overall','trin','trade_date',false,0);

            //let data_z = this.getData(json_data.asset,'tv_zscore','',dates,false);
            //console.log('data_price=',data_price.data);

            let series = [
                { name: this.$t('category.index'),type: 'line', marker:{enabled:false}, yAxis:0, data: data_index.data},
                { name: this.$t('category.tv'),type: 'area', capacity:0.3, marker:{enabled:false}, yAxis:1, data: data_tv.data},
                //{ name: 'tick',type: 'line', yAxis:0, data: data_bithumb.data},
                //{ name: 'kpremium',type: 'area', yAxis:1, data: data_kimchi.data },
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


        update: function(json_data,exchange) {
            logger.log.debug('CExchangeIndexChart.update : =',json_data);


            this.updateIndexChart(json_data,exchange,'Scaled Index Chart ');            
            this.updateTickChart(json_data,exchange);
            this.updateSectorChart(json_data,exchange,'Sector');
            //this.updateComparisonChart(json_data,'섹터별 수익율비교차트');
            
            //this.updateRSChart(json_data,category,category + ' Rank Chart');
        }
    }
  }
</script>
