<template>

  <div>

    <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>

    <q-table
        title=""
        row-key="name"
        class="my-sticky-column-table"        
        :data="items"
        :columns="headers"
        :rows-per-page-options="[50]"
        :pagination="initialPagination"        
    >
        <template v-slot:body="props">

            <q-tr :props="props">
              <q-td key="date" :props="props">{{ props.row.date }}</q-td>
              <q-td key="category" :props="props">{{ props.row.category }}</q-td>
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="asset" :props="props">
                <a href="#" @click="navInstrument(props.row.asset)">{{ props.row.asset }}</a>
              </q-td>
              <q-td key="price" :props="props">{{ Number(props.row.price).toLocaleString() }}</q-td>
              <q-td key="mc" :props="props">{{ Number(props.row.mc).toLocaleString() }}</q-td>
              <q-td key="crx_signal_52high" :props="props">{{ props.row.crx_signal_52high }}</q-td>
              <q-td key="crx_signal_cross" :props="props">{{ props.row.crx_signal_cross }}</q-td>
              <q-td key="crx_signal_volume" :props="props">{{ props.row.crx_signal_volume }}</q-td>
              <q-td key="time_diff" :props="props">{{ props.row.time_diff }}</q-td>
            </q-tr>            

        </template>

    </q-table>

  </div>

</template>


<script>
import NvaFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";

import LocalStorageService from 'src/services/localStorage';

export default {
    data () {
      return {
        search: '',
        g_period: 5,
        g_data: null,
        g_mc:5000,

        g_chart: {
            'chart1': { series: [], },
            'chart2': { series: [], },
        },

        initialPagination: {
          sortBy: 'date',
          descending: true,
          page: 1,
          rowsPerPage: 20
          // rowsNumber: xx if getting data from a server
        },   

        headers: [
          { name:'date', field: 'date', label: '일자', sortable: true },
          { name:'category', field: 'category', label: '섹터', sortable: true },
          { name:'name', field: 'name', label: '이름', sortable: true },
          { name:'asset', field: 'asset', label: '코드', sortable: true },
          { name:'price', field: 'price', label: '주가', sortable: true },
          { name:'mc', field: 'mc', label: 'MC', sortable: true },
          { name:'crx_signal_52high', field: 'crx_signal_52high', label: 'Sig_52High', sortable: true },
          { name:'crx_signal_cross', field: 'crx_signal_cross', label: 'Sig_Cross', sortable: true },
          { name:'crx_signal_volume', field: 'crx_signal_volume', label: 'Sig_Volume', sortable: true },
          { name:'time_diff', field: 'time_diff', label: 'Time Diff', sortable: true },
        ],
        items: [],
      }
    },

    methods: {

      getReportList(json_data) {
          //console.log('getReportList=',list);

          let a_table_items = [];
            
          let dic_columns = {};
          let column_index = 0;
          json_data.columns.forEach(a_column => {
              dic_columns[a_column] = column_index;
              column_index += 1;
          });

          let a_code = LocalStorageService.getCode();
          console.log('code=',a_code);
          let a_mc = 0;

          json_data.values.forEach(a_row => {
            var a_item = {};
            
            for (var a_key in dic_columns) {
                a_item[a_key] = a_row[ dic_columns[a_key] ];
            }      
  
            a_mc = 0;
            if (a_code) {
              a_mc = Math.round(a_code[a_item.asset].mc/100000000);
            }
            
            a_item['mc'] = a_mc;
            if (a_mc>this.g_mc) {
              a_table_items.push(a_item);
            }            
          });
              
          return a_table_items;

        },

        updateList: function(period_type) {
            const _this = this;
            
            let g_data = CommonFunc.getAppData('momentumTable');
            if (g_data) {
                logger.log.debug('momentumTable.updateTable : found g_data');
                this.g_data = g_data;
                this.showReportList(this.g_data);
                return;
            }

            let a_today = CommonFunc.getToday(false);
            let a_start_date = CommonFunc.addDays(a_today, parseInt(this.g_period)*-1 );

            let dic_param = {start_date:a_start_date,end_date:a_today,period_type:period_type};

            MoaBackendAPI.getMomentumList(dic_param,function(response) {
                _this.g_data = response.data.data;
                logger.log.debug("MomentumTable.updateList - response",response);
                
                CommonFunc.setAppData('momentumTable',_this.g_data);    
                _this.showReportList(_this.g_data);

            },function(err) {
                logger.log.error("MomentumTable.getRecommendList - error",err);
            });
        },

        showReportList: function(dic_json) {
            const table_items = this.getReportList(dic_json);
            console.log('>>> MomentumTable.showReportList : result = ',table_items);
            this.items = table_items;
            this.showMomentumChart(this.items);
        },

        showMomentumChart: function(items,mtype='crx_signal_52high',thresh=3) {
          let dic_sector = {};
          for (var index=0;index<items.length;index++) {
            
            if (items[index]['mc']<this.g_mc) {
              continue
            }
            
            if (! dic_sector.hasOwnProperty(items[index].category)) {
              dic_sector[items[index].category] = 0;
            }
            ['crx_signal_52high','crx_signal_cross','crx_signal_volume'].forEach(a_column => {
              if (items[index][a_column]>0) {
                dic_sector[items[index].category] += 1;
              }
            });            
          }
          console.log('dic_sector=',dic_sector);

          let series = [];
          for (var a_sector in dic_sector) {
            if (dic_sector[a_sector]<thresh) {
              continue;
            }
            series.push( {name:a_sector, type:'bar', dataLabels:{enabled:true}, data: [dic_sector[a_sector]] } );
          }

          this.g_chart['chart1'] = CommonFunc.getChartOption(series);

/*          
          { name:'category', field: 'category', label: '섹터', sortable: true },
          { name:'name', field: 'name', label: '이름', sortable: true },
          { name:'asset', field: 'asset', label: '코드', sortable: true },
          { name:'price', field: 'price', label: '주가', sortable: true },
          { name:'mc', field: 'mc', label: 'MC', sortable: true },
          { name:'crx_signal_52high', field: 'crx_signal_52high', label: 'Sig_52High', sortable: true },
          { name:'crx_signal_cross', field: 'crx_signal_cross', label: 'Sig_Cross', sortable: true },
          { name:'crx_signal_volume', field: 'crx_signal_volume', label: 'Sig_Volume', sortable: true },

            let data_chart = this.updateChart(data,'Monthly Chart',0);
            console.log("updateMonthly : data=",data);

            let series = [
                {name: 'Value', type:'line',  yAxis:0, data: data_chart.price}, 
                {name: 'EWM', type:'line',  yAxis:0, data: data_chart.ewm},                  
                {name: 'coppock', type:'line',  yAxis:1, data: data_chart.coppock},
            ]            
*/
        },

        update: function(period_type) {
            console.log('MomentumTable.update - ',period_type);
            //this.items = data;
            this.updateList(period_type);
        },

        navSector: function(category) {
            console.log('MomentumTable.navSector - ',category);
            NavFunc.navSector(this.$parent,category);
        },

        navInstrument: function(asset) {
            console.log('MomentumTable.navInstrument - ',asset);
            
            NavFunc.openInstrument(this.$parent,asset);
            //NavFunc.navInstrument(this.$parent,asset);
        }

    }
  }
</script>
