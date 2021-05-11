<template>
    
    <div class="q-pa-md">
      
        <div class="row q-gutter-md"> 

            <q-list bordered class="rounded-borders">
                <q-item-label header>Google Inbox style</q-item-label>

                <q-item v-for="item in g_items">
                    <q-item-section avatar top>
                        <q-icon name="account_tree" color="black" size="34px" />
                    </q-item-section>

                    <q-item-section top class="col-2 gt-sm">
                        <q-item-label class="q-mt-sm">{{item['name']}}</q-item-label>
                    </q-item-section>

                    <q-item-section top>
                        <q-item-label lines="1">
                            <span class="text-grey-8"> {{item['description']}} </span>
                            <!--
                            <span class="text-weight-medium">[quasarframework/quasar]</span>
                            <span class="text-grey-8"> - GitHub repository</span>
                            -->
                        </q-item-label>
                    </q-item-section>

                    <q-item-section top class="col-2 gt-sm">
                        <q-item-label class="q-mt-sm">{{item['avg_roi']}}</q-item-label>
                    </q-item-section>

                    <q-item-section top class="col-2 gt-sm">
                        <q-item-label class="q-mt-sm">{{item['total_ret']}}</q-item-label>
                    </q-item-section>

                    <!--
                    <q-item-section top side>
                        <div class="text-grey-8 q-gutter-xs">
                            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
                            <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
                            <q-btn size="12px" flat dense round icon="more_vert" />
                        </div>
                    </q-item-section>
                    -->

                </q-item>

                <q-separator spaced />

            </q-list>

        </div>


      <div class="row">
            <div class="col">
                <CTitle ttype='title' :title="$t('chart.home_scaled.title')"></CTitle>          
                <ChartTimeframe period='daily' :onclick="onClickTimeframe" :selected='g_timeframe'></ChartTimeframe>          
                <CWatchChart ref='cwatchChart'></CWatchChart>
            </div>      
      </div>


  </div> 


</template>

<script>
import { MoaConfig } from 'src/data/MoaConfig';
import { CONST } from 'src/data/const';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import MoaBackendAPI from 'src/services/apiService';
import { LoadingBar } from 'quasar';

import CTitle from 'components/CTitle';
import CBigLabel from 'components/CBigLabel';
import ChartTimeframe from 'components/ChartTimeframe';
import CWatchChart from 'pages/cwatch/CWatchChart';


export default {
  name: 'PageCWatch',
  components: {
      CTitle,
      CBigLabel,
      ChartTimeframe,
      CWatchChart,
  },

  data: function () {
    return {
      g_data: '',
      g_items: [{'name':'test', 'description':'afadsfsfasfsdfsdf'}],

    }
  },
    created: function () {
        //console.log("HomeView.created");
    },
    mounted: function() {
        //console.log("HomeView.mounted - ");
        this.refresh();
    },
    updated: function() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        test: function() {
            logger.log.debug("HomeView.test=");
            this.showChart('A051910');
            //this.getFilteredData('A051910');
        },

        refresh: function() {
            const _this = this;
        
            LoadingBar.start();
            let funcs = [            
                //this.loadCalendarEffectData('1h'),
                this.loadCryptovcData(),
                //this.loadCryptoTopAssetData('1h')
            ];
            Promise.all(funcs).then(function() {
                LoadingBar.stop();
            });

        },
        
        convertToJson:function(data) {
            let items = [];
            for (let index=0;index<data['values'].length;index++) {
                let a_item = {};
                for (let index2=0;index2<data['columns'].length;index2++) {
                    a_item[data['columns'][index2]] = data['values'][index][index2];
                }
                items.push(a_item);
            }
            return items;
        },

        updateListData:function(data) {
            this.g_items = this.convertToJson(data);
        },

        loadCryptovcData: function() {
            const _this = this;

            return new Promise(function(resolve,reject) {
                //logger.log.debug("CWatchView.loadCryptoWatchData - dic_param=",dic_param);

                MoaBackendAPI.getCryptovcData({},function(response) {
                    _this.g_data = response.data.data;
                    logger.log.debug("CWatchView.loadCryptovcData - response",_this.g_data);
                    _this.updateListData(_this.g_data);
                    //logger.log.debug("CWatchView.loadCryptoWatchData - response",_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("CryptovcView.loadCryptovcData - error",err);
                    reject();
                });
            });            
        },
        

        onLoad: function(progress) {
            console.log('onLoad - ',progress);
        },


        onClickTimeframe: function(offset,timeframe) {
            //let ioffset = CONST.timeframe[this.g_timeframe];
            console.log('onClickTimeframe.ioffset=',offset);

            this.loadCryptoWatchData(offset);
        },

    }

};
</script>
