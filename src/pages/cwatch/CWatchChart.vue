<template>
    <div class="example">

        <div class="row">
            <q-input outlined v-model="g_field" label="Field" :dense="dense" />
            <q-input outlined v-model="g_thresh" label="Threshold" :dense="dense" />
            <q-btn color="primary" label="Refresh" @click='onClickRefresh' /> 
        </div>

        <CTitle ttype='subtitle' :title="$t('chart.home_scaled.title')" :desc="$t('chart.home_scaled.desc')"></CTitle>
        <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>
        
        <CTitle ttype='subtitle' :title="$t('chart.home_tick.title')" :desc="$t('chart.home_tick.desc')"></CTitle>        
        <highcharts class="hc" :options="g_chart['chart2']" ref="chart2"></highcharts>

    </div>

</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'src/components/CTitle';
import moment from 'moment-timezone';


export default {
    name: 'CWatchChart',
    components: {
        CTitle
    },
    data: function () {
        return {
            dense: true,
            
            g_data: null,
            g_period: 200,
            g_height: "500",
            
            g_thresh: 2, 
            g_field: 'z',

            g_chart: {
                'chart1': { series: [], },
                'chart2': { series: [], },
            },
        }
    },

    methods: {
        
        filterData: function(prices,series,thresh) {
            let items =[];
            for (let index=0;index<series.length;index++) {
                if (series[index].y>thresh) {
                    items.push( prices[index] );
                }
            }
            return items;
        },

        updateRiskChart: function(chart,json_data,symbol,field,thresh) {
            let data_price = CommonFunc.getChartData(json_data,symbol,'priceClose','utc_trade_date',false,0);
            let data_risk1 = CommonFunc.getChartData(json_data,symbol,'short_usd_'+field,'utc_trade_date',false,0);
            let data_risk2 = CommonFunc.getChartData(json_data,symbol,'long_usd_'+field,'utc_trade_date',false,0);

            let data_risk1_thresh = this.filterData(data_price.data,data_risk1.data,thresh);
            let data_risk2_thresh = this.filterData(data_price.data,data_risk2.data,thresh);
            
            //let a_minmax = CommonFunc.getMinMaxExt([data_kimchi.data]);

            let series = [
                { name: this.$t('name.price'),type: 'line', yAxis:0, data: data_price.data},
                { name: this.$t('name.short'),type: 'scatter', yAxis:0, data: data_risk1_thresh},
                { name: this.$t('name.long'),type: 'scatter', yAxis:0, data: data_risk2_thresh},
            ];

            //console.log("updateRiskChart : data_price=",data_price.data);

            let a_option = CommonFunc.getChartOption(series);
            //a_option.yAxis[1] = {mshow:true, opposite:true, gridLineWidth:0};
            this.g_chart[chart] = a_option;
        },

        updateIndexChart: function(json_data) {
            this.updateRiskChart('chart1',json_data,'BTC',this.g_field,this.g_thresh);
            this.updateRiskChart('chart2',json_data,'ETH',this.g_field,this.g_thresh);
        },


        update: function(json_data) {
            logger.log.debug('CWatchChart.update : =',json_data);

            this.g_data = json_data;
            this.updateIndexChart(json_data);            
        },

        onClickRefresh: function() {
            this.updateIndexChart(this.g_data);
        }
    }
  }
</script>
