<template>
    <div class="example">
<!--
        <highcharts :constructorType="'stockChart'" class="hc" :options="chartOptions" ref="chart"></highcharts>
-->        
        <ChartTimeframe period='daily' :onclick="onClickTimeframe" selected='m6'></ChartTimeframe>
        <CTitle ttype='subtitle' title="시장강도"></CTitle>
        <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>

        
        <CTitle ttype='subtitle' title="시장강도"></CTitle>
        <highcharts class="hc" :options="g_chart['chart2']" ref="chart2"></highcharts>

    </div>

</template>

<script>
//import {HChart} from 'highcharts-vue';
//import stockInit from 'highcharts/modules/stock';

//import * as Const from '@/store/constants';
import CommonFunc from 'src/util/CommonFunc';
//import MoaBackendAPI from '@/services/apiService';
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
                'chart1': {
                    series: [],                  
                },
                'chart2': {
                    series: [],                  
                },
            },


            chartOptions2: {
                chart: {
                    stacked: false,
                },

                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '65%',
                        //endingShape: 'rounded'
                    },
                },                

                title: {
                    text:'Investor',
                    align: 'center',
                    style: {
                        fontSize:  '18px',fontWeight:  'bold',color:  '#263238'
                    },            
                },
                xaxis: {
                    type: 'datetime',            
                    //tickAmount:10,
                },
            },
            series2: [],

            chartOptions3: {
                chart: {
                    stacked: false,
                },

                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '65%',
                        //endingShape: 'rounded'
                    },
                },                

                title: {
                    text:'Investor',
                    align: 'center',
                    style: {
                        fontSize:  '18px',fontWeight:  'bold',color:  '#263238'
                    },            
                },
                xaxis: {
                    type: 'datetime',            
                    //tickAmount:10,
                },
            },
            series3: [],

        }
    },

    methods: {
    
        getChartOption: function(yaxis,series) {
            let a_option = {
                chart: {
                    zoomType: 'x'
                },
                tooltip: {
                    xDateFormat: '%Y/%m/%d',
                    shared: true,
                    split: false,
                    enabled: true
                },                
                title: {text:''},
                xAxis: { type: 'datetime' },                
                yAxis:yaxis,
                series: series
            }
            return a_option;
        },

        updateIndexChart: function(json_data,title) {
            let data_binance = CommonFunc.getChartData(json_data['binance'],'overall','index_cumsum','trade_date',false,0);
            let data_upbit = CommonFunc.getChartData(json_data['upbit'],'overall','index_cumsum','trade_date',false,0);
            let data_bithumb = CommonFunc.getChartData(json_data['bithumb'],'overall','index_cumsum','trade_date',false,0);
            let data_kimchi = CommonFunc.getChartData(json_data['kpremium'],'overall','price_avg','trade_date',false,0);

            //let data_z = this.getData(json_data.asset,'tv_zscore','',dates,false);
            //console.log('binance_price=',data_binance.data);

            let a_minmax = CommonFunc.getMinMaxExt([data_binance.data,data_upbit.data]);
            let a_minmax2 = CommonFunc.getMinMaxExt([data_kimchi.data]);

            let series = [
                { name: 'binance',type: 'line', yAxis:0, data: data_binance.data},
                { name: '업비트',type: 'line', yAxis:0, data: data_upbit.data},
                { name: 'bithumb',type: 'line', yAxis:0, data: data_bithumb.data},
                { name: 'kpremium',type: 'area', yAxis:1, data: data_kimchi.data },
            ];

            let yaxis = [
                {opposite:false, show:true, min:a_minmax.min, max:a_minmax.max, endOnTick:false, title:{text:''} },
                {opposite:true, show:true, min:a_minmax2.min, max:a_minmax2.max, endOnTick:false, title:{text:''} },
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            this.g_chart['chart1'] = this.getChartOption(yaxis,series) ;
        },

        updateTickTrinChart: function(json_data,title) {            
            let data_binance = CommonFunc.getChartData(json_data['binance'],'overall','tick','trade_date',false,1);
            let data_upbit = CommonFunc.getChartData(json_data['upbit'],'overall','tick','trade_date',false,1);
            let data_bithumb = CommonFunc.getChartData(json_data['bithumb'],'overall','tick','trade_date',false,1);

            let data_binance2 = CommonFunc.getChartData(json_data['binance'],'overall','trin','trade_date',false,1);
            let data_upbit2 = CommonFunc.getChartData(json_data['upbit'],'overall','trin','trade_date',false,1);
            let data_bithumb2 = CommonFunc.getChartData(json_data['bithumb'],'overall','trin','trade_date',false,1);

            //let data_z = this.getData(json_data.asset,'tv_zscore','',dates,false);
            //console.log('data_price=',data_price.data);

            let series = [
                //{ name: 'binance',type: 'line', data: data_binance.data},
                { name: 'upbit',type: 'line', yAxis:0,  data: data_upbit.data},
                { name: 'bithumb',type: 'line',  yAxis:0, data: data_bithumb.data},
                { name: 'binance',type: 'line', yAxis:0, data: data_binance.data},
                //{ name: 'upbit_tr',type: 'bar',  yAxis:0, data: data_upbit2.data},
                //{ name: 'bithumb_tr',type: 'bar',  yAxis:0, data: data_bithumb2.data},

            ];

            let a_minmax = CommonFunc.getMinMaxExt([data_upbit.data,data_bithumb.data]);
            let a_minmax2 = CommonFunc.getMinMaxExt([data_upbit2.data,data_bithumb2.data]);
            
            let yaxis = [
                //{seriesName: 'binance', forceNiceScale: false, opposite:false, show:true},
                {opposite:false, show:true, endOnTick:false, title:{text:''} },
                //{seriesName: 'bithumb', forceNiceScale: false, opposite:false, show:false, min:a_minmax.min,max:a_minmax.max},
                //{seriesName: 'binance_tr', forceNiceScale: false, opposite:true, show:true},
                //{seriesName: 'upbit_tr', forceNiceScale: false, opposite:true, show:true, min:a_minmax2.min,max:a_minmax2.max},
                //{seriesName: 'bithumb_Tr', forceNiceScale: false, opposite:true, show:false, min:a_minmax2.min,max:a_minmax2.max},

            ];
            
            //console.log("updateAlphaChart : yaxis=",data_index);
            this.g_chart['chart2'] = this.getChartOption(yaxis,series) ;

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


        getCEData: function(json_data,exchange,column) {
            let dic_freq = {};
            let dic_column = CommonFunc.getColumnDic( json_data['ce'][exchange].columns ,[],[]);

            json_data['ce'][exchange].values.forEach(a_item => {
                dic_freq[ a_item[dic_column['cvalue']] ] = a_item[dic_column[column]];
            });

            logger.log.debug('getChartData : dic_freq=',dic_freq);
            return dic_freq;
        },

        getMarketPowerData: function(json_data,exchange,column,dtype) { 
            let dic_freq = this.getCEData(json_data,exchange,column);
            let dic_column = CommonFunc.getColumnDic( json_data[exchange]['overall'].columns ,[],[]);

            let data_points = [];
            json_data[exchange]['overall'].values.forEach(a_item => {
                let freq = a_item[dic_column['trade_date']].substring(11,16);
                
                let value1 = a_item[dic_column[column]];
                let value0 = dic_freq[freq];
                let a_value = 0;
                if (dtype==0) {
                
                    a_value = CommonFunc.round(CommonFunc.calcRet(value0,value1),2);
                    //console.log('freq=',freq,value0,value1,a_value);

                } else {
                    a_value = CommonFunc.round(value0,4);
                }
                
                //a_value = CommonFunc.round(a_value,3);
                let a_data = {x: CommonFunc.toTimestamp(a_item[dic_column['trade_date']]),  y:a_value}

                
                data_points.push(a_data);                
            });

            //logger.log.debug('getChartData : data_points=',data_points);
            return data_points;
        },

        updateMarketPowerChart: function(json_data,title) { 
            let data_index_ret_freq = this.getMarketPowerData(json_data,'upbit','tick',1);
            let data_index_ret_ratio = this.getMarketPowerData(json_data,'upbit','tick',0);
            let data_index_ret = CommonFunc.getChartData(json_data['upbit'],'overall','tick','trade_date',false,0);

            logger.log.debug('updateMarketPowerChart : data_points=',data_index_ret);
            logger.log.debug('updateMarketPowerChart : data_index_ret_ratio=',data_index_ret_ratio);

            let series = [                
                { name: 'power',type: 'line', data: data_index_ret_ratio},                
                { name: 'index',type: 'bar', data: data_index_ret.data},
                { name: 'avg',type: 'bar', data: data_index_ret_freq},                
            ];

            let a_minmax = CommonFunc.getMinMaxExt([data_index_ret.data,data_index_ret_freq]);
            let a_minmax2 = CommonFunc.getMinMaxExt([data_index_ret_ratio]);
            
            let yaxis = [
                {seriesName: 'power', forceNiceScale: false, opposite:false, show:true},                
                {seriesName: 'index', forceNiceScale: false, opposite:true, show:true, min:a_minmax.min,max:a_minmax.max},
                {seriesName: 'avg', forceNiceScale: false, opposite:true, show:false, min:a_minmax.min,max:a_minmax.max},
                //{seriesName: category, forceNiceScale: false, opposite:false, show:false, min:a_minmax.min,max:a_minmax.max},                
            ];

            this.chartOptions3 = { 
                annotations: { 
                    yaxis: [
                        { y: 0.0, borderColor: '#000',},
                    ]
                },
                yaxis: yaxis,
                stroke: { dashArray: [0,0,0,5,0],width:Const.CHART_LINE_WIDTH },
                title: { text: title },
                zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.series3 = series;
        },


        update: function(json_data) {
            logger.log.debug('CIndexChart.update : =',json_data);

            this.updateIndexChart(json_data,'Scaled Index Chart ');            
            this.updateTickTrinChart(json_data,'Buying Power');
            //this.updateMarketPowerChart(json_data,'Market Power Chart');
            
            //this.updateRSChart(json_data,category,category + ' Rank Chart');
        },

        onClickTimeframe: function(offset,timeframe) {
            console.log('CTrendView.onClickTimeframe - ',offset,timeframe);
            this.g_timeframe = timeframe;
            //this.$parent.reload(offset);
        },

    }
  }
</script>
