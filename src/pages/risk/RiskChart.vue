<template>
  <div class="example">
    
    <CTitle ttype='subtitle' :title="$t('page.risk.chart.risk.title')" :desc="$t('page.risk.chart.risk.desc')"></CTitle>    
    <ChartTimeframe period='yearly' :onclick="onClickTimeframeRisk" selected='y3'></ChartTimeframe>
    <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>
    
    <CTitle ttype='subtitle' :title="$t('page.risk.chart.risk_vix.title')" :desc="$t('page.risk.chart.risk_vix.desc')"></CTitle>    
    <ChartTimeframe period='monthly' :onclick="onClickTimeframeVix" selected='y1'></ChartTimeframe>
    <highcharts class="hc" :options="g_chart['chart2']" ref="chart2"></highcharts>
    
    <CTitle ttype='subtitle' :title="$t('page.risk.chart.risk_event.title')" :desc="$t('page.risk.chart.risk_event.desc')"></CTitle>
    <ChartTimeframe period='monthly' :onclick="onClickTimeframeEvent" selected='y1'></ChartTimeframe>
    <highcharts class="hc" :options="g_chart['chart3']" ref="chart3"></highcharts>
  </div>

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
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
       
        loadMarketEvent: function(ioffset=360) 
        {
            const _this = this;

            return new Promise(function(resolve,reject) {
              let a_today = CommonFunc.getToday(false);
              let a_start_date = CommonFunc.addDays(a_today, ioffset*-1 );
              let a_end_date = CommonFunc.addDays(a_today, 1 );
              
              let dic_param = {start_date:a_start_date, end_date:a_end_date};
              logger.log.debug("RiskChart.loadMarketEvent - dic_param=",dic_param);

              APIService.getMarketEventData(dic_param,function(response) {                  
                  _this.g_data_event = response.data.data;
                  logger.log.debug("RiskChart.loadMarketEvent - response",_this.g_data_event);
                  //CommonFunc.setAppData('chartEvent',_this.g_data);
                  _this.showEventChart(_this.g_data_event);

                  resolve();
              },function(err) {
                  logger.log.error("RiskChart.loadMarketEvent - error",err);
                  reject();
              });
            });
        },


        loadMarketRisk: function(ioffset=720) 
        {
            const _this = this;

            return new Promise(function(resolve,rejec) {
              let a_today = CommonFunc.getToday(false);
              let a_start_date = CommonFunc.addDays(a_today, ioffset*-1 );
              let a_end_date = CommonFunc.addDays(a_today, 1 );
              
              let dic_param = {start_date:a_start_date, end_date:a_end_date};
              logger.log.debug("RiskChart.loadMarketRisk - dic_param=",dic_param);

              APIService.getMarketRiskData(dic_param,function(response) {
                  logger.log.debug("RiskChart.loadMarketRisk - response",response.data.data);
                  //_this.g_data = CommonFunc.setAppData('chartRisk',response.data.data.list);
                  _this.g_data = response.data.data;
                  _this.showRiskChart(_this.g_data);
                  _this.$emit('notify','crisis',_this.g_data);
                  resolve();
              },function(err) {
                  logger.log.error("RiskChart.loadMarketRisk - error",err);
                  reject();
              });
            });
        },

        loadKvixData: function(ioffset=360) 
        {
            const _this = this;

            return new Promise(function(resolve,reject) {
              let a_today = CommonFunc.getToday(false);
              let a_start_date = CommonFunc.addDays(a_today, ioffset*-1 );
              let a_end_date = CommonFunc.addDays(a_today, 1 );
              
              let dic_param = {start_date:a_start_date, end_date:a_end_date};
              logger.log.debug("RiskChart.loadKvixData - dic_param=",dic_param);

              APIService.getKvixData(dic_param,function(response) {                  
                  _this.g_data_kvix = response.data.data;
                  logger.log.debug("RiskChart.loadKvixData - response",_this.g_data_kvix);
                  //CommonFunc.setAppData('kvixData',_this.g_data_kvix);
                  _this.showKvixChart(_this.g_data_kvix);
                  _this.$emit('notify','vix',_this.g_data_kvix);
                  resolve();
              },function(err) {
                  logger.log.error("RiskChart.loadKvixData - error",err);
                  reject();
              });
            });
        },

        getEventData: function(data,column,thresh_up,thresh_down,a_size,a_color,start_index=200) {
          //logger.log.debug("RiskChart.getEventData - data=",data);

          let dic_columns = CommonFunc.getColumnDic(data.market.columns,[],[]);
          //let a_size = 10;

          let data_price = [];
          //let loop_index = 0;

          //data.market.values.forEach(item => {
          for(var index=0; index<data.market.values.length; index++) {
            //let a_data = null;
            if (start_index>index) {
              continue;
            }

            let item = data.market.values[index];
            let a_data = null;
            let a_value = item[dic_columns[column]];            
            let a_index_value = item[dic_columns['close']];            

            if ( (thresh_up==null) & (thresh_down==null) ) {
              a_data = {x: CommonFunc.toTimestamp(item[dic_columns['date']]), y:a_value};
              data_price.push(a_data);            
            } else {
              if (a_value>thresh_up) {
                a_data = {x: CommonFunc.toTimestamp(item[dic_columns['date']]), y:a_index_value}
                data_price.push(a_data);                              
              }
              
              if (a_value<thresh_down) {                
                a_data = {x: CommonFunc.toTimestamp(item[dic_columns['date']]), y:a_index_value}
                data_price.push(a_data);            
              }
              
            }

            if ((index+1)==data.market.values.length) {
              //data_price.push(a_data);
              //console.log("item=",item[dic_columns['date']],item);
            }

          };

          return data_price;
        },

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

        showKvixChart: function(data) {
          logger.log.debug('showKvixChart : data = ',data);

            const a_size = 6;
            const start_index = 0;

            let data_kospi = CommonFunc.getChartData(data,'U001','close','date',false,0);
            let data_kvix = CommonFunc.getChartData(data,'U545','close','date',false,0);
            let data_kvix_ema = CommonFunc.getChartData(data,'U545','close_ema','date',false,0);
            let data_kvix_z = CommonFunc.getChartData(data,'U545','close_z','date',false,0);
            let data_vix = CommonFunc.getChartData(data,'vix','close','date',false,0);

            console.log("showKvixChart : data_vix =",data_vix.data);            

            let series = [
                { name: this.$t('chart.series.kospi') ,type: 'line', lineWidth:3, yAxis:0, data: data_kospi.data},
                { name: this.$t('chart.series.vix') ,type: 'line', yAxis:1, color:'#cc0000', lineWidth:2, data: data_vix.data},
                { name: this.$t('chart.series.kvix'),type: 'line', yAxis:1, color:'black', data: data_kvix.data},
                { name: this.$t('chart.series.kvix_ema'),type: 'line', yAxis:1, dashStyle:'Dash', color:'blue', data: data_kvix_ema.data},
            ];

            this.g_chart['chart2'] = CommonFunc.getChartOption(series);
        },


        showRiskChart: function(data) {
          console.log('RiskChart.showChart=',data);

          let data_vix = CommonFunc.getChartData(data,'vix','close','date',false,0);
          //let data_test = CommonFunc.getChartData(data,'risk','close_vol','mydate',false,2);
          //console.log('data_test=',data_test);

            //let categories = [];
          let data_crisis = DataService.getCrisisData(data);
          
            let series = [
                { name: this.$t('chart.series.kospi') ,type: 'line', yAxis:0, data: data_crisis.price},
                { name: this.$t('chart.series.kospi_risk') ,type: 'scatter', yAxis:0, data: data_crisis.point},
                { name: this.$t('chart.series.vix') ,type: 'line', color:'#cc0000', yAxis:1, data: data_vix.data},
            ];

            let a_option = CommonFunc.getChartOption(series);
            a_option.plotOptions = {
              scatter: {
                  marker: {
                      symbol: "circle",
                      radius: 8,
                      states: {
                          hover: {
                              enabled: true,
                              lineColor: 'rgb(100,100,100)'
                          }
                      }
                  },
              }
            };
            
            console.log('a_option=',a_option);
            this.g_chart['chart1'] = a_option;
        },

        update: function() {
            const _this = this;

            return new Promise(function(resolve,reject) {
                _this.loadMarketRisk();
                _this.loadKvixData();                
                _this.loadMarketEvent();
                resolve();
            });
        },

        onClickTimeframeRisk: function(ioffset,timeframe) {
          console.log('onClickTimeframeRisk=',ioffset);
          this.loadMarketRisk(ioffset);
        },

        onClickTimeframeVix: function(ioffset,timeframe) {
          this.loadKvixData(ioffset);     
        },

        onClickTimeframeEvent: function(ioffset,timeframe) {
          console.log('onClickTimeframeEvent=',ioffset);          
          this.loadMarketEvent(ioffset);     
        }


    }
  }
</script>