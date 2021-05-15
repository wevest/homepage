<template>

  <q-table
  title=""
  :data="items"
  :columns="headers"
  row-key="name"
  :rows-per-page-options="[20]"
  >
    <template v-slot:body="props">

        <q-tr :props="props">
            <q-td key="symbol" :props="props">{{ props.row.symbol }}</q-td>
            <q-td key="name" :props="props">
                <a href="#" @click="onClickAsset(props.row.symbol)">{{ props.row.name }}</a>
            </q-td>
            <q-td key="ret" :props="props">{{ Number(props.row.ret).toLocaleString() }}</q-td>
            <q-td key="date_added" :props="props">{{ props.row.date_added.substring(0,10) }}</q-td>
            <q-td key="first_price" :props="props">{{ Number(props.row.first_price).toLocaleString() }}</q-td>
            <q-td key="cryptovc" :props="props">
              
              <a v-for="a_item in props.row.cryptovc" href="#" @click="onClickVC(a_item)" class="link_vc">
                {{ a_item }}
              </a>&nbsp;
            </q-td>
        </q-tr>            

    </template>

  </q-table>            

</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";

export default {
  components: {
  },

  data: function () {
    return {
        g_data: null,
        
        headers: [
            { name:'symbol', label: this.$t('name.symbol'),align:'left', field: 'symbol' },
            { name:'name', label: this.$t('name.name'),align:'left', field: 'name' },
            { name:'date_added', label: this.$t('name.listed_date'),align:'left', sortable:true, field: 'date_added' },
            { name:'first_price', label: this.$t('name.first_price')+'($)', sortable:true,  field: 'first_price' ,
              format: (val, row) => `${Number(val).toLocaleString()}`, 
            },
            { name:'cryptovc', label: this.$t('name.cryptovc'), field: 'cryptovc' ,align:'left'},
        ],
        items: [],        
      }
    },
    created: function () {
        //logger.log.debug("VCPortfolioTable.created");
    },
    mounted: function() {
        //logger.log.debug("VCPortfolioTable.mounted");
    },
    updated: function() {
        //logger.log.debug("VCPortfolioTable.updated");
    },

    methods: {
        updateTable: function(json_data) {
          let items = CommonFunc.formatArrayToJson(json_data);
          //logger.log.debug('items=',items);
          for (var index=0; index<items.length; index++) {
            let tokens = items[index]['cryptovc'].split(",");
            items[index]['cryptovc'] = tokens;
          }
          //logger.log.debug('items2=',items);
          this.items = items;
        },

        update: function(json_data) {
            logger.log.debug('PortfolioValue.update - ',json_data);
            this.g_data = json_data;
            this.updateTable(this.g_data);
        },

        onClickAsset: function(symbol) {
          logger.log.debug('PortfolioValue.onClickAsset - ',symbol);
          
          let dic_param = { name:'asset', params:{ symbol:symbol } };
          this.$router.replace(dic_param);
        },

        onClickVC: function(vc) {
          logger.log.debug('VCPortfolioTable.onClickVC - ',vc);
          this.$emit('onClickVC',vc);
        }
    }
}
</script>


<style scoped>

.link_vc {
    padding-right: 0.5rem;   
}

</style>