<template>
    <div class="example">
<!--
        <highcharts :constructorType="'stockChart'" class="hc" :options="chartOptions" ref="chart"></highcharts>
-->        
        <CTitle ttype='subtitle' title="trend_chart"></CTitle>          
        <ChartTimeframe period="monthly" :onclick="onClickTimeframe" selected='m6'></ChartTimeframe>
        <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>
        
        <CTitle ttype='subtitle' title="trend_btc_dominance_chart"></CTitle>          
        <ChartTimeframe period="monthly" :onclick="onClickTimeframe" selected='m6'></ChartTimeframe>
        <highcharts class="hc" :options="g_chart['chart2']" ref="chart2"></highcharts>
        
        <CTitle ttype='subtitle' :title="$t('page.trend.chart.kpremium.title')" :desc="$t('page.trend.chart.kpremium.desc')"></CTitle>
        <ChartTimeframe period="monthly" :onclick="onClickTimeframe" selected='m6'></ChartTimeframe>
        <highcharts class="hc" :options="g_chart['chart3']" ref="chart3"></highcharts>
        
        <q-tabs v-model="tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
          <q-tab name="upbit" :label="tab_upbit" @click="onClickTab('upbit')" />
          <q-tab name="bithumb" :label="tab_bithumb" @click="onClickTab('bithumb')" />
        </q-tabs>

        <CTitle ttype='subtitle' :title="$t('chart.trend_sector.title')"></CTitle>   
        <ChartTimeframe period="monthly" :onclick="onClickTimeframe" selected='m6'></ChartTimeframe>       
        <highcharts class="hc" :options="g_chart['chart4']" ref="chart4"></highcharts>
        
        <CTitle ttype='subtitle' :title="$t('page.trend.chart.sector_tv.title')"></CTitle>          
        <ChartTimeframe period="monthly" :onclick="onClickTimeframe" selected='m6'></ChartTimeframe>
        <highcharts class="hc" :options="g_chart['chart5']" ref="chart5"></highcharts>

    </div>

</template>

<script>
//import {HChart} from 'highcharts-vue';
//import stockInit from 'highcharts/modules/stock';

//import * as Const from '@/store/constants';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CTitle from 'components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';

