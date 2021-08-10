<template>
    <div style="margin:0px;padding:0px;">
<!--
        <highcharts :constructorType="'stockChart'" class="hc" :options="chartOptions" ref="chart"></highcharts>
        <CTitle ttype='subtitle' :title="$t('page.asset.price.title')" :desc="$t('page.asset.price.desc')"></CTitle>        
        <highcharts class="box_chart" :options="g_chart['chart1']" ref="chart1"></highcharts>
-->     
        <q-skeleton v-if="!v_chart_loaded" animation="pulse-x" square height="450px" />
        <div v-show="v_chart_loaded">
            <highcharts class="box_chart" :options="g_chart['chart1']" ref="chart1" style="height:250px;"></highcharts>
            
            <q-separator color="black" size="1px" class="q-mt-sm" />

            <highcharts class="box_chart" :options="g_chart['chart2']" ref="chart2" style="height:100px;"></highcharts>

            <q-separator color="black" size="1px" class="q-mt-sm" />

            <div class="text-center q-mt-md">
                <q-toggle v-model="v_visible_table" :label="$t('button.show_table')" class="q-mb-md center" />
            </div>

            <q-slide-transition>
                <div v-show="v_visible_table" class="q-my-md">
<!--                    
                    <CTitle ttype='subtitle' :title="v_table_title" :desc="v_table_desc"></CTitle>
-->                    
                    <div class="gBoxNoMargin">
                        <WPriceDataTable ref="dataTable" />                    
                    </div>

                </div>
            </q-slide-transition>                
        </div>

    </div>

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'src/components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';
import WPriceDataTable from 'components/w/WPriceDataTable';

export default {
    name: 'WAssetChart',
    components: {
        CTitle,
        ChartTimeframe,
        WPriceDataTable
    },
    props: {
        data: {
            default: null,
        },
        tableTitle: {
            type:String,
            default: '',
        },
        tableDesc: {
            type:String,
            default: '',
        },
        showTable: {
            type:String,
            default: '1'
        }
    },
    data() {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",
            
            g_chart: {
                'chart1': {series: []},
                'chart2': {series: []},
            },

            v_chart_loaded: false,

            v_visible_table: true,

            v_table_title: this.tableTitle,
            v_table_desc: this.tableDesc
        }
    },
    methods: {
        getChartData(json_data,column_index,date_index,dtype=0,idecimal=3) {
                    
            let data_price = [];
            let values = [];
            
            json_data.forEach(a_item => {
                //logger.log.debug("a_item=",a_item);

                let a_value = a_item[column_index]; 
                if (dtype==1) {
                    a_value = a_value - 0.5;
                }                
                a_value = CommonFunc.round(a_value,idecimal);
                let a_data = {x: a_item[date_index], y:a_value}
                data_price.push(a_data);
                values.push(a_value);
            });    
                    
            return {data:data_price, values:values};
        },

        updatePriceChart(json_data) {
            let data_price = this.getChartData(json_data,4,0,false,0);

            let a_minmax = CommonFunc.getMinMaxInSeries(data_price.data,0.05);            

            let series = [
                { name: this.$t('name.price'), type: 'area', yAxis:0, data: data_price.data, 
                    showInLegend: false, min:a_minmax.min,max:a_minmax.max},
                //{ name: 'top_tier_volume',type: 'bar', yAxis:1, data: data_volume_top.data},
            ];

            let a_option = CommonFunc.getChartOption(series);
            //logger.log.debug('WAssetChart.updateChart : =',a_option);

            a_option['xAxis'][0]['visible'] = false;
            a_option['yAxis'][0]['min'] = a_minmax.min;
            a_option['yAxis'][0]['max'] = a_minmax.max;
            this.g_chart['chart1'] = a_option;
            logger.log.debug('WAssetChart.updatePriceChart : =',a_minmax,a_option);
        },
        updateVolumeChart(json_data) {
            let data_volume = this.getChartData(json_data,5,0,false,0);

            let series = [
                { name: this.$t('name.volume'),type: 'bar', yAxis:0, data: data_volume.data, showInLegend: false, color:'black'},
                //{ name: 'top_tier_volume',type: 'bar', yAxis:1, data: data_volume_top.data},
            ];

            let a_option = CommonFunc.getChartOption(series);
            a_option['yAxis']['gridLineWidth'] = 0;
            a_option['xAxis']['gridLineWidth'] = 0;
            //a_option['xAxis']['tickWidth'] = 0;
            this.g_chart['chart2'] = a_option;
            this.v_chart_loaded = true;

            //logger.log.debug('WAssetChart.updateChart : =',a_option);
        },

        update(json_data,show_table=true) {
            //logger.log.debug('WAssetChart.update : =',json_data);
            this.updatePriceChart(json_data); 
            this.updateVolumeChart(json_data); 
            this.$refs.dataTable.update(json_data);           
            
            this.v_visible_table = show_table;
        },
    }
  }
</script>
