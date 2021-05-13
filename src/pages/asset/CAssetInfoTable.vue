<template>

  <div class="q-pa-md">
    <div class="row">
      <div class="col">

          <q-tabs v-model="tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
            <q-tab name="intro" :label="$t('name.intro')" @click="onClickTab('intro')" />
            <q-tab name="info" :label="$t('name.info')" @click="onClickTab('info')" />
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

            <q-tab-panel name="info">
              <div class="row">
                <div class="col">
                  <q-markup-table>
                    <tbody>
                      <tr v-for="a_item in items_info">
                        <td class="text-left">{{ a_item['column'] }}</td>
                        <td class="text-right" v-if="a_item['type']==0">
                          <a :href="a_item['desc']" target="_blank"> {{ a_item['desc'] }}</a></td>
                        <td class="text-right" v-else>{{ a_item['desc'] }}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>            
                </div>            
                <div class="col">
                  <q-markup-table>
                    <tbody>
                      <tr v-for="a_item in items_price">
                        <td class="text-left">{{ a_item['column'] }}</td>
                        <td class="text-right">{{ a_item['desc'] }}</td>
                      </tr>
                    </tbody>
                  </q-markup-table>
                </div>
              </div>

            </q-tab-panel>

            <q-tab-panel name="investor">

              <q-markup-table>
                <thead>
                  <tr>
                    <th class="investor_name">{{ $t('name.name') }}</th>
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

            <q-tab-panel name="development">

              <q-markup-table>
                <tbody>
                  <tr class="develop-low">
                    <td>                      
                      <p>
                        <h6 class="develop-name">{{ $t('name.commit_count')}}</h6>
                        <h7 class="develop-value">{{ g_commit_item['github_commit_count'] }}</h7>
                      </p>
                    </td> 
                    <td>
                      <p>
                        <h6 class="develop-name">{{ $t('name.created_at')}}</h6>
                        <h7 class="develop-value">{{ g_commit_item['github_created_at'] }}</h7>
                      </p>
                    </td>
                  </tr>
                  <tr class="develop-low">
                    <td>
                      <p>
                        <h6 class="develop-name">{{ $t('name.pushed_at')}}</h6>
                        <h7 class="develop-value">{{ g_commit_item['github_pushed_at'] }}</h7>
                      </p>
                    </td>
                    <td>
                      <p>
                        <h6 class="develop-name">{{ $t('name.subscriber_count')}}</h6>
                        <h7 class="develop-value">{{ g_commit_item['github_subscribers_count'] }}</h7>
                      </p> 
                    </td>
                  </tr>
                  <tr class="develop-low">
                    <td>
                      <p>
                        <h6 class="develop-name">{{ $t('name.watcher_count')}}</h6>
                        <h7 class="develop-value">{{ g_commit_item['github_watchers_count'] }}</h7>
                      </p>    
                    </td>
                    <td>
                      <p>
                        <h6 class="develop-name">{{ $t('name.forks_count')}}</h6> 
                        <h7 class="develop-value">{{ g_commit_item['github_forks_count'] }}</h7>
                      </p>
                    </td>
                  </tr>
                  <tr class="develop-low">
                    <td>
                      <p>
                        <h6 class="develop-name">{{ $t('name.language') }}</h6>
                        <h7 class="develop-value">{{ g_commit_item['github_language'] }}</h7>
                      </p>    
                    </td>
                    <td>
                      <p>
                        <h6 class="develop-name">{{ $t('name.language') }}</h6>
                        <h7 class="develop-value">{{ g_commit_item['github_language'] }}</h7>
                      </p>
                    </td>    
                  </tr>
                </tbody>
              </q-markup-table>


              <CTitle ttype='subtitle' :title="$t('crypto.chart.github.title')"></CTitle>
              <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>

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

import CTitle from 'src/components/CTitle';


