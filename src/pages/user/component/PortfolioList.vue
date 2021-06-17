<template>

<<<<<<< HEAD
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
=======
    <div class="row">
        <div class="col">
            <div> 

                <q-card bordered v-for="(a_portfolio,index) in v_portfolio.items" :key="index" >
                    <q-card-section>
                        <div class="row">
                            <div>{{a_portfolio.name}}</div>>
                            <div>{{a_portfolio.description}}</div>
                            <q-space />
                            <q-btn side size="12px" flat dense round icon="navigate_next" @click="onClickPortfolio(a_portfolio)" />
                        </div>
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                        <div class="row">
                            <div class="col-4">
                                <span> {{ Number(a_portfolio.roi).toLocaleString() }} %</span>
                            </div>
                            <div class="col-4">
                                <span>$ {{a_portfolio.evaluated_value.toLocaleString() }} </span>                            
                            </div>
                            <div class="col-2">
                                {{ v_updated_at(a_portfolio.updated_at) }}
                            </div>
                            <div class="col-2">
>>>>>>> 795da4537a2317d9007c0932bb10e25c43b917d4
                                <div class="text-grey-8">
                                    <q-btn size="12px" flat dense round icon="add" @click="onClickAdd(a_portfolio)" />
                                    <q-btn size="12px" flat dense round icon="remove" @click="onClickDelete(a_portfolio)" />
                                    <q-btn size="12px" flat dense round icon="edit" @click="onClickEdit(a_portfolio)" />
                                </div>
<<<<<<< HEAD
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
=======
                            </div>               
                        </div>
                    </q-card-section>

                </q-card>
>>>>>>> 795da4537a2317d9007c0932bb10e25c43b917d4

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

    }),
    computed: {
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        }
    },

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
