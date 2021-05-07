<template>


  <div class="q-pa-md">
    <div class="row">
      <div class="col">

          <q-tabs v-model="tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
            <q-tab name="fundamental" label="$t('name.fundamental')" @click="onClickTab('ret')" />
            <q-tab name="price" label="$t('name.price')" @click="onClickTab('rret')" />
          </q-tabs>

        <q-table
          title=""
          :data="items"
          :columns="headers"
          row-key="name"
        >
          <template v-slot:body="props">

            <q-tr :props="props">
              <q-td key="column" :props="props">{{ props.row.column }}</q-td>
              <q-td key="desc" :props="props">{{ props.row.desc }}</q-td>
            </q-tr>            

          </template>

        </q-table>

<!--          
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="fundamental">
            </q-tab-panel>

            <q-tab-panel name="price">
              <div class="text-h4 q-mb-md">Mails</div>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
              <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
            </q-tab-panel>

          </q-tab-panels>

-->

      </div>
    </div>


    <div class="row">
      <div class="col">
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
            { name:'column', field:'column', label: this.$t('name.column') },
            { name:'desc', field: 'desc', label: this.$t('name.desc') },
        ],
        items: [],
      }
    },

    methods: {

        getReportList(json_data,exchange,sector,category) {

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


        onClickTab:function(value) {
          console.log('CTopTable.onClick - ',value);
          this.showReportList(this.g_exchange,this.g_sector,value);
        }
    }
}
</script>
