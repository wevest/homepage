<template>
  <div class="example">
    
    <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>
    
  </div>

</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import DataService from 'src/services/dataService';
import logger from "src/error/Logger";

import CTitle from 'src/components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';

export default {
    name: 'PortfolioChart',
    components: {
      CTitle,
      ChartTimeframe
    },
    data: function () {
      return {
        g_data: null,
        g_data_kvix: null,
        g_data_event: null,
        g_period: 350,
        
        
        g_title: {
          'title1': this.$t('chart.title.risk')
        },

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
        },         
      }
    },

    methods: {
       

        showEventChart: function(data) {
            let thresh_up = 2;
            let thresh_down = -2;
            const a_size = 10;
            const start_index = 0;

            let data_index = this.getEventData(data,'close',null,null,0,null,start_index);
            let data_krx = this.getEventData(data,'FOREIGN_krx_z',thresh_up,thresh_down,a_size,'#ff1493',start_index);
            let data_future = this.getEventData(data,'FOREIGN_future_z',thresh_up,thresh_down,a_size,'#1e90ff',start_index);            
            let data_call = this.getEventData(data,'FOREIGN_call_z',thresh_up,thresh_down,a_size,'#00ff00',start_index);
            let data_put = this.getEventData(data,'FOREIGN_put_z',thresh_up,thresh_down,a_size,'#8b0000',start_index);

            //let data_points = [].concat(data_future,data_krx,data_call,data_put);
            //console.log("showEventData : data_future =",data_future);

            //let a_minmax = CommonFunc.getMinMaxInSeries(data_index);

            let series = [
                { name: this.$t('chart.series.kospi') ,type: 'line', yAxis:0, data: data_index},
                { name: this.$t('chart.series.kospi_ret'),type: 'scatter', yAxis:0, data: data_krx, marker: {symbol:'circle', radius:8} },
                { name: this.$t('chart.series.future'),type: 'scatter', yAxis:0, data: data_future, marker: {symbol:'diamond', radius:8}},
                { name: this.$t('chart.series.call'),type: 'scatter', yAxis:0, data: data_call, marker: {symbol:'rectangle', radius:8}},
                { name: this.$t('chart.series.put'),type: 'scatter', yAxis:0, data: data_put, marker: {symbol:'triangle', radius:8}},
            ];

            this.g_chart['chart3'] = CommonFunc.getChartOption(series);          
        },


        update: function() {
            const _this = this;
        },

    }
  }
</script>