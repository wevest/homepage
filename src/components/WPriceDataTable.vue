<template>
     
    <q-table
        title="" flat
        class="sticky-column-table"
        row-key="trade_date"        
        :data="v_items"
        :columns="v_headers"
        :pagination-label="getPagelabel"
        :pagination.sync="v_pagination"
        :rows-per-page-options="[10]"
        v-if="v_items.length>0"
        >
        <template v-slot:body="props">

            <q-tr :props="props">
                <q-td key="trade_date" :props="props">{{ props.row.trade_date }}</q-td>
                <q-td key="open" :props="props" class="text-red-10 text-bold">{{ Number(props.row.open).toLocaleString() }}</q-td>
                <q-td key="high" :props="props" class="text-red-10 text-bold">{{ Number(props.row.high).toLocaleString() }}</q-td>
                <q-td key="low" :props="props" class="text-red-10 text-bold">{{ Number(props.row.low).toLocaleString() }}</q-td>
                <q-td key="close" :props="props" class="text-red-10 text-bold">{{ Number(props.row.close).toLocaleString() }}</q-td>
                <q-td key="volume" :props="props">{{ Number(props.row.volume).toLocaleString() }}</q-td>
            </q-tr>            

        </template>

        <template v-slot:no-data="{ icon, message, filter }">
            <div class="full-width row flex-center text-accent q-gutter-sm">
                <q-icon size="2em" name="sentiment_dissatisfied" />
                <span>
                    Well this is sad... {{ message }}
                </span>
                <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
            </div>
        </template>

    </q-table>
    
</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import DataService from 'src/services/dataService';
import logger from "src/error/Logger";


export default {
    computed: {
    },
    data() {
        return {
            v_headers: [
                { name:'trade_date', label: this.$t('name.trade_date'), field: 'trade_date', align:'left', required:true  },
                { name:'open', label: "$ "+this.$t('name.price_open'), field: 'open'},
                { name:'high', label: "$ "+this.$t('name.price_high'), field: 'high'},
                { name:'low', label: "$ "+this.$t('name.price_low'), field: 'low'},
                { name:'close', label: "$ "+this.$t('name.price_close'), field: 'close'},
                { name:'volume', label: this.$t('name.volume'), field: 'volume'},
            ],
            v_pagination: {
                sortBy: 'trade_date',
                descending: true,
                //page:1,
                //rowsPerPage:10,
                //rowsNumber:10
            },
            v_items: [],         
        }
    },
    methods: {
        getPagelabel(firstRowIndex,endRowIndex,totalRowsNumber) {
            return firstRowIndex.toString() + " - " + endRowIndex.toString() + " of " + totalRowsNumber.toString();
        },
        update(json_data) {            
            //let dic_column = CommonFunc.getColumnDic( json_data['overall'].columns ,[],[]);

            let items = [];            
            for (let index=0;index<json_data.length;index++) {
                
                let a_item = {
                    trade_date: CommonFunc.unixToDatetime(json_data[index][0]),
                    open: json_data[index][1],
                    high: json_data[index][2],
                    low: json_data[index][3],
                    close: json_data[index][4],
                    volume: json_data[index][5],
                };
                items.push(a_item);
            }
            //logger.log.debug('WPriceDataTable.update : items=',items);
            this.v_items = items;
        },

        update_old(json_data) {            
            let dic_column = CommonFunc.getColumnDic( json_data['overall'].columns ,[],[]);

            let items = [];            
            for (let index=0;index<json_data['overall'].values.length;index++) {
                
                let a_item = {
                    trade_date: CommonFunc.safeGetJsonValue(json_data.overall.values,index,dic_column['trade_date']),
                    price: CommonFunc.safeGetJsonValue(json_data.overall.values,index,dic_column['priceClose']),
                    volume: CommonFunc.safeGetJsonValue(json_data.overall.values,index,dic_column['volume']),
                };
                items.push(a_item);
            }
            //logger.log.debug('items=',items);
            this.v_items = items;
        },

        updateTable(json_data) {

        }
    }
};
</script>
