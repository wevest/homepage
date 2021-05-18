<template>
    <div class="example">     
        <CTitle ttype='subtitle' :title="$t('page.trend.index.title')" :desc="$t('page.trend.index.desc')"></CTitle>          
        <div class="row">
            <ChartTimeframe period="monthly" :onclick="onClickTimeframe" :selected='v_timeframe' ref='tfIndex'></ChartTimeframe>
            <q-btn>test</q-btn>
        </div>
        <highcharts class="hc box_chart" :options="g_chart['chart1']" ref="chart1"></highcharts>
        
        <q-table
        title=""
        :data="v_items_index"
        :columns="v_headers_index"
        row-key="name"
        :pagination.sync="v_index_pagination"
        :rows-per-page-options="[20]"
        >
            <template v-slot:body="props">

                <q-tr :props="props">
                    <q-td key="trade_date" :props="props">{{ props.row.trade_date }}</q-td>
                    <q-td key="upbit" :props="props">{{ Number(props.row.upbit).toLocaleString() }}</q-td>
                    <q-td key="bithumb" :props="props">{{ Number(props.row.bithumb).toLocaleString() }}</q-td>                    
                    <q-td key="btc" :props="props">{{ Number(props.row.btc).toLocaleString() }}</q-td>
                    <q-td key="alt" :props="props">{{ Number(props.row.alt).toLocaleString() }}</q-td>
                    <q-td key="tv" :props="props">{{ Number(props.row.tv).toLocaleString() }}</q-td>
                </q-tr>            

            </template>

        </q-table>
                
        <CTitle ttype='subtitle' :title="$t('page.trend.dominance.title')" :desc="$t('page.trend.dominance.desc')"></CTitle>
        <ChartTimeframe period="monthly" :onclick="onClickTimeframe" :selected='v_timeframe' ref='tfDominance'></ChartTimeframe>
        <highcharts class="hc box_chart" :options="g_chart['chart2']" ref="chart2"></highcharts>

        <q-table
        title=""
        :data="v_items_dominance"
        :columns="v_headers_dominance"
        row-key="name"
        :pagination.sync="v_dominance_pagination"
        :rows-per-page-options="[20]"
        >
            <template v-slot:body="props">

                <q-tr :props="props">
                    <q-td key="trade_date" :props="props">{{ props.row.trade_date }}</q-td>
                    <q-td key="ratio_btc" :props="props">{{ Number(props.row.ratio_btc).toLocaleString() }}</q-td>
                    <q-td key="btc_tv" :props="props">{{ Number(props.row.btc_tv).toLocaleString() }}</q-td>
                    <q-td key="alt_tv" :props="props">{{ Number(props.row.alt_tv).toLocaleString() }}</q-td>
                </q-tr>            

            </template>

        </q-table>
                        

        <CTitle ttype='subtitle' :title="$t('page.trend.kpremium.title')" :desc="$t('page.trend.kpremium.desc')"></CTitle>
        <ChartTimeframe period="monthly" :onclick="onClickTimeframe" :selected='v_timeframe' ref='tfKpremium'></ChartTimeframe>
        <highcharts class="hc box_chart" :options="g_chart['chart3']" ref="chart3"></highcharts>

        <q-table
        title=""
        :data="v_items_kpremium"
        :columns="v_headers_kpremium"
        row-key="name"
        :pagination.sync="v_kpremium_pagination"
        :rows-per-page-options="[20]"
        >
            <template v-slot:body="props">

                <q-tr :props="props">
                    <q-td key="trade_date" :props="props">{{ props.row.trade_date }}</q-td>
                    <q-td key="upbit" :props="props">{{ Number(props.row.upbit).toLocaleString() }}</q-td>
                    <q-td key="kpremium_btc" :props="props">{{ Number(props.row.kpremium_btc).toLocaleString() }}</q-td>
                    <q-td key="kpremium_alt" :props="props">{{ Number(props.row.kpremium_alt).toLocaleString() }}</q-td>
                </q-tr>            

            </template>

        </q-table>
                        
        

        <CTitle ttype='subtitle' :title="$t('page.trend.sector.title')" :desc="$t('page.trend.sector.desc')"></CTitle>
        
        <q-tabs v-model="v_tab" class="text-grey" active-color="primary" indicated-color="primary" align="justify">
          <q-tab name="upbit" :label="tab_upbit" @click="onClickTab('upbit')" />
          <q-tab name="bithumb" :label="tab_bithumb" @click="onClickTab('bithumb')" />
        </q-tabs>

        <ChartTimeframe period="monthly" :onclick="onClickTimeframe" :selected='v_timeframe' ref='tfSector'></ChartTimeframe>       
        <highcharts class="hc box_chart" :options="g_chart['chart4']" ref="chart4"></highcharts>

        <q-table
        title=""
        :data="v_items_sector"
        :columns="v_headers_sector"
        row-key="name"
        :pagination.sync="v_sector_pagination"
        :rows-per-page-options="[20]"
        >
            <template v-slot:body="props">

                <q-tr :props="props">
                    <q-td key="trade_date" :props="props">{{ props.row.trade_date }}</q-td>
                    <q-td key="major" :props="props">{{ Number(props.row.major).toLocaleString() }}</q-td>
                    <q-td key="korean" :props="props">{{ Number(props.row.korean).toLocaleString() }}</q-td>                    
                    <q-td key="chinese" :props="props">{{ Number(props.row.chinese).toLocaleString() }}</q-td>
                    <q-td key="nft" :props="props">{{ Number(props.row.nft).toLocaleString() }}</q-td>
                    <q-td key="defi" :props="props">{{ Number(props.row.defi).toLocaleString() }}</q-td>
                    <q-td key="misc" :props="props">{{ Number(props.row.misc).toLocaleString() }}</q-td>
                </q-tr>            

            </template>

        </q-table>

        <CTitle ttype='subtitle' :title="$t('page.trend.sectortv.title')" :desc="$t('page.trend.sectortv.desc')"></CTitle>
        <ChartTimeframe period="monthly" :onclick="onClickTimeframe" :selected='v_timeframe' ref='tfSectortv'></ChartTimeframe>
        <highcharts class="hc box_chart" :options="g_chart['chart5']" ref="chart5"></highcharts>

        <q-table
        title=""
        :data="v_items_sectortv"
        :columns="v_headers_sectortv"
        row-key="name"
        :pagination.sync="v_sectortv_pagination"
        :rows-per-page-options="[20]"
        >
            <template v-slot:body="props">

                <q-tr :props="props">
                    <q-td key="trade_date" :props="props">{{ props.row.trade_date }}</q-td>
                    <q-td key="major" :props="props">{{ Number(props.row.major).toLocaleString() }}</q-td>
                    <q-td key="korean" :props="props">{{ Number(props.row.korean).toLocaleString() }}</q-td>                    
                    <q-td key="chinese" :props="props">{{ Number(props.row.chinese).toLocaleString() }}</q-td>
                    <q-td key="nft" :props="props">{{ Number(props.row.nft).toLocaleString() }}</q-td>
                    <q-td key="defi" :props="props">{{ Number(props.row.defi).toLocaleString() }}</q-td>
                    <q-td key="misc" :props="props">{{ Number(props.row.misc).toLocaleString() }}</q-td>
                </q-tr>            

            </template>

        </q-table>

    </div>

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CTitle from 'components/CTitle';
import ChartTimeframe from 'components/ChartTimeframe';


