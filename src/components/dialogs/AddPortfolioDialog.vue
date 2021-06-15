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

                            <q-input 
                                v-model="v_portfolio_item.portfolio_id" 
                                label="Portfolio Group" 
                                :error="v_error.title.error"
                                :error-message="v_error.title.msg"
                            />
<!--
                            <q-input 
                                v-model="v_portfolio_item.asset_id" 
                                label="Symbol" 
                                :error="v_error.title.error"
                                :error-message="v_error.title.msg"
                            />

                            <q-input 
                                v-model="v_portfolio_item.price" 
                                label="Price" 
                                :error="v_error.title.error"
                                :error-message="v_error.title.msg"
                            />
-->                            
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

import { PortfolioItemModel } from "src/store/PortfolioModel";


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

            v_portfolio_item: new PortfolioItemModel(),
            
            v_page: {title:this.$t('page.cryptovc.title'), desc:''},
            v_error: {
                title: {error:false, msg:''},
                text: {error:false, msg:''},
            },                    
        }
    },

    created: function () {
        console.log("AddPortfolioDialog.created");
    },
    mounted: function() {},
    updated: function() {},
    
    methods: {      
        setPortfolioItem(portfolio_item) {
            this.v_portfolio_item = portfolio_item;            
        },

        
        validate: function(v_post) {
            return true;
        },


        show: function(v_portfolio_item) {
            logger.log.debug("AddPortfolioDialog.show : v_portfolio_item=",v_portfolio_item);
            
            if (v_portfolio_item) {
                this.setPortfolioItem(v_portfolio_item);
            }

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

        postProcess: function(response) {
            this.setPostID(response.data.id);
            this.v_post.saved = true;
        },

        onClickSave: function() {                        
            logger.log.debug('onClickSave - ',this.v_post);

            this.v_portfolio_item.add();
        },

        onClickClose: function() {
            logger.log.debug('onClickClose - ');
            this.hide();
        },
        
        onSelectAsset: function(param) {
            logger.log.debug('onSelectAsset param - ',param);
            this.v_portfolio_item.asset_id = param.value;
        }

    }

};
</script>


<style scoped>

</style>