<template>

    <div>
        
		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreAsset"></CTitle>

        <q-table
            row-key="name" flat                    
            :data="v_assets.items"
            :columns="v_headers"            
            :loading="v_table_loading"
            :filter="v_filter"
            :rows-per-page-options="[0]"
            :pagination.sync="v_pagination" >

            <template v-slot:top-right v-if="hideHeader=='0'">
                <q-input borderless dense debounce="300" v-model="v_filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
                </q-input>
            </template>

            <template v-slot:pagination="scope">
                <div class="boxPagination">
                    
                    {{v_pagination_label(scope)}}
<!--                    
                    <q-btn v-if="scope.pagesNumber > 2"
                        icon-right="first_page" color="grey-8" label="loadMore"
                        dense flat
                        :disable="scope.isLastPage"
                        @click="onClickMore"
                    />
-->                    
                </div>
            </template>

            <template v-slot:body="props">

                <q-tr :props="props" v-ripple @click="onClickAsset(props.row)" >
                    <q-td key="cmc_rank" :props="props">{{ props.row.cmc_rank }}</q-td>
                    <q-td key="symbol" :props="props" class="text-red-10 text-bold">{{ props.row.symbol }}</q-td>
                    <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                </q-tr>            

            </template>

        </q-table>
        
<!--
        <q-list separator class="rounded-borders">

            <q-item clickable v-ripple 
                v-for="(a_asset,index) in v_assets.items" :key="index" 
                v-if="index<v_maxLength"
                @click.stop="onClickAsset(a_asset)">
                <q-item-section avatar top>
                    <q-icon name="paid" color="black" size="50px" />
                </q-item-section>

                <q-item-section top>
                    <q-item-label lines="1">

                        <q-badge
                            class="RewardPoint q-mr-sm" 
                            color="purple-4"
                            text-color="white">
                            <span>{{a_asset.cmc_rank}}</span>
                        </q-badge>

                        <span class="gListTitle">{{a_asset.symbol}}</span>
                    </q-item-label>
                    <q-item-label lines="1">
                        <span class="gCaption">{{a_asset.name}}</span>
                    </q-item-label>
                </q-item-section>

            </q-item>

        </q-list>
-->

		<LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />

  </div>  
  
</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import { AssetListModel } from "src/models/AssetModel";

import CTitle from 'components/CTitle';
import LoadMore from "src/components/LoadMore";

export default {
	components: {
		CTitle,
        LoadMore
	},
    props: {
        maxLength: {
            default: 20,
        },
		title: {
			type:String,
			default: "Asset List"
		},
		moreCaption: {
			type:String,
			default: ""
		},
        hideHeader: {
            type:String,
            default:"1"
        }
    },
    computed: {
        v_title() {
            return this.title;
        },
        v_pagination_label() {
            return (scope) => {
                //logger.log.debug("v_pagination_label=",scope);
                let caption = this.v_assets.items.length.toString() + " of " + scope.pagination.rowsNumber.toString();
                return caption;
            };
        }
    },
    data () {
        return {
            g_data: null,
            v_maxLength: this.maxLength,
            v_more_caption: this.moreCaption,								

            v_assets: new AssetListModel(),

            v_headers: [                
                { name:'cmc_rank', label: this.$t('name.rank'), field: 'cmc_rank', sortable: true, align:'left'},
                { name:'symbol', label: this.$t('name.symbol'), field: 'symbol', sortable: true, align:'left', required:true  },
                { name:'name', label: "$ "+this.$t('name.name'), field: 'name', sortable: true, align:'left',},                
            ],
            v_pagination: {
                sortBy: 'cmc_rank',
                descending: false,
                page:1,
                rowsPerPage:this.maxLength,                
                rowsNumber:40,
            },
            v_table_loading:false,
            v_filter: ''
        }
    },

    methods: {
        update(limit,offset) {
            const _this=this;
            
            this.v_loading_table = true;
            this.v_assets.load(null,limit,offset).then(response=>{
                logger.log.debug("AssetList.update : response=",response);
                _this.$refs.loadMore.setPageParameter(response.data);
                
                _this.v_pagination.rowsNumber = _this.$refs.loadMore.v_count;
                _this.v_loading_table = false;

            }).catch(err=>{
                logger.log.error("AssetList.update : err=",err);
            });

        },

        onClickAsset: function(asset) {
            logger.log.debug('AssetList.onClickAsset : asset = ',asset);          
            CommonFunc.navAsset(this,asset.symbol,asset.id);
        },

        onClickMoreAsset: function() {
            logger.log.debug('AssetList.onClickMoreAsset');
            CommonFunc.navAssetIndex(this);
        },
        onClickMore() {
            logger.log.debug('AssetList.onClickMore');
        },

        onClickLoadMore: function() {                        
            logger.log.debug('AssetList.onClickLoadMore : v_next=',this.$refs.loadMore.v_next);
            
            this.v_maxLength = 100000;
            this.update(this.$refs.loadMore.v_next.limit,this.$refs.loadMore.v_next.offset);
        },

        onScroll ({ to, ref }) {            
            this.v_maxLength = 100000;
            
            const lastIndex = this.v_assets.items.length - 1;
            const lastPage = Math.ceil(this.$refs.loadMore.v_count / this.v_pagination.rowsPerPage);

            logger.log.debug('AssetList.onScroll : ',to,lastIndex, this.v_next_page, lastPage);
            //if (! this.v_loading_table.value) && nextPage.value < lastPage && to === lastIndex) {
            if ( (! this.v_loading_table) && (this.v_next_page<lastPage) && (to === lastIndex)) {                
                this.v_next_page++;
                //this.update(this.$refs.loadMore.v_next.limit,this.$refs.loadMore.v_next.offset);
            }
/*
            

            if (loading.value !== true && nextPage.value < lastPage && to === lastIndex) {
            loading.value = true

            setTimeout(() => {
                nextPage.value++
                nextTick(() => {
                ref.refresh()
                loading.value = false
                })
            }, 500)
            }
*/            
        },

        onRequest (props) {
            logger.log.debug('AssetList.onRequest : props=',props);
            this.update(this.$refs.loadMore.v_next.limit,this.$refs.loadMore.v_next.offset);
            this.v_pagination.page++; 
            this.v_pagination.rowsPerPage=20; 
        },

        onPagination(props) {
            logger.log.debug('AssetList.onPagination : props=',props);            
        }

    }
}
</script>


<style scope>
.boxPagination {
    justify-content: center;
}
</style>