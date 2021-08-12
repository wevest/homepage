<template>
  
    <div class="row">
      <div class="col">
        <q-table
          title="" flat
          class="sticky-column-table"
          :data="items"
          :columns="headers"
          row-key="name"
          hide-bottom
          :rows-per-page-options="[0]"
        >
          <template v-slot:body="props">

            <q-tr :props="props">
              <q-td key="asset" align="left" :props="props">
                <a href='#' @click="onClickAsset(props.row.asset)">
                  {{ props.row.asset }}
                </a>
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
import NvaFunc from 'src/util/NavFunc';
import APIService from 'src/services/apiService';
import logger from "src/error/Logger";


export default {
    data () {
      return {
        search: '',
        g_period: 5,
        g_data: null,

        headers: [
            { name:'asset', align:'left', label: this.$t('name.coin'), field: 'asset', sortable:true },
            { name:'d1', label: this.$t('name.d1'), field: 'd1', sortable:true },
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

      getCalcValue(data,asset,dic_columns,column,index0,index1) {
        let n_count = data[asset].values.length-1;
        if (n_count<index1) {
          return 0;
        }
        return this.calcRet( data[asset].values[n_count-index0][dic_columns[column]], data[asset].values[n_count-index1][dic_columns[column]] );
      },

      getReportList(json_data) {
          //console.log('getReportList=',list);
            
          let dic_columns = null; 

          let a_table_items = [];            
          let n_rows = null; 
          for (let a_asset in json_data) {
              if (! dic_columns) {
                dic_columns = CommonFunc.getColumnDic(json_data[a_asset].columns,[],[]);
                n_rows = json_data[a_asset].values.length-1;
              } 
          
              //console.log('getReportList=',a_asset);
              //n_count = json_data[a_asset].values.length-1;

              var value_today = json_data[a_asset].values[json_data[a_asset].values.length-1];
              /*
              var value_yesterday = json_data[a_asset].values[n_rows-1];
              var value_w1 = json_data[a_asset].values[n_rows-7];
              var value_m1 = json_data[a_asset].values[n_rows-30];
              var value_m3 = json_data[a_asset].values[n_rows-90];
              */
              var a_item = {asset:a_asset, 
                price: value_today[dic_columns['priceClose']],
                d1: this.getCalcValue(json_data,a_asset,dic_columns,'priceClose',0,1),
                w1: this.getCalcValue(json_data,a_asset,dic_columns,'priceClose',0,7),
                m1: this.getCalcValue(json_data,a_asset,dic_columns,'priceClose',0,30),
                m3: this.getCalcValue(json_data,a_asset,dic_columns,'priceClose',0,90),
              };

              a_table_items.push(a_item);
            }
              
          return a_table_items;

        },

        showReportList(data) {
            const table_items = this.getReportList(data);
            logger.log.debug('showReportList : result = ',table_items);
            this.items = table_items;
        },

        update(data) {
            logger.log.debug('CSectorCryptoTable.update - ',data);
            this.g_data = data;            
            this.showReportList(data);
        },

        onClickAsset(symbol) {
            logger.log.debug('CSectorTable.navAsset - ',symbol);
            NavFunc.navAsset(this,symbol);
        },

    }
}
</script>
