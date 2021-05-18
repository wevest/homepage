<template>

    <div class="row">
      <div class="col q-gutter-sm">

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
            keep-alive
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

              <q-table
                title=""
                class="sticky-column-table"
                hide-bottom
                :data="v_items_vc"
                :columns="v_headers_vc"
                row-key="name"
                :rows-per-page-options="[50]"
                >
                    <template v-slot:body="props">

                        <q-tr :props="props">
                            <q-td key="name" :props="props">
                                <a href="#" @click="onClickVC(props.row.name)">{{ props.row.name }}</a>
                            </q-td>
                            <q-td key="avg_roi" class="text-red text-weight-bolder" :props="props">{{ Number(props.row.avg_roi).toLocaleString() }}</q-td>
                            <q-td key="total_ret" :props="props">{{ Number(props.row.total_ret).toLocaleString() }}</q-td>
                            <q-td key="homepage" :props="props">
                                <a :href="props.row.homepage" target="_blank"> {{ props.row.homepage }}</a>
                            </q-td>
                            <q-td key="description" :props="props">{{ props.row.description }}</q-td>
                        </q-tr>            

                    </template>

                </q-table>

<!--
              <q-markup-table>
                <thead>
                  <tr class="investor">
                    <th class="investor_name">{{ $t('name.name') }}</th>
                    <th class="roi">{{ $t('name.roi') }}</th>
                    <th class="total_return">{{ $t('name.total_return') }}</th>
                    <th class="homepage">{{ $t('name.homepage') }}</th>
                    <th class="description">{{ $t('name.description') }}</th>
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
-->
            </q-tab-panel>

            <q-tab-panel name="development">

              <q-markup-table>
                <tbody class="develop-low">
                  <tr>
                    <td>                      
                      <div>
                        <h5>{{ $t('name.commit_count')}}</h5>
                        <h6>{{ g_commit_item['github_commit_count'] }}</h6>
                      </div>
                    </td> 
                    <td>
                      <div>
                        <h5>{{ $t('name.created_at')}}</h5>
                        <h6>{{ g_commit_item['github_created_at'] }}</h6>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>
                        <h5>{{ $t('name.pushed_at')}}</h5>
                        <h6>{{ g_commit_item['github_pushed_at'] }}</h6>
                      </div>
                    </td>
                    <td>
                      <div>
                        <h5>{{ $t('name.subscriber_count')}}</h5>
                        <h6>{{ g_commit_item['github_subscribers_count'] }}</h6>
                      </div> 
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>
                        <h5>{{ $t('name.watcher_count')}}</h5>
                        <h6>{{ g_commit_item['github_watchers_count'] }}</h6>
                      </div>    
                    </td>
                    <td>
                      <div>
                        <h5>{{ $t('name.forks_count')}}</h5> 
                        <h6>{{ g_commit_item['github_forks_count'] }}</h6>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div>
                        <h5>{{ $t('name.language') }}</h5>
                        <h6>{{ g_commit_item['github_language'] }}</h6>
                      </div>    
                    </td>
                    <td>
                      <div>
                        <h5>{{ $t('name.language') }}</h5>
                        <h6>{{ g_commit_item['github_language'] }}</h6>
                      </div>
                    </td>    
                  </tr>
                </tbody>
              </q-markup-table>


              <CTitle ttype='subtitle' :title="$t('page.asset.github.title')" :desc="$t('page.asset.github.desc')"></CTitle>
              <highcharts class="hc box_chart" :options="g_chart['chart1']" ref="chart1"></highcharts>

            </q-tab-panel>

          </q-tab-panels>

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


        v_headers_vc: [
            { name:'name', label: this.$t('name.name'), field: 'name' },
            { name:'avg_roi', label: this.$t('name.roi')+'(%)', sortable:true,  field: 'avg_roi' ,
              format: (val, row) => `${Number(val).toLocaleString()}`, 
            },
            { name:'total_ret', label: this.$t('name.total_return')+'(%)', sortable:true, field: 'total_ret',
              format: (val, row) => `${Number(val).toLocaleString()}`,
            },
            { name:'homepage', label: this.$t('name.homepage'), align:'left', field: 'homepage'},
            { name:'description', label: this.$t('name.description'), align:'left', field: 'description'},
        ],

        v_items_vc: [],        
      }
    },

    methods: {
        getPriceDate: function(json_data,dic_columns,column) {
          let a_value = "$ " + CommonFunc.formatNumber(json_data['values'][0][dic_columns[column]],2) + " (" + json_data['values'][0][dic_columns[column+'_date']] + ')';
          return a_value;
        },

        filterVCData: function(items,column,vcs) {
          let new_items = [];
          let cryptovc = vcs.split(',');
          if (cryptovc.length==0) {
            return new_items;
          }

          for (let index=0;index<items.length;index++) {
            if (cryptovc.includes(items[index][column])) {
              new_items.push(items[index]);
            }
          }
          return new_items;
        },


        updateTable: function(data_base,data_vc) {
            const dic_columns = CommonFunc.getColumnDic(data_base.columns,[],[]);
            const dic_columns_vc = CommonFunc.getColumnDic(data_vc.columns,[],[]);
            let a_vc = data_base['values'][0][dic_columns['cryptovc']];
            logger.log.debug('items=',a_vc, dic_columns,);

            this.g_symbol = data_base['values'][0][dic_columns['symbol']];
            this.g_description = data_base['values'][0][dic_columns['description']];

            let items = CommonFunc.formatArrayToJson(data_vc);
            let items_vc = this.filterVCData(items,'name',a_vc);
            this.v_items_vc = items_vc;


            this.updateInfoTable(data_base);

/*
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
*/
            
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
          logger.log.debug('CAssetInfo.onClick - ',value);
          //this.updateTable(this.g_data,value);
          //this.loadGithubData(this.g_data);
        },

        onClickVC: function(vc) {
          logger.log.debug('CAssetInfo.onClick - ',vc);
          let dic_param = { name:'cryptovc', params:{} };
          this.$router.push(dic_param);
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
  color: #464646;
  font-size: 12px;
  font-weight:500;
}

.text-right {
  color:#5F5F5F;
  font-size:12px;
  font-weight: 700;
}


.investor {
  text-align: left;
  color:#464646;
}


.investor_name {
  text-align: left;
  font-size:12px;
}


.develop-low {
  line-height:0.2rem;
}

.develop-low h5 {
  color:#464646;
  font-size: 12px;
  margin-top:-0.6rem;
  margin-bottom:0.0rem;
}

.develop-low h6 {
  color:#5F5F5F;
  font-size: 16px;
  font-weight:bold;
  margin-top:-0.6rem;
  margin-bottom:0.0rem;
}
</style>

