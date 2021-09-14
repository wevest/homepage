<template>
    <div class="q-pa-md responsive">
        <!-- 청산전 asset-Page-시작 -->
        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.asset.title')" :desc="$t('page.asset.desc')"
                        extraCaption="Add" @onClickTitleExtra="onClickAdd">
                </CTitle>
            </div>
        </div>
        <div class="gBoarder1 q-mb-sm">
            <div class="q-pa-md gPageSubTitle">
                {{ $t('page.asset.pool.title') }}
            </div>  
            <div class="q-mx-lg"> 
                <div class="row gBoarder2 q-mb-sm" @click="onClickPool(a_pool)"
                    :key="index"
                    v-for="(a_pool, index) in v_pools.items">        
                    <div>
                        {{a_pool.name}}
                    </div>
                    <q-space />
                    <div> 
                        ${{a_pool.tvl}}
                    </div>
                </div>
            </div>
            <div class="q-pa-md gPageSubTitle">
                {{ $t('page.asset.poolIncome.title') }}
            </div>  
            <div class="q-mx-lg"> 
                <div class="row gBoarder2 q-mb-sm">
                    <div class="gNameText">{{ $t('page.asset.poolIncome.feeIncome.title') }}</div>
                    <q-space />
                    <div>$13.63</div>
                </div>
                <div class="row gBoarder2 q-mb-sm">
                    <div class="gNameText">{{ $t('page.asset.poolIncome.yieldFarming.title') }}</div>
                    <q-space />
                    <div>$13.63</div>
                </div>
                <div class="row gBoarder2 q-mb-sm">
                    <div class="gNameText">{{ $t('page.asset.poolIncome.wevestToken.title') }}</div>
                    <q-space />
                    <div>6,310.57</div>
                </div>
            </div>
        </div>
        <div class="gBoarder1">
            <div class="q-pa-md gPageSubTitle">
                {{ $t('page.asset.token.title') }}
            </div>  
            <div class="gBoarder2 q-mx-lg q-mb-sm" 
                :key="index"
                v-for="(a_asset, index) in v_assets.items">
                
                <div class="q-pa-md" @click="onClickToken(a_asset)">
                    <div class="row justify-center text-h6">
                        <div class="q-ma-xs">{{a_asset.name}}</div>
                    </div>
                    <q-separator class="q-my-md" />
                    <div class="q-mx-md">
                        <div class="row justify-between"> 
                            <div>{{ $t('page.asset.token.roi.title') }}</div>
                            <div style="color:green">{{a_asset.roi}}%</div>
                        </div>
                        <div class="row justify-between q-my-sm">
                            <div>{{ $t('page.asset.token.risk.title') }}</div>
                            <div style="color:red">{{a_asset.risk}}%</div> 
                        </div> 
                    </div>
                </div>  
            </div>
        </div>
        <div class="q-py-md text-center"> 
            <q-btn color="red" :label="$t('button.emergencyKill')" />
        </div>          
        <div class="q-my-lg text-center"> 
            <q-btn flat color="primary" label="언어: English" />
        </div>

        
        <!-- 청산전 asset-Page-끝-->
        <!-- Asset-detail-dialog-시작 -->
        
        <q-dialog v-model="v_dialog_token" position="bottom">
            <q-card class="q-ma-md q-pa-md">
                    <div class="text-right">
                        <q-btn flat size="16px" label="X" @click="onClickCloseTokenDialog" />
                    </div>    
                    <div class="row justify-center gDialogTitle">
                        <div class="q-ma-xs">wETH 3x Long</div>
                    </div>
                    <q-separator class="q-my-md" />
                    <div class="q-mx-md">
                        <div class="row"> 
                            <div>{{ $t('dialog.asset.roi.title') }}</div>
                            <q-space />
                            <div style="color:green">+36%</div>
                        </div>
                        <div class="row q-my-sm">
                            <div>{{ $t('dialog.asset.totalAmount.title') }}</div>
                            <q-space />
                            <div>$16,800</div> 
                        </div> 
                        <div class="row q-my-sm">
                            <div>{{ $t('dialog.asset.valuationLoss.title') }}</div>
                            <q-space />
                            <div style="color:green">$180</div> 
                        </div> 
                        <div class="row q-my-sm">
                            <div>{{ $t('dialog.asset.risk.title') }}</div>
                            <q-space />
                            <div style="color:red">2.5%</div> 
                        </div> 
                        <div class="row q-my-sm">
                            <div>{{ $t('dialog.asset.purchasePrice.title') }}</div>
                            <q-space />
                            <div>$3,500</div> 
                        </div> 
                        <div class="row q-my-sm">
                            <div>{{ $t('dialog.asset.totalPurchase.title') }}</div>
                            <q-space />
                            <div>$15,000</div> 
                        </div> 
                        <div class="row q-my-sm">
                            <div>{{ $t('dialog.asset.principal.title') }}</div>
                            <q-space />
                            <div>$500</div> 
                        </div> 
                        <q-separator class="q-my-md" />
                        <div class="row justify-evenly"> 
                            <div class="">
                                <q-btn color="orange" :label="$t('button.stopPL')" @click="onClickPTSL" />
                            </div> 
                            <div class="">
                                <q-btn color="red" :label="$t('button.closePosition')" @click="onClickClosePosition" />
                            </div> 
                        </div>
                    </div>
            </q-card>        
        </q-dialog>

        <!-- Asset-detail-dialog-끝 -->

        <!-- Sell-All-시작 -->
        <q-dialog v-model="v_dialog_sell" position="bottom">
            <q-card>
                <q-card-section>
                    <div class="row">
                        <div class="gDialogTitle">
                            {{ $t('dialog.asset.closePosition.title') }}
                        </div>
                        <q-space />
                        <div class=""> 
                            <q-btn flat icon="close" />
                        </div>
                    </div>
                    <div class="gBoarder1 q-pa-md">
                        <div class="row q-py-sm"> 
                            <div class="gNameText">{{ $t('dialog.asset.symbol.title') }}</div>
                            <q-space />
                            <div>BTCUSDT Perpetual</div>
                        </div>
                        <div class="row q-py-sm"> 
                            <div class="gNameText">{{ $t('dialog.asset.price.title') }}</div>
                            <q-space />
                            <div>49763.08 USDT</div>       
                        </div>
                        <div class="row q-py-sm"> 
                            <div class="gNameText">{{ $t('dialog.asset.amount.title') }}</div>
                            <q-space />
                            <div>1012.45 USDT</div>
                        </div>
                        <div class="row q-py-sm"> 
                            <div class="gNameText">{{ $t('dialog.asset.cost.title') }}</div>
                            <q-space />
                            <div>331.95 USDT</div>
                        </div>
                        <div class="q-my-md">
                        <q-checkbox v-model="v_sell_check" :label="$t('dialog.asset.checkBoxMessage.title')" />
                        </div>
                        <div>
                            <q-btn class="full-width" color="primary" :label="$t('button.confirm')" @click="onClickConfirm" />
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