export default {
    name: 'CTrendChart',
    components: {
        CTitle,
        ChartTimeframe
    },
    data: function () {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",

            v_tab:'upbit',
            v_timeframe:'m6',
            tab_upbit: this.$t('name.upbit'),
            tab_bithumb: this.$t('name.bithumb'),

            g_chart: {
                'chart1': { series: [], },
                'chart2': { series: [],  },
                'chart3': { series: [], },
                'chart4': { series: [], },
                'chart5': { series: [], },
            },

            v_headers_index: [
                { name:'trade_date', label: '시간', field: 'trade_date', align:'left', sortable:true  },
                { name:'upbit', label: this.$t('name.upbit'), field: 'upbit'},
                { name:'bithumb', label: this.$t('name.bithumb'), field: 'bithumb'},
                { name:'btc', label: this.$t('name.bitcoin'), field: 'btc'},
                { name:'alt', label: this.$t('name.alt'), field: 'alt'},
                { name:'tv', label: this.$t('name.tv'), field: 'tv'},
            ],
            v_items_index: [],         
            v_index_pagination: {
                sortBy: 'trade_date',
                descending: true,
                //page: 2,
                //rowsPerPage: 3
                // rowsNumber: xx if getting data from a server
            },

            v_headers_dominance: [
                { name:'trade_date', label: '시간', field: 'trade_date', align:'left', sortable:true  },
                { name:'ratio_btc', label: this.$t('name.btc_tv_ratio'), field: 'ratio_btc'},
                { name:'btc_tv', label: this.$t('name.bitcoin'), field: 'btc_tv'},
                { name:'alt_tv', label: this.$t('name.alt'), field: 'alt_tv'},
            ],
            v_items_dominance: [],         
            v_dominance_pagination: {
                sortBy: 'trade_date',
                descending: true,
            },

            v_headers_kpremium: [
                { name:'trade_date', label: '시간', field: 'trade_date', align:'left', sortable:true  },
                { name:'upbit', label: this.$t('name.upbit'), field: 'upbit'},
                { name:'kpremium_btc', label: this.$t('name.bitcoin'), field: 'kpremium_btc'},
                { name:'kpremium_alt', label: this.$t('name.alt'), field: 'kpremium_alt'},
            ],
            v_items_kpremium: [],         
            v_kpremium_pagination: {
                sortBy: 'trade_date',
                descending: true,
            },

            v_headers_sector: [
                { name:'trade_date', label: '시간', field: 'trade_date', align:'left', sortable:true  },
                { name:'major', label: this.$t('category.major'), field: 'major'},
                { name:'korean', label: this.$t('category.korean'), field: 'korean'},
                { name:'chinese', label: this.$t('category.chinese'), field: 'chinese'},
                { name:'nft', label: this.$t('category.nft'), field: 'nft'},
                { name:'defi', label: this.$t('category.defi'), field: 'defi'},
                { name:'misc', label: this.$t('category.misc'), field: 'misc'},
            ],
            v_items_sector: [],         
            v_sector_pagination: {
                sortBy: 'trade_date',
                descending: true,
            },

            v_headers_sectortv: [
                { name:'trade_date', label: '시간', field: 'trade_date', align:'left', sortable:true  },
                { name:'major', label: this.$t('category.major'), field: 'major'},
                { name:'korean', label: this.$t('category.korean'), field: 'korean'},
                { name:'chinese', label: this.$t('category.chinese'), field: 'chinese'},
                { name:'nft', label: this.$t('category.nft'), field: 'nft'},
                { name:'defi', label: this.$t('category.defi'), field: 'defi'},
                { name:'misc', label: this.$t('category.misc'), field: 'misc'},
            ],
            v_items_sectortv: [],         
            v_sectortv_pagination: {
                sortBy: 'trade_date',
                descending: true,
            },

        }
    },

    methods: {

        updateIndexTable: function(json_data) {            
            let dic_column = CommonFunc.getColumnDic( json_data['upbit']['overall'].columns ,[],[]);

            let items = [];            
            for (let index=0;index<json_data['upbit']['overall'].values.length;index++) {
                
                let a_item = {
                    trade_date: CommonFunc.safeGetJsonValue(json_data.upbit.overall.values,index,dic_column['trade_date']),
                    upbit: CommonFunc.safeGetJsonValue(json_data.upbit.overall.values,index,dic_column['index_cumsum']),
                    bithumb: CommonFunc.safeGetJsonValue(json_data.bithumb.overall.values,index,dic_column['index_cumsum']),
                    tv: CommonFunc.safeGetJsonValue(json_data.binance.overall.values,index,dic_column['index_tv']),
                    btc: CommonFunc.safeGetJsonValue(json_data.binance.btc.values,index,dic_column['index_cumsum']),
                    alt: CommonFunc.safeGetJsonValue(json_data.binance.alt.values,index,dic_column['index_cumsum'])
                };
                items.push(a_item);
            }
            logger.log.debug('items=',items);
            this.v_items_index = items;
        },

        updateIndexChart: function(json_data) {
            let data_btc = CommonFunc.getChartData(json_data['binance'],'btc','index_cumsum','trade_date',false,0);
            let data_alt = CommonFunc.getChartData(json_data['binance'],'alt','index_cumsum','trade_date',false,0);
            let data_tv = CommonFunc.getChartData(json_data['binance'],'overall','index_tv','trade_date',false,0);
            let data_upbit = CommonFunc.getChartData(json_data['upbit'],'overall','index_cumsum','trade_date',false,0);
            let data_bithumb = CommonFunc.getChartData(json_data['bithumb'],'overall','index_cumsum','trade_date',false,0);

            //let a_minmax = CommonFunc.getMinMaxExt([data_btc.data,data_alt.data]);
            //let a_minmax2 = CommonFunc.getMinMaxExt([data_tv.data]);

            let series = [
                { name: this.$t('name.btc'), type: 'line', yAxis:0, data: data_btc.data},
                { name: this.$t('name.alt'), type: 'line', yAxis:0, data: data_alt.data},
                { name: this.$t('name.upbit'), type: 'line', yAxis:0, data: data_upbit.data},
                { name: this.$t('name.bithumb'),type: 'line', yAxis:0, data: data_bithumb.data},
                { name: this.$t('name.tv'),type: 'column', opacity:0.7, yAxis:1, data: data_tv.data },
            ];

            //console.log("updateAlphaChart : yaxis=",data_index);

            this.g_chart['chart1'] = CommonFunc.getChartOption(series);
        },

        getDominanceData: function(json_data) {
            let data_tv = CommonFunc.getChartData(json_data['binance'],'overall','index_tv','trade_date',false,0);
            let data_tv_btc = CommonFunc.getChartData(json_data['binance'],'btc','index_tv','trade_date',false,0);
            let data_tv_alt = CommonFunc.getChartData(json_data['binance'],'alt','index_tv','trade_date',false,0);
            
            let data_ratio_btc = [];
            for (var index=0;index<data_tv.data.length;index++) {
                let a_value = data_tv_btc.data[index].y/data_tv.data[index].y
                data_ratio_btc.push( {x:data_tv.data[index].x , y:CommonFunc.round(a_value,2)} )
            }

            let data_ratio_alt = [];
            for (var index=0;index<data_tv.data.length;index++) {
                let a_value = data_tv_alt.data[index].y/data_tv.data[index].y
                data_ratio_alt.push( {x:data_tv.data[index].x , y:CommonFunc.round(a_value,2)} )
            }

            return {'tv':data_tv.data, 'btc_tv':data_tv_btc.data, 'alt_tv':data_tv_alt.data, 
                'ratio_btc':data_ratio_btc, 'ratio_alt':data_ratio_alt};
        },

        updateDominanceTable: function(json_data) {            
            let dic_column = CommonFunc.getColumnDic( json_data['binance']['overall'].columns ,[],[]);

            let data = this.getDominanceData(json_data);
            
            //logger.log.debug('dic_column=',dic_column);
            //logger.log.debug('data=',data);

            let items = [];            
            for (let index=0;index<data.tv.length;index++) {
                
                let a_item = {
                    trade_date: json_data.binance.overall.values[index][dic_column['trade_date']],
                    //trade_date: CommonFunc.unixToDatetime(data.tv[index].x),
                    ratio_btc: data.ratio_btc[index].y,
                    btc_tv: data.btc_tv[index].y,
                    alt_tv: data.alt_tv[index].y,
                };
                items.push(a_item);
            }
            //logger.log.debug('items=',items);
            this.v_items_dominance = items;
        },


        updateDominanceChart: function(json_data) {
            let data = this.getDominanceData(json_data);

            let series = [
                { name: this.$t('name.btc_tv_ratio'),type: 'line', yAxis:0, data: data.ratio_btc},
                //{ name: this.$t('ratio_alt'),type: 'line', yAxis:0, data: data_ratio_alt},
                { name: this.$t('name.btc'),type: 'area', opacity:0.7, yAxis:1, data: data.btc_tv},
                { name: this.$t('name.alt'),type: 'area', opacity:0.7, yAxis:1, data: data.alt_tv},
            ];

            this.g_chart['chart2'] = CommonFunc.getChartOption(series) ;
        },



        updateKpremiumTable: function(json_data) {            
            let dic_column = CommonFunc.getColumnDic( json_data['upbit']['overall'].columns ,[],[]);

            let items = [];            
            for (let index=0;index<json_data['upbit']['overall'].values.length;index++) {
                
                let a_item = {
                    trade_date: CommonFunc.safeGetJsonValue(json_data.upbit.overall.values,index,dic_column['trade_date']),
                    upbit: CommonFunc.safeGetJsonValue(json_data.upbit.overall.values,index,dic_column['index_cumsum']),
                    kpremium_btc: CommonFunc.safeGetJsonValue(json_data.kpremium.btc.values,index,dic_column['price_avg']),
                    kpremium_alt: CommonFunc.safeGetJsonValue(json_data.kpremium.alt.values,index,dic_column['price_avg']),
                };
                items.push(a_item);
            }
            logger.log.debug('items=',items);
            this.v_items_kpremium = items;
        },

        updateKpremiumChart: function(json_data) {
            let data_index = CommonFunc.getChartData(json_data['upbit'],'overall','index_cumsum','trade_date',false,0);
            let data_tv_btc = CommonFunc.getChartData(json_data['kpremium'],'btc','price_avg','trade_date',false,0);
            let data_tv_alt = CommonFunc.getChartData(json_data['kpremium'],'alt','price_avg','trade_date',false,0);
        
            let series = [
                { name: this.$t('name.index'),type: 'line', yAxis:1, data: data_index.data},
                { name: this.$t('name.btc'),type: 'line', yAxis:0, data: data_tv_btc.data},
                { name: this.$t('name.alt'),type: 'line', yAxis:0, data: data_tv_alt.data},
            ];

            //let a_minmax = CommonFunc.getMinMaxExt([data_tv_btc.data,data_tv_alt.data]);

            this.g_chart['chart3'] = CommonFunc.getChartOption(series) ;
        },

        updateSectorTable: function(target,json_data,exchange,column) {
            let dic_column = CommonFunc.getColumnDic( json_data[exchange]['overall'].columns ,[],[]);
            
            let items = [];            
            for (let index=0;index<json_data[exchange]['overall'].values.length;index++) {
                
                let a_item = {
                    trade_date: CommonFunc.safeGetJsonValue(json_data[exchange].overall.values,index,dic_column['trade_date']),
                    major: CommonFunc.safeGetJsonValue(json_data[exchange].major.values,index,dic_column[column]),
                    korean: CommonFunc.safeGetJsonValue(json_data[exchange].korean.values,index,dic_column[column]),
                    chinese: CommonFunc.safeGetJsonValue(json_data[exchange].chinese.values,index,dic_column[column]),
                    nft: CommonFunc.safeGetJsonValue(json_data[exchange].nft.values,index,dic_column[column]),
                    defi: CommonFunc.safeGetJsonValue(json_data[exchange].defi.values,index,dic_column[column]),
                    misc: CommonFunc.safeGetJsonValue(json_data[exchange].misc.values,index,dic_column[column]),
                };
                items.push(a_item);
            }
            logger.log.debug('items=',items);
            if (target=='index') {
                this.v_items_sector = items;
            } else {
                this.v_items_sectortv = items;
            }
            
        },

        updateSectorChart: function(json_data,exchange,column,target) {            
            let data_major = CommonFunc.getChartData(json_data[exchange],'major',column,'trade_date',false,0);
            let data_korean = CommonFunc.getChartData(json_data[exchange],'korean',column,'trade_date',false,0);
            let data_chinese = CommonFunc.getChartData(json_data[exchange],'chinese',column,'trade_date',false,0);
            let data_defi = CommonFunc.getChartData(json_data[exchange],'defi',column,'trade_date',false,0);
            let data_nft = CommonFunc.getChartData(json_data[exchange],'nft',column,'trade_date',false,0);
            let data_misc = CommonFunc.getChartData(json_data[exchange],'misc',column,'trade_date',false,0);

            let series = [
                { name:this.$t('category.major'), type:'line', data: data_major.data},
                { name:this.$t('category.korean'), type:'line', data: data_korean.data},
                { name:this.$t('category.chinese'), type:'line', data: data_chinese.data},
                { name:this.$t('category.defi'), type:'line', data: data_defi.data},
                { name:this.$t('category.nft'), type:'line', data: data_nft.data},
                //{ name: 'misc',type: 'line', data: data_misc.data},
            ];

            this.g_chart['chart4'] = CommonFunc.getChartOption(series) ;
        },

        updateSectorTVChart: function(json_data,exchange,column) {            
            let data_major = CommonFunc.getChartData(json_data[exchange],'major',column,'trade_date',false,0);
            let data_korean = CommonFunc.getChartData(json_data[exchange],'korean',column,'trade_date',false,0);
            let data_chinese = CommonFunc.getChartData(json_data[exchange],'chinese',column,'trade_date',false,0);
            let data_defi = CommonFunc.getChartData(json_data[exchange],'defi',column,'trade_date',false,0);
            let data_nft = CommonFunc.getChartData(json_data[exchange],'nft',column,'trade_date',false,0);
            let data_misc = CommonFunc.getChartData(json_data[exchange],'misc',column,'trade_date',false,0);

            let categories = [];
            for (var index=0;index<data_major.data.length;index++) {
                categories.push( data_major.data[index].x );
            }

            let series = [
                { name:this.$t('category.major'), type:'line', data: data_major.data},
                { name:this.$t('category.korean'), type:'line', data: data_korean.data},
                { name:this.$t('category.chinese'), type:'line', data: data_chinese.data},
                { name:this.$t('category.defi'), type:'line', data: data_defi.data},
                { name:this.$t('category.nft'), type:'line', data: data_nft.data},
            ];
            
            //console.log('series=',series);
            let a_option = CommonFunc.getChartOption(series);
            
            //a_option.xAxis = {
            //    type: 'datetime', categories:categories
            //};
            //xAxis: { type: 'datetime' },                            
            a_option.yAxis = { title: {text:''} };
            a_option.plotOptions = {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: false
                    }
                }
            };
            this.g_chart['chart5'] = a_option;        

        },

        update: function(json_data) {
            logger.log.debug('CTrendChart.update : =',json_data);
            this.g_data = json_data;

            this.updateIndexChart(json_data);
            this.updateIndexTable(json_data);

            this.updateDominanceChart(json_data);
            this.updateDominanceTable(json_data);

            this.updateKpremiumChart(json_data);   
            this.updateKpremiumTable(json_data);   

            this.updateSectorChart(json_data,'upbit','index_cumsum','chart4');
            this.updateSectorTable('index',json_data,'upbit','index_cumsum');

            this.updateSectorTVChart(json_data,'upbit','index_tv');
            this.updateSectorTable('tv',json_data,'upbit','index_tv');
        },

        onClickTab:function(exchange) {
            console.log('CTrendView.onClick - ',exchange);

            this.updateSectorChart(this.g_data,exchange,'index_cumsum');
            this.updateSectorTable('index',this.g_data,exchange,'index_cumsum');

            this.updateSectorTVChart(this.g_data,exchange,'index_tv');
            this.updateSectorTable('tv',this.g_data,exchange,'index_tv');
        },

        onClickTimeframeIndex:function(value) {
            logger.log.debug('CTrendView.onClickTimeframeIndex - ',value);
            //this.updateIndexChart(this.g_data);
            //this.updateIndexTable(this.g_data);
        },

        onClickTimeframe: function(offset,timeframe) {
            logger.log.debug('CTrendView.onClickTimeframe - ',timeframe);
            
            this.v_timeframe = timeframe;
            this.$parent.onClickTimeframe('trend',offset);
        },

    }
  }
</script>
