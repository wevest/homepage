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
                    <div class="q-pa-md q-gutter-sm">            
                        <div class="row">
                            <q-space />
                            <div>
                                <q-btn label="Save" @click="onClickSave" />
                                <q-btn label="Close" @click="onClickClose" />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <q-input 
                                    v-model="v_portfolio_item.portfolio_id" 
                                    label="Parent" 
                                    :error="v_error.title.error"
                                    :error-message="v_error.title.msg"
                                />
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

                                <q-input 
                                    v-model="v_portfolio_item.qty" 
                                    label="Qty" 
                                    :error="v_error.title.error"
                                    :error-message="v_error.title.msg"
                                />

                                <q-input 
                                    v-model="v_portfolio_item.description" 
                                    label="Description" 
                                    :error="v_error.title.error"
                                    :error-message="v_error.title.msg"
                                />
                            </div>
                        </div>
                    </div>
                </q-card-section>        
            </q-card>

        </q-dialog>

    </div>

</template>

<script>
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';

import { PortfolioItemModel } from "src/store/PortfolioModel";


export default {
    name: 'AddPortfolioDialog',
    components: {

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


        loadBlogPost: function(page_id) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                //logger.log.debug("CWatchView.loadCryptoWatchData - dic_param=",dic_param);
                CMSAPI.getPostData(page_id,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("BlogWriterView.loadBlogPost - response",_this.g_data);
                    _this.handlePostPage(_this.g_data);
                    resolve();

                },function(err) {
                    logger.log.error("BlogWriterView.loadBlogPost - error",err);
                    reject();
                });
            });            
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
        

        onPostSave: function(dic_param) {
            logger.log.debug('onPostSave - ',dic_param);

            if (dic_param.ret==1) {
                this.postProcess(dic_param.response);
                CommonFunc.showOkMessage(this,'Blog posted');
            } else {
                CommonFunc.showErrorMessage(this,'Blog error');
            }

        },

    }

};
</script>


<style scoped>

</style>