<template>
    <div class="example">

        <div class="row q-pa-md">
<!--            
            <q-input outlined v-model="g_field" label="Field" :dense="dense" />
            <q-input outlined v-model="g_thresh" label="Threshold" :dense="dense" />
            <q-btn color="primary" label="Refresh" @click='onClickRefresh' /> 
-->
            <span>Change Probability Level</span>
            <q-slider
                v-model="g_thresh"
                :min="1"
                :max="10"
                :step="1"
                label label-always
                @change="onChangeProb"
                color="light-green" />
        </div>

        <CTitle ttype='subtitle' :title="$t('page.cwatch.btc.title')" :desc="$t('page.cwatch.btc.desc')"></CTitle>
        
        <highcharts class="hc box_chart" :options="g_chart['chart1']" ref="chart1"></highcharts>        

        <q-table
        title=""
        row-key="name"        
        :data="v_items.BTC"
        :columns="v_headers"
        :pagination.sync="v_pagination"
        :rows-per-page-options="[20]"
        >
            <template v-slot:body="props">

                <q-tr :props="props">
                    <q-td key="utc_trade_date" :props="props">{{ props.row.utc_trade_date }}</q-td>
                    <q-td key="index" :props="props">{{ Number(props.row.index).toLocaleString() }}</q-td>
                    <q-td key="fall" :props="props">{{ Number(props.row.fall).toLocaleString() }}</q-td>
                    <q-td key="rise" :props="props">{{ Number(props.row.rise).toLocaleString() }}</q-td>
                    <q-td key="fall_prob" :props="props">{{ Number(props.row.fall_prob).toLocaleString() }}</q-td>
                    <q-td key="rise_prob" :props="props">{{ Number(props.row.rise_prob).toLocaleString() }}</q-td>
                </q-tr>            

            </template>

        </q-table>

        <CTitle ttype='subtitle' :title="$t('page.cwatch.eth.title')" :desc="$t('page.cwatch.eth.desc')"></CTitle>
        <highcharts class="hc box_chart" :options="g_chart['chart2']" ref="chart2"></highcharts>

        <q-table
        title=""
        row-key="name"        
        :data="v_items.ETH"
        :columns="v_headers"
        :pagination.sync="v_pagination"
        :rows-per-page-options="[20]"
        >
            <template v-slot:body="props">

                <q-tr :props="props">
                    <q-td key="utc_trade_date" :props="props">{{ props.row.utc_trade_date }}</q-td>
                    <q-td key="index" :props="props">{{ Number(props.row.index).toLocaleString() }}</q-td>
                    <q-td key="fall" :props="props">{{ Number(props.row.fall).toLocaleString() }}</q-td>
                    <q-td key="rise" :props="props">{{ Number(props.row.rise).toLocaleString() }}</q-td>
                    <q-td key="fall_prob" :props="props">{{ Number(props.row.fall_prob).toLocaleString() }}</q-td>
                    <q-td key="rise_prob" :props="props">{{ Number(props.row.rise_prob).toLocaleString() }}</q-td>
                </q-tr>            

            </template>

        </q-table>

<!--
        <CTitle ttype='subtitle' :title="$t('chart.home_tick.title')" :desc="$t('chart.home_tick.desc')"></CTitle>
        <highcharts class="hc box_chart" :options="g_chart['chart3']" ref="chart3"></highcharts>
