<template>
    <div class="q-pa-md">
<!-- 유동성추가전-page-START -->
        <div class="">
            <CTitle ttype='title' 
                :title="$t('page.pool.title')" :desc="$t('page.pool.desc')" 
                extraCaption="Add" @onClickTitleExtra="onClickAdd" />
        </div>    
        <div> 
            {{ $t('page.pool.poolSummary.title') }}
        </div>
        <div class="q-my-md text-center"> 
            <q-btn color="primary" :label="$t('button.addLiquidity')" />
        </div>
        <div class="gBoarder2 text-center">
            <div class="q-my-lg"> 
                <q-icon color="grey-7" size="60px" name="move_to_inbox" />
            </div>
            <div class="q-my-md gCaption"> 
                {{ $t('page.pool.poolListHere.title..') }}
            </div>
            <div class="q-my-lg">  
                <q-btn color="primary" rounded :label="$t('button.connectWallet')" />
            </div>
        </div>
<!-- 유동성추가전-page-END -->

<q-separator class="q-my-lg" color="orange"  size="10px" inset />

<!-- token-create-page-START -->
        <div class="">
            <CTitle ttype='title' 
                :title="$t('page.pool.title')" :desc="$t('page.pool.desc')" 
                extraCaption="Add" @onClickTitleExtra="onClickAdd" />
        </div>   
        <div> 
            {{ $t('page.pool.liquidityAdd.title') }}
        </div>
        <div class="row justify-center q-my-md">
            <div class="q-mx-xs"> 
                <q-select style="width: 160px" outlined v-model="model" :options="options" :label="$t('button.coinSelect')"  />
            </div>
            <q-space />
            <div class="q-mt-sm"> 
                <q-btn color="primary" :label="$t('button.add')" />
            </div>
        </div>
        <div class="gBoarder2 q-mb-sm q-pa-md"> 
            <div class="q-mb-sm">
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
        <div class="gBoarder2 text-center">
            <div class="q-my-lg"> 
                <q-icon color="grey-7" size="60px" name="move_to_inbox" />
            </div>
            <div class="q-my-md gCaption"> 
               {{ $t('page.pool.poolListHere.title..') }}
            </div>
            <div class="q-my-lg">  
                <q-btn color="primary" rounded :label="$t('button.connectWallet')" />
            </div>
        </div>
<!-- token-create-page-END  -->
        
<q-separator class="q-my-lg" color="orange" size="10px" inset />
        
<!-- 토큰선택-dialog-START -->
        <q-card>
            <q-card-section>
                <div class="q-pa-md">
                    <div CLASS="row"> 
                        <div>
                            {{ $t('dialog.pool.coinChoice.title') }}
                        </div> 
                        <q-space />
                        <div>
                            <q-btn flat icon="close" />
                        </div> 
                    </div>
                    <div> 
                        <q-input filled v-model="ph" :placeholder="$t('button.searchPaste')" :dense="dense" />
                    </div>
                    <q-separator class="q-my-md" />
                    <div class="gBoarder3 q-pa-md">
                        <div class="row q-my-sm">
                            <div class="q-mr-sm">
                                <q-icon size="40px" name="paid" />
                            </div> 
                            <div>
                                <div>ETH</div> 
                                <div class="gCaption">Ethereum</div> 
                            </div> 
                            <q-space />
                            <div class="text-h6">
                                0.07354
                            </div> 
                        </div>
                        <div class="row q-my-sm">
                            <div class="q-mr-sm">
                                <q-icon size="40px" name="paid" />
                            </div> 
                            <div>
                                <div>1INCH</div> 
                                <div class="gCaption">1Inch</div> 
                            </div> 
                            <q-space />
                            <div class="text-h6">
                                98.14
                            </div> 
                        </div>
                        <div class="row q-my-sm">
                            <div class="q-mr-sm">
                                <q-icon size="40px" name="paid" />
                            </div> 
                            <div>
                                <div>AAVE</div> 
                                <div class="gCaption">AaveToken</div> 
                            </div> 
                            <q-space />
                            <div class="text-h6">
                                0
                            </div> 
                        </div>
                        <div class="row">
                            <div class="q-mr-sm">
                                <q-icon size="40px" name="paid" />
                            </div> 
                            <div>
                                <div>ANT</div> 
                                <div class="gCaption">Aragon Network Token</div> 
                            </div> 
                            <q-space />
                            <div class="text-h6">
                                0
                            </div> 
                        </div>
                    </div>
                    <div>
                        <q-btn class="full-width" text-color="primary" outline icon="edit_note" :label="$t('button.manageTokenList')" />
                    </div>
                </div>
            </q-card-section>
        </q-card>
