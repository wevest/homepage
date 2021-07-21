<template>
    
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle ttype='title' :title="$t ('page.vcportfolio.title')" :desc="$t('page.vcportfolio.desc')"></CTitle>          
            </div>
        </div>
        
        <div class="row  q-gutter-md">
            <div class="col">
                <CTitle ttype='subtitle' :title="$t ('page.vcportfolio.roi.title')" :desc="$t ('page.vcportfolio.roi.desc')"></CTitle>
                <VCPortfolioTable ref='portfolioTable' @onClickVC="onClickVC"></VCPortfolioTable>

<!--
                <q-tabs v-model="v_tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
                    <q-tab name="portfolio" :label="$t('name.portfolio')" @click="onClickTab('portfolio')" />
                    <q-tab name="cryptovc" :label="$t('name.cryptovc')" @click="onClickTab('cryptovc')" />
                </q-tabs>

                <q-tab-panels
                v-model="v_tab"
                animated
                swipeable
                vertical
                keep-alive
                transition-prev="jump-up"
                transition-next="jump-up"
                >
                    <q-tab-panel name="portfolio">

                        <VCPortfolioTable ref='portfolioTable' @onClickVC="onClickVC"></VCPortfolioTable>

                    </q-tab-panel>

                    <q-tab-panel name="cryptovc">
        
                        <div class="row q-gutter-md">
                        <div class="col-6 col-md">
                            <CBigLabel ref='label_roi' title="abc"></CBigLabel>
                        </div>
                        <div class="col-6 col-md">
                            <CBigLabel ref='label_total' title="abc"></CBigLabel>
                        </div>
                        </div>

                        <q-card flat bordered class="my-card">
                        <q-card-section>
                            <div class="text-h6">{{v_cryptovc.name}}</div>
                        </q-card-section>

                        <q-separator dark inset />

                        <q-card-section>
                            {{ v_cryptovc.desc }}
                        </q-card-section>
                        </q-card>

                        <PortfolioTable ref='vcportTable'></PortfolioTable>
                            
                    </q-tab-panel>

                </q-tab-panels>
-->

            </div>      
        </div>

        <q-dialog v-model="v_dialog" persistent position="bottom">
            <q-card class="bg-teal text-white" style="width: 300px">
                <q-card-section>
                    <div class="text-h6">{{v_cryptovc.name}}</div>
                </q-card-section>

                <q-card-section class="q-pt-none">

                    <div class="row q-gutter-md">
                        <div class="col-3 col-md">
                            <h6>{{ Number(v_cryptovc.avg_roi).toLocaleString() }}</h6>
                            <a :href="v_cryptovc.homepage" target="_blank">{{ v_cryptovc.homepage}}</a>
                        </div>
                        <div class="col-9 col-md">
                            <q-input type="textarea" :value="v_cryptovc.description"  />
                        </div>
                    </div>
            
                    <div class="row q-gutter-md">
                        <div class="col">
                            {{ v_cryptovc.desc }}
                        </div>
                    </div>

                </q-card-section>

                <q-card-actions align="right" class="bg-white text-teal">
                    <q-btn flat label="OK" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

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
import PortfolioTable from 'components/PortfolioTable';
import VCPortfolioTable from 'pages/vcportfolio/VCPortfolioTable';
import ChartTimeframe from 'components/ChartTimeframe';

