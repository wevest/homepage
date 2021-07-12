<template>

    <div>
        <q-table
        title="" flat
        class="sticky-column-table"
        row-key="name"        
        :data="data"
        :columns="v_headers"
        :pagination.sync="v_pagination"
        :rows-per-page-options="[20]"
        >
            <template v-slot:body="props">

                <q-tr :props="props">
                    <q-td key="utc_trade_date" :props="props">{{ props.row.utc_trade_date }}</q-td>
                    <q-td key="index" :props="props">{{ Number(props.row.index).toLocaleString() }}</q-td>
                    <q-td key="fall" :props="props">{{ Number(props.row.fall).toLocaleString() }}</q-td>
                    <q-td key="rise" :props="props">{{ Number(props.row.rise).toLocaleString() }}</q-td>
                    <q-td key="fall_prob" :props="props">{{ Number(props.row.fall_prob).toLocaleString() }}</q-td>
                    <q-td key="rise_prob" :props="props">{{ Number(props.row.rise_prob).toLocaleString() }}</q-td>
                </q-tr>            

            </template>
        </q-table>
    </div>    

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';


export default {
    name:'CWatchTable',
	props: {
        data: {
            required: true,
            default: null
        },
    },
    data() {
        return {
            v_headers: [
                { name:'utc_trade_date', label: '시간', field: 'utc_trade_date', align:'left', required:true, sortable:true  },
                { name:'index', label: this.$t('name.index'), field: 'index', sortable:true},
                { name:'fall', label: this.$t('name.fall'), field: 'fall', sortable:true},
                { name:'rise', label: this.$t('name.rise'), field: 'rise', sortable:true},
                { name:'fall_prob', label: this.$t('name.rise_prob'), field: 'fall_prob', sortable:true},
                { name:'rise_prob', label: this.$t('name.fall_prob'), field: 'rise_prob', sortable:true},
            ],
            v_pagination: {
                sortBy: 'utc_trade_date',
                descending: true,
            },
        }
    },
    methods: {

    }
};

</script>

<style scoped>

</style>
