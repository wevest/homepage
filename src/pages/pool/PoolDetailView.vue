<template>
    <div class="q-pa-md">
        <div class="row q-my-xl justify-center">
            <div>
                <q-icon size="40px" name="paid" />
            </div>   
            <div class="text-h4">
                ADA / USDT
            </div>
        </div>
        <div class="row justify-center q-my-md">
            <div class="q-ma-sm"> 
                <q-btn :label="$t('button.liquidityAdd')" />
            </div>
            <div class="q-ma-sm"> 
                <q-btn color="red" :label="$t('button.liquidityRemove')" />
            </div>
        </div>
        <div class="gBoarder2 q-mb-sm q-pa-md"> 
            <div class="q-mb-sm gSubTitle">
                {{ $t('page.pool.poolRatio.title') }}
            </div>
            <div class="full-width">
                <q-btn-toggle
                v-model="v_utilization"
                toggle-color="primary"
                spread
                :options="[
                    {label: '0%', value: '0'},
                    {label: '25%', value: '25'},
                    {label: '50%', value: '50'},
                    {label: '75%', value: '75'}, 
                    {label: '100%', value: '100'} 
                    ]" />
            </div>   
            <div class="q-mt-md">
                <q-badge color="secondary">
                        Model: {{ basicModel }} (0 to 100, step 5)
                        </q-badge>
                        <q-slider
                        v-model="basicModel"
                        :step="5"
                        label-always
                        color="primary"
                        />
            </div>
        </div>
        <div class="gBoarder q-my-sm q-pa-md"> 
            <div class="gDialogTitle q-my-md">
                 {{  $t ('page.poolDetail.liquidity.title') }}
            </div>
            <div class="text-h4">
                $354.28
            </div>
        </div>
        
        <div class="gBoarder q-pa-md"> 
            <div class="gDialogTitle q-my-md">
                {{  $t ('page.poolDetail.fee.title') }}
            </div>
            <div class="text-h4">
                $3.70
            </div>
        </div>
        <q-separator class="q-my-lg" color="orange" size="10px" inset />

<!-- 유동성추가2-dialog-START-->
        
        <q-card>
            <q-card-section>
                <div class="q-ma-md"> 
                    <div class="row q-py-md"> 
                        <div class="gSubTitle"> 
                            {{ $t('dialog.pool.addLiquidity.title')}}
                        </div>
                        <q-space />
                        <div> 
                            <q-btn flat icon="close" /> 
                        </div>
                    </div>
                    <div class="row q-pa-md gBoarder2"> 
                        <div>USDT 풀링추가</div> 
                        <q-space />
                        <div> $350 </div>
                    </div>   
                    <div class="text-center q-mt-lg"> 
                        <q-btn rounded color="primary" :label="$t('button.confirm')" />
                    </div>        
                </div>
            </q-card-section>
        </q-card>

<!-- 유동성추가2-dialog-END-->
<q-separator class="q-my-lg" color="orange" size="10px" inset />
<!-- 유동성추가3-확인을기다리는중-dialog-START-->

        <q-card> 
            <q-card-section>
                <div class="row q-pa-md"> 
                    <q-space />
                    <div class="">
                        <q-btn flat icon="close" />
                    </div>
                </div>
                <div class="q-my-md text-center">
                    <q-spinner color="primary" size="4em" />
                </div> 
                <div class="text-center text-bold">
                    {{ $t('dialog.pool.checking.title')}}    
                </div>
                <div class="row justify-center q-ma-md">
                    <div class="q-mr-md"> 
                        {{ $t('dialog.pool.checking.adding') }}
                    </div>
                    <div> 
                        51.8775 USDT
                    </div>
                </div>
                <div class="text-center q-mb-md">  
                    {{ $t('dialog.pool.checking.desc')}}
                </div>
            </q-card-section>
        </q-card>
<!-- 유동성추가3-확인을기다리는중-dialog-END-->

<q-separator class="q-my-lg" color="orange" size="10px" inset />

<!-- 유동성추가4-Confirm Payment-dialog-START -->
        <q-card> 
            <q-card-section>
                <div class="q-mb-md">
                    <div class="gSubTitle"> 
                        {{ $t('dialog.pool.confirmPayment.title')}}
                    </div>
                    <div class="gCaption">
                        https://app.wevest.io/#/remove/
                    </div>
                </div>
                <div> 
                    {{ $t('dialog.pool.confirmPayment.desc')}}
                </div>
                <q-separator class="q-my-md" />
                <div class="row justify-center">
                    <div class="q-mr-sm"> 
                        <q-btn rounded text-color="primary" :label="$t('button.cancel')" />
                    </div>
                    <div class="q-ml-sm"> 
                        <q-btn rounded color="primary" :label="$t('button.confirm')" />
                    </div>
                </div>

            </q-card-section>
        </q-card>

