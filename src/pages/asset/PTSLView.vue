<template>
    <div class="q-ma-md"> 
        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.stopLoss.title')" :desc="$t('page.stopLoss.desc')">
                </CTitle>
            </div>
        </div>
        <div class="gBoarder q-pa-md"> 
            <div class="gSubTitle">
                {{ $t('page.stopLoss.coinSelect.title') }}
            </div>
            <div class="q-my-md">
                <q-select  style="width: 200px" outlined v-model="v_position.asset" :options="v_assets" label="USDT" />
            </div>
            <div class="row justify-between">  
                <div class="gSubTitle">
                    주문가능
                </div>
                <div class="text-right text-subtitle2">
                    <div>9.97777774333 DOT</div>
                    <div >= 376,000 USDT</div>
                </div>
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
                <div>
                    수량
                </div>
                <div class="q-my-md full-width"> 
                    <q-input  type="number" outlined filled v-model="v_position.portion" placeholder="수량" />
                </div>
                <div> 
                    가격
                </div>
                <div class="q-my-md full-width" style="width: 200px"> 
                    <q-input  type="number" filled outline v-model="v_position.stop_price" placeholder="가격" />
                </div>
                <!-- <div class="row q-my-md">
                    <div class="q-mr-xs">
                        <q-btn color="grey-5" outline text-color="grey-10" icon="add" />
                    </div> 
                    <div>
                        <q-btn color="grey-5" outline text-color="grey-10" icon="remove" />
                    </div> 
                </div>  -->
            </div>
            <div>총액</div>
            <div class="q-my-md"> 
                <q-input  class="full-width" type="number" outlined filled v-model="v_position.estimated_value" placeholder="총액" />
            </div>
            <div class="row justify-evenly"> 
                <div class="q-ma-xs">
                    <q-btn text-color="primary" label="초기화" />
                </div>
                <div class="q-ma-xs">
                    <q-btn color="primary" label="Close Position" @click="onClickPosition" />
                </div>
            </div>
            <q-separator class="q-my-md" />
            <div class="text-h6 q-my-md"> 
                보유자산(USDT)
            </div>
            <div> 
                <div class="row justify-between">
                    <div>{{ $t('page.stopLoss.asset.avgPurchase.title') }}</div>
                    <div>100,000,000</div>
                </div>
                <div class="row justify-between">
                    <div>{{ $t('page.stopLoss.asset.value.title') }}</div>
                    <div>120,000,000</div>
                </div>
                <div class="row justify-between">
                    <div>{{ $t('page.stopLoss.asset.pl.title') }}</div>
                    <div style="color: red">20,000,000</div>
                </div>
                <div class="row justify-between">
                    <div>{{ $t('page.stopLoss.asset.roi.title') }}</div>
                    <div style="color: red">20%</div>
                </div>
            </div> 
        </div>

        <q-dialog v-model="v_dialog_confirm" position="bottom">
            <q-card> 
                <q-card-section>
                    <div class="q-my-md gDialogTitle text-center">
                        매도 주문 확인
                    </div>
                    <div class="gBoarder q-pa-md text-center coinTitle"> 
                        Polkadot (DOT/USDT)
                    </div>
                    <div class="coinBody">
                        <div class="row justify-between q-ma-sm"> 
                            <div>주문구분</div> 
                            <div>지정가매도</div> 
                        </div>
                        <div class="row justify-between q-ma-sm"> 
                            <div>주문가격</div> 
                            <div>130,000,000</div> 
                        </div>
                        <div class="row justify-between q-ma-sm"> 
                            <div>주문수량</div> 
                            <div>30,000</div> 
                        </div>
                        <div class="row justify-between q-ma-sm"> 
                            <div>주문총액</div> 
                            <div>30,000,000</div> 
                        </div>
                    </div>
                </q-card-section>
                <q-card-actions align="center">
                    <div class="q-ma-md">
                        <q-btn text-color="primary" outline label="cancel" @click="onClickCancel" />
                    </div>
                    <div class="q-ma-md">
                        <q-btn color="primary" label="sell confirm" @click="onClickSell"/>
                    </div>
                </q-card-actions>
            </q-card>
        </q-dialog>

        <q-dialog v-model="v_dialog_notice" position="bottom">
            <q-card>
                <q-card-section> 
                <div class="text-center"> 
                    <div class="gDialogTitle q-my-md">
                        매도 주문 접수
                    </div>
                    <div class="q-my-xl"> 
                        매도주문이 정상완료되었습니다. 
                    </div>
                    <q-separator class="q-my-md" />
                    <div class=""> 
                        <q-btn flat text-color="primary" label="확인" @click="onClickDone" />
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