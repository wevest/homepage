<template>


  <div class="q-pa-md">
    <div class="row">
      <div class="col">
        <q-tabs v-model="tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
          <q-tab name="ret" label="가격급등" @click="onClickTab('ret')" />
          <q-tab name="rret" label="가격급락" @click="onClickTab('rret')" />
          <q-tab name="yester_ret" label="전일대비 가격급등" @click="onClickTab('yester_ret')" />
          <q-tab name="yester_rret" label="전일대비 가격급락" @click="onClickTab('yester_rret')" />          
          <q-tab name="volume" label="거래량상위"  @click="onClickTab('volume')" />
          <q-tab name="tvz" label="거래량급증"  @click="onClickTab('tvz')" />
        </q-tabs>
      </div>
    </div>


    <div class="row">
      <div class="col">
        <q-table
          dense
          title=""
          :data="items"
          :columns="headers"
          row-key="name"
          :rows-per-page-options="[10]"
        >
          <template v-slot:body="props">

            <q-tr :props="props">
              <q-td key="rank" :props="props">{{ props.row.rank }}</q-td>
              <q-td key="asset" :props="props">{{ props.row.asset }}</q-td>
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
        tab: 'ret',
        g_period: 5,
        g_data: null,
        g_exchange: null,
        g_sector: null,

        headers: [
            { name:'rank', label: '순위', field: 'rank' },
            { name:'asset', label: '코인', field: 'asset' },
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
            
            this.showReportList(exchange,sector,category);
        },

        showSectorChart: function(category) {
            console.log('CSectorTable.showSectorChart - ',category);
            this.$parent.onClickCategory(category);
        },


        onClickTab:function(value) {
          console.log('CTopTable.onClick - ',value);
          this.showReportList(this.g_exchange,this.g_sector,value);
        }
    }
}
</script>
