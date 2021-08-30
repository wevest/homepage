<template>
    <div class="q-pa-md responsive">
        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.asset.title')" :desc="$t('page.asset.desc')"
                        extraCaption="Add" @onClickTitleExtra="onClickAdd">
                </CTitle>
            </div>
        </div>
        <!-- 청산전 asset 페이지 - START -->
        <div class="boarder"> 
            <div class="boarder2 q-mx-lg q-my-md"> 
                <div class="q-pa-md text-bold">
                    Pool
                </div>   
                <div class="row boarder2 q-pa-md q-ma-lg">
                    <div>
                        ADA/USDT 
                    </div>
                    <q-space />
                    <div> 
                        $360
                    </div>
                </div>
            </div>
            <div class="boarder2 q-mx-lg">
                 <div class="q-pa-md">
                    <div class="row justify-center gSubTitleLG">
                        <div class="q-ma-xs">wETH</div>
                        <div class="q-ma-xs">3x</div>
                        <div class="q-ma-xs">LONG</div>
                    </div>
                    <div class="q-mx-md">
                        <div class="row"> 
                            <div>수익률</div>
                            <q-space />
                            <div style="color:green">+36%</div>
                        </div>
                        <div class="row q-my-sm">
                            <div>총평가</div>
                            <q-space />
                            <div>$16,800</div> 
                        </div> 
                        <div class="row q-my-sm">
                            <div>평가손익</div>
                            <q-space />
                            <div style="color:green">$180</div> 
                        </div> 
                        <div class="row q-my-sm">
                            <div>Risk</div>
                            <q-space />
                            <div style="color:red">2.5%</div> 
                        </div> 
                        <div class="row q-my-sm">
                            <div>매입가</div>
                            <q-space />
                            <div>$3,500</div> 
                        </div> 
                        <div class="row q-my-sm">
                            <div>총매수</div>
                            <q-space />
                            <div>$15,000</div> 
                        </div> 
                        <div class="row q-my-sm">
                            <div>원금</div>
                            <q-space />
                            <div>$500</div> 
                        </div> 
                        <div class="row justify-center"> 
                            <div class="boarder2 q-ma-lg">
                                <q-btn color="orange" label="S/L" />
                            </div> 
                            <div class="boarder2 q-ma-lg">
                                <q-btn color="red" label="청산"/>
                            </div> 
                        </div>
                    </div>
                </div>  
            </div>          

            <div class="q-mx-lg q-my-md"> 
                <div class="row boarder2 q-pa-sm q-my-xs">
                    <div>수수료</div>
                    <q-space />
                    <div>$13.63</div>
                </div>
                <div class="row boarder2 q-pa-sm q-my-xs">
                    <div>이자농사</div>
                    <q-space />
                    <div>$13.63</div>
                </div>
                <div class="row boarder2 q-pa-sm q-my-xs">
                    <div>wevest</div>
                    <q-space />
                    <div>6310.57</div>
                </div>
            </div>
        </div>
        <div class="q-ma-md text-center"> 
            <q-btn color="red" label="Emergency Kill" />
        </div>          
        <!-- 청산전 asset 페이지 - END-->
        <!-- Sell All : Start -->
        <div class="q-pa-md">
            <div class="row">
                <div class="">
                    Confirm Sell All
                </div>
                <q-space />
                <div class=""> 
                    <q-btn flat icon="close" />
                </div>
            </div>
            <div class="boarder q-pa-md">
                <div class="row q-py-sm"> 
                    <div>Symbol</div>
                    <q-space />
                    <div>BTCUSDT Perpetual</div>
                </div>
                <div class="row q-py-sm"> 
                    <div>Price</div>
                    <q-space />
                    <div>49763.08 USDT</div>       
                </div>
                <div class="row q-py-sm"> 
                    <div>Amount</div>
                    <q-space />
                    <div>1012.45 USDT</div>
                </div>
                <div class="row q-py-sm"> 
                    <div>Cost</div>
                    <q-space />
                    <div>331.95 USDT</div>
                </div>
                <div class="q-my-md">
                   <q-checkbox v-model="right" label="Don't show again. You can change this in (Futures-Preference)." />
                </div>
                <div>
                    <q-btn class="full-width" color="primary" label="Confirm Sell" />
                </div>
            </div>
        </div>
        <!-- Sell All : End -->
        <!-- Confirm Dialog -->
        <q-dialog v-model="v_confirm" persistent ref="confirmDialog">
            <q-card>
                <q-card-section class="row items-center">
                    <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
                    <span class="q-ml-sm">{{v_title}}</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat :label="$t('button.cancel')" color="primary" @click="onClickConfirm(0)" />
                    <q-btn flat :label="$t('button.confirm')" color="primary" @click="onClickConfirm(1)" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!-- Confirm Dialog -->
        <!-- 청산 완료 : START -->
        <div class="q-pa-md">
            <div class="boarder"> 
                <div class="boarder text-center"> 
                    <div class="row q-mt-md justify-center">
                        <div class="text-h6 q-ma-sm">USDT</div> 
                        <div class="text-h6 q-my-sm">$16,800</div> 
                    </div>
                    <div> 
                        USDT로 청산한 토큰의 USDT 가격
                    </div>
                    <div class="">
                        <div class="q-py-lg">
                            <q-btn color="primary" label="청산 완료" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 청산완료 : END -->
        <!-- 청산 후 asset page - START-->
        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.asset.title')" :desc="$t('page.asset.desc')"
                        extraCaption="Add" @onClickTitleExtra="onClickAdd">
                </CTitle>
            </div>
        </div>
        <div class="boarder q-ma-md">
            <div class="q-mx-lg"> 
                <div class="boarder2 q-my-md"> 
                    <div class="q-pa-md text-bold">
                        Pool
                    </div>   
                    <div class="row boarder2 q-pa-md q-ma-lg">
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
                    <div class="boarder2 row q-pa-md q-mb-sm">
                        <div> 
                            USDT 
                        </div>
                        <q-space />
                        <div>
                            $680
                        </div>
                    </div> 
                    <div class="boarder2 row q-pa-md q-mb-sm">
                        <div> 
                            수수료
                        </div>
                        <q-space />
                        <div>
                            $13.63
                        </div>
                    </div> 
                    <div class="boarder2 row q-pa-md q-mb-sm">
                        <div> 
                            이자농사
                        </div>
                        <q-space />
                        <div>
                            $3.83
                        </div>
                    </div> 
                    <div class="boarder2 row q-pa-md">
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

.boarder {
    border: 1px solid #bcbcbc;
    border-radius: 7px;
    background-color: #F2F4F4;  
}

.boarder2 {
    border: 1px solid #bcbcbc;
    border-radius: 7px;
    background-color: white;  
}
</style>
