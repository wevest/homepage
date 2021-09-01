<template>
    <div class="q-pa-md responsive">
        <!-- 청산전 asset 페이지 - START -->
        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.asset.title')" :desc="$t('page.asset.desc')"
                        extraCaption="Add" @onClickTitleExtra="onClickAdd">
                </CTitle>
            </div>
        </div>
        <div class="gBoarder"> 
            <div class="q-pa-md text-bold">
                {{ $t('page.asset.pool.title') }}
            </div>  
            <div class="gBoarder2 q-mx-lg q-mb-md"> 
                <div class="row gBoarder2 q-pa-md q-ma-lg">
                    <div>
                        ADA/USDT 
                    </div>
                    <q-space />
                    <div> 
                        $360
                    </div>
                </div>
            </div>
            <div class="q-pa-md text-bold">
                {{ $t('page.asset.token.title') }}
            </div>  
            <div class="gBoarder2 q-mx-lg q-mb-sm">
                 <div class="q-pa-md">
                    <div class="row justify-center text-h6">
                        <div class="q-ma-xs">wETH</div>
                        <div class="q-ma-xs">3x</div>
                        <div class="q-ma-xs">LONG</div>
                    </div>
                    <q-separator class="q-my-md" />
                    <div class="q-mx-md">
                        <div class="row justify-between"> 
                            <div>{{ $t('page.asset.token.roi.title') }}</div>
                            <div style="color:green">+3600000099999%</div>
                        </div>
                        <div class="row justify-between q-my-sm">
                            <div>{{ $t('page.asset.token.risk.title') }}</div>
                            <div style="color:red">2.5%</div> 
                        </div> 
                    </div>
                </div>  
            </div>          
            <div class="gBoarder2 q-mx-lg q-mb-sm">
                 <div class="q-pa-sm">
                    <div class="row justify-center text-h6">
                        <div class="q-ma-xs">wADA</div>
                        <div class="q-ma-xs">3x</div>
                        <div class="q-ma-xs">SHORT</div>
                    </div>
                    <q-separator class="q-my-md" />
                    <div class="q-mx-md">
                        <div class="row justify-between"> 
                            <div>{{ $t('page.asset.token.roi.title') }}</div>
                            <div style="color:green">+333%</div>
                        </div>
                        <div class="row justify-between q-my-sm">
                            <div>{{ $t('page.asset.token.risk.title') }}</div>
                            <div style="color:red">2.5%</div> 
                        </div> 
                    </div>
                </div>  
            </div>          
            <div class="gBoarder2 q-mx-lg">
                 <div class="q-pa-sm">
                    <div class="row justify-center text-h6">
                        <div class="q-ma-xs">wDOT</div>
                        <div class="q-ma-xs">3x</div>
                        <div class="q-ma-xs">LONG</div>
                    </div>
                    <q-separator class="q-my-md" />
                    <div class="q-mx-md">
                        <div class="row justify-between"> 
                            <div>{{ $t('page.asset.token.roi.title') }}</div>
                            <div style="color:green">+1.5M%</div>
                        </div>
                        <div class="row justify-between q-my-sm">
                            <div>{{ $t('page.asset.token.risk.title') }}</div>
                            <div style="color:red">2.5%</div> 
                        </div> 
                    </div>
                </div>  
            </div>          
            <div class="q-pa-md text-bold">
                {{ $t('page.asset.poolIncome.title') }}
            </div>  
            <div class="q-mx-lg"> 
                <div class="row gBoarder2 q-pa-md q-mb-sm">
                    <div>{{ $t('page.asset.poolIncome.feeIncome.title') }}</div>
                    <q-space />
                    <div>$13.63</div>
                </div>
                <div class="row gBoarder2 q-pa-md q-mb-sm">
                    <div>{{ $t('page.asset.poolIncome.yieldFarming.title') }}</div>
                    <q-space />
                    <div>$13.63</div>
                </div>
                <div class="row gBoarder2 q-pa-md q-mb-sm">
                    <div>{{ $t('page.asset.poolIncome.wevestToken.title') }}</div>
                    <q-space />
                    <div>6310.57</div>
                </div>
            </div>
        </div>
        
        <div class="q-ma-md text-center"> 
            <q-btn color="red" :label="$t('button.emergencyKill')" />
        </div>          
        <!-- 청산전 asset 페이지 - END-->
        <q-separator class="q-my-lg" color="orange" size="10px" inset />

        <!-- Asset-detail-dialog-START -->
        <!-- 에셋 목록 중 하나를 클릭하면 팝업되는 다이알로그 -->
        <div class="gBoarder2 q-mx-lg">
                 <div class="q-pa-md">
                    <div class="row justify-center gSubTitleLG">
                        <div class="q-ma-xs">wETH</div>
                        <div class="q-ma-xs">3x</div>
                        <div class="q-ma-xs">LONG</div>
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
                        <div class="row justify-center"> 
                            <div class="gBoarder2 q-ma-lg">
                                <q-btn color="orange" :label="$t('button.sl')" />
                            </div> 
                            <div class="gBoarder2 q-ma-lg">
                                <q-btn color="red" :label="$t('button.closePosition')"/>
                            </div> 
                        </div>
                    </div>
                </div>  
            </div>          
        <!-- Asset-detail-dialog-END -->
        <q-separator class="q-my-lg" color="orange" size="10px" inset />

        <!-- Sell-All-Start -->
        <q-card>
            <q-card-section>
                <div class="row">
                    <div class="">
                        {{ $t('dialog.asset.closePosition.title') }}
                    </div>
                    <q-space />
                    <div class=""> 
                        <q-btn flat icon="close" />
                    </div>
                </div>
                <div class="gBoarder q-pa-md">
                    <div class="row q-py-sm"> 
                        <div>{{ $t('dialog.asset.symbol.title') }}</div>
                        <q-space />
                        <div>BTCUSDT Perpetual</div>
                    </div>
                    <div class="row q-py-sm"> 
                        <div>{{ $t('dialog.asset.price.title') }}</div>
                        <q-space />
                        <div>49763.08 USDT</div>       
                    </div>
                    <div class="row q-py-sm"> 
                        <div>{{ $t('dialog.asset.amount.title') }}</div>
                        <q-space />
                        <div>1012.45 USDT</div>
                    </div>
                    <div class="row q-py-sm"> 
                        <div>{{ $t('dialog.asset.cost.title') }}</div>
                        <q-space />
                        <div>331.95 USDT</div>
                    </div>
                    <div class="q-my-md">
                    <q-checkbox v-model="right" :label="$t('dialog.asset.checkBoxMessage.title')" />
                    </div>
                    <div>
                        <q-btn class="full-width" color="primary" :label="$t('button.confirmSell')" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
