<template>
    <div class="q-pa-md"> 
<!-- pool-first-page-START -->
        <div class="">
            <CTitle ttype='title' 
                :title="$t('page.pool.title')" :desc="$t('page.pool.desc')" />
        </div>

        <div class="gSubTitle"> 
            {{ $t('page.pool.poolSummary.title') }}
        </div>
        <div class="q-my-md text-right"> 
            <q-btn color="primary" rounded :label="$t('button.newPosition')" @click="onClickAdd" />
        </div>

        <div class="gBoarder text-center poolList" v-if="v_pools.items.length>0">
            <div class="row gBoarder2 q-pa-md q-ma-lg" @click="onClickPool(a_pool)"
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
        <div class="gBoarder2 text-center" v-else>
            <div class="q-my-lg"> 
                <q-icon color="grey-7" size="60px" name="move_to_inbox" />
            </div>
            <div class="q-my-md poolListDesc"> 
                {{ $t('page.pool.poolList.desc') }}
            </div>
            <div class="q-my-lg">  
                <q-btn color="primary" rounded :label="$t('button.connectWallet')" />
            </div>
        </div>
<!-- pool-first-page-END -->


    <AddPoolDialog ref="addDialog" />


<!-- 유동성추가4-Confirm Payment-dialog-START 
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
-->


<!-- 제출된거래-dialog-시작 

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
-->

    </div>
</template>


<script>
import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import {PoolModel,PoolListModel} from "src/models/PoolModel";

import CTitle from 'components/CTitle';
import AddPoolDialog from 'src/pages/pool/components/AddPoolDialog';

export default {
    name: 'PoolView',
    components: {
        CTitle,
        AddPoolDialog
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_is_owner() {
            return true;
        }        
    },
    data() {
        return {          
            v_enabled:true,  
            
            v_utilization: null,
            v_asset: null,
            v_search: null,

            v_pools: new PoolListModel(),
            v_options: ['USDT'],
            
            v_dialog_asset: false,
            v_dialog_portion: false,
            v_dialog_confirm: false,
            v_dialog_progress: false,

            v_data: [],
        }
    },
    created() {
        //console.log("HomeView.created");
        logger.log.debug("BlogView.created - query=",this.$route.query);

        //this.validateQuery();
    },
    mounted() {
        //this.g_asset.symbol = 'BTC';
        //this.g_asset.object_id = 20;

        this.v_pools.addTestData();
    },
    beforeDestroy() {
        logger.log.debug("BookmarkView.beforeDestroy");
        //this.onClickSave();
    },
    methods: {
        validateQuery() {            
            if (! CommonFunc.isEmptyObject(this.$route.query.category)) {
                return;
            }

            NavFunc.navError404(this);
        },        
        refresh() {
            this.loadBookmarks();
        },

        getBookmarkDicdata() {
            let dicData = [];
            for (let index=0;index<this.v_data[0].items.length++;index++) {
                dicData.push( {} );
            }
            return dicData;            
        },

        onClickAdd() {
            this.$refs.addDialog.show();
        },

    
        onClickPool(pool) {
            logger.log.debug("BookmarkView.onClickPool : pool=",pool);
            NavFunc.navPoolDetail(this);
        },

        onClickAsset() {
            this.v_dialog_asset = false;
            this.v_dialog_portion = true;
        },

        onClickAdd2() {
            this.v_dialog_portion = false;
            this.v_dialog_confirm = true;
        },

        onClickConfirm() {
            this.v_dialog_confirm = false;
            this.v_dialog_progress = true;
        },

        onClickDone() {
            this.v_dialog_progress = false;
        }
    }

};

</script>

<style scoped>


.poolList div {
    margin: 10px;
    padding: 3px 0px;
}

.poolListDesc {
    color : #6E727D;
    font-size : 17px;
}

.terms {
    color : blue;
}

.termsBox {
    background-color: rgb(247, 248, 250);;
} 
</style>