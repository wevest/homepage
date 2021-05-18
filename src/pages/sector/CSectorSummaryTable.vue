<template>

    <div class="row">
      <div class="col">
        <q-table          
          title=""
          class="sticky-column-table"
          :data="items"
          :columns="headers"
          row-key="name"
          hide-bottom
          :rows-per-page-options="[0]"
        >
          <template v-slot:body="props">

            <q-tr :props="props">
              <q-td key="category" :props="props" >
                <a href='#' @click="showSectorChart(props.row.category)">{{ $t('category.'+props.row.category) }}</a>
              </q-td>
              <q-td key="d1" :props="props" :class="(props.row.d1>0)?'text-red':'text-green'">{{ Number(props.row.d1).toLocaleString() }}</q-td>
              <q-td key="w1" :props="props" :class="(props.row.w1>0)?'text-red':'text-green'">{{ Number(props.row.w1).toLocaleString() }}</q-td>
              <q-td key="m1" :props="props" :class="(props.row.m1>0)?'text-red':'text-green'">{{ Number(props.row.m1).toLocaleString() }}</q-td>
              <q-td key="m3" :props="props" :class="(props.row.m3>0)?'text-red':'text-green'">
                {{ Number(props.row.m3).toLocaleString() }}
              </q-td>
            </q-tr>            

          </template>

        </q-table>
      </div>
    </div>

</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";


export default {
    data () {
      return {
        search: '',
        g_period: 5,
        g_data: null,

        headers: [
            { name:'category', align:'left', label: this.$t('name.sector'), field: 'category', sortable:true, format: (val, row) => `${ this.$t('category.'+val)}` },
            { name:'d1', label: this.$t('name.d1'), field: 'd1' , sortable:true},
            { name:'w1', label: this.$t('name.w1'), field: 'w1', sortable:true,
              format: (val, row) => `${Number(val).toLocaleString()}`, 
            },
            { name:'m1', label: this.$t('name.m1'), field: 'm1', sortable:true,
              format: (val, row) => `${Number(val).toLocaleString()}` 
            },
            { name:'m3', label: this.$t('name.m3'),  field: 'm3', sortable:true ,
              format: (val, row) => `${Number(val).toLocaleString()}`, 
            },
        ],

        items: [],
      }
    },

    methods: {

      calcRet(v1,v2) {
        return CommonFunc.round( ((v1-v2)/v2)*100,2);
      },

      getReportList(json_data,exchange) {
          //console.log('getReportList=',list);
            
            let dic_columns = CommonFunc.getColumnDic(json_data[exchange]['overall'].columns,[],[]);
            let column_index = dic_columns['index_cumsum'];
            let a_table_items = [];
            
            let n_rows = json_data[exchange]['overall'].values.length-1;
            for (let a_sector in json_data[exchange]) {
                if (['overall','btc','alt'].includes(a_sector)) {
                    continue;
                }
                
                var value_today = json_data[exchange][a_sector].values[n_rows];
                var value_w1 = json_data[exchange][a_sector].values[n_rows-7];
                var value_m1 = json_data[exchange][a_sector].values[n_rows-30];
                var value_m3 = json_data[exchange][a_sector].values[n_rows-90];

                var a_item = {category:a_sector, 
                  d1: value_today[dic_columns['index_ret']],
                  w1: this.calcRet(value_today[dic_columns['index_cumsum']],value_w1[dic_columns['index_cumsum']]),
                  m1: this.calcRet(value_today[dic_columns['index_cumsum']],value_m1[dic_columns['index_cumsum']]),
                  m3: this.calcRet(value_today[dic_columns['index_cumsum']],value_m3[dic_columns['index_cumsum']])
                };

                a_table_items.push(a_item);
            }
              
          return a_table_items;

        },


        showReportList: function(data,exchange) {
            const table_items = this.getReportList(data,exchange);
            console.log('showReportList : result = ',table_items);
            this.items = table_items;
        },

        update: function(data,exchange) {
            console.log('CSectorTable.update - ',exchange,data);
            this.g_data = data;
            
            this.showReportList(data,exchange);
        },

        showSectorChart: function(category) {
            console.log('CSectorTable.showSectorChart - ',category);
            this.$parent.onClickSectorChart(category);
        },

    }
}
</script>