<!-- 토큰선택-dialog-END -->
        
<q-separator class="q-my-lg" color="orange" size="10px" inset />

<!-- 유동성추가-dialog-START-->
        <q-card>
            <q-card-section>
                <div class="q-ma-md"> 
                    <div class="row q-pa-md"> 
                        <div> 
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
<!-- 유동성추가-dialog-END-->

<q-separator class="q-my-lg" color="orange" size="10px" inset />
        
<!-- Confirm-dialog-START-->
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
                    {{ $t('dialog.pool.checking.title')}}    
                </div>
                <div class="row justify-center q-ma-md">
                    <div class="q-mr-md"> 
                        {{ $t('dialog.pool.checking.adding')}}
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
<!-- Confirm-dialog-END-->

<q-separator class="q-my-lg" color="orange" size="10px" inset />

<!-- Confirm-Payment-dialog-START -->
        <q-card> 
            <q-card-section>
                <div class="q-mb-md">
                    <div class="gDialogTitle"> 
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

<!-- Confirm-Payment-dialog-END -->
<q-separator class="q-my-lg" color="orange" size="10px" inset />
<!-- 제출된거래-dialog-START -->

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

<!-- 제출된거래-dialog-END -->
<q-separator class="q-my-lg" color="orange" size="10px" inset />
<!-- 유동성제거-page-START -->
        
        <div class="">
            <CTitle ttype='title' 
                :title="$t('page.pool.title')" :desc="$t('page.pool.desc')" 
                extraCaption="Add" @onClickTitleExtra="onClickAdd" />
        </div>
        <div> 
            풀 개요 (유동성 리스트 화면)
        </div>
        <div class="row justify-around">
            <div class="q-my-md"> 
                <q-btn text-color="primary" label="유동성 추가" />
            </div>
            <div class="q-my-md"> 
                <q-btn color="primary" label="유동성 제거" /> 
            </div>
        </div>
        <div class="gBoarder text-center poolList">
            <div class="row gBoarder2 q-pa-md"> 
                <div> ADA/USDT </div>
                <q-space /> 
                <div>$360</div>
            </div>
            <div class="row gBoarder2 q-pa-md"> 
                <div> DOT/USDT </div>
                <q-space /> 
                <div>$60,000</div>
            </div>
            <div class="row gBoarder2 q-pa-md"> 
                <div> SOL/USDT </div>
                <q-space /> 
                <div>$99,000</div>
            </div>
        </div>