export default {
  name: 'PageCWatch',
  components: {
      CTitle,
      CBigLabel,
      PortfolioTable,
      VCPortfolioTable,
  },

  data: function () {
    return {
        g_data: '',
        g_data_vc:null,

        g_items: [{'name':'test', 'description':'afadsfsfasfsdfsdf'}],

        g_chart: {
            'chart1': { series: [], },
            'chart2': { series: [], },
        },
        v_portfolio: {title:this.$t('name.portfolio'), desc:''},
        v_page: {title: this.$t('page.vcportfolio.title'), desc:'' },

        v_tab:'portfolio',
        v_cryptovc:{name:'asd', description:'asd', homepage:'', avg_roi:''},
        v_dialog: false,

        headers: [
            { name:'rank', label: this.$t('name.rank'), field: 'rank', sortable:true },
            { name:'name', label: this.$t('name.name'), field: 'name' },
            { name:'avg_roi', label: this.$t('name.roi')+'(%)', sortable:true,  field: 'avg_roi' ,
              format: (val, row) => `${Number(val).toLocaleString()}`, 
            },
            { name:'total_ret', label: this.$t('name.total_return')+'(%)', sortable:true, field: 'total_ret',
              format: (val, row) => `${Number(val).toLocaleString()}`,
            },
            { name:'homepage', label: this.$t('name.homepage'), field: 'homepage'},
            { name:'description', label: this.$t('name.description'), field: 'description'},
        ],

        items: [],
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

        refresh: function() {
            const _this = this;
        
            LoadingBar.start();
            let funcs = [           
                this.loadCryptovcData(),
                this.loadCryptovcPortfolioData(),            
            ];
            Promise.all(funcs).then(function() {
                LoadingBar.stop();
            });

        },
        
        getMean: function(data,column) {
            let dic_columns = CommonFunc.getColumnDic(data.columns,[],[]);
            let a_sum = 0;
            for (let index=0;index<data.values.length;index++) {
                a_sum = a_sum + data.values[index][dic_columns[column]];
            }
            return a_sum/data.values.length;
        },

        updateWidget: function(data) {            
            logger.log.debug('data=',data);

            const a_roi = this.getMean(data,'avg_roi');
            const a_total = this.getMean(data,'total_ret');

            let a_label = {title:this.$t('name.avg_roi')+"(%)", value:a_roi, value_pct_change: 0};            
            this.$refs['label_roi'].update(a_label);                

            a_label = {title:this.$t('name.avg_total_return')+"(%)", value:a_total, value_pct_change: 0};            
            this.$refs['label_total'].update(a_label);                            
        },

        updateListData:function(data) {
            this.items = CommonFunc.formatArrayToJson(data);
        },

        loadCryptovcPortfolioData: function() {
            const _this = this;

            return new Promise(function(resolve,reject) {
                //logger.log.debug("CWatchView.loadCryptoWatchData - dic_param=",dic_param);
                let dic_param = {vc:''};
                MoaBackendAPI.getCryptoVCPortfolioData(dic_param,function(response) {
                    _this.g_data = response.data.data;
                    logger.log.debug("VCPortfolioView.loadCryptovcPortfolioData - response",_this.g_data);
                    _this.$refs.portfolioTable.update(_this.g_data);
                    //logger.log.debug("CWatchView.loadCryptoWatchData - response",_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("PortfolioTable.loadCryptovcPerformanceData - error",err);
                    reject();
                });
            });            
        },

        loadCryptovcData: function() {
            const _this = this;
            return new Promise(function(resolve,reject) {
                MoaBackendAPI.getCryptovcData({},function(response) {
                    _this.g_data_vc = response.data.data;
                    logger.log.debug("VCPortfolioView.loadCryptovcData - response",_this.g_data_vc);
                    resolve();
                },function(err) {
                    logger.log.error("VCPortfolio.loadCryptovcData - error",err);
                    reject();
                });
            });            
        },

        updatePortfolioTitle: function(vc) {
            this.v_portfolio.title = vc;
            this.v_portfolio.desc = this.$t('name.portfolio_desction');
        },

        navAsset:function(symbol) {
          let dic_param = { name:'asset', params:{ symbol:symbol } };
          this.$router.push(dic_param);
        },

        showCryptovc: function(vc) {
            logger.log.debug('showCryptovc - ',vc);

            let found_vc = null;
            let dic_columns = CommonFunc.getColumnDic(this.g_data_vc.columns,[],[]);
            for (let index=0;index<this.g_data_vc.values.length;index++ ) {
                if (this.g_data_vc.values[index][dic_columns['name']]==vc) {
                    found_vc = this.g_data_vc.values[index];
                    break;
                }
            }

            if (! found_vc) {
                return;
            }

            this.v_cryptovc = {
                name: vc, 
                homepage:found_vc[dic_columns['homepage']],
                description:found_vc[dic_columns['description']],
                avg_roi:found_vc[dic_columns['avg_roi']],
            };
            this.v_dialog = true;
        },



        onLoad: function(progress) {
            logger.log.debug('onLoad - ',progress);
        },


        onClickTab:function(value) {
            logger.log.debug('PortfolioValue.onClick - ',value);
            //this.updateTable(this.g_data,value);
        },

        onClickVC: function(vc) {
            logger.log.debug('VCPortfolioView.onClickVC - ',vc,this.$refs);
            this.showCryptovc(vc);
            //this.v_tab = 'v_tab';
            //this.$refs.vcportTable.update(vc);
        }

    }

};
</script>
