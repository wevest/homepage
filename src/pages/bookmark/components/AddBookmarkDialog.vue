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
                    <div>
<!--                        
                        <CryptoSelect ref="cryptoSelector" filled="1"
                            :label="$t('dialog.add_portfolio.asset.title')"                                 
                            @onSelect="onSelectAsset"  />
-->
                        <div class="row q-mb-md">
                            <q-input dense outlined v-model="v_search" />
                            <q-space />
                            <q-btn dense label="Search" @click="onClickSearch" />
                        </div>
                        <div v-if="v_query_count>-1">
                            Total Results : {{v_query_count}}
                        </div>

                        <AssetList ref='assetList' title="" desc="" moreCaption="" 
                            @onUpdateDone="onUpdateDone"></AssetList>

                    </div>
                </q-card-section>       

                <q-card-actions>

                    <q-btn class="fit"  color="primary" ripple
                        label="Add" :loading="v_loading" @click="onClickSave" />

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
import AssetList from 'components/lists/AssetList';

//import UserModel from "src/models/UserModel";
//import { PriceModel, PriceListModel } from "src/models/PriceModel";
import { PortfolioListModel, PortfolioItemModel } from "src/models/PortfolioModel";


export default {
    name: 'AddBookmarkDialog',
    components: {
        WTextArea,
        CryptoSelect,
        AssetList,
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
            return this.title;
        },
    },
    data() {
        return {            
            v_show: false,
            
            v_search: '',            
            v_loading: false,

            v_query_count: -1,
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
    
    methods: {   
        clear() {
            this.v_loading = false;
        },

        show() {
            logger.log.debug("AddBookmarkDialog.show : ");
            
            this.v_loading = false;
            this.v_show = true;
        },

        hide() {
            this.v_show = false;
        },

        processSave() {
            const _this = this;
            this.v_loading = true;
            this.v_portfolio_item.addToServer().then( response => {
                _this.v_loading = false;                
                if (response.data.ret!=0) {                    
                    CommonFunc.showErrorMessage(_this,response.data.msg);
                    return;
                }
                
                logger.log.debug("AddPortfolioDialog.processSave : response=",response);

                CommonFunc.showOkMessage(_this,'Portfolio added');
                
                _this.v_user.portfolio.addPortfolioItem(response.data.portfolio_item);
                _this.v_user.portfolio.calcPerformance(store.state.prices);                
                
                _this.$emit("onPortfolioItemAdded",response.data.portfolio_item);
                
                _this.clear();
                //_this.hide();

            }).catch( err=> {
                _this.v_loading = false;
                CommonFunc.showErrorMessage(_this,'Portfolio error');
            });

        },

        onClickSave() {
            let selected = this.$refs.assetList.getSelected();
            logger.log.debug('AddBookmarkDialog.onClickSave - ',selected);
            
            this.$emit("onClickSave",{selected:selected});
        },

        onClickClose() {
            logger.log.debug('onClickClose - ');
            this.hide();
        },

        onUpdateDone(dicParam) {
            logger.log.debug("AddBookmarkDialog.onUpdateDone : dicParam=",dicParam);
            this.v_query_count = this.$refs.assetList.getCount();            
        },

        onClickSearch() {
            logger.log.debug("AddBookmarkDialog.onClickSearch : v_search=",this.v_search);
            this.$refs.assetList.clear();
            this.$refs.assetList.update(null,this.v_search);
        }

    }

};
</script>


<style scoped>
.closeButton {
    margin:-10px 10px 0px -10px;
}
</style>