export default {
    name: 'CTrendChart',
    components: {
        CTitle,
        ChartTimeframe
    },
    data: function () {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",

            tab:'upbit',
            tab_upbit: this.$t('name.upbit'),
            tab_bithumb: this.$t('name.bithumb'),

            g_chart: {
                'chart1': {
                    series: [],                  
                },
                'chart2': {
                    series: [],                  
                },
                'chart3': {
                    series: [],                  
                },
                'chart4': {
                    series: [],                  
                },
                'chart5': {
                    series: [],                  
                },
            },
        }
    },

    methods: {
        updateIndexChart: function(json_data,title) {
            let data_btc = CommonFunc.getChartData(json_data['binance'],'btc','index_cumsum','trade_date',false,0);
            let data_alt = CommonFunc.getChartData(json_data['binance'],'alt','index_cumsum','trade_date',false,0);
            let data_tv = CommonFunc.getChartData(json_data['binance'],'overall','index_tv','trade_date',false,0);
            let data_upbit = CommonFunc.getChartData(json_data['upbit'],'overall','index_cumsum','trade_date',false,0);
            let data_bithumb = CommonFunc.getChartData(json_data['bithumb'],'overall','index_cumsum','trade_date',false,0);

            //let data_z = this.getData(json_data.asset,'tv_zscore','',dates,false);
            //console.log('binance_price=',data_binance.data);

            let a_minmax = CommonFunc.getMinMaxExt([data_btc.data,data_alt.data]);
            let a_minmax2 = CommonFunc.getMinMaxExt([data_tv.data]);

            let series = [
                { name: this.$t('name.btc'), type: 'line', yAxis:0, data: data_btc.data},
                { name: this.$t('name.alt'), type: 'line', yAxis:0, data: data_alt.data},
                { name: this.$t('name.upbit'), type: 'line', yAxis:0, data: data_upbit.data},
                { name: this.$t('name.bithumb'),type: 'line', yAxis:0, data: data_bithumb.data},
                { name: this.$t('name.tv'),type: 'column', opacity:0.7, yAxis:1, data: data_tv.data },
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            this.g_chart['chart1'] = CommonFunc.getChartOption(series);
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
                { name: this.$t('name.btc_tv_ratio'),type: 'line', yAxis:0, data: data_ratio_btc},
                //{ name: this.$t('ratio_alt'),type: 'line', yAxis:0, data: data_ratio_alt},
                { name: this.$t('name.btc'),type: 'area', opacity:0.7, yAxis:1, data: data_tv_btc.data},
                { name: this.$t('name.alt'),type: 'area', opacity:0.7, yAxis:1, data: data_tv_alt.data},
            ];

            this.g_chart['chart2'] = CommonFunc.getChartOption(series) ;
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


        updateKpremiumChart: function(json_data,title) {
            let data_index = CommonFunc.getChartData(json_data['upbit'],'overall','index_cumsum','trade_date',false,0);
            let data_tv_btc = CommonFunc.getChartData(json_data['kpremium'],'btc','price_avg','trade_date',false,0);
            let data_tv_alt = CommonFunc.getChartData(json_data['kpremium'],'alt','price_avg','trade_date',false,0);
        
            let series = [
                { name: this.$t('name.index'),type: 'line', yAxis:1, data: data_index.data},
                { name: this.$t('name.btc'),type: 'line', yAxis:0, data: data_tv_btc.data},
                { name: this.$t('name.alt'),type: 'line', yAxis:0, data: data_tv_alt.data},
            ];

            //let a_minmax = CommonFunc.getMinMaxExt([data_tv_btc.data,data_tv_alt.data]);

            //let a_option = CommonFunc.getChartOption(series);
            //a_option.yAxis[0] = {min: a_minmax.min, max:a_minmax.max, show:true, opposite:false, gridLineWidth:1, title:{text:''}};

            //#this.g_chart['chart3'] = a_option;
            this.g_chart['chart3'] = CommonFunc.getChartOption(series) ;
        },

        updateSectorChart: function(json_data,exchange,column,target,title) {            
            let data_major = CommonFunc.getChartData(json_data[exchange],'major',column,'trade_date',false,0);
            let data_korean = CommonFunc.getChartData(json_data[exchange],'korean',column,'trade_date',false,0);
            let data_chinese = CommonFunc.getChartData(json_data[exchange],'chinese',column,'trade_date',false,0);
            let data_defi = CommonFunc.getChartData(json_data[exchange],'defi',column,'trade_date',false,0);
            let data_nft = CommonFunc.getChartData(json_data[exchange],'nft',column,'trade_date',false,0);
            let data_misc = CommonFunc.getChartData(json_data[exchange],'misc',column,'trade_date',false,0);

            let series = [
                { name:this.$t('category.major'), type:'line', data: data_major.data},
                { name:this.$t('category.korean'), type:'line', data: data_korean.data},
                { name:this.$t('category.chinese'), type:'line', data: data_chinese.data},
                { name:this.$t('category.defi'), type:'line', data: data_defi.data},
                { name:this.$t('category.nft'), type:'line', data: data_nft.data},
                //{ name: 'misc',type: 'line', data: data_misc.data},
            ];

            this.g_chart['chart4'] = CommonFunc.getChartOption(series) ;
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
                { name:this.$t('category.major'), type:'line', data: data_major.data},
                { name:this.$t('category.korean'), type:'line', data: data_korean.data},
                { name:this.$t('category.chinese'), type:'line', data: data_chinese.data},
                { name:this.$t('category.defi'), type:'line', data: data_defi.data},
                { name:this.$t('category.nft'), type:'line', data: data_nft.data},
            ];
            
            //console.log('series=',series);
            let a_option = CommonFunc.getChartOption(series);
            
            //a_option.xAxis = {
            //    type: 'datetime', categories:categories
            //};
            //xAxis: { type: 'datetime' },                            
            a_option.yAxis = { title: {text:''} };
            a_option.plotOptions = {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
                    }
                }
            };

            this.g_chart['chart5'] = a_option;

/*
            this.g_chart[target].options = { 
                chart: {
                    zoomType: 'x'                                 
                },    
                title: { text:'' },
                xAxis: { type: 'datetime', categories:categories },                
                plotOptions: {
                },                
                tooltip: {
                    xDateFormat: '%Y/%m/%d',
                    shared: true,
                    split: false,
                    enabled: true
                },                
            };
            this.g_chart[target].series = series;
*/            
        },

        update: function(json_data) {
            logger.log.debug('CTrendChart.update : =',json_data);

            this.updateIndexChart(json_data,'Scaled Index Chart ');            
            this.updateDominanceChart(json_data,'Dominance Chart ')
            this.updateKpremiumChart(json_data,'Scaled Index Chart ');   

            this.updateSectorChart(json_data,'upbit','index_cumsum','chart4','Upbit Sector Chart');
            this.updateSectorTVChart(json_data,'upbit','index_tv','chart5','Upbit Sector TV Chart');
            
            //this.updateTickTrinChart(json_data,'Buying Power');
            //this.updateMarketPowerChart(json_data,'Market Power Chart');            
            //this.updateRSChart(json_data,category,category + ' Rank Chart');
        },

        onClickTab:function(exchange) {
            console.log('CTrendView.onClick - ',exchange);

            this.updateSectorChart(json_data,exchange,'index_cumsum','chart4','');
            this.updateSectorTVChart(json_data,exchange,'index_tv','chart5','');
        },

        onClickTimeframe: function(value) {
            console.log('CTrendView.onClickTimeframe - ',value);
            this.$parent.onClickTimeframe('trend',value);            
        },


    }
  }
</script>
