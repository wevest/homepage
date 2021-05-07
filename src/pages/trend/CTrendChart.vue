<template>
    <div class="example">     
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
        },

        update: function(json_data) {
            logger.log.debug('CTrendChart.update : =',json_data);

            this.updateIndexChart(json_data,'Scaled Index Chart ');            
            this.updateDominanceChart(json_data,'Dominance Chart ')
            this.updateKpremiumChart(json_data,'Scaled Index Chart ');   

            this.updateSectorChart(json_data,'upbit','index_cumsum','chart4','Upbit Sector Chart');
            this.updateSectorTVChart(json_data,'upbit','index_tv','chart5','Upbit Sector TV Chart');            
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