export default {
    components: {
        CTitle,
    },
    data () {
      return {
        tab: 'intro',
        g_data: null,
        g_data_vc:null,
        g_data_commit: null,
        g_description: null,
        g_symbol: null,
                
        g_chart: {
            'chart1': {series: []},
            'chart2': {series: []},
        },

        g_commit_item: {'github_created_at':'','github_pushed_at':'','github_language':'',
          'github_subscribers_count':0,'github_watchers_count':0, 'github_commit_count':0,'github_forks_count':0,
        },

        items: [],
        items_info: [],
        items_price: [],
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

            this.updateInfoTable(data_base);
            //this.items = items;
        },


        getFirstLink: function(json_data,dic_columns,column) {
          let a_links = json_data['values'][0][dic_columns[column]];          
          if (a_links.length==0) {
            return '';
          }
          return a_links.split(',')[0];
        },

        updateInfoTable: function(json_data) {
            const dic_columns = CommonFunc.getColumnDic(json_data.columns,[],[]);
            logger.log.debug('items=',dic_columns);

            //this.g_symbol = json_data['values'][0][dic_columns['symbol']];
            //this.g_description = json_data['values'][0][dic_columns['description']];

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

            this.items_info = items;


            let items2 = [];
              
            items2.push( {column:'symbol', desc:json_data['values'][0][dic_columns['symbol']]} );
            items2.push( {column:'first traded date', desc:json_data['values'][0][dic_columns['date_added']]} );
            
            items2.push( {column:'alltime_high', desc:this.getPriceDate(json_data,dic_columns,'alltime_high')} );              
            items2.push( {column:'alltime_low', desc:this.getPriceDate(json_data,dic_columns,'alltime_low')} );              
            items2.push( {column:'w52_high', desc:this.getPriceDate(json_data,dic_columns,'w52_high')} );              
            items2.push( {column:'w52_low', desc:this.getPriceDate(json_data,dic_columns,'w52_low')} );
          
            this.items_price = items2;



            logger.log.debug('items=',items);

            //this.items = items;
        },
        
        updateDevWidget: function(data_base) {
          const dic_columns = CommonFunc.getColumnDic(data_base.columns,[],[]);          
          this.g_commit_item['github_created_at'] = data_base['values'][0][dic_columns['github_created_at']];
          this.g_commit_item['github_pushed_at'] = data_base['values'][0][dic_columns['github_pushed_at']];
          this.g_commit_item['github_forks_count'] = data_base['values'][0][dic_columns['github_forks_count']];
          this.g_commit_item['github_commit_count'] = data_base['values'][0][dic_columns['github_commit_count']];
          this.g_commit_item['github_watchers_count'] = data_base['values'][0][dic_columns['github_watchers_count']];
          this.g_commit_item['github_subscribers_count'] = data_base['values'][0][dic_columns['github_subscribers_count']];
          this.g_commit_item['github_language'] = data_base['values'][0][dic_columns['github_language']];
        },

        update: function(data_base,data_vc) {
            console.log('CAssetInfoTable.update - ',data_base);
            this.g_data = data_base;
            this.g_data_vc = data_vc;
            
            this.updateTable(this.g_data,this.g_data_vc);
            this.updateDevWidget(this.g_data);
        },


        updateCommitChart: function(json_data) {
            let data_count = CommonFunc.getChartData(json_data,'commit','commit_count','time',false,0);

            let series = [
                { name: this.$t("name.count"),type: 'column', yAxis:0, data: data_count.data},
            ];

            let a_option = CommonFunc.getChartOption(series);
            this.g_chart['chart1'] = a_option;
        },


        updateChart: function(data_commit) {
            console.log('CAssetInfoTable.updateChart - ',data_commit);
            this.g_data_commit = data_commit;
            this.updateCommitChart(data_commit);
        },

        onClickTab:function(value) {
          console.log('CAssetInfo.onClick - ',value);
          //this.updateTable(this.g_data,value);
          //this.loadGithubData(this.g_data);
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
.text-left {
  color: #848484;
  font-weight:500;
}

.text-right {
  color:#464646;
  font-weight: bold;
}


.develop-low {
line-height:0.0rem;
}
.develop-name {
  color:#848484;
  font-size: 0.9rem;
  margin:0.3rem;
}

.develop-value {
 color:#464646;
 font-size: 1.3rem;
 margin:0.3rem;
 font-weight:bold;
}
</style>