<!-- 청산 완료-Dialog-시작 -->
        <q-dialog v-model="v_dialog_notice" position="bottom">
            <q-card>
                <q-card-section>
                    <div class="gBoarder1 text-center"> 
                        <div class="row q-mt-md justify-center">
                            <div class="text-h6 q-ma-sm">USDT</div> 
                            <div class="text-h6 q-my-sm">$16,800</div> 
                        </div>
                        <div> 
                            {{ $t('dialog.asset.completeClosePositionMessage.title') }}
                        </div>
                        <div class="">
                            <div class="q-py-lg">
                                <q-btn color="primary" :label="$t('button.completeClosePosition')" @click="onClickDone" />
                            </div>
                        </div>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>

    </div>
</template>

<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import NavFunc from 'src/util/NavFunc';
import logger from "src/error/Logger";

import UserModel from "src/models/UserModel";
import {PoolModel,PoolListModel} from "src/models/PoolModel";
import {AssetModel,AssetListModel} from "src/models/AssetModel";

import CTitle from 'components/CTitle';

export default {
    components: {
        CTitle,
    },
    props: {},
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data() {
        return {
            v_title: 'Title',

            v_user: new UserModel(),
            v_assets: new AssetListModel(),
            v_pools: new PoolListModel(),

            v_sell_check: false,

            v_dialog_token: false,
            v_dialog_sell: false,
            v_dialog_notice: false,

            v_labels: {'submit': 'Upload', 'cancel': 'Cancel'},
        }
    },
    mounted() {
        //console.log("HomeView.mounted - ");
        logger.log.debug("ProfileView.mounted - symbol=",this.$route.query);
        this.v_assets.addTestData();
        this.v_pools.addTestData();
        //this.setUser(this.$route.query);
        //this.refresh();
    },

    methods: {        
        setUser(params) {
            const _this = this;

            let username = params.username;
            if (! username) {
                username = this.v_me.username;
            }
            UserModel.loadProfile(username).then( a_user => {
                _this.v_user = a_user;

                _this.v_user.loadPortfolio().then( response => {
                    logger.log.debug("setUser=>",response);
                    _this.updatePortfolioWidget();
                    _this.loadRelation();
                    
                });
            });
        },


        refresh() {
            this.loadFeeds();
        },


        onClickAdd() {

        },

        onClickPool(pool) {
            NavFunc.navPoolDetail(this);
        },

        onClickToken(asset) {
            logger.log.debug("AssetView.onClickToken :",asset);
            this.v_dialog_token = true;
        },

        onClickCloseTokenDialog() {
            this.v_dialog_token = false;
        },

        onClickPTSL() {
            NavFunc.navPTSL(this);
        },

        onClickClosePosition() {
            this.v_dialog_token = false;
            this.v_dialog_sell = true;
        },

        onClickConfirm() {
            this.v_dialog_sell = false;
            this.v_dialog_notice = true;
        },

        onClickDone() {
            this.v_dialog_notice = false;
        }

    },

}

</script>


<style scope> 
.responsive {
    /* 모바일 반응형 */
  max-width: 700px;
  width: auto;
  margin:0 auto;
} 



.coinTitle {
    margin:4em 8em;
}

.coinBody {
    margin: 2em 7em;
}
</style>
