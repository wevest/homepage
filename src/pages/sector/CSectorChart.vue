<template>
    <div class="example">
        <CTitle ttype='subtitle' :title="$t('chart.sector_index.title')"></CTitle> 
        <ChartTimeframe period='monthly' :onclick="onClickTimeframe" selected='m6'></ChartTimeframe>
        <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>

        <q-table
        title=""
        :data="v_items"
        :columns="v_headers"
        row-key="name"
        :pagination.sync="v_pagination"
        :rows-per-page-options="[20]"
        >
            <template v-slot:body="props">

                <q-tr :props="props">
                    <q-td key="trade_date" :props="props">{{ props.row.trade_date }}</q-td>
                    <q-td key="index" :props="props">{{ Number(props.row.index).toLocaleString() }}</q-td>
                    <q-td key="tv" :props="props">{{ Number(props.row.tv).toLocaleString() }}</q-td>
                </q-tr>            

            </template>

        </q-table>    

    </div>

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';

export default {
    name: 'CSectorIndexChart',
    components: {
        CTitle,
        ChartTimeframe
    },
    data: function () {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",

            g_chart: {
                'chart1': { series: [],  },
                'chart2': { series: [],},
            },

            v_headers: [
                { name:'trade_date', label: '시간', field: 'trade_date', align:'left', sortable:true  },
                { name:'index', label: this.$t('name.index'), field: 'index'},
                { name:'tv', label: this.$t('name.tv'), field: 'tv'},
            ],
            v_items: [],         
            v_pagination: {
                sortBy: 'trade_date',
                descending: true,
            },


        }
    },

    methods: {
  

        updateCategoryTable: function(json_data,exchange,category) {            
            let dic_column = CommonFunc.getColumnDic( json_data[exchange][category].columns ,[],[]);

            let items = [];            
            for (let index=0;index<json_data[exchange][category].values.length;index++) {
                
                let a_item = {
                    trade_date: CommonFunc.safeGetJsonValue(json_data[exchange][category].values,index,dic_column['trade_date']),
                    index: CommonFunc.safeGetJsonValue(json_data[exchange][category].values,index,dic_column['index_cumsum']),
                    tv: CommonFunc.safeGetJsonValue(json_data[exchange][category].values,index,dic_column['index_tv']),
                };
                items.push(a_item);
            }
            logger.log.debug('items=',items);
            this.v_items = items;
        },

        updateCategoryChart: function(json_data,exchange,category) {
            let data_index = CommonFunc.getChartData(json_data[exchange],category,'index_cumsum','trade_date',false,0);
            let data_category = CommonFunc.getChartData(json_data[exchange],'overall','index_cumsum','trade_date',false);
            let data_tv = CommonFunc.getChartData(json_data[exchange],category,'index_tv','trade_date',false,0);
            
            //console.log('data_price=',data_price.data);

            let series = [
                { name: this.$t('category.index'),type: 'line', yAxis:0, data: data_index.data},
                { name: this.$t('category.'+category),type: 'line', yAxis:0, data: data_category.data},
                { name: this.$t('category.volume'),type: 'bar', yAxis:1, opacity:0.4, data: data_tv.data},                
            ];

            this.g_chart['chart1'] = CommonFunc.getChartOption(series) ;
        },



        update: function(json_data,exchange,category) {
            logger.log.debug('CSectorChart.update : =',category,json_data);

            this.updateCategoryChart(json_data,exchange,category);
            this.updateCategoryTable(json_data,exchange,category);
        },

        onClickTimeframe: function(value) {
            this.$parent.onClickChartTimeframe(value);
        }
    }
  }
</script>
