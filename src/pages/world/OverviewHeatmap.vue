<template>
  <div class="example">
    <highcharts height="500" class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>
  </div>
</template>

<script>
//import VueApexCharts from 'vue-apexcharts';
import CommonFunc from 'src/util/CommonFunc';
import DataService from 'src/services/dataService';


export default {
    name: 'OverviewHeatmap',
    components: {
        'apexchart': VueApexCharts
    },
    data: function () {
        return {
            g_chart: {
                'chart1': {
                    series: [],
                }
            }
        }
    },

    methods: {

        getChartOption: function(yaxis,series) {
            let a_option = {
                chart: {
                    type: 'heatmap',
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
                colorAxis: {
                    stops: [
                        [0, '#3060cf'],
                        [0.5, '#fffbbc'],
                        [0.9, '#c4463a'],
                        [1, '#c4463a']
                    ],
                    min: -15,
                    max: 25,
                    startOnTick: false,
                    endOnTick: false,
                    labels: {
                        format: '{value}℃'
                    }
                },                
                series: series
            }
            return a_option;
        },

        extractColumnValue: function(data,index,dtype) {
            var values = [];
            for (var row_index=0; row_index<data.length; row_index++) {
                if (dtype==0) {
                    values.push( data[row_index][index] );
                } else {
                values.push( CommonFunc.formatNumber(data[row_index][index],3) );
                }
                
            }
            return values;
        },

        update: function(data) {
    
            //var new_data = CommonFunc.sortArray(data,'yymm','a');
            //console.log('overviewHeatmap.update = ',data);
            
            let yymms = this.extractColumnValue(data.asset['NYSE'].values,5,0);
            //console.log('overviewHeatmap.yymms = ',yymms);
            /*
            this.chartOptions = {
                xaxis: {
                    categories: yymms
                }
            };
            */
            let series = [];
            for (var a_asset in data.asset) {
                //console.log('a_asset=',a_asset);
                
                let data_point = [];
                for (var row_index=0; row_index<data.asset[a_asset].values.length; row_index++) {
                    data_point.push( {x: data.asset[a_asset].values[row_index][5], y: CommonFunc.formatNumber(data.asset[a_asset].values[row_index][6],2) } );
                }
                var a_item = { 'name' : a_asset, data: data_point };
                series.push(a_item);
            };

            this.series = series;

        },

    }
  }
</script>
