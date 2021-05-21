<template>
    
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle ttype='title' :title="v_page.title" :desc="v_page.desc"></CTitle>      
            </div>
        </div>
        
        <div class="row q-gutter-md">
            <div class="col-12 col-md">
                <CBigLabel ref='label_roi' title="abc"></CBigLabel>
            </div>
            <div class="col-12 col-md">
                <CBigLabel ref='label_total' title="abc"></CBigLabel>
            </div>
        </div>
        
        <div class="row">
            <div class="col">
                <CTitle ttype='subtitle' :title="$t('page.cryptovc.roi.title')"  :desc="$t('page.cryptovc.roi.desc')"></CTitle>
                <q-skeleton v-if="!v_chart_loaded" animation="fade" square height="450px" />
                <highcharts v-show="v_chart_loaded" class="box_chart" :options="g_chart['chart1']" ref="chart1"></highcharts>
            </div>
        </div>

        <div class="row q-gutter-md"> 
            <div class="col">

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
            </div>
        </div>


      <div class="row">
            <div class="col">
                <CTitle ttype='subtitle' :title="v_portfolio['title']" :desc="v_portfolio['desc']"></CTitle>          
                <PortfolioTable ref='portfolioTable'></PortfolioTable>
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
import PortfolioTable from 'pages/cryptovc/PortfolioTable';


export default {
  name: 'PageCWatch',
  components: {
      CTitle,
      CBigLabel,
      ChartTimeframe,
      PortfolioTable,
  },

  data: function () {
    return {
        g_data: '',
        g_items: [{'name':'test', 'description':'afadsfsfasfsdfsdf'}],

        g_chart: {
            'chart1': { series: [], },
            'chart2': { series: [], },
        },
        
        v_page: {title:this.$t('page.cryptovc.title'), desc:''},
        v_portfolio: {title:this.$t('page.cryptovc.portfolio.title'), desc:''},
        v_chart_loaded: false,

        headers: [
            { name:'rank', label: this.$t('name.rank'), field: 'rank', sortable:true },
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
                //this.loadCalendarEffectData('1h'),
                this.loadCryptovcData(),
                //this.loadCryptoTopAssetData('1h')
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

        loadCryptovcData: function() {
            const _this = this;

            return new Promise(function(resolve,reject) {
                //logger.log.debug("CWatchView.loadCryptoWatchData - dic_param=",dic_param);

                MoaBackendAPI.getCryptovcData({},function(response) {
                    _this.g_data = response.data.data;
                    logger.log.debug("CWatchView.loadCryptovcData - response",_this.g_data);
                    _this.updateWidget(_this.g_data);
                    _this.updateListData(_this.g_data);
                    _this.updateVCChart(_this.g_data);
                    //logger.log.debug("CWatchView.loadCryptoWatchData - response",_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("CryptovcView.loadCryptovcData - error",err);
                    reject();
                });
            });            
        },
        

        updateVCChart: function(data) {

            let dic_columns = CommonFunc.getColumnDic(data.columns,[],[]);
            let items = [];
            for (let index=0;index<data.values.length;index++) {
                items.push( [data.values[index][dic_columns['name']],data.values[index][dic_columns['avg_roi']]] ); ;
            }

            let series = [
                { name: this.$t('name.investor'),type: 'bar', yAxis:0, data: items,
                    dataLabels: { 
                       enabled: true, rotation: -90,format: '{point.y:.0f}', y: 10,
                    }
                },
            ];

            //console.log("updateVCChart : data=",items);

            let a_option = CommonFunc.getChartOption(series);
            a_option.xAxis.type = 'category';
            a_option.xAxis.labels = {rotation: -90};
            a_option.legend = { enabled:false };
            //a_option.yAxis[1] = {mshow:true, opposite:true, gridLineWidth:0};
            this.g_chart['chart1'] = a_option;

            this.v_chart_loaded = true;
        },

        updatePortfolioTitle: function(vc) {
            this.v_portfolio.title = vc;
            this.v_portfolio.desc = this.$t('name.portfolio_desction');
        },

        navAsset:function(symbol) {
          let dic_param = { name:'asset', params:{ symbol:symbol } };
          this.$router.push(dic_param);
        },

        onLoad: function(progress) {
            logger.log.debug('onLoad - ',progress);
        },

        onClickVC: function(vc) {
            logger.log.debug('onClickVC - ',vc);
            this.updatePortfolioTitle(vc);
            this.$refs.portfolioTable.update(vc);
        }

    }

};
</script>
