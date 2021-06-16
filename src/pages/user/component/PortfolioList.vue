<template>
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <div> 
                    <q-list separator>
                        <q-item v-for="(a_portfolio,index) in v_portfolio.items" :key="index" >
                            <q-item-section @click="onClickPortfolio(a_portfolio)">
                                <q-item-label>{{a_portfolio.name}}</q-item-label>
                                <q-item-label caption lines="2">{{a_portfolio.description}}</q-item-label>
                            </q-item-section>
                            <q-item-section top class="col-2 gt-sm">
                                <q-item-label class="q-mt-sm">
                                    <span>$ {{a_portfolio.evaluated_value }} </span>
                                </q-item-label>
                                <q-item-label class="q-mt-sm">                                    
                                    <span> {{a_portfolio.roi }} %</span>
                                </q-item-label>
                            </q-item-section>                            
                            <q-item-section side>{{a_portfolio.updated_at}}</q-item-section>
                            <q-item-section top side>
                                <div class="text-grey-8">
                                    <q-btn size="12px" flat dense round icon="add" @click="onClickAdd(a_portfolio)" />
                                    <q-btn size="12px" flat dense round icon="remove" @click="onClickDelete(a_portfolio)" />
                                    <q-btn size="12px" flat dense round icon="edit" @click="onClickEdit(a_portfolio)" />
                                </div>
                            </q-item-section>               
                        </q-item>

<!--
                        <q-expansion-item
                            v-for="(a_portfolio,index) in v_portfolio" :key="index"
                            expand-separator
                            icon="perm_identity"
                            :label="a_portfolio.name"
                            :caption="a_portfolio.description"
                        >
                            
                        </q-expansion-item>
-->
                    </q-list>

                </div>
            </div>
        </div>

    </div>

</template>

<script>
import {store} from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import { PortfolioListModel, PortfolioModel, PortfolioItemModel} from "src/store/PortfolioModel";

export default {
    components: {},
    props: {},

    data: () => ({
        g_data: null,

        v_user: null,
        v_portfolio: new PortfolioListModel(),

        v_headers: [
            { name:'symbol', label: 'name.symbol', field: 'symbol' },
            { name:'price', label: 'name.roi', sortable:true,  field: 'price' ,
              format: (val, row) => `${Number(val).toLocaleString()}`, 
            },
            { name:'qty', label: 'name.last_price', field: 'qty'},
            { name:'updated_at', label: 'name.homepage', field: 'updated_at'},            
        ],

    }),
    computed: {},

    mounted: function() {},

    methods: {        

        update: function(v_portfolio) {
            this.v_portfolio = v_portfolio;
        },

        onClickPortfolio: function(a_portfolio) {
            logger.log.debug("onClickPortfolio: portfolio=",a_portfolio);
            this.$emit("onClickPortfolio",a_portfolio);
        }
    },

}

</script>



<style scope> 
</style>
