<template>
  <div>
    <q-tabs v-model="v_tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
      <q-tab name="upbit" :label="$t('name.upbit')" @click="onClickExchange('upbit')" />
      <q-tab name="bithumb" :label="$t('name.bithumb')" @click="onClickExchange('bithumb')" />
      <q-tab name="binance" :label="$t('name.binance')" @click="onClickExchange('binance')" />      
    </q-tabs>

    <q-table      
      title=""
      class="sticky-column-table"
      :data="items"
      :columns="headers"
      row-key="name"
      :rows-per-page-options="[10]"
    >
      <template v-slot:body="props">

        <q-tr :props="props">
          <q-td key="asset" :props="props">
            <a href="#" @click="onClickAsset(props.row.asset)">{{ props.row.asset }}</a>
          </q-td>
          <q-td key="rank" :props="props">{{ props.row.rank }}</q-td>
          <q-td key="price" :props="props">{{ Number(props.row.price).toLocaleString() }}</q-td>
          <q-td key="volume" :props="props">{{ Number(props.row.volume).toLocaleString() }}</q-td>
          <q-td key="price_ret" :props="props" :class="(props.row.price_ret>0)?'text-red':'text-green'">
            {{ Number(props.row.price_ret).toLocaleString() }}
          </q-td>
          <q-td key="price_yret" :props="props" :class="(props.row.price_yret>0)?'text-red':'text-green'">
            {{ Number(props.row.price_yret).toLocaleString() }}
          </q-td>

        </q-tr>            

      </template>

    </q-table>

  </div>  
  

</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
import logger from "src/error/Logger";


export default {
    data () {
      return {
        v_tab: 'upbit',
        g_data: null,
        g_exchange: null,
        g_sector: null,

        headers: [
            { name:'asset', label: '코인', field: 'asset', align:'left', required:true },          
            { name:'rank', label: '순위', field: 'rank', required:true  },
            { name:'price', label: '가격', field: 'price',
              format: (val, row) => `${Number(val).toLocaleString()}`, 
            },
            { name:'volume', label: '거래량', field: 'volume',
              format: (val, row) => `${Number(val).toLocaleString()}` 
            },
            { name:'price_ret', label: '등락률(%)',  field: 'price_ret' ,
              format: (val, row) => `${Number(val).toLocaleString()}`, 
            },
            { name:'price_yret', label: '전일비(%)', field: 'price_yret',
              format: (val, row) => `${Number(val).toLocaleString()}`,
            },
        ],

        items: [],
      }
    },

    methods: {

      getReportList(json_data,exchange,sector,category) {
          //console.log('getReportList=',list);
            
            let dic_columns = CommonFunc.getColumnDic(json_data[exchange][sector][category].columns,[],[]);

            let a_table_items = [];
            for (let row_index=0; row_index< json_data[exchange][sector][category].values.length;row_index++) {
                var a_row = json_data[exchange][sector][category].values[row_index];
                var a_item = {};                
                for (var a_key in dic_columns) {
                    a_item[a_key] = a_row[ dic_columns[a_key]];
                }      
                a_table_items.push(a_item);
            }

              
          return a_table_items;

        },


        showReportList: function(exchange,sector,category) {
            const table_items = this.getReportList(this.g_data,exchange,sector,category);
            console.log('showReportList : result = ',table_items);
            this.items = table_items;
        },

        update: function(data,exchange,sector,category) {
            console.log('CSectorTable.update - ',data.length,data);
            this.g_data = data;
            this.g_exchange = exchange;
            this.g_sector = sector;
            this.g_category = category;

            this.showReportList(exchange,sector,category);
        },

        showSectorChart: function(category) {
            console.log('CSectorTable.showSectorChart - ',category);
            this.$parent.onClickCategory(category);
        },

        onClickAsset: function(symbol) {
          let dic_param = { name:'asset', path:'asset', params:{ symbol:symbol } };
          this.$router.push(dic_param);
        },

        onClickExchange:function(exchange) {
          console.log('CTopTable.onClickExchange - ',exchange);
          this.g_exchange = exchange;
          this.showReportList(this.g_exchange,this.g_sector,this.g_category);
        }
    }
}
</script>


<style lang="sass">
</style>