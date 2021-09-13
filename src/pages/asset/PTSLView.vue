<template>
    <div class="q-ma-md"> 
        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.stopPL.title')" :desc="$t('page.stopPL.desc')">
                </CTitle>
            </div>
        </div>
        <div class="gBoarder1 q-pa-md"> 
            <div class="q-my-md text-h6">
                wETH 3x Long
                <!-- <q-select  bg-color="grey-1" outlined v-model="v_position.asset" :options="v_assets" label="Select a Token" /> -->
            </div>
            <div class="row justify-between">  
                <div class="gCaption">
                    Order available
                </div>
                <div class="text-right text-subtitle2">
                    <div>9.97777774333 DOT</div>
                    <div >= 376,000 USDT</div>
                </div>
            </div>  
                <div class="gPageSubTitle q-mt-md"> 
                    Price
                </div>
            <div class="q-my-md full-width"> 
                <q-input  bg-color="grey-1" type="number" outlined v-model="v_position.stop_price" placeholder="Price" />
            </div>
            <div class="gPageSubTitle q-mt-lg"> 
                Amount
            </div>
            <div class="row q-ma-md justify-between">
                <div class="full-width">
                    <q-btn-toggle
                        v-model="v_position.portion"
                        toggle-color="primary"
                        spread
                        :options="[
                            {label: '25%', value: '25'},
                            {label: '50%', value: '50'},
                            {label: '75%', value: '75'}, 
                            {label: '100%', value: '100'} 
                        ]" />
                </div>    
            </div>
            <div class="row justify-between"> 
                <div class="q-my-sm full-width"> 
                    <q-input  bg-color="grey-1" type="number" outlined v-model="v_position.portion" placeholder="DOT" />
                </div>
            </div>
            <div class="q-my-sm"> 
                <q-input  class="full-width" bg-color="grey-1" type="number" outlined v-model="v_position.estimated_value" placeholder="USDT" />
            </div>
            <div class="row justify-evenly"> 
                <div class="q-ma-xs">
                    <q-btn text-color="primary" label="Clear" />
                </div>
                <div class="q-ma-xs">
                    <q-btn color="primary" label="Close Position" @click="onClickPosition" />
                </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="gDialogTitle q-my-md"> 
                ASSET(USDT)
            </div>
            <div> 
                <div class="row justify-between">
                    <div class="gNameText">{{ $t('page.stopPL.asset.avgPurchase.title') }}</div>
                    <div>100,000,000</div>
                </div>
                <div class="row justify-between">
                    <div class="gNameText">{{ $t('page.stopPL.asset.value.title') }}</div>
                    <div>120,000,000</div>
                </div>
                <div class="row justify-between">
                    <div class="gNameText">{{ $t('page.stopPL.asset.pl.title') }}</div>
                    <div style="color: red">20,000,000</div>
                </div>
                <div class="row justify-between">
                    <div class="gNameText">{{ $t('page.stopPL.asset.roi.title') }}</div>
                    <div style="color: red">20%</div>
                </div>
            </div> 
        </div>

        <q-dialog v-model="v_dialog_confirm" position="bottom">
            <q-card> 
                <q-card-section>
                    <div class="q-my-md gDialogTitle text-center">
                        Order Confirm
                    </div>
                    <div class="gBoarder1 q-pa-md text-center"> 
                        Polkadot (DOT/USDT)
                    </div>
                    <div class="gBoarder1 q-mt-sm">
                        <div class="row justify-between q-ma-sm"> 
                            <div class="gNameText">Position</div> 
                            <div>Short</div> 
                        </div>
                        <div class="row justify-between q-ma-sm"> 
                            <div class="gNameText">Ordered Price</div> 
                            <div>130,000</div> 
                        </div>
                        <div class="row justify-between q-ma-sm"> 
                            <div class="gNameText">Ordered Amount</div> 
                            <div>30,000</div> 
                        </div>
                        <div class="row justify-between q-ma-sm"> 
                            <div class="gNameText">Total</div> 
                            <div>30,000,000</div> 
                        </div>
                    </div>
                </q-card-section>
                <q-card-actions align="center">
                    <div class="q-ma-md">
                        <q-btn text-color="primary" outline label="cancel" @click="onClickCancel" />
                    </div>
                    <div class="q-ma-md">
                        <q-btn color="primary" label="confirm" @click="onClickSell"/>
                    </div>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="v_dialog_notice" position="bottom">
            <q-card>
                <q-card-section> 
                <div class="text-center"> 
                    <div class="gDialogTitle q-my-md">
                        Order recieved
                    </div>
                    <div class="q-my-xl"> 
                        Your order has been successfully completed.                   
                    </div>
                    <q-separator class="q-my-md" />
                    <div class=""> 
                        <q-btn flat text-color="primary" label="close" @click="onClickDone" />
                    </div>
                </div>

                </q-card-section>    
            </q-card>
        </q-dialog>

    </div>



</template>


<script>
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import {PTSLModel} from "src/models/PositionModel";

import CTitle from 'components/CTitle';

export default {
    name: 'PTSLView',
    components: {
        CTitle
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_is_owner() {
            if (this.v_tweet.owner.id==this.v_me.id) {
                return true;
            }
            return false;
        }
    },
    data() {
        return {
            v_dialog_confirm: false,
            v_dialog_notice: false,
            
            v_position: new PTSLModel(),
            v_assets: [],
        }
    },
    created() {
        //this.validateQuery();
    },
    mounted() {
        //console.log("HomeView.mounted - ");
        this.refresh();
    },
    methods: {
        validateQuery() {                        
            if (this.$route.query.hasOwnProperty('id')) {
                if (CommonFunc.isEmptyObject(this.$route.query.id)) {
                    NavFunc.navError404(this);
                }
            }            
            
        },  
        setTweet(query) {
            this.v_tweet.id = query.id;
        },

        refresh() {
        },


        onClickDone() {
            this.v_dialog_notice = false;
        },

        onClickSell() {
            this.v_dialog_confirm = false;
            this.v_dialog_notice = true;
        },

        onClickCancel() {
            this.v_dialog_confirm = false;
        },

        onClickPosition() {
            this.v_dialog_confirm = true;
        }
    }
};

</script>



<style scoped>

.boxToolbar {
    display:flex;
}

.boxToolbarTitle {
    flex:1 auto;
}

.boxAvatar {
    width:50px;
}

</style>