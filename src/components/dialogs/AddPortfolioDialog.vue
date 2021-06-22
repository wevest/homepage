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
                    <div class="text-h6">Add Portfolio Item</div>
<!--                    
                    <div class="text-subtitle2">by John Doe</div>
-->                    
                </q-card-section>       
                <q-separator />         
                <q-card-section>
                    <div class="row">
                        <div class="col">
                            <CryptoSelect ref="cryptoSelector" @onSelectAsset="onSelectAsset" />
                            <br>
                            <q-select
                                filled
                                use-input fill-input hide-selected
                                input-debounce="0"
                                v-model="v_input"
                                label="Portfolio Group"
                                :options="v_group_list"
                                behavior="menu"
                                @input-value="onPortfolioChange"
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
                            <br />

                            <WTextArea v-model="v_portfolio_item.description" label="Description" rows="3" ref="descText" />
                       
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
import { ref } from 'vue';
import { store } from 'src/store/store';
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';

import WTextArea from "src/components/WTextArea";
import CryptoSelect from "src/components/CryptoSelect";

import UserModel from "src/models/UserModel";
import { PriceModel, PriceListModel } from "src/models/PriceModel";
import { PortfolioListModel, PortfolioItemModel } from "src/models/PortfolioModel";


export default {
    name: 'AddPortfolioDialog',
    components: {
        WTextArea,
        CryptoSelect
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data: function () {
        return {
            g_data: '',
            
            v_user: null,
            v_show: false,
            
            v_portfolio: new PortfolioItemModel(),
            v_portfolio_item: new PortfolioItemModel(),
            
            v_selected_asset: null,
            v_selected_portfolio: null,

            v_groups: null,
            v_group_list: [],
            
            v_input: null,
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
    beforeMount() {
        logger.log.debug("AddPortfolioDialog.beforeMounted - params=",this.$route.params);        
    },
    mounted: function() {
        //this.loadPrice();
    },
    updated: function() {
        //this.$refs.selectPortfolio.setOptionIndex(0);
    },
    
    methods: {      
        setPortfolio: function(v_portfolio) {
            this.v_portfolio = v_portfolio;
        },

        setPortfolioSelector: function(v_portfolio) {
            logger.log.debug("AddPortfolioDialog.setPortfolioSelector: v_portfolio=",v_portfolio);

            let groups = [];
            
            if (v_portfolio.items.length==0) {
                groups.push( MoaConfig.setting.defaultPortfolio );
            } else {
                for (let index=0;index<v_portfolio.items.length;index++) {
                    groups.push( v_portfolio.items[index].name );
                }
            }
            
            if (groups.length>0) {
                this.v_input = groups[0];
            }
            logger.log.debug("setPortfolioSelector",groups);
            this.v_group_list = groups;
        },

        validate: function(v_post) {
            return true;
        },


        show: function(v_user,v_portfolio_item) {
            //logger.log.debug("AddPortfolioDialog.show : v_portfolio=",v_portfolio_item);
            
            this.v_user = v_user;

            this.setPortfolioSelector(this.v_user.portfolio);

            if (v_portfolio_item) {
                this.v_portfolio_item = v_portfolio_item;
            } else {
                this.v_portfolio_item.asset_id = 1;
                this.v_portfolio_item.portfolio_id = -1;
                this.v_portfolio_item.price = 0;
                this.v_portfolio_item.qty = 0;
                this.v_portfolio_item.description = '';
            }

            logger.log.debug("AddPortfolioDialog.show : v_portfolio=",this.v_portfolio_item);

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
        
        onSelectAsset: function(asset) {
            logger.log.debug('onSelectAsset param - ',asset);
            this.v_selected_asset = asset;
            this.v_portfolio_item.asset_id = asset.id;
            
            let a_price = store.state.prices.getPrice(this.v_selected_asset.symbol);
            if (a_price) {
                this.v_portfolio_item.price = a_price.last;
            }            
        },

        onClickSave: function() {                        
            const _this = this;
            logger.log.debug('onClickSave - ',this.v_portfolio_item);
            this.v_portfolio_item.description = this.$refs.descText.getValue();

            this.v_portfolio_item.addToServer().then( response => {
                if (response.data.ret!=0) {
                    CommonFunc.showErrorMessage(_this,response.data.msg);
                } else {
                    CommonFunc.showOkMessage(_this,'Portfolio added');
                    _this.$emit("onPortfolioItemAdded",response.data);
                }
                
            }).catch( err=> {
                CommonFunc.showErrorMessage(_this,'Portfolio error');
            });
        },

        onClickClose: function() {
            logger.log.debug('onClickClose - ');
            this.hide();
        },

        onPortfolioChange: function(value) {      
            logger.log.debug('onPortfolioChange=',value, this.v_input);
            this.v_input = value;
            if (value.length>2) {
                this.v_portfolio_item.portfolio_name = value;
            }            
        },
/*
        onPortfolioInput: function(value) {
            logger.log.debug('onPortfolioInput=',value);
            this.v_portfolio_item.portfolio_name = value;
        },
*/
        onNewPortfolio: function(val,done) {
            logger.log.debug('onClickClose - ',val);
            done(val,'add-unique');
        }
    }

};
</script>


<style scoped>

</style>