<!-- 유동성제거-page-END -->
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
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost",
                delayOnTouchOnly: true,
                delay:200, 
            }
        },
        v_is_owner() {
            return true;
        }        
    },
    data() {
        return {          
            v_enabled:true,  
            v_drag:false,
            //v_bookmarks: new BookmarkListModel(),
            //id: 1,label: 'Satisfied customers',children: [],
            //v_data: [],

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

        //this.refresh();
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
        loadBookmarks() {
            //const category = CONST.ASSETPAGE_CATEGORY+this.g_asset.symbol;
            logger.log.debug('BookmarkView.loadBookmarks');
            const _this=this;
            
            this.v_me.bookmarks.clear();            
            this.v_me.loadBookmarks().then(resp=>{
                logger.log.debug('BookmarkView.loadBookmarks : items=',_this.v_me.bookmarks.items);
                _this.v_data = _this.v_me.bookmarks.items;
                //_this.assignData(_this.v_me.bookmarks.items);
            }).catch(err=>{
                logger.log.error('BookmarkView.loadBookmarks : err=',err);
            });
        },

        checkMove(e) {
            logger.log.debug("Future index: " + e.draggedContext.futureIndex);
        },
/*
        added(event, group) {
            const newItems = this.v_rows
                .map(group => group.items)
                .reduce((prev, curr) => [...prev, ...curr], [])
                .filter(item => event.detail.ids.map(Number).indexOf(item.id) >= 0);
            group.items.splice(event.detail.index, 0, ...newItems);
        },
        removed(event, group) {
            group.items = group.items.filter(
                item => event.detail.ids.map(Number).indexOf(item.id) < 0
            );
        },
        reordered(event, group) {
            const reorderedItems = group.items.filter(
                item => event.detail.ids.map(Number).indexOf(item.id) >= 0
            );
            const newItems = group.items.filter(
                item => event.detail.ids.map(Number).indexOf(item.id) < 0
            );
            newItems.splice(event.detail.index, 0, ...reorderedItems);
            group.items = newItems;
        },
*/        
        addBookmarks(selected) {
            logger.log.debug("BookmarkView.addBookmarks : selected=",selected);
            this.v_me.bookmarks.assignExt(selected);
        },
        processSave(items) {
            const _this=this;

            let bookmarks = [];
            for (let index=0;index<items.length;index++) {
                bookmarks.push( {
                    id:items[index].bookmark_id, 
                    asset_id:items[index].api_asset.id, seq:index+1, vote:1 
                } );
            }
            let dicParam = {userid: this.v_me.id, data: bookmarks};
            logger.log.debug("BookmarkView.processSave : dicParam=",dicParam);

            this.v_me.bookmarks.addToServer(dicParam).then(resp=>{
                logger.log.debug('BookmarkView.processSave : resp=',resp);
                _this.v_me.saveToCookie();

                CommonFunc.showOkMessage(_this,'Saved');       
            }).catch(err=>{
                logger.log.error('BookmarkView.processSave : err=',err);
                CommonFunc.showErrorMessage(_this,err.data.msg);                
            });
        },
        processDelete(bookmark) {
            const _this=this;

            logger.log.debug("BookmarkView.processDelete : bookmark=",bookmark);
            
            let dicParam = {userid: this.v_me.id, id: bookmark.id};
            this.v_me.bookmarks.deleteFromServer(dicParam).then(resp=>{
                logger.log.debug("BookmarkView.processDelete : resp=",resp);
                _this.v_me.saveToCookie();
                CommonFunc.showOkMessage(_this,'Deleted');
            }).catch(err=>{
                logger.log.error("BookmarkView.processDelete : err=",err);
                CommonFunc.showErrorMessage(_this,err.data.msg);                                
            });

        },


        onClickAdd() {
            logger.log.debug("BookmarkView.onClickAdd");
            this.$refs.bookmarkDialog.show();
        },
        onClickTest() {
            logger.log.debug("BookmarkView.onClickTest : v_data=",this.v_data);
        },
        onClickSave() {
            logger.log.debug("BookmarkView.onClickSave");
            this.processSave(this.v_data);
        },
        onClickDelete(bookmark) {
            logger.log.debug("BookmarkView.onClickDelete : bookmark=",bookmark);
            this.processDelete(bookmark);
        },
        onBookmarkAdded(dicParam) {
            logger.log.debug("BookmarkView.onBookmarkAdded : dicParam=",dicParam);
            this.addBookmarks(dicParam.selected);            
        }
    }

};

</script>

<style scoped>


.poolList div {
    margin: 10px;
    padding: 3px 0px;
}
</style>