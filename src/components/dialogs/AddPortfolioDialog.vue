<template>

    <div>
        <q-dialog 
            v-model="v_show" 
            class="full-width window-height"
            position="top"
            persistent
            transition-show="slide-down"
            transition-hide="slide-up"
        >
            <q-card>
                <q-card-section>
                    <div class="row">
                        <div class="closeButton">
                            <WDialogCloseButton @onClick="onClickClose" />&nbsp;
                        </div>

                        <div class="q-pl-sm">
                            <div>
                                <span class="text-h6">{{v_title}}</span>
                            </div>
                            <div>
                                <span class="gCaption">{{ $t('dialog.add_portfolio.desc') }}</span>
                            </div>
                        </div>
                        
                    </div>
                </q-card-section>       
                <q-separator />         
                <q-card-section>
                    <div class="row">
                        <div class="col">
                            <CryptoSelect ref="cryptoSelector" 
                            :label="$t('dialog.add_portfolio.asset.title')" 
                            filled="1"
                                @onSelect="onSelectAsset"  />
                            <br>
                            <q-select
                                filled use-input fill-input hide-selected
                                input-debounce="0"
                                v-model="v_input"
                                :label="$t('dialog.add_portfolio.group_name.title')" 
                                :options="v_group_list"
                                behavior="menu"
                                @input-value="onPortfolioChange"
                                ref="selectPortfolio"
                            >
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            {{ $t('dialog.add_portfolio.no_results.title') }}
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
                            <br />

                            <WTextArea v-model="v_portfolio_item.description" ref="descText"
                                maxLength="300" showLength="1"
                                label="Description" rows="5" :hint="$t('dialog.add_portfolio.description.title')" 
                                customStyle="border:none;background:#f2f2f2;" />
                       
                        </div>
                    </div>
                </q-card-section>       
                
                <q-card-actions >
                    <q-btn class="fit"  color="primary" ripple
                        :label="v_button_label" :loading="v_loading" @click="onClickSave" />
                </q-card-actions>        

            </q-card>

        </q-dialog>

    </div>

</template>


<script>
import { store } from 'src/store/store';
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import WTextArea from "src/components/WTextArea";
import WDialogCloseButton from "src/components/WDialogCloseButton";
import CryptoSelect from "src/components/CryptoSelect";

//import UserModel from "src/models/UserModel";
//import { PriceModel, PriceListModel } from "src/models/PriceModel";
import { PortfolioListModel, PortfolioItemModel } from "src/models/PortfolioModel";


