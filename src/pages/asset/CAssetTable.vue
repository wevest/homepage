<template>


  <div class="q-pa-md">
    <div class="row">
      <div class="col">

          <q-tabs v-model="tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
            <q-tab name="intro" label="$t('name.intro')" @click="onClickTab('intro')" />
            <q-tab name="fundamental" label="$t('name.fundamental')" @click="onClickTab('base')" />
            <q-tab name="price" label="$t('name.price')" @click="onClickTab('price')" />
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

            <q-tab-panel name="fundamental">

              <q-markup-table>
                <tbody>
                  <tr v-for="a_item in items">
                    <td class="text-left">{{ a_item['column'] }}</td>
                    <td class="text-left" v-if="a_item['type']==0">
                      <a :href="a_item['desc']" target="_blank"> {{ a_item['desc'] }}</a></td>
                    <td class="text-left" v-else>{{ a_item['desc'] }}</td>
                  </tr>
                </tbody>
              </q-markup-table>

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
        g_description: null,
        g_symbol: null,

        items: [],
        items2: [],
      }
    },

    methods: {

        getReportList(json_data,exchange,sector,category) {

        },

        getPriceDate: function(json_data,dic_columns,column) {
          let a_value = "$ " + CommonFunc.formatNumber(json_data['values'][0][dic_columns[column]],2) + " (" + json_data['values'][0][dic_columns[column+'_date']] + ')';
          return a_value;
        },

        getFirstLink: function(json_data,dic_columns,column) {
          let a_links = json_data['values'][0][dic_columns[column]];          
          if (a_links.length==0) {
            return '';
          }
          return a_links.split(',')[0];
        },

        updateTable: function(json_data,atype='base') {
            const dic_columns = CommonFunc.getColumnDic(json_data.columns,[],[]);
            logger.log.debug('items=',dic_columns);

            this.g_symbol = json_data['values'][0][dic_columns['symbol']];
            this.g_description = json_data['values'][0][dic_columns['description']];

            let items = [];
            items.push( {column:'symbol', type:1, desc:json_data['values'][0][dic_columns['symbol']]} );
            items.push( {column:'name', type:1, desc:json_data['values'][0][dic_columns['name']]} );            
            items.push( {column:'token_address', type:1, desc:json_data['values'][0][dic_columns['token_address']]} );
            items.push( {column:'date_added', type:1,desc:json_data['values'][0][dic_columns['date_added']]} );
            items.push( {column:'max_supply', type:1, desc:CommonFunc.formatNumber(json_data['values'][0][dic_columns['max_supply']],0,true)} );
            items.push( {column:'total_supply', type:1,desc:CommonFunc.formatNumber(json_data['values'][0][dic_columns['total_supply']],0,true)} );
            items.push( {column:'circulating_supply', type:1, desc:CommonFunc.formatNumber(json_data['values'][0][dic_columns['circulating_supply']],0,true)} );
            items.push( {column:'website', type:0, desc:json_data['values'][0][dic_columns['website']] } );
            items.push( {column:'github', type:0, desc:json_data['values'][0][dic_columns['source_code']]} );
            items.push( {column:'announcement', type:0, desc:json_data['values'][0][dic_columns['announcement']]} );
            items.push( {column:'source_code', type:0, desc:json_data['values'][0][dic_columns['source_code']]} );
            items.push( {column:'twitter', type:0, desc:json_data['values'][0][dic_columns['twitter']]} );
            items.push( {column:'chat', type:0, desc:json_data['values'][0][dic_columns['chat']]} );
            items.push( {column:'explorer', type:0, desc:this.getFirstLink(json_data,dic_columns,'explorer')} );

            this.items = items;


            let items2 = [];
              
            items2.push( {column:'symbol', desc:json_data['values'][0][dic_columns['symbol']]} );
            items2.push( {column:'first traded date', desc:json_data['values'][0][dic_columns['date_added']]} );
            
            items2.push( {column:'alltime_high', desc:this.getPriceDate(json_data,dic_columns,'alltime_high')} );              
            items2.push( {column:'alltime_low', desc:this.getPriceDate(json_data,dic_columns,'alltime_low')} );              
            items2.push( {column:'w52_high', desc:this.getPriceDate(json_data,dic_columns,'w52_high')} );              
            items2.push( {column:'w52_low', desc:this.getPriceDate(json_data,dic_columns,'w52_low')} );
          
            this.items2 = items2;

            logger.log.debug('items=',items);

            //this.items = items;
        },

        update: function(json_data) {
            console.log('CAssetTable.update - ',json_data);
            this.g_data = json_data;
            
            this.updateTable(this.g_data,'base');
        },

        onClickTab:function(value) {
          console.log('CTopTable.onClick - ',value);
          //this.updateTable(this.g_data,value);
        }
    }
}
</script>
