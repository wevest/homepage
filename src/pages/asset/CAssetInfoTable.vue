<template>

  <div class="q-pa-md">
    <div class="row">
      <div class="col">

          <q-tabs v-model="tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
            <q-tab name="intro" :label="$t('name.intro')" @click="onClickTab('intro')" />
            <q-tab name="investor" :label="$t('name.investor')" @click="onClickTab('base')" />
            <q-tab name="development" :label="$t('name.development')" @click="onClickTab('price')" />
          </q-tabs>

          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="intro">
              <q-card flat bordered class="my-card">
                <q-card-section>
                  <div class="text-h6">{{g_symbol}}</div>
                </q-card-section>

                <q-separator dark inset />

                <q-card-section>
                  {{ g_description }}
                </q-card-section>
              </q-card>

            </q-tab-panel>

            <q-tab-panel name="investor">

              <q-markup-table>
                <thead>
                  <tr>
                    <th>{{ $t('name.name') }}</th>
                    <th>{{ $t('name.roi') }}</th>
                    <th>{{ $t('name.total_return') }}</th>
                    <th>{{ $t('name.homepage') }}</th>
                    <th>{{ $t('name.description') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="a_item in items">
                    <td class="text-left">{{ a_item['name'] }}</td>
                    <td class="text-right">{{ Number(a_item['avg_roi']).toLocaleString() }}</td>
                    <td class="text-right">{{ Number(a_item['total_ret']).toLocaleString() }}</td>
                    <td class="text-left">
                      <a :href="a_item['homepage']" target="_blank"> {{ a_item['homepage'] }}</a>
                    </td>
                    <td class="text-left">
                      <p class="vc_desc">{{ a_item['description'] }}</p>                      
                    </td>
                  </tr>
                </tbody>
              </q-markup-table>

            </q-tab-panel>

            <q-tab-panel name="twitter">

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
        tab: 'intro',
        g_data: null,
        g_data_vc:null,
        g_description: null,
        g_symbol: null,

        items: [],
        items2: [],
      }
    },

    methods: {


        getPriceDate: function(json_data,dic_columns,column) {
          let a_value = "$ " + CommonFunc.formatNumber(json_data['values'][0][dic_columns[column]],2) + " (" + json_data['values'][0][dic_columns[column+'_date']] + ')';
          return a_value;
        },

        updateTable: function(data_base,data_vc) {
            const dic_columns = CommonFunc.getColumnDic(data_base.columns,[],[]);
            const dic_columns_vc = CommonFunc.getColumnDic(data_vc.columns,[],[]);
            logger.log.debug('items=',dic_columns);

            this.g_symbol = data_base['values'][0][dic_columns['symbol']];
            this.g_description = data_base['values'][0][dic_columns['description']];

            let items = [];
            for (let index=0;index<data_vc['values'].length;index++) {
              let a_item = {};
              for (let index2=0;index2<data_vc['columns'].length;index2++) {
                a_item[data_vc['columns'][index2]] = data_vc['values'][index][dic_columns_vc[data_vc['columns'][index2]]];
              }
              items.push( a_item );
            }

            this.items = items;
            logger.log.debug('items=',items);

            //this.items = items;
        },

        update: function(data_base,data_vc) {
            console.log('CAssetInfoTable.update - ',data_base);
            this.g_data = data_base;
            this.g_data_vc = data_vc;
            
            this.updateTable(this.g_data,this.g_data_vc);
        },


        loadGithubData: function(data) {
            const _this = this;

            const dic_columns = CommonFunc.getColumnDic(data.columns,[],[]);
            let a_github = data.values[0][dic_columns['source_code']];
            if ( (a_github.length==0) || (a_github.search('github')==-1)) {
              logger.log.error('Github not found');
              return;
            }
            let tokens = a_github.split("/");
            logger.log.debug("tokens=",tokens);
            if (tokens.length!=5) {
              logger.log.error('Github url format is wrong!!!',a_github);
              return;
            }

            let a_owner = tokens[3];
            let a_repo = tokens[4];

            return new Promise(function(resolve,reject) {
                let dic_param = {repo:a_repo, owner:a_owner};
                MoaBackendAPI.getGithubData(dic_param,function(response) {
                    logger.log.debug("AssetView.loadGithubData - response",response);
                    //_this.updatePriceTable(_this.g_data_price);
                    //_this.$refs.assetChart.update(_this.g_data_price);                    
                    resolve();
                },function(err) {
                    logger.log.error("AssetView.loadGithubData - error",err);
                    reject();
                });
            });            
        },

        onClickTab:function(value) {
          console.log('CAssetInfo.onClick - ',value);
          //this.updateTable(this.g_data,value);
          this.loadGithubData(this.g_data);
        }
    }
}
</script>


<style scoped>

.vc_desc {
    width:300px;
    word-break: break-all;
    word-wrap: break-word;    
}


</style>

