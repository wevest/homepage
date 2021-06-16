<template>

    <div>
        <q-dialog v-model="v_show" 
            class="full-width window-height"
            position="bottom"
            persistent
            transition-show="slide-up"
            transition-hide="slide-down"
        >
            <q-card>
                <q-card-section>
                    <div class="row">
                        <div class="col">
                            <CryptoSelect ref="cryptoSelector" @onSelectAsset="onSelectAsset" />

<!--
                            <q-input 
                                v-model="v_portfolio_item.portfolio_id" 
                                label="Portfolio Group" 
                                :error="v_error.title.error"
                                :error-message="v_error.title.msg"
                            />

                            <q-input 
                                v-model="v_portfolio_item.asset_id" 
                                label="Symbol" 
                                :error="v_error.title.error"
                                :error-message="v_error.title.msg"
                            />
-->

                            <q-select
                                filled
                                v-model="v_portfolio_item.portfolio_id"
                                label="Portfolio Group"
                                :options="v_group_list"
                                option-label="label"
                                option-value="value"
                                map-options
                                emit-value
                                behavior="menu"
                                ref="selectPortfolio"
                            >
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            No results
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                            <q-input 
                                v-model="v_portfolio_item.price" 
                                label="Price($)" 
                                :error="v_error.title.error"
                                :error-message="v_error.title.msg"
                            />                            
                            <q-input 
                                v-model="v_portfolio_item.qty" 
                                label="Qty" type="number"
                                :error="v_error.title.error"
                                :error-message="v_error.title.msg"
                            />

                            <q-input 
                                type="textarea"
                                v-model="v_portfolio_item.description" 
                                label="Why add to portfolio" 
                                :error="v_error.title.error"
                                :error-message="v_error.title.msg"
                            />
                        </div>
                    </div>
                </q-card-section>       
                
                <q-card-actions>
                    <q-btn label="Save" @click="onClickSave" />
                    <q-btn label="Close" @click="onClickClose" />
                </q-card-actions>        

            </q-card>

        </q-dialog>

    </div>

</template>

<script>
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';

import CryptoSelect from "src/components/CryptoSelect";

import { PriceModel, PriceListModel } from "src/store/PriceModel";
import { PortfolioListModel, PortfolioItemModel } from "src/store/PortfolioModel";


export default {
    name: 'AddPortfolioDialog',
    components: {
        CryptoSelect
    },
    computed: {},
    data: function () {
        return {
            g_data: '',
            
            v_show: false,

            v_prices: new PriceListModel(),
            v_portfolio: new PortfolioListModel(),
            v_portfolio_item: new PortfolioItemModel(),
            v_selected_portfolio: null,

            v_groups: null,
            v_group_list: [],
        
            v_options: this.v_group_list,

            v_error: {
                title: {error:false, msg:''},
                text: {error:false, msg:''},
            },                    
        }
    },

    created: function () {
        console.log("AddPortfolioDialog.created");
    },
    mounted: function() {
        this.loadPrice();
    },
    updated: function() {
        //this.$refs.selectPortfolio.setOptionIndex(0);
    },
    
    methods: {      
        setPortfolio: function(v_portfolio) {
            this.v_portfolio = v_portfolio;
        },

        setPortfolioItem: function(v_portfolio_item) {
            this.v_portfolio_item = v_portfolio_item;
        },

        loadPrice: function() {
            this.v_prices.load().then( response => {
                logger.log.debug("loadPrice=",response);                
            });
            
        },

        getPrice: function(symbol) {
            let a_pair = symbol+"_USDT";
            let a_found = this.v_prices.find({currency_pair:a_pair});
            logger.log.debug("getPrice=",a_found);
            if (a_found) {
                this.v_portfolio_item.price = a_found.last;
            }
            
        },

        setPortfolioSelector: function() {
            let groups = [];
            for (let index=0;index<this.v_portfolio.models.length;index++) {
                groups.push( {value:this.v_portfolio.models[index].id, label:this.v_portfolio.models[index].name});
            }
            if (groups.length>0) {
                this.v_portfolio_item.portfolio_id = groups[0];
            }
            //logger.log.debug("setPortfolioSelector",groups);
            this.v_group_list = groups;
        },

        validate: function(v_post) {
            return true;
        },


        show: function(v_portfolio,v_portfolio_item) {
            logger.log.debug("AddPortfolioDialog.show : v_portfolio_item=",v_portfolio,v_portfolio_item);
            
            this.loadPrice();

            if (v_portfolio) {
                this.setPortfolio(v_portfolio);
            }
            if (v_portfolio_item) {
                this.setPortfolioItem(v_portfolio_item);
            }

            this.setPortfolioSelector();

            this.v_portfolio_item.asset_id = 1;
            this.v_portfolio_item.portfolio_id = -1;
            this.v_portfolio_item.price = 1.23;
            this.v_portfolio_item.qty = 1;
            this.v_portfolio_item.description = 'description';

            this.v_show = true;
        },

        hide: function() {
            this.v_show = false;
        },


        filterGroup: function(val, update) {
            if (val === '') {
                update(() => {
                    this.v_options = this.v_group_list
                })
                return
            }

            update(() => {
                const needle = val.toLowerCase()
                this.v_options = this.v_group_list.filter(v => v.toLowerCase().indexOf(needle) > -1)
            })            
        },
        
        onSelectAsset: function(param) {
            logger.log.debug('onSelectAsset param - ',param);
            this.v_portfolio_item.asset_id = param.value;
            this.getPrice(param.value);
        },

        onClickSave: function() {                        
            logger.log.debug('onClickSave - ',this.v_portfolio_item);

            //this.v_portfolio_item.add();
        },

        onClickClose: function() {
            logger.log.debug('onClickClose - ');
            this.hide();
        },


    }

};
</script>


<style scoped>

</style>