<template>
    <div class="q-pa-md">

        <div class="row">
            <q-avatar>
                <q-img v-if="v_user.avatar_url" class="gBlogAvatar" :src="v_user.avatar_url" />
                <q-icon v-else name="person" color="black" size="34px" />
            </q-avatar>
            <div>
                <span> {{v_user.username}} </span>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <q-btn label="Write" @click="onClickWrite" />
            </div>
        </div>

        <div class="row">
            <div class="col">
                <div>
                    <span> $ {{v_portfolio.evaluated_value}} </span>
                    <span> {{v_portfolio.roi}} % </span>
                </div>
                <div>
                    portfolio chart
                </div>

            </div>
        </div>

        <div class="row">
            <div class="col">
                <div> 
                    portfolio list
                    <q-list separator>
                        <q-item v-for="(a_portfolio,index) in v_portfolio.models" :key="index" >
                            <q-item-section @click="onclickPortfolio(a_portfolio)">
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

import PriceService from 'src/services/priceService';

import { PortfolioListModel, PortfolioModel, PortfolioItemModel} from "src/models/PortfolioModel";


import CTitle from 'components/CTitle';


export default {
    components: {
        CTitle,
    },
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

        v_back: false,

    }),
    computed: {},

    mounted: function() {
        console.log("HomeView.mounted - auth",MoaConfig.auth);
        console.log("MessageView.mounted - params=",this.$route.params);
        
        this.v_user = MoaConfig.auth;
        //this.v_message.subject = "test";
        //this.v_message.to_user = "tester1002";
        //this.v_message.body = "private message";
        this.loadPortfolio();
    },

    methods: {        

        loadPortfolio: function() {
            const _this = this;

            this.v_portfolio.load().then( response => {
                logger.log.debug("PortfolioView.loadPortfolio - response=",response);                
                _this.g_data = response.data;

                _this.v_portfolio.evaluated_value = 100;
                _this.v_portfolio.roi = 0.6;
            });

        },


        loadCryptoCurrency: function() {
            const _this = this;

            logger.log.debug("loadCryptoCurrency");

            let reqParam = {};
            PriceService.getCryptoCurrencies(reqParam).then( response => {
                logger.log.debug("loadCryptoCurrency : response=",response);

            }).catch( err=> {

            });
        },

        onClickWrite: function() {
            logger.log.debug("onClickWrite");
            this.$refs.addPortfolio.show(this.v_portfolio,null);
        },

        onclickPortfolio: function(portfolio) {
            logger.log.debug("onclickPortfolio",portfolio);
            let dic_param = { name:'portfolio_detail', path:'portfolio_detail', params:{ portfolio:portfolio, back:true } };
            this.$router.push(dic_param);
        },

        onClickDelete: function(portfolio) {
            logger.log.debug("onClickDelete",portfolio);
        }

    },

}

</script>



<style scope> 
</style>