<!-- Sell-All-End -->
<q-separator class="q-my-lg" color="orange" size="10px" inset />
<!-- 청산 완료-dialog-START -->
        <q-card>
            <q-card-section>
                <div class="gBoarder text-center"> 
                    <div class="row q-mt-md justify-center">
                        <div class="text-h6 q-ma-sm">USDT</div> 
                        <div class="text-h6 q-my-sm">$16,800</div> 
                    </div>
                    <div> 
                        {{ $t('dialog.asset.completeClosePositionMessage.title') }}
                    </div>
                    <div class="">
                        <div class="q-py-lg">
                            <q-btn color="primary" :label="$t('button.completeClosePosition')" />
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
        <!-- 청산완료-dialog-END -->
        <q-separator class="q-my-lg" color="orange" size="10px" inset />

        <!-- Confirm Dialog -->
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="priority_high" flat color="red" text-color="white" />
                <span class="q-ml-sm">{{v_title}} 정말로 OOO 하시겠습니까?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat :label="$t('button.cancel')" color="primary" @click="onClickConfirm(0)" />
                <q-btn flat :label="$t('button.confirm')" color="primary" @click="onClickConfirm(1)" />
            </q-card-actions>
        </q-card>
        <!-- Confirm Dialog -->
        <q-separator class="q-my-lg" color="orange" size="10px" inset />

        <!-- Confirm Dialog -->
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="priority_high" flat color="primary" text-color="white" />
                <span class="q-ml-sm">{{v_title}} 정말로 OOO 하시겠습니까?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat :label="$t('button.cancel')" color="primary" @click="onClickConfirm(0)" />
                <q-btn flat :label="$t('button.confirm')" color="primary" @click="onClickConfirm(1)" />
            </q-card-actions>
        </q-card>
        <!-- Confirm Dialog -->
        <q-separator class="q-my-lg" color="orange" size="10px" inset />

        <!-- Confirm Dialog -->
      <q-card>
        <q-card-section>
          <div class="text-h6">Alert</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum repellendus sit voluptate voluptas eveniet porro. Rerum blanditiis perferendis totam, ea at omnis vel numquam exercitationem aut, natus minima, porro labore.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat :label="$t('button.ok')" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
        <!-- Confirm Dialog -->
        <q-separator class="q-my-lg" color="orange" size="10px" inset />

        <!-- 청산 후 asset page - START-->
        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.asset.title')" :desc="$t('page.asset.desc')"
                        extraCaption="Add" @onClickTitleExtra="onClickAdd">
                </CTitle>
            </div>
        </div>
        <div class="gBoarder q-ma-md">
            <div class="q-mx-lg"> 
                <div class="gBoarder2 q-my-md"> 
                    <div class="q-pa-md text-bold">
                        Pool
                    </div>   
                    <div class="row gBoarder2 q-pa-md q-ma-lg">
                        <div>
                            ADA/USDT 
                        </div>
                        <q-space />
                        <div> 
                            $360
                        </div>
                    </div>
                </div>
                <div class="q-mb-md">
                    <div class="gBoarder2 row q-pa-md q-mb-sm">
                        <div> 
                            USDT 
                        </div>
                        <q-space />
                        <div>
                            $680
                        </div>
                    </div> 
                    <div class="gBoarder2 row q-pa-md q-mb-sm">
                        <div> 
                            수수료
                        </div>
                        <q-space />
                        <div>
                            $13.63
                        </div>
                    </div> 
                    <div class="gBoarder2 row q-pa-md q-mb-sm">
                        <div> 
                            이자농사
                        </div>
                        <q-space />
                        <div>
                            $3.83
                        </div>
                    </div> 
                    <div class="gBoarder2 row q-pa-md">
                        <div> 
                            wevest
                        </div>
                        <q-space />
                        <div>
                            6310.57
                        </div>
                    </div> 
                </div>
            </div>
        </div>
        
        <!-- 청산 후 asset page - END -->
    </div>
</template>

<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import UserModel from "src/models/UserModel";

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
    data: () => ({
        g_data: null,

        v_user: new UserModel(),
        v_edit: false,

        v_labels: {'submit': 'Upload', 'cancel': 'Cancel'},
    }),
    mounted() {
        //console.log("HomeView.mounted - ");
        logger.log.debug("ProfileView.mounted - symbol=",this.$route.query);
        
        //this.setUser(this.$route.query);
        //this.refresh();
    },

    methods: {        
        setUser: function(params) {
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


        refresh: function() {
            this.loadFeeds();
        },


        loadFeeds() {
            this.$refs.feedList.update(this.v_me,0);
        },

    },

}

</script>


<style scope> 

.gBoarder {
    border: 1px solid #bcbcbc;
    border-radius: 7px;
    background-color: #F2F4F4;  
}

.gBoarder2 {
    border: 1px solid #bcbcbc;
    border-radius: 7px;
    background-color: white;  
}
</style>
