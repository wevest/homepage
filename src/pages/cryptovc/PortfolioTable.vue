<template>

  <div class="q-pa-md">
    <div class="row">
      <div class="col">

          <q-tabs v-model="tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
            <q-tab name="fundamental" :label="$t('name.fundamental')" @click="onClickTab('base')" />
            <q-tab name="price" :label="$t('name.price')" @click="onClickTab('price')" />
          </q-tabs>

          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="fundamental">

                <q-table
                title=""
                hide-bottom
                :data="items"
                :columns="headers"
                row-key="name"
                :rows-per-page-options="[50]"
                >
                  <template v-slot:body="props">

                      <q-tr :props="props">
                          <q-td key="rank" :props="props">{{ props.row.rank+1 }}</q-td>
                          <q-td key="symbol" :props="props">{{ props.row.symbol }}</q-td>
                          <q-td key="name" :props="props">
                              <a href="#" @click="onClickAsset(props.row.symbol)">{{ props.row.name }}</a>
                          </q-td>
                          <q-td key="ret" :props="props">{{ Number(props.row.ret).toLocaleString() }}</q-td>
                          <q-td key="first_date" :props="props">{{ props.row.first_date.substring(0,10) }}</q-td>
                          <q-td key="openPrice" :props="props">{{ Number(props.row.openPrice).toLocaleString() }}</q-td>
                          <q-td key="last_date" :props="props">{{ props.row.last_date }}</q-td>
                          <q-td key="closePrice" :props="props">{{ Number(props.row.closePrice).toLocaleString() }}</q-td>
                          <q-td key="homepage" :props="props">
                            <a :href="props.row.website" target="_blank"> {{ props.row.website }}</a>
                          </q-td>
                          <q-td key="description" :props="props">{{ props.row.description }}</q-td>
                      </q-tr>            

                  </template>

                </q-table>


            </q-tab-panel>

            <q-tab-panel name="price">

              <q-markup-table>
                <tbody>
                  <tr v-for="a_item in items2">
                    <td class="text-left">{{ a_item['column'] }}</td>
                    <td class="text-left">{{ a_item['desc'] }}</td>
                  </tr>
                </tbody>
              </q-markup-table>

            </q-tab-panel>

          </q-tab-panels>


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
        tab: 'fundamental',
        g_data: null,
        g_data_portfolio: null,
        g_description: null,
        g_symbol: null,
        

        headers: [
            { name:'rank', label: this.$t('name.rank'), field: 'rank', sortable:true },
            { name:'symbol', label: this.$t('name.symbol'), field: 'symbol' },
            { name:'name', label: this.$t('name.name'), field: 'name' },
            { name:'ret', label: this.$t('name.roi')+'(%)', sortable:true,  field: 'ret' ,
              format: (val, row) => `${Number(val).toLocaleString()}`, 
            },
            { name:'first_date', label: this.$t('name.listed_date'), sortable:true, field: 'first_date' },
            { name:'openPrice', label: this.$t('name.listed_price'), field: 'openPrice'},
            { name:'closePrice', label: this.$t('name.last_price'), field: 'closePrice'},
            { name:'homepage', label: this.$t('name.homepage'), field: 'homepage'},            
        ],


        items: [],      
        items2: [],  
      }
    },

    methods: {

        loadCryptovcPerformanceData: function(vc) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                //logger.log.debug("CWatchView.loadCryptoWatchData - dic_param=",dic_param);
                let dic_param = {vc:vc};
                MoaBackendAPI.getCryptoVCPerformanceData(dic_param,function(response) {
                    _this.g_data = response.data.data;
                    logger.log.debug("PortfolioTable.loadCryptovcPerformanceData - response",_this.g_data);
                    _this.updateTable(_this.g_data);
                    //logger.log.debug("CWatchView.loadCryptoWatchData - response",_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("PortfolioTable.loadCryptovcPerformanceData - error",err);
                    reject();
                });
            });            
        },


        updateTable: function(json_data) {
          let items = CommonFunc.formatArrayToJson(json_data);
          //logger.log.debug('items=',items);
          this.items = items;
        },

        update: function(vc) {
            logger.log.debug('PortfolioValue.update - ',vc);
            this.loadCryptovcPerformanceData(vc);
        },

        onClickTab:function(value) {
          logger.log.debug('PortfolioValue.onClick - ',value);
          //this.updateTable(this.g_data,value);
        },

        onClickAsset: function(symbol) {
          logger.log.debug('PortfolioValue.onClickAsset - ',symbol);
          
          //this.$parent.navAsset(symbol);
          let dic_param = { name:'asset', params:{ symbol:symbol } };
          this.$router.replace(dic_param);
        }
    }
}
</script>