export default {
    name: 'AddPortfolioDialog',
    components: {
        WTextArea,
        CryptoSelect,
        WDialogCloseButton
    },
	props: {
        title: {
            type:String,
            default: 'Add Portfolio Item',
        },
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_title() {
            if (this.v_portfolio_item.id) {
                return 'Update Portfolio Item';
            }
            return 'Add Portfolio Item';
        },
        v_button_label() {
            if (! this.v_is_new) {
                return this.$t("button.update");
            }
            return this.$t("button.add");
        },
        v_is_new() {
            if (this.v_portfolio_item.id) return false;
            return true;
        }
    },
    data() {
        return {
            g_data: '',
            
            v_user: null,
            v_show: false,
            
            //v_portfolio: new PortfolioItemModel(),
            v_portfolio_item: new PortfolioItemModel(),
            
            v_loading: false,
            //v_title: this.title,

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

    created() {
        logger.log.debug("AddPortfolioDialog.created");
    },
    beforeMount() {
        logger.log.debug("AddPortfolioDialog.beforeMounted - params=",this.$route.params);        
    },
    mounted() {
        logger.log.debug("AddPortfolioDialog.mounted");
    },
    updated() {
        logger.log.debug("AddPortfolioDialog.updated : v_portfolio_item=",this.v_portfolio_item);
        
        if ( (this.v_portfolio_item) && (this.v_portfolio_item.id)) {
            this.fillValue();
        }
    },
    
    methods: {   
        clear() {
            this.v_portfolio_item.asset_id = 1;
            this.v_portfolio_item.portfolio_id = -1;
            this.v_portfolio_item.price = 0;
            this.v_portfolio_item.qty = 0;
            this.v_portfolio_item.description = '';
            
            //this.v_input = '';
            if (this.$refs.descText) {
                this.$refs.descText.clear();
            }            
            if (this.$refs.cryptoSelector) {
                this.$refs.cryptoSelector.setValue('');
            }
            this.v_loading = false;
        },

        fillValue() {
            logger.log.debug("AddPortfolioDialog.fillValue");
            this.v_input = this.v_portfolio_item.portfolio_name;
            if (this.$refs.cryptoSelector) {
                this.$refs.cryptoSelector.setValue(this.v_portfolio_item.api_asset.symbol);            
            }
        },
        setPortfolioItem(v_portfolio) {
            this.v_portfolio_item = v_portfolio;
        },

        setPortfolioSelector(v_portfolio) {
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

        validate(v_post) {
            return true;
        },


        show(v_user,v_portfolio_item) {
            logger.log.debug("AddPortfolioDialog.show : v_portfolio=",v_portfolio_item);
            
            this.v_user = v_user;

            this.setPortfolioSelector(this.v_user.portfolio);

            if (v_portfolio_item) {
                this.setPortfolioItem(v_portfolio_item);
            } else {
                this.clear();
            }

            logger.log.debug("AddPortfolioDialog.show : v_portfolio=",this.v_portfolio_item);

            this.v_loading = false;
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
        processSave() {
            const _this = this;
            this.v_loading = true;
            this.v_portfolio_item.addToServer().then( response => {
                if (response.data.ret!=0) {
                    _this.v_loading = false;
                    CommonFunc.showErrorMessage(_this,response.data.msg);
                    return;
                } 
                CommonFunc.showOkMessage(_this,'Portfolio added');
                
                _this.v_user.portfolio.addPortfolioItem(response.data.portfolio_item);
                _this.v_user.portfolio.calcPerformance(store.state.prices);
                _this.clear();
                
                _this.$emit("onPortfolioItemAdded",_this.v_portfolio_item);
                //_this.hide();

            }).catch( err=> {
                _this.v_loading = false;
                CommonFunc.showErrorMessage(_this,'Portfolio error');
            });

        },
        processUpdate() {
            const _this = this;
            this.v_loading = true;
            this.v_portfolio_item.updateToServer().then( response => {
                
                if (response.data.ret!=0) {
                    _this.v_loading = false;
                    CommonFunc.showErrorMessage(_this,response.data.msg);
                    return;
                } 
                CommonFunc.showOkMessage(_this,'Portfolio updated');
                
                //_this.v_user.portfolio.addPortfolioItem(response.data.portfolio_item);
                _this.v_user.portfolio.calcPerformance(store.state.prices);
                _this.clear();                
                _this.$emit("onPortfolioItemUpdated",_this.v_portfolio_item);
                //_this.hide();

            }).catch( err=> {
                _this.v_loading = false;
                CommonFunc.showErrorMessage(_this,'Portfolio error');
            });

        },

        onSelectAsset(asset) {
            logger.log.debug('AddPortfolioDialog.onSelectAsset param - ',asset);
            this.v_selected_asset = asset;
            this.v_portfolio_item.asset_id = asset.id;
            
            let a_price = store.state.prices.getPrice(this.v_selected_asset.symbol);
            if (a_price) {
                this.v_portfolio_item.price = a_price.last;
            }            
        },

        onClickSave() {                        
            logger.log.debug('AddPortfolioDialog.onClickSave - ',this.v_portfolio_item);
            this.v_portfolio_item.description = this.$refs.descText.getValue();
            
            if (this.v_is_new) {
                this.processSave();
            } else {
                this.processUpdate();
            }            
            
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
.closeButton {
    margin:-10px 10px 0px -10px;
}
</style>