<template>

    <div class="example">
        <CTitle ttype='subtitle' title="Instrument" desc=""></CTitle> 
        <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>

        <CTitle ttype='subtitle' title="Instrument Volume" desc=""></CTitle> 
        <highcharts class="hc" :options="g_chart['chart_volume']" ref="chart_volume"></highcharts>

        <CTitle ttype='subtitle' title="Instrument Investor" desc=""></CTitle> 
        <highcharts class="hc" :options="g_chart['chart2']" ref="chart2"></highcharts>

        <CTitle ttype='subtitle' title="Instrument Return" desc=""></CTitle> 
        <highcharts class="hc" :options="g_chart['chart3']" ref="chart3"></highcharts>


    </div>

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';



export default {
    name: 'WinnerChart',
    components: {
        CTitle
    },
    data: function () {
        return {
            g_data: null,
            g_period: 350,
            g_height: "500",

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
                'chart_volume': {
                    series: [],                  
                },
            },
       
        }
    },

    methods: {
        getData: function(json_data,column='', needle='',dates=[],is_float=true) {
            //logger.log.debug('updateChart : needle=',needle);
            
            let data_point = [];
            let data_price = [];
            let asset_index = 0;
            let column_index = null;

            for (let a_asset in json_data) {
                if (! column_index) {
                    let dic_columns = CommonFunc.getColumnDic(json_data[a_asset].columns,[],[]);
                    //console.log('dic_columns=',dic_columns);
                    column_index = dic_columns[column];
                }
                

                if ( (needle.length==0) || (a_asset.indexOf(needle)>-1) ) {
                    json_data[a_asset].values.forEach(a_item => {
                        let a_value = a_item[column_index]; 

                        if (! is_float) {
                            a_value = parseInt(a_value);
                        }

                        if (asset_index==0) {
                            if (dates.includes(a_item[0])) {
                                data_point.push( {x:CommonFunc.toTimestamp(a_item[0]), y:a_value, marker: { size:8 } } );
                            }
                        }

                        let a_data = {x: CommonFunc.toTimestamp(a_item[0]), y:a_value}
                        data_price.push(a_data);
                    });    
                    
                    asset_index += 1;
                }                
            }
            
            //let a_data = data_price[data_price.length-1];
            //data_price.push( {x: CommonFunc.addDays(a_data.x,1,true), y:a_data.y} )

            return {data:data_price, points:data_point};
        },
        
        updateChart: function(json_data,column_index=5, needle=[],ctype='line',market_ctype='area',include_market=true,dates=[],is_float=true) {
            //logger.log.debug('updateChart : needle=',needle);
            
            let data_point = [];
            let series_data = [];
            let yaxis = [];
            let asset_index = 0;

            for (let a_asset in json_data.asset) {
                if ( (needle.length==0) || (needle.includes(a_asset)) ) {
                    
                    column_index.forEach( a_column_index => {
                        let data_price = [];
                        json_data.asset[a_asset].values.forEach(a_item => {
                            let a_value = a_item[a_column_index]; 

                            if (! is_float) {
                                a_value = parseInt(a_value);
                            }

                            if (asset_index==0) {
                                if (dates.includes(a_item[0])) {
                                    data_point.push( {x:CommonFunc.toTimestamp(a_item[0]), y:a_value, marker: { size:8 } } );
                                }
                            }

                            let a_data = {x: CommonFunc.toTimestamp(a_item[0]), y:a_value}
                            data_price.push(a_data);
                        });

                    });
                    
                    let a_minmax = CommonFunc.getMinMaxInSeries(data_price);
                    yaxis.push( {seriesName: CommonFunc.getCode(a_asset).name, forceNiceScale: false, opposite:false, min:a_minmax.min,max:a_minmax.max} ) ;
                    
                    series_data.push( { name: CommonFunc.getCode(a_asset).name, type: ctype,data: data_price} );                    

                    asset_index += 1;
                }                
            }

            if (include_market) {
                let data_index = [];
                let column_index_market = column_index;
                if (column_index>5) {
                    column_index_market = 2;
                }
                json_data.index.values.forEach(item => {
                    let a_data = {x: CommonFunc.toTimestamp(item[0]), y:item[column_index_market]}
                    //console.log('a_data=',a_data);
                    data_index.push(a_data);
                });
                
                let a_minmax = CommonFunc.getMinMaxInSeries(data_index);
                yaxis.push( {seriesName: 'market', forceNiceScale: false, opposite:true, show:false, min:a_minmax.min,max:a_minmax.max} ) ;
                
                series_data.push( { name: 'market',type: market_ctype,data: data_index} );
            }
            //logger.log.debug('Winnerchart.update : series=',series_data);
            
            return {series:series_data, yaxis:yaxis ,points:data_point};
        },
        

        updateAlphaChart: function(json_data,dates,name) {
            
            let data_price = this.getData(json_data.asset,'close','',dates,true);
            let data_price_ema = this.getData(json_data.asset,'close_ema_20','',dates,true);
            let data_index = this.getData(json_data.index,'close','U001',dates,true);

            let series = [
                { name: 'instrument',type: 'line', yAxis:0, data: data_price.data},
                { name: 'ema',type: 'line', yAxis:0, dashStyle:'Dash', data: data_price_ema.data},
                { name: 'market',type: 'line', yAxis:1, data: data_index.data},
            ];


            this.g_chart['chart1'] = CommonFunc.getChartOption(series) ;
        },

        updateInvestorChart: function(json_data,dates,name) {
            let data_anet = this.getData(json_data.asset,'agency_net','',dates,true);
            let data_anet_ema = this.getData(json_data.asset,'agency_net_ema_20','',dates,true);

            let data_fnet = this.getData(json_data.asset,'foreign_net','',dates,true);
            let data_fnet_ema = this.getData(json_data.asset,'foreign_net_ema_20','',dates,true);

            let data_pnet = this.getData(json_data.asset,'person_net','',dates,true);
            let data_pnet_ema = this.getData(json_data.asset,'person_net_ema_20','',dates,true);

            let data_gnet = this.getData(json_data.asset,'gov_net','',dates,true);
            let data_gnet_ema = this.getData(json_data.asset,'gov_net_ema_20','',dates,true);

            let data_index = this.getData(json_data.index,'close','U001',dates,true);

            let series = [
                { name: 'anet',type: 'line', yAxis:0, data: data_anet.data},
                { name: 'anet_ema',type: 'line', yAxis:0, dashStyle:'Dash', data: data_anet_ema.data},
                { name: 'fnet',type: 'line', yAxis:0, data: data_fnet.data},
                { name: 'fnet_ema',type: 'line', yAxis:0, dashStyle:'Dash', data: data_fnet_ema.data},
                { name: 'pnet',type: 'line', yAxis:0, data: data_pnet.data},
                { name: 'pnet_ema',type: 'line', yAxis:0, dashStyle:'Dash', data: data_pnet_ema.data},
                { name: 'gnet',type: 'line', yAxis:0, data: data_gnet.data},
                { name: 'market',type: 'line', yAxis:1, data: data_index.data},
            ];

            this.g_chart['chart2'] = CommonFunc.getChartOption(series) ;            
        },

        updateReturnChart: function(json_data,dates,name) {
            let data_price = this.getData(json_data.asset,'close_ret','',dates,true);
            let data_index = this.getData(json_data.index,'close_ret','U001',dates,true);
            let data_alpha = this.getData(json_data.asset,'alpha','',dates,true);
            let data_alpha_ema = this.getData(json_data.asset,'alpha_ema_20','',dates,true);

            let series = [
                { name: 'instrument',type: 'bar', yAxis:0, data: data_price.data},
                { name: 'market',type: 'bar', yAxis:0, data: data_index.data},
                { name: 'alpha',type: 'line', yAxis:1, data: data_alpha.data},
                { name: 'alpha_ema',type: 'line', yAxis:1, dashStyle:'Dash', data: data_alpha_ema.data},
            ];

            this.g_chart['chart3'] = CommonFunc.getChartOption(series);
        },

        updateVolumeChart: function(json_data,dates,name) { 
            let data_price = this.getData(json_data.asset,'volume','',dates,true);
            let data_index = this.getData(json_data.asset,'volume_ema_20','',dates,true);

            let series = [
                { name: 'instrument',type: 'bar', yAxis:0, data: data_price.data},
                { name: 'ema',type: 'line', yAxis:0, data: data_index.data},
            ];
            
            this.g_chart['chart_volume'] = CommonFunc.getChartOption(series,null,300);
        },

        updateAll: function(json_data,dates,name) {
            //let series_acc = this.updateChart(json_data,2,[],'line','line',true,dates);
            this.updateAlphaChart(json_data,dates,name);
            this.updateInvestorChart(json_data,dates,name);
            this.updateReturnChart(json_data,dates,name);
            this.updateVolumeChart(json_data,dates,name);
            
            //CommonFunc.getAppData('spinner').hide();
        },

        update: function(asset,name,dates) {
            const _this = this;

            let a_today = CommonFunc.getToday(false);
            let a_start_date = CommonFunc.addDays(a_today, _this.g_period*-1 );
            let a_end_date = CommonFunc.addDays(a_today, 1 );

            let dic_param = {'start_date':a_start_date,'asset':asset,'index':'U001', 'scale':'0'};
            //console.log("dic_param=",dic_param);

            APIService.getPrice(dic_param,function(response) {
                _this.g_data = response.data.data;

                logger.log.debug("WinnerChart.update - response",_this.g_data);
                _this.updateAll(_this.g_data,dates,name);

            },function(err) {
                logger.log.error("InstrumentView.showChart - error",err);
            });

        }
    }
  }
</script>
