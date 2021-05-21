<template>

  <div class="example">
<!--
        <CTitle :title="g_title['title2']"></CTitle>
        <highcharts class="hc" :options="g_chart['chart2']" ref="chart2"></highcharts>        
-->
        <CTitle ttype="subtitle" :title="$t('chart.world_return.title')" :desc="$t('chart.world_return.desc')"></CTitle>
<!--
        <ChartTimeframe :onclick="onClickTimeframe" selected='y1' period='yearly'></ChartTimeframe>
-->        
        <q-skeleton v-if="!v_chart_loaded" height="450px" square animation="fade" />
        <highcharts v-show="v_chart_loaded" class="box_chart" :options="g_chart['chart3']" ref="chart3"></highcharts>        

        <CTitle ttype="subtitle" :title="$t('chart.world_scaled.title')" :desc="$t('chart.world_scaled.desc')"></CTitle>
        <ChartTimeframe period='yearly' :onclick="onClickTimeframe" :selected='g_timeframe'></ChartTimeframe>
        <highcharts height="500" class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>


        <div class="row">
            <div class="col">
                <CTitle ttype="subtitle" :title="$t('chart.world_asset_price.title')" :desc="$t('chart.world_asset_price.desc')"></CTitle>

                <q-tabs v-model="tab" class="text-grey tab_bgcolor" active-color="primary" indicated-color="primary" align="justify">
                <q-tab name="btc" :label="$t('name.btc')" @click="onClickTab('btc')" />
                <q-tab name="nyse" :label="$t('name.nyse')" @click="onClickTab('nyse')" />
                <q-tab name="gold" :label="$t('name.gold')" @click="onClickTab('gold')" />
                <q-tab name="wti" :label="$t('name.wti')" @click="onClickTab('wti')" />          
                <q-tab name="bond" :label="$t('name.bond')"  @click="onClickTab('bond')" />
                <q-tab name="usd" :label="$t('name.usd')"  @click="onClickTab('usd')" />
                </q-tabs>
            </div>
        </div>
                
<!--
        <ChartTimeframe period='yearly' :onclick="onClickTimeframe" :selected='g_timeframe'></ChartTimeframe>
-->        
        <q-skeleton v-if="!v_chart_loaded" height="450px" square animation="fade" />
        <highcharts v-show="v_chart_loaded" height="500" class="box_chart" :options="g_chart['chart4']" ref="chart4"></highcharts>
  </div>

</template>

<script>
//import VueApexCharts from 'vue-apexcharts';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";
//import MoaBackendAPI from 'src/services/apiService';
import CTitle from 'src/components/CTitle';
import CSubtitle from 'src/components/CSubtitle';
import ChartTimeframe from 'components/ChartTimeframe';

