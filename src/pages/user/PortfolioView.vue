<template>
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle title="$t('page.message.title')" desc="$t('page.message.desc')"></CTitle>
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
                    <span> $ 3424334234324 </span>
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
                        <q-item v-for="(a_portfolio,index) in v_portfolio" :key="index" >
                            <q-item-section @click="onclickPortfolio(a_portfolio)">
                                <q-item-label>{{a_portfolio.name}}</q-item-label>
                                <q-item-label caption lines="2">{{a_portfolio.description}}</q-item-label>
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

        <AddPortfolioDialog ref="addPortfolio" />

    </div>

</template>

<script>
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';
import PriceService from 'src/services/priceService';
import AddPortfolioDialog from 'components/dialogs/AddPortfolioDialog';

import {PortfolioModel, ThreadListModel} from "src/store/PortfolioModel";


import CTitle from 'components/CTitle';


export default {
    components: {
        CTitle,
        AddPortfolioDialog
    },
    props: {},

    data: () => ({
        g_data: null,

        v_portfolio: [],

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
        //console.log("HomeView.mounted - ");
        console.log("MessageView.mounted - params=",this.$route.params);
        
        //this.v_message.subject = "test";
        //this.v_message.to_user = "tester1002";
        //this.v_message.body = "private message";

        const _this = this;
        this.loadPortfolio().then(response=> {
            logger.log.debug("UserPortfolioView.mounted - response=",response);
            _this.g_data = response.data;

            let portfolio = _this.g_data.results;
            for (let index=0;index<_this.g_data.results.length;index++) {
                
                let a_group = {name: _this.g_data.results[index].name, 
                    created_at:  _this.g_data.results[index].created_at,
                    description:_this.g_data.results[index].description,
                    items: [],
                };

                for (let index=0;index<_this.g_data.results.length;index++) {
                }
            }

            _this.v_portfolio = _this.g_data.results;
        });

        this.loadCryptoCurrency();
    },

    methods: {        

        loadPortfolio: function() {
            const _this = this;

            return new Promise(function(resolve,reject) {
                
                let reqParam = { token: MoaConfig.auth.token};
                AuthService.getPortfolio(reqParam, function(response) {
                    resolve(response);
                }, function(err) {
                    reject(err);
                });
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
            this.$refs.addPortfolio.show();
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
