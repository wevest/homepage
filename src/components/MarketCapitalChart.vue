<template>
  <div class="example">
    <CTitle ttype='subtitle' title="Industry Chart" desc=""></CTitle> 
    <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>

    <CTitle ttype='subtitle' title="Investor Chart" desc=""></CTitle> 
    <highcharts class="hc" :options="g_chart['chart2']" ref="chart2"></highcharts>

    <CTitle ttype='subtitle' title="Industry Alpha & REturn Chart" desc=""></CTitle> 
    <highcharts class="hc" :options="g_chart['chart3']" ref="chart3"></highcharts>

  </div>

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';


export default {
    name: 'MarketCapitalChart',
    components: {
      CTitle
    },
    data: function () {
      return {
        g_height: "400",
        g_height_heatmap: "800",
        g_period: 350,
        g_columns: null,
        g_data: null,

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
        flatenArray: function(arr) {
            let values = [];
            arr.forEach(a_data => {
              //logger.log.debug("a_data=",a_data);
              values.push(a_data);
            });
            return values;
        },

        getData: function(json_data,column='', needles=[],is_float=true) {
            //logger.log.debug('updateChart : needle=',needle);
            
            //let data_point = [];
            let dic_data = {};
            let column_index = null;

            for (let a_asset in json_data) {                

                if ( (needles.length==0) || (needles.includes(a_asset)) ) {
                    let dic_columns = CommonFunc.getColumnDic(json_data[a_asset].columns,[],[]);
                    //console.log('dic_columns=',dic_columns);
                    column_index = dic_columns[column];
                    
                    let data_price = [];
                    json_data[a_asset].values.forEach(a_item => {
                        let a_value = a_item[column_index]; 

                        if (! is_float) {
                            a_value = parseInt(a_value);
                        }

                        let a_data = {x: CommonFunc.toTimestamp(a_item[0]), y:a_value}
                        data_price.push(a_data);
                    });    
                    
                    dic_data[a_asset] = data_price;
                }                
            }

            //logger.log.debug('Winnerchart.update : series=',series_data);
            
            return dic_data;
        },

        getDisparity: function(arr1,arr2) {
          //logger.log.debug('MarketCapitalChart.getDisparity : arr=',arr1,arr2);

          let items = [];
          for (var index=0;index<arr1[0].length;index++) {
            let a_item1 = arr1[0][index];
            let a_item2 = arr2[0][index];
            
            //console.log('a_item1=',a_item1),a_item2;

            //let a_value = CommonFunc.safeDivide(a_item1.y,a_item2.y)-1;
            let a_value = a_item1.y-a_item2.y;
            items.push( { x:a_item1.x, y:a_value });
          }

          return items;
        },

        loadSectorTrend: function(category,dates,excludes) 
        {
            const _this = this;

            //CommonFunc.getAppData('spinner').show();

            let a_data = CommonFunc.getAppData('dataMC');
            if (a_data) {
              this.g_data = a_data;
              if (category.length==0) {
                //CommonFunc.getAppData('spinner').hide();    
                return;
              }

              _this.update([category],dates,excludes);
              return;
            }

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                let a_start_date = CommonFunc.addDays(a_today, _this.g_period*-1 );
                let a_end_date = CommonFunc.addDays(a_today, 1 );

                let dic_param = {start_date:a_start_date, end_date:a_end_date};
                //logger.log.debug("MarketCapitalChart.loadSectorTrend - dic_param=",dic_param);

                APIService.getSectorMCTrendData(dic_param,function(response) {
                    _this.g_data = CommonFunc.setAppData('dataMC',response.data.data);
                    logger.log.debug("MarketCapitalChart.loadSectorTrend - response",response.data.data);
                    
                    if (category.length>0) {
                      _this.update([category],dates,excludes);
                    }
                    
                    //CommonFunc.getAppData('spinner').hide();
                    resolve();

                },function(err) {
                    logger.log.error("MarketCapitalChart.loadSectorTrend - error",err);
                    reject();
                });
            });
        },



        updateTrendChart: function(data_chart,needles,dates,excludes) {
            let dic_share = this.getData(data_chart.sectors,'share',needles);
            let dic_share_ema = this.getData(data_chart.sectors,'share_ema_20',needles);

            let dic_alpha = this.getData(data_chart.sectors,'alpha_acc',needles);
            let dic_alpha_ema = this.getData(data_chart.sectors,'alpha_acc_ema_20',needles);

            //let series_share = this.updateChart(data_chart,CommonFunc.addPostfix(needles,'_share'),dates,excludes); 
            logger.log.debug('marketCapitalChart.updateTrendChart : share = ',dic_share);
            //logger.log.debug('marketCapitalChart.updateTrendChart : value = ',CommonFunc.getKeyValue(dic_share).value);
            //let a_minmax_share = CommonFunc.getMinMaxInSeries(dic_share.data);

            let series = [];        
            for (var a_category in dic_share) {
              series.push ( { name: a_category+'_share', type: 'line', data: dic_share[a_category], yAxis:0 } );
              series.push ( { name: a_category+'_ewm', type: 'line', dashStyle:'Dash', data: dic_share_ema[a_category], yAxis:0} );
            
              //yaxis.push( {seriesName: a_category+'_share', show:true, forceNiceScale: false, opposite:false, min:a_minmax_share.min,max:a_minmax_share.max} ) ;
              //yaxis.push( {seriesName: a_category+'_share', show:false, forceNiceScale: false, opposite:false, min:a_minmax_share.min,max:a_minmax_share.max} ) ;
            }

            for (var a_category in dic_alpha) {
              series.push ( { name: a_category+'_alpha', type: 'line', data: dic_alpha[a_category], yAxis:1 } );
              series.push ( { name: a_category+'_alpha_ewm', type: 'line', dashStyle:'Dash', data: dic_alpha_ema[a_category], yAxis:1} );
            }

            this.g_chart['chart1'] = CommonFunc.getChartOption(series) ;
        },


        updateInvestorTrendChart: function(data_chart,needles,dates,excludes) {
            let dic_anet = this.getData(data_chart.sectors,'anet',needles);
            let dic_anet_ema = this.getData(data_chart.sectors,'anet_ema_20',needles);

            let dic_fnet = this.getData(data_chart.sectors,'fnet',needles);
            let dic_fnet_ema = this.getData(data_chart.sectors,'fnet_ema_20',needles);

            let dic_pnet = this.getData(data_chart.sectors,'pnet',needles);
            let dic_pnet_ema = this.getData(data_chart.sectors,'pnet_ema_20',needles);

            let series = [];                      
            for (var a_category in dic_anet) {
              series.push ( { name: a_category+'_anet', type: 'line', yAxis:0, data: dic_anet[a_category]} );
              series.push ( { name: a_category+'_anet_ewm', type: 'line', yAxis:0, dashStyle:'Dash', data: dic_anet_ema[a_category]} );
              series.push ( { name: a_category+'_fnet', type: 'line', yAxis:0, data: dic_fnet[a_category]} );
              series.push ( { name: a_category+'_fnet_ewm', type: 'line', yAxis:0, dashStyle:'Dash', data: dic_fnet_ema[a_category]} );
              series.push ( { name: a_category+'_pnet', type: 'line', yAxis:0, data: dic_pnet[a_category]} );
              series.push ( { name: a_category+'_pnet_ewm', type: 'line', yAxis:0, dashStyle:'Dash', data: dic_pnet_ema[a_category]} );
            }


            this.g_chart['chart2'] = CommonFunc.getChartOption(series) ;
        },

        updateReturnChart:function(data_chart,needles,dates,excludes) {
            let dic_alpha_up = this.getData(data_chart.sectors,'alpha_up',needles);
            let dic_alpha_up_ema = this.getData(data_chart.sectors,'alpha_up_ema_20',needles);

            let data_disparity = this.getDisparity(this.flatenArray(CommonFunc.getKeyValue(dic_alpha_up).value),this.flatenArray(CommonFunc.getKeyValue(dic_alpha_up_ema).value))
            //logger.log.debug('updateReturnChart : disparity=',data_disparity);

            let series = [
              { name: 'disparity', type: 'column', yAxis:0, data: data_disparity}
            ];

            for (var a_category in dic_alpha_up) {
              series.push ( { name: a_category+'_alpha_up', type: 'line', yAxis:1, data: dic_alpha_up[a_category]} );
              series.push ( { name: a_category+'_alpha_up_ewm', type: 'line', yAxis:1, dashStyle:'Dash', data: dic_alpha_up_ema[a_category]} );
            }

            //logger.log.debug('updateReturnChart : series=',series);

            this.g_chart['chart3'] = CommonFunc.getChartOption(series) ;
        },

        updateSector:function(needle,dates,excludes) {
          logger.log.debug('MarketCapitalChart.updateSector : dates=',dates);

            if (this.g_data) {
                this.update([needle],dates,excludes);
                return;
            }
            this.loadSectorTrend(needle,dates,excludes);
        },

        updateAll: function(data_chart) {
            const excludes = ['_anet','_fnet','_pnet'];
            this.updateTrendChart(data_chart,['share'],[],excludes);
            //this.updateInvestorTrendChart(data_chart,execludes,[],excludes);
            this.updateReturnChart(data_chart,['sret'],[],excludes);

            /*
            let series_share = this.updateChart(data_chart,['share'],[]); 
            this.series = series_share.series;

            let series_ret = this.updateChart(data_chart,['sret'],[]); 
            this.series2 = series_ret.series;
            */
        },

        update: function(needles,dates,excludes) {        
            let a_data = CommonFunc.getAppData('dataMC');
            if (a_data) {
              this.g_data = a_data;
            }

            //logger.log.debug('marketCapitalChart.update : data , needles =',this.g_data,needles);

            this.updateTrendChart(this.g_data,needles,dates,[]);
            this.updateInvestorTrendChart(this.g_data,needles,dates,[]);
            this.updateReturnChart(this.g_data,needles,dates,[]);

            //CommonFunc.getAppData('spinner').hide();
        },
    }
  }
</script>