export default {
    name: 'OverviewScaledChart',
    components: {
        CTitle,
        CSubtitle,
        ChartTimeframe
    },
    data: function () {
        return {
            g_data: null,
            g_period: 350,
            
            tab: 'btc',
            g_timeframe: 'y1',

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

            v_chart_loaded: false,
        }        
    },


    methods: {
        updateAssetChart: function(json_data,asset,column='close') {
            let data_asset = CommonFunc.getChartData(json_data.asset,asset,column,'time',false,0);
            let data_upper = CommonFunc.getChartData(json_data.asset,asset,'upper','time',false,0);
            let data_lower = CommonFunc.getChartData(json_data.asset,asset,'lower','time',false,0);
            let data_mid = CommonFunc.getChartData(json_data.asset,asset,'mid','time',false,0);
            let data_volume = CommonFunc.getChartData(json_data.asset,asset,'volume','time',false,0);

            //let data_asset = CommonFunc.getOHCLVData(json_data.asset,asset,'time',['open','high','low','close']);

            let series = [
                { name: this.$t('name.'+asset) ,type: 'line', yAxis:0, data: data_asset.data},
                { name: this.$t('name.bb_upper') ,type: 'line', dashStyle:'Dash', marker:{enabled:false}, yAxis:0, data: data_upper.data},
                { name: this.$t('name.bb_lower') ,type: 'line', dashStyle:'Dash', marker:{enabled:false}, yAxis:0, data: data_lower.data},
                { name: this.$t('name.bb_mid') ,type: 'line', dashStyle:'Dash', marker:{enabled:false}, yAxis:0, data: data_mid.data},
            ];

            if (['btc','wti'].includes(asset)) {
                series.push( { name: this.$t('name.volume') ,type: 'area', opacity:0.2, fillOpacity:1, yAxis:1, marker:{enabled:false}, data: data_volume.data} );
            }
            //console.log("data_asset=",data_asset);

           this.g_chart['chart4'] = CommonFunc.getChartOption(series) ;
        },

        updateOverviewChart: function(json_data) {
            let data_btc = CommonFunc.getChartData(json_data.asset,'btc','scaled','time',false,0);
            let data_nyse = CommonFunc.getChartData(json_data.asset,'nyse','scaled','time',false,0);
            let data_gold = CommonFunc.getChartData(json_data.asset,'gold','scaled','time',false,0);
            let data_wti = CommonFunc.getChartData(json_data.asset,'wti','scaled','time',false,0);
            let data_bond = CommonFunc.getChartData(json_data.asset,'bond','scaled','time',false,0);
            let data_usd = CommonFunc.getChartData(json_data.asset,'usd','scaled','time',false,0);

            let events = {};
            const assets = ['nyse','btc','gold','wti','gold','bond','usd'];
            for (let index in assets) {
                //console.log('asset=',assets[index]);
                events[assets[index]] = CommonFunc.getBBEventData(json_data.asset,assets[index],'scaled','time',['close','upper','lower']);
            }
            console.log("data_btc=",events['btc'],events['nyse']);

            let series = [
                { name: this.$t('name.btc') ,type: 'line', yAxis:0, marker:{enabled:false}, data: data_btc.data},
                { name: this.$t('name.nyse'),type: 'line', yAxis:0, marker:{enabled:false}, data: data_nyse.data},
                { name: this.$t('name.usd'),type: 'line', yAxis:0, marker:{enabled:false}, data: data_usd.data},
                { name: this.$t('name.gold'),type: 'line', yAxis:0, marker:{enabled:false}, data: data_gold.data },
                { name: this.$t('name.wti'),type: 'line', yAxis:0, marker:{enabled:false}, data: data_wti.data },
                { name: this.$t('name.bond'),type: 'line', yAxis:0, marker:{enabled:false}, data: data_bond.data },                
            ];

            for (let a_asset in events) {
                if (events[a_asset].up.length>0) {
                    series.push( { name: '' ,type: 'scatter', yAxis:0, showInLegend:false, label:{ enabled:false}, color:'red', marker: {symbol:'triangle', radius:5}, data: events[a_asset].up} );
                }
                if (events[a_asset].down.length>0) {
                    series.push( { name: '' ,type: 'scatter', yAxis:0, showInLegend:false, color:'black', marker: {symbol:'triangle-down', radius:5}, data: events[a_asset].down} );
                }
            }

           this.g_chart['chart1'] = CommonFunc.getChartOption(series) ;
        },

        
        updateChangeChart: function(json_data,ioffset=-10) {
            let data_btc = CommonFunc.getChartData(json_data.asset,'btc','ret','time',false,0);
            let data_nyse = CommonFunc.getChartData(json_data.asset,'nyse','ret','time',false,0);
            let data_gold = CommonFunc.getChartData(json_data.asset,'gold','ret','time',false,0);
            let data_wti = CommonFunc.getChartData(json_data.asset,'wti','ret','time',false,0);
            let data_bond = CommonFunc.getChartData(json_data.asset,'bond','ret','time',false,0);
            let data_usd = CommonFunc.getChartData(json_data.asset,'usd','ret','time',false,0);

            //console.log("data_btc=",CommonFunc.getChartDataFromIndex(data_btc.data,-10));

            let series = [
                { name: this.$t('name.btc') ,type: 'column', yAxis:0, data: CommonFunc.getChartDataFromIndex(data_btc.data,ioffset)},
                { name: this.$t('name.nyse'),type: 'column', yAxis:0, data: CommonFunc.getChartDataFromIndex(data_nyse.data,ioffset)},
                { name: this.$t('name.usd'),type: 'column', yAxis:0, data: CommonFunc.getChartDataFromIndex(data_usd.data,ioffset)},
                { name: this.$t('name.gold'),type: 'column', yAxis:0, data: CommonFunc.getChartDataFromIndex(data_gold.data,ioffset) },
                { name: this.$t('name.wti'),type: 'column', yAxis:0, data: CommonFunc.getChartDataFromIndex(data_wti.data,ioffset) },
                { name: this.$t('name.bond'),type: 'column', yAxis:0, data: CommonFunc.getChartDataFromIndex(data_bond.data,ioffset) },
            ];

           this.g_chart['chart3'] = CommonFunc.getChartOption(series) ;
        },

        scaleBetween: function (unscaledNum, minAllowed, maxAllowed, min, max) {
            return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
        },

        scaleData: function(values,min,max) {
            var maxRange = Math.max.apply(Math, values);
            var minRange = Math.min.apply(Math, values);

            let scaledValues = [];
            for (var i = 0; i < values.length; i++) {
                var unscaled = values[i];
                var scaled = (max - min) * (unscaled - minRange) / (maxRange - minRange) + min;

                //var scaled = this.scaleBetween(unscaled, 0, 100, minRange, maxRange);
                //console.log(scaled.toFixed(2));
                scaledValues.push( scaled );
            }
            return scaledValues;
        },

        updateWeeklyRetChart: function(json_data) {
            let asset_data = {
                'asset.btc':CommonFunc.getChartData(json_data.asset,'btc','ret','time',false,0).data,
                'asset.nyse':CommonFunc.getChartData(json_data.asset,'nyse','ret','time',false,0).data,
                'asset.gold':CommonFunc.getChartData(json_data.asset,'gold','ret','time',false,0).data,
                'asset.wti':CommonFunc.getChartData(json_data.asset,'wti','ret','time',false,0).data,
                'asset.bond':CommonFunc.getChartData(json_data.asset,'bond','ret','time',false,0).data,
                'asset.usd':CommonFunc.getChartData(json_data.asset,'usd','ret','time',false,0).data
            };

            let data_values = [];
            for (let a_asset in asset_data) {
                let a_value = asset_data[a_asset][ asset_data[a_asset].length-1 ].y;                
                data_values.push(a_value);
            }
            let data_scaled = this.scaleData(data_values,1,100);

            let data_tree = [];
            let keys = Object.keys(asset_data);
            for (let index=0; index<keys.length;index++) {
                let a_asset = keys[index];

                let a_value = asset_data[a_asset][ asset_data[a_asset].length-1 ].y;                

                let a_color = '#d92550';
                if (a_value>0) {
                    a_color = '#3ac47d';
                }
                data_tree.push( {name: this.$t(a_asset), value: data_scaled[index], color:a_color } );
                //data_tree.push( {name: a_asset, id:a_asset, value: a_value } );
            }
            
            //var scaled = this.scaleData(data_values,1,100);
            //console.log("data_overview=",data_tree);

            let series = [
                { type: 'treemap', layoutAlgorithm: 'squarified', data: data_tree },
            ];

            let a_option = CommonFunc.getChartOption(series) ;
            //a_option.chart = {};
            a_option.xAxis = {};
            a_option.yAxis = {};
            this.g_chart['chart2'] = a_option;

            //console.log("option=",a_option);
        },

        update: function(data) {
            //const _this = this;
            this.g_data = data;
            //let dic_columns = CommonFunc.getColumnDic(data.columns,[],[]);

            console.log('OverviewScaledChart.update : data==',data, this.tab);
            this.updateOverviewChart(data);
            this.updateChangeChart(data,-5);
            this.updateAssetChart(this.g_data,this.tab);
            //this.updateWeeklyRetChart(data);
            this.v_chart_loaded = true;
        },

        onClickTab: function(atype) {
            this.updateAssetChart(this.g_data,atype);
        },

        onClickTimeframe: function(offset,timeframe) {
            console.log('CTrendView.onClickTimeframe - ',offset,timeframe);
            this.g_timeframe = timeframe;
            this.$parent.reload(offset);
        },

    }
  }
</script>
