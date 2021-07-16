<template>

    <q-table
        title="" flat
        class="sticky-column-table"
        :data="v_items"
        :columns="v_headers"
        row-key="name"
        :pagination.sync="v_pagination"
        :rows-per-page-options="[10]"
        >
        <template v-slot:body="props">

            <q-tr :props="props">
                <q-td key="trade_date" :props="props">{{ props.row.trade_date }}</q-td>
                <q-td key="price" :props="props" class="text-red-10 text-bold">{{ Number(props.row.price).toLocaleString() }}</q-td>
                <q-td key="volume" :props="props">{{ Number(props.row.volume).toLocaleString() }}</q-td>
            </q-tr>            

        </template>

    </q-table>
    
</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import DataService from 'src/services/dataService';
import logger from "src/error/Logger";


export default {
    data() {
        return {
            v_headers: [
                { name:'trade_date', label: this.$t('name.trade_date'), field: 'trade_date', align:'left', required:true  },
                { name:'price', label: "$ "+this.$t('name.price'), field: 'price'},
                { name:'volume', label: this.$t('name.volume'), field: 'volume'},
            ],
            v_pagination: {
                sortBy: 'trade_date',
                descending: true,
            },
            v_items: [],         
        }
    },
    methods: {
        update: function(json_data) {            
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
    }
};
</script>