<!-- 유동성추가4-Confirm Payment-dialog-END -->
<q-separator class="q-my-lg" color="orange" size="10px" inset />
<!-- 유동성추가5-제출된거래-dialog-START -->

        <q-card> 
            <q-card-section> 
                <div class="" align="center"> 
                    <div class="q-my-lg"> 
                        <q-icon color="primary" size="4rem" name="arrow_circle_up" />
                    </div>
                    <div class="gDialogTitle q-my-md"> 
                        제출된 거래 
                    </div>
                    <div class="q-py-md"> 
                        <q-btn text-color="primary" flat :label="$t('dialog.pool.exploreView.view')" />  
                    </div>
                    <div class="q-my-md "> 
                        <q-btn rounded color="primary" :label="$t('button.close')" />
                    </div>
                </div>
            </q-card-section>
        </q-card>

<!-- 유동성추가5-제출된거래-dialog-END -->
<q-separator class="q-my-lg" color="orange" size="10px" inset />

<q-separator class="q-my-lg" color="orange" size="10px" inset />

 <!-- 기존 유동성 제거-dialog-시작-->
        
        <q-card>
            <q-card-section>
                <div class="q-ma-md"> 
                    <div class="row q-py-md"> 
                        <div class="gSubTitle"> 
                            {{ $t('dialog.pool.removeLiquidity.title')}}
                        </div>
                        <q-space />
                        <div> 
                            <q-btn flat icon="close" /> 
                        </div>
                    </div>
                    <div class="row q-pa-md gBoarder2"> 
                        <div>USDT 풀링 해제</div> 
                        <q-space />
                        <div> $350 </div>
                    </div>   
                    <div class="text-center q-mt-lg"> 
                        <q-btn rounded color="primary" :label="$t('button.confirm')" />
                    </div>        
                </div>
            </q-card-section>
        </q-card>

<!-- 기존 유동성 제거-dialog-끝-->
<q-separator class="q-my-lg" color="orange" size="10px" inset />

<!-- Checking-dialog-시작-->

        <q-card> 
            <q-card-section>
                <div class="row"> 
                    <q-space />
                    <div class="">
                        <q-btn flat icon="close" />
                    </div>
                </div>
                <div class="q-my-md text-center">
                    <q-spinner color="primary" size="4em" />
                </div> 
                <div class="text-center text-bold">
                    {{ $t('dialog.pool.checking.title') }}    
                </div>
                <div class="row justify-center q-ma-md">
                    <div class="q-mr-md"> 
                        {{ $t('dialog.pool.checking.removing') }}
                    </div>
                    <div> 
                        51.8775 USDT
                    </div>
                </div>
                <div class="text-center q-mb-md">  
                    {{ $t('dialog.pool.checking.desc')}}
                </div>
            </q-card-section>
        </q-card>
<!-- Checking-dialog-끝-->
<q-separator class="q-my-lg" color="orange" size="10px" inset />

<!-- Confirm-Payment-dialog-시작 -->
        <q-card> 
            <q-card-section>
                <div class="q-mb-md">
                    <div class="gSubTitle"> 
                        {{ $t('dialog.pool.confirmPayment.title')}}
                    </div>
                    <div class="gCaption">
                        https://app.wevest.io/#/remove/
                    </div>
                </div>
                <div> 
                    {{ $t('dialog.pool.confirmPayment.desc')}}
                </div>
                <q-separator class="q-my-md" />
                <div class="row justify-center">
                    <div class="q-mr-sm"> 
                        <q-btn rounded text-color="primary" :label="$t('button.cancel')" />
                    </div>
                    <div class="q-ml-sm"> 
                        <q-btn rounded color="primary" :label="$t('button.confirm')" />
                    </div>
                </div>

            </q-card-section>
        </q-card>

<!-- Confirm-Payment-dialog-끝 -->
<q-separator class="q-my-lg" color="orange" size="10px" inset />

<!-- 제출된거래-dialog-시작 -->

        <q-card> 
            <q-card-section> 
                <div class="" align="center"> 
                    <div class="q-my-lg"> 
                        <q-icon color="primary" size="4rem" name="arrow_circle_up" />
                    </div>
                    <div class="gDialogTitle q-my-md"> 
                        제출된 거래 
                    </div>
                    <div class="q-py-md"> 
                        <q-btn text-color="primary" flat :label="$t('dialog.pool.exploreView.view')" />  
                    </div>
                    <div class="q-my-md "> 
                        <q-btn rounded color="primary" :label="$t('button.close')" />
                    </div>
                </div>
            </q-card-section>
        </q-card>

<!-- 제출된거래-dialog-끝 -->
    </div>
    



</template>

<script>
import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';


export default {
    name: 'PoolView',
    components: {
        CTitle,
    },
}

</script>

<style scoped>

</style>