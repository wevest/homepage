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
                    <q-list class="rounded-borders">

                        <q-expansion-item
                            v-for="(a_portfolio,index) in v_portfolio" :key="index"
                            expand-separator
                            icon="perm_identity"
                            :label="a_portfolio.name"
                            :caption="a_portfolio.description"
                        >
                            

                            <q-table
                                title=""
                                hide-bottom
                                :data="a_portfolio.portfolio_children"
                                :columns="v_headers"
                                row-key="name"
                                :rows-per-page-options="[50]"
                                >
                                    <template v-slot:body="props">

                                        <q-tr :props="props">
                                            <q-td key="symbol" :props="props">{{ props.row.api_asset.name }}</q-td>
                                            <q-td key="price" :props="props">{{ props.row.price }}</q-td>
                                            <q-td key="qty" :props="props">{{ props.row.qty }}</q-td>
                                            <q-td key="updated_at" :props="props">{{ props.row.updated_at }}</q-td>
                                        </q-tr>

                                    </template>
                            </q-table>

                        </q-expansion-item>

                    </q-list>

                </div>
            </div>
        </div>

    </div>

</template>

<script>
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';

import {PortfolioModel, ThreadListModel} from "src/store/PortfolioModel";

import CTitle from 'components/CTitle';


export default {
    components: {
        CTitle,
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

        sendMessage: function(v_message) {
            const _this = this;
            
            let dic_param = v_message;
            dic_param.token = MoaConfig.auth.token;

            return new Promise(function(resolve,reject) {
                AuthService.postPrivateMessage(dic_param,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("MessageView.sendMessage - response",_this.g_data);
                    resolve();
                },function(err) {
                    logger.log.error("MessageView.sendMessage - error",err);
                    reject();
                });
            });            
        },


        onClickWrite: function() {
            logger.log.debug("onClickWrite");
        },

        onClickSend: function() {
            logger.log.debug("onClickSend");
            this.sendMessage(this.v_message);            
        }

    },

}

</script>



<style scope> 
</style>