-->
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
            
            g_thresh: 5, 

            g_chart: {
                'chart1': { series: [], },
                'chart2': { series: [], },
                'chart3': { series: [], },
            },

            v_headers: [
                { name:'utc_trade_date', label: '시간', field: 'utc_trade_date', align:'left', required:true, sortable:true  },
                { name:'index', label: this.$t('name.index'), field: 'index', sortable:true},
                { name:'fall', label: this.$t('name.fall'), field: 'fall', sortable:true},
                { name:'rise', label: this.$t('name.rise'), field: 'rise', sortable:true},
                { name:'fall_prob', label: this.$t('name.rise_prob'), field: 'fall_prob', sortable:true},
                { name:'rise_prob', label: this.$t('name.fall_prob'), field: 'rise_prob', sortable:true},
            ],
            v_pagination: {
                sortBy: 'utc_trade_date',
                descending: true,
            },
            v_items: {BTC: [], ETH:[]},
        }
    },

    methods: {
        
        filterData: function(prices,series,thresh) {
            let items =[];
            for (let index=0;index<series.length;index++) {
                if (Math.abs(series[index].y)>thresh) {
                    items.push( prices[index] );
                }
            }
            return items;
        },

        getProbThresh: function() {
            let a_thresh = (90+this.g_thresh)/100;
            return a_thresh;
        },

        updateRiskTable: function(json_data,symbol) {
            let dic_column = CommonFunc.getColumnDic( json_data[symbol].columns ,[],[]);

            let items = [];            
            for (let index=0;index<json_data[symbol].values.length;index++) {
                
                let a_item = {
                    utc_trade_date: CommonFunc.safeGetJsonValue(json_data[symbol].values,index,dic_column['utc_trade_date']),
                    index: CommonFunc.safeGetJsonValue(json_data[symbol].values,index,dic_column['priceClose']),
                    fall: CommonFunc.safeGetJsonValue(json_data[symbol].values,index,dic_column['fall']),
                    rise: CommonFunc.safeGetJsonValue(json_data[symbol].values,index,dic_column['rise']),
                    fall_prob: CommonFunc.safeGetJsonValue(json_data[symbol].values,index,dic_column['fall_prob']),
                    rise_prob: CommonFunc.safeGetJsonValue(json_data[symbol].values,index,dic_column['rise_prob']),
                };
                items.push(a_item);
            }
            //logger.log.debug('updateRiskTable.items=',symbol,items);
            this.v_items[symbol] = items;
        },

        updateRiskChart: function(chart,json_data,symbol) {

            let thresh = this.getProbThresh();

            let data_price = CommonFunc.getChartData(json_data,symbol,'priceClose','utc_trade_date',false,0);
            let data_risk1 = CommonFunc.getChartData(json_data,symbol,'fall_prob','utc_trade_date',false,0);
            let data_risk2 = CommonFunc.getChartData(json_data,symbol,'rise_prob','utc_trade_date',false,0);

            let data_risk1_thresh = this.filterData(data_price.data,data_risk1.data,thresh);
            let data_risk2_thresh = this.filterData(data_price.data,data_risk2.data,thresh);
            
            //let a_minmax = CommonFunc.getMinMaxExt([data_kimchi.data]);
            //console.log("updateRiskChart.thresh=",thresh);

            let series = [
                { name: this.$t('name.price'),type: 'line', yAxis:0, data: data_price.data},
                { name: this.$t('name.rise'),type: 'scatter', yAxis:0, data: data_risk1_thresh},
                { name: this.$t('name.fall'),type: 'scatter', yAxis:0, data: data_risk2_thresh},
            ];

            //console.log("updateRiskChart : data_price=",data_price.data);

            let a_option = CommonFunc.getChartOption(series);
            //a_option.yAxis[1] = {mshow:true, opposite:true, gridLineWidth:0};
            this.g_chart[chart] = a_option;
        },

        updateIndexChart: function(json_data) {
            this.updateRiskChart('chart1',json_data,'BTC');
            this.updateRiskChart('chart2',json_data,'ETH');
        },

        updateOracleChart: function(json_data,freq) {
            let data_long = CommonFunc.getChartData(json_data,freq,'long_count','utctime',false,0);
            let data_short = CommonFunc.getChartData(json_data,freq,'short_count','utctime',false,0);
            
            //let a_minmax = CommonFunc.getMinMaxExt([data_kimchi.data]);

            let series = [
                { name: this.$t('name.short'),type: 'scatter', yAxis:0, data: data_short.data},
                { name: this.$t('name.long'),type: 'scatter', yAxis:0, data: data_long.data},
            ];

            console.log("updateOracleChart : data_price=",data_long.data);

            let a_option = CommonFunc.getChartOption(series);
            //a_option.yAxis[1] = {mshow:true, opposite:true, gridLineWidth:0};
            this.g_chart['chart3'] = a_option;
        },

        update: function(json_data) {
            logger.log.debug('CWatchChart.update : =',json_data);

            this.g_data = json_data;
            this.updateIndexChart(this.g_data);    
            this.updateRiskTable(this.g_data,'BTC');
            this.updateRiskTable(this.g_data,'ETH');
        },

        updateOracle: function(json_data) {
            logger.log.debug('CWatchChart.updateOracle : =',json_data);

            this.g_data_oracle = json_data;
            this.updateOracleChart(json_data,'1H');
        },


        onClickRefresh: function() {
            this.updateIndexChart(this.g_data);
        },

        onChangeProb: function(value) {
            logger.log.debug('CWatchChart.onChangeProb : =',value);            
            this.updateIndexChart(this.g_data);
        }
    }
  }
</script>
