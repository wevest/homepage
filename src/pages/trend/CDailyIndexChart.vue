<template>
    <div class="example">
        <apexchart ref="chart" :height="g_height" type="line" :options="chartOptions" :series="series"></apexchart>
        <apexchart ref="chart2" :height="g_height" type="line" :options="chartOptions2" :series="series2"></apexchart>        
        <apexchart ref="chart3" :height="g_height" type="line" :options="chartOptions3" :series="series3"></apexchart>    
        <apexchart ref="chart4" :height="g_height" type="line" :options="charts['chart4']['options']" :series="charts['chart4']['series']"></apexchart>           
        <apexchart ref="chart5" :height="g_height" type="line" :options="charts['chart5']['options']" :series="charts['chart5']['series']"></apexchart>
        <apexchart ref="chart6" :height="g_height" type="line" :options="charts['chart6']['options']" :series="charts['chart6']['series']"></apexchart>
        <apexchart ref="chart7" :height="g_height" type="line" :options="charts['chart7']['options']" :series="charts['chart7']['series']"></apexchart>        
    </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import CommonFunc from '@/util/CommonFunc';
//import MathFunc from '@/util/MathFunc';
import MoaBackendAPI from '@/services/apiService';
import logger from "@/error/Logger";


export default {
    name: 'CDailyIndexChart',
    components: {
        'apexchart': VueApexCharts
    },
    data: function () {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",

            charts: {
                'chart4': {
                    options: {
                        plotOptions: {
                            bar: { horizontal: false,columnWidth: '65%', },
                        },                

                        title: {
                            text:'Investor',
                            align: 'center',
                            style: {
                                fontSize:  '18px',fontWeight:  'bold',color:  '#263238'
                            },            
                        },
                        xaxis: { type: 'datetime' },
                    },
                    series: [],
                },
                'chart5': {
                    options: {
                        chart: {
                            type:'bar',
                            stacked: true,
                        },
                        plotOptions: {
                            bar: { horizontal: false,columnWidth: '65%', },
                        },                

                        title: {
                            text:'Investor',
                            align: 'center',
                            style: {
                                fontSize:  '18px',fontWeight:  'bold',color:  '#263238'
                            },            
                        },
                        xaxis: { type: 'datetime' },
                    },
                    series: [],
                },
                'chart6': {
                    options: {
                        plotOptions: {
                            bar: { horizontal: false,columnWidth: '65%', },
                        },                

                        title: {
                            text:'Investor',
                            align: 'center',
                            style: {
                                fontSize:  '18px',fontWeight:  'bold',color:  '#263238'
                            },            
                        },
                        xaxis: { type: 'datetime' },
                    },
                    series: [],
                },
                'chart7': {
                    options: {
                        plotOptions: {
                            bar: { horizontal: false,columnWidth: '65%', },
                        },                

                        title: {
                            text:'Investor',
                            align: 'center',
                            style: {
                                fontSize:  '18px',fontWeight:  'bold',color:  '#263238'
                            },            
                        },
                        xaxis: { type: 'datetime' },
                    },
                    series: [],
                }                
            },

            chartOptions: {
                chart: {
                    stacked: false,
                },
                title: {
                    text:'',
                    align: 'center',
                    style: {
                        fontSize:  '18px',fontWeight:  'bold',color:  '#263238'
                    },            
                },
                annotations: {
                    points: []
                },
                xaxis: {
                    type: 'datetime',            
                },
                yaxis: {
                    forceNiceScale: true,
                    title: {
                        text: '주가',
                    },
                },
            },
            series: [],  

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
    
        updateIndexChart: function(json_data,title) {
            //let data_index = CommonFunc.getChartData(json_data['binance'],'overall','index_cumsum','trade_date',false,0);
            let data_btc = CommonFunc.getChartData(json_data['binance'],'btc','index_cumsum','trade_date',false,0);
            let data_alt = CommonFunc.getChartData(json_data['binance'],'alt','index_cumsum','trade_date',false,0);
            let data_tv = CommonFunc.getChartData(json_data['binance'],'overall','index_tv','trade_date',false,0);
            let data_upbit = CommonFunc.getChartData(json_data['upbit'],'overall','index_cumsum','trade_date',false,0);
            let data_bithumb = CommonFunc.getChartData(json_data['bithumb'],'overall','index_cumsum','trade_date',false,0);

            //let data_z = this.getData(json_data.asset,'tv_zscore','',dates,false);
            //console.log('binance_price=',data_binance.data);

            let series = [                
                { name: 'btc',type: 'line', data: data_btc.data},                
                { name: 'alt',type: 'line', data: data_alt.data},
                { name: 'upbit',type: 'line', data: data_upbit.data},                
                { name: 'bithumb',type: 'line', data: data_bithumb.data},                
                { name: 'tv',type: 'bar', data: data_tv.data},
                //{ name: 'tv_btc',type: 'area', data: data_tv_btc.data},
                //{ name: 'tv_alt',type: 'area', data: data_tv_alt.data},
            ];

            //let a_minmax = CommonFunc.getMinMaxExt([data_price_sector.data,data_price.data]);
            //let a_minmax2 = CommonFunc.getMinMaxExt([data_kimchi.data]);
            
            let yaxis = [
                {seriesName: 'btc', forceNiceScale: false, opposite:false, show:true},                
                {seriesName: 'alt', forceNiceScale: false, opposite:false, show:false},               
                {seriesName: 'upbit', forceNiceScale: false, opposite:false, show:false},
                {seriesName: 'bithumb', forceNiceScale: false, opposite:false, show:false},
                {seriesName: 'tv', forceNiceScale: false, opposite:true, show:false},
                //{seriesName: 'tv_btc', forceNiceScale: false, opposite:true, show:false},
                //{seriesName: 'tv_alt', forceNiceScale: false, opposite:true, show:false},
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            this.chartOptions = { 
                annotations: { 
                    yaxis: [
                        { y: -1.0, borderColor: '#000',},
                        { y: 1.0, borderColor: '#000',},
                    ]
                },
                yaxis: yaxis,
                stroke: { dashArray: [0,0,0,0,0] },
                title: { text: title },
                zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.series = series;
        },

        updateDominanceChart: function(json_data,title) {
            let data_tv = CommonFunc.getChartData(json_data['binance'],'overall','index_tv','trade_date',false,0);
            let data_tv_btc = CommonFunc.getChartData(json_data['binance'],'btc','index_tv','trade_date',false,0);
            let data_tv_alt = CommonFunc.getChartData(json_data['binance'],'alt','index_tv','trade_date',false,0);
            
            let data_ratio_btc = [];
            for (var index=0;index<data_tv.data.length;index++) {
                let a_value = data_tv_btc.data[index].y/data_tv.data[index].y
                data_ratio_btc.push( {x:data_tv.data[index].x , y:CommonFunc.round(a_value,2)} )
            }

            let data_ratio_alt = [];
            for (var index=0;index<data_tv.data.length;index++) {
                let a_value = data_tv_alt.data[index].y/data_tv.data[index].y
                data_ratio_alt.push( {x:data_tv.data[index].x , y:CommonFunc.round(a_value,2)} )
            }

            let series = [                
                { name: 'ratio_btc',type: 'line', data: data_ratio_btc},
                { name: 'ratio_alt',type: 'line', data: data_ratio_alt},
                { name: 'btc',type: 'area', data: data_tv_btc.data},
                { name: 'alt',type: 'area', data: data_tv_alt.data},
                //{ name: 'tv_btc',type: 'area', data: data_tv_btc.data},
                //{ name: 'tv_alt',type: 'area', data: data_tv_alt.data},
            ];

            //let a_minmax = CommonFunc.getMinMaxExt([data_price_sector.data,data_price.data]);
            //let a_minmax2 = CommonFunc.getMinMaxExt([data_kimchi.data]);
            
            let yaxis = [
                {seriesName: 'ratio_btc', forceNiceScale: false, opposite:false, show:true},
                {seriesName: 'ratio_alt', forceNiceScale: false, opposite:false, show:false},
                {seriesName: 'btc', forceNiceScale: false, opposite:true, show:false},                
                {seriesName: 'alt', forceNiceScale: false, opposite:true, show:false},                         
                //{seriesName: 'tv_btc', forceNiceScale: false, opposite:true, show:false},
                //{seriesName: 'tv_alt', forceNiceScale: false, opposite:true, show:false},
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            this.chartOptions2 = { 
                annotations: { 
                    yaxis: [
                        { y: -1.0, borderColor: '#000',},
                        { y: 1.0, borderColor: '#000',},
                    ]
                },
                yaxis: yaxis,
                stroke: { dashArray: [0,0,0,0,0] },
                title: { text: title },
                zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.series2 = series;
        },

        updateKpremiumChart: function(json_data,title) {
            //let data_tv = CommonFunc.getChartData(json_data['kpremium'],'overall','price_avg','trade_date',false,0);
            let data_tv_btc = CommonFunc.getChartData(json_data['kpremium'],'btc','price_avg','trade_date',false,0);
            let data_tv_alt = CommonFunc.getChartData(json_data['kpremium'],'alt','price_avg','trade_date',false,0);

            
            //console.log('updateKpremiumChart.data_tv=',data_tv.data);

            let series = [                
                //{ name: 'overall',type: 'line', data: data_tv.data},
                { name: 'btc',type: 'line', data: data_tv_btc.data},
                { name: 'alt',type: 'line', data: data_tv_alt.data},
            ];

            let a_minmax = CommonFunc.getMinMaxExt([data_tv_btc.data,data_tv_alt.data]);
            //let a_minmax2 = CommonFunc.getMinMaxExt([data_kimchi.data]);
            
            let yaxis = [
                //{seriesName: 'overall', forceNiceScale: false, opposite:false, show:true, min:a_minmax.min,max:a_minmax.max},
                {seriesName: 'btc', forceNiceScale: false, opposite:false, show:true, min:a_minmax.min,max:a_minmax.max},                
                {seriesName: 'alt', forceNiceScale: false, opposite:false, show:false, min:a_minmax.min,max:a_minmax.max},                         
                //{seriesName: 'tv_btc', forceNiceScale: false, opposite:true, show:false},
                //{seriesName: 'tv_alt', forceNiceScale: false, opposite:true, show:false},
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            this.chartOptions3 = { 
                yaxis: yaxis,
                stroke: { dashArray: [0,0,0,0,0] },
                title: { text: title },
                zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.series3 = series;
        },

        updateTickTrinChart: function(json_data,title) {            
            let data_index = CommonFunc.getChartData(json_data['binance'],'overall','index_cumsum','trade_date',true,0);
            let data_tick = CommonFunc.getChartData(json_data['binance'],'overall','tick','trade_date',false,1);
            let data_trin = CommonFunc.getChartData(json_data['binance'],'overall','trin','trade_date',false,1);
            
            let data_upbit = CommonFunc.getChartData(json_data['upbit'],'overall','tick','trade_date',false,0);
            let data_bithumb = CommonFunc.getChartData(json_data['bithumb'],'overall','tick','trade_date',false,0);
            let data_upbit2 = CommonFunc.getChartData(json_data['upbit'],'overall','trin','trade_date',false,0);
            let data_bithumb2 = CommonFunc.getChartData(json_data['bithumb'],'overall','trin','trade_date',false,0);

            let data_ratio = [];
            for (var index=0;index<data_tick.data.length;index++) {
                let a_value = data_trin.data[index].y/data_tick.data[index].y - 1;
                data_ratio.push( {x:data_tick.data[index].x , y:CommonFunc.round(a_value,2)} )
            }

            //let data_z = this.getData(json_data.asset,'tv_zscore','',dates,false);
            //console.log('data_price=',data_price.data);

            let series = [
                { name: 'index',type: 'line', data: data_index.data},
                //{ name: 'tick',type: 'line', data: data_binance.data},
                //{ name: 'upbit',type: 'line', data: data_upbit.data},
                //{ name: 'bithumb',type: 'line', data: data_bithumb.data},
                { name: 'trin',type: 'bar', data: data_trin.data},
                //{ name: 'power',type: 'line', data: data_ratio},
                //{ name: 'bithumb_tr',type: 'bar', data: data_bithumb2.data},

            ];

            //let a_minmax = CommonFunc.getMinMaxExt([data_price_sector.data,data_price.data]);
            //let a_minmax2 = CommonFunc.getMinMaxExt([data_kimchi.data]);
            
            let yaxis = [
                {seriesName: 'index', forceNiceScale: false, opposite:false, show:true},
                //{seriesName: 'upbit', forceNiceScale: false, opposite:false, show:false},
                //{seriesName: 'tick', forceNiceScale: false, opposite:true, show:false},
                {seriesName: 'trin', forceNiceScale: false, opposite:true, show:true},
                //{seriesName: 'power', forceNiceScale: false, opposite:true, show:true},
                //{seriesName: 'bithumb_Tr', forceNiceScale: false, opposite:true, show:false},

            ];
            
            //console.log("updateAlphaChart : yaxis=",data_index);

            this.chartOptions4 = { 
                annotations: { 
                    yaxis: [
                        { y: -1.0, borderColor: '#000',},
                        { y: 1.0, borderColor: '#000',},
                    ]
                },
                yaxis: yaxis,
                stroke: { dashArray: [0,0,0,0,0] },
                title: { text: title },
                zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.series4 = series;
        },


        updateSectorChart: function(json_data,exchange,column,target,title) {            
            let data_major = CommonFunc.getChartData(json_data[exchange],'major',column,'trade_date',false,0);
            let data_korean = CommonFunc.getChartData(json_data[exchange],'korean',column,'trade_date',false,0);
            let data_chinese = CommonFunc.getChartData(json_data[exchange],'chinese',column,'trade_date',false,0);
            let data_defi = CommonFunc.getChartData(json_data[exchange],'defi',column,'trade_date',false,0);
            let data_nft = CommonFunc.getChartData(json_data[exchange],'nft',column,'trade_date',false,0);
            let data_misc = CommonFunc.getChartData(json_data[exchange],'misc',column,'trade_date',false,0);

            let series = [
                { name: 'major',type: 'line', data: data_major.data},                
                { name: 'korean',type: 'line', data: data_korean.data},                
                { name: 'chinese',type: 'line', data: data_chinese.data},
                { name: 'defi',type: 'line', data: data_defi.data},
                { name: 'nft',type: 'line', data: data_nft.data},
                //{ name: 'misc',type: 'line', data: data_misc.data},
            ];

            //let a_minmax = CommonFunc.getMinMaxExt([data_volume.data]);
            //let a_minmax2 = CommonFunc.getMinMaxExt([data_volume_btc.data]);
            
            let yaxis = [
                {seriesName: 'major', forceNiceScale: true, opposite:false, show:true},
                {seriesName: 'korean', forceNiceScale: true, opposite:false, show:false},
                {seriesName: 'chinese', forceNiceScale: false, opposite:false, show:false},                
                {seriesName: 'defi', forceNiceScale: false, opposite:false, show:false},
                {seriesName: 'nft', forceNiceScale: false, opposite:false, show:false},
                //{seriesName: 'misc', forceNiceScale: false, opposite:false, show:false},
            ];

            this.charts[target].options = { 
                yaxis: yaxis,
                stroke: { dashArray: [0,0,0,0,0] },
                title: { text: title },
                zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.charts[target].series = series;
        },



        updateSectorTVChart: function(json_data,exchange,column,target,title) {            
            let data_major = CommonFunc.getChartData(json_data[exchange],'major',column,'trade_date',false,0);
            let data_korean = CommonFunc.getChartData(json_data[exchange],'korean',column,'trade_date',false,0);
            let data_chinese = CommonFunc.getChartData(json_data[exchange],'chinese',column,'trade_date',false,0);
            let data_defi = CommonFunc.getChartData(json_data[exchange],'defi',column,'trade_date',false,0);
            let data_nft = CommonFunc.getChartData(json_data[exchange],'nft',column,'trade_date',false,0);
            let data_misc = CommonFunc.getChartData(json_data[exchange],'misc',column,'trade_date',false,0);

            let categories = [];
            for (var index=0;index<data_major.data.length;index++) {
                categories.push( data_major.data[index].x );
            }

            let series = [
                { name:'major', data: data_major.values},
                { name:'korean', data: data_korean.values},
                { name:'chinese', data: data_chinese.values},
                { name:'defi', data: data_defi.values},
                { name:'nft', data: data_nft.values},
            ];
            //console.log('series=',series);

            this.charts[target].options = { 
                chart: {
                    type:'bar',
                    stacked: true,                    
                },           
                xaxis: {
                    type:'datetime',
                    categories: categories
                },     
                //yaxis: yaxis,
                //stroke: { dashArray: [0,0,0,0,0] },
                //title: { text: title },
                //zoom: { enabled:true, autoScaleYaxis: true, }
            };
            this.charts[target].series = series;
        },


        update: function(json_data) {
            logger.log.debug('CDailyIndexChart.update : =',json_data);

            this.updateIndexChart(json_data,'Scaled Index Chart ');            
            this.updateDominanceChart(json_data,'BTC Dominance Chart');            
            this.updateKpremiumChart(json_data,'KPremium Chart');            
            //this.updateTickTrinChart(json_data,'Buying Power');            
            this.updateSectorChart(json_data,'upbit','index_cumsum','chart4','Upbit Sector Chart');
            this.updateSectorTVChart(json_data,'upbit','index_tv','chart5','Upbit Sector TV Chart');
            this.updateSectorChart(json_data,'bithumb','index_cumsum','chart6','Bithumb Sector Chart');
            this.updateSectorTVChart(json_data,'bithumb','index_tv','chart7','Bithumb Sector TV Chart');
        }
    }
  }
</script>
