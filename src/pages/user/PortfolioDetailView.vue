<template>
    <div>
        <div class="row">
            <div>
                <q-btn label="back" @click="onClickBack" />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div>
                    <span> {{v_portfolio.name}}  </span>
                    <span> {{v_portfolio.description}}  </span>
                </div>
                <div>
                    <span> {{v_portfolio.roi}} % </span>
                    <span> {{v_portfolio.evaluated_value}}  </span>
                </div>
            </div>
        </div>

        <div>
            <div>
                <h4> ROI Chart </h4>
            </div>
            <PortfolioChart ref="portfolioChart" />
        </div>

        <div class="row">
            <div class="col">
                <q-btn label="Add" @click="onClickAdd" />

                <q-list>
                    <q-item clickable v-for="(a_portfolio,index) in v_portfolio.items" :key="index">

                        <q-item-section avatar top>
                            <q-icon name="account_tree" color="black" size="34px" />
                        </q-item-section>

                        <q-item-section size="30px">
                            <q-item-label>{{a_portfolio.api_asset.name}}</q-item-label>
                        </q-item-section>

                        <q-item-section top>
                            <q-item-label lines="1">
                                <span class="text-weight-medium">{{v_format(a_portfolio.roi)}}</span>
                            </q-item-label>
                            <q-item-label caption>
                                <span class="text-grey-8"> {{ v_format(a_portfolio.last*a_portfolio.qty)}} </span>
                            </q-item-label>
                        </q-item-section>
                        
                        <q-item-section top>
                            <q-item-label lines="1">
                                {{ v_format(a_portfolio.last) }}
                            </q-item-label>
                            <q-item-label caption lines="1">
                                <span class="cursor-pointer">{{ v_format(a_portfolio.price) }}</span>
                            </q-item-label>
                        </q-item-section>                        
                        
                        <q-item-section top side>
                            <span>{{v_updated_at(a_portfolio.updated_at)}}</span>
                            <div class="text-grey-8 q-gutter-xs">
                                <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="onClickDelete(a_portfolio)"/>
                                <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
                                <q-btn size="12px" flat dense round icon="more_vert" />
                            </div>                            
                        </q-item-section>
                    </q-item>
                        
                </q-list>

            </div>
        </div>

        <AddPortfolioDialog ref="addPortfolio" />

        <q-dialog v-model="v_confirm" persistent ref="confirmDialog">
            <q-card>
                <q-card-section class="row items-center">
                    <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
                    <span class="q-ml-sm">Do you want to delete the item?</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn flat label="Delete" color="primary" @click="onClickDeleteConfirm" />
                </q-card-actions>
            </q-card>
        </q-dialog>


        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" @click="onClickAdd" />
        </q-page-sticky>

    </div>
</template>


<script>
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";
import {PortfolioModel, ThreadListModel} from "src/store/PortfolioModel";

import AddPortfolioDialog from 'components/dialogs/AddPortfolioDialog';
import PortfolioChart from 'src/pages/user/component/PortfolioChart';



export default {
    name: 'PortfolioDetail',
    props: [],
    components: {
        AddPortfolioDialog,
        PortfolioChart
    },    
    mixins: [],
    computed: {
        v_format() {
            return (value) => {
                return value.toLocaleString();
            };
        },
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        }
    },
    data() {
        return {
            v_confirm: false,

            v_user: null,
            v_portfolio: null,
            v_selected: null,
        }
    },
    created() {
        logger.log.debug("PortfolioDetailView.created");
    },
    beforeMount() {
        logger.log.debug("PortfolioDetailView.beforeMounted - params=",this.$route.params);
        this.v_user = this.$route.params.user;
        this.v_portfolio = this.$route.params.portfolio;        
    },
    mounted() {
        logger.log.debug("PortfolioDetailView.mounted");

        //this.$parent.$parent.$refs.header.setBackArrow(true,this);
        //this.profile = store.getters.moa.user.profile;
        //this.avatarUrl = store.getters.moa.user.firebase.photoURL;
        //this.getProfile();

        this.$refs.portfolioChart.update(this.v_portfolio);
    },
    beforeDestroy() {
        logger.log.debug("PortfolioDetailView.beforeDestroy");
        //this.$parent.$parent.$refs.header.setBackArrow(false,this);
    },

    methods: {

        handleDelete: function() {

        },

        onClickAdd: function() {
            logger.log.debug("PortfolioDetail.onClickAdd");
            this.$refs.addPortfolio.show(this.v_user,null);
        },
        
        onClickDelete: function(portfolio_item) {
            logger.log.debug("PortfolioDetail.onClickDelete : item=",portfolio_item);
            this.v_selected = portfolio_item;
            this.v_confirm = true;
        },

        onClickDeleteConfirm: function() {            
            this.v_confirm = false;       

            let a_portfolio_item = this.v_portfolio.getItem(this.v_selected.id);
            //logger.log.debug("PortfolioDetail.onClickDeleteConfirm",a_portfolio_item.name);
            //logger.log.debug("PortfolioDetail.onClickDeleteConfirm",this.v_selected.constructor.name);
            
            const _this = this;
            this.v_user.portfolio.deletePortfolioItem(this.v_portfolio.id,this.v_selected.id).then( response => {                
                //let a_portfolio = _this.v_user.portfolio.getItem(_this.v_portfolio.id);
                logger.log.debug("onClickDeleteConfirm.items=",_this.v_portfolio.items);            
                _this.v_selected = null;

                CommonFunc.showOkMessage(_this,'Portfolio deleted');
            });

            //this.v_selected = null;
        },

        onClickBack: function() {
            logger.log.debug("PortfolioDetail.onClickBack");
            CommonFunc.navBack(this);
        },

        

    }
};
</script>


<style scoped>
</style>
