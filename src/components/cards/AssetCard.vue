<template>

    <div>
        
		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreAsset"
            extraCaption="Bookmark" @onClickTitleExtra="onClickAssetExtra"></CTitle>

        <q-skeleton v-if="!v_table_loaded" animation="fade" square height="150px" />
        <div v-show="v_table_loaded">

            <div class="row justify-center q-gutter-md">            

                <q-card v-for="(a_asset,index) in v_assets.items" :key="index">
                    
                    <q-card-section @click="onClickAsset(a_asset)" class="text-center">
                        
                        <q-img :src="a_asset.logo_thumb" width="64px" height="64px" v-if="a_asset.logo_thumb" />
                        <q-icon name="monetization_on" size="64px" v-else />
                        <div>
                            <div class="gListTitle q-pt-sm">{{a_asset.symbol}}</div>
                            <div class="gCaption">{{a_asset.name}}</div>
                        </div>
<!--                        
                        <div class="text-subtitle2">by John Doe</div>
-->                        
                    </q-card-section>

                </q-card>

            </div>

            <LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />
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

        </div>

    </div>  
  
</template>


<script>
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import { AssetModel, AssetListModel } from "src/models/AssetModel";

import CTitle from 'components/CTitle';
import LoadMore from "src/components/LoadMore";
import CryptoSelect from "src/components/CryptoSelect";

export default {
	components: {
		CTitle,
        LoadMore,
        CryptoSelect
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
        v_me() {
            return store.getters.me;
        },
        v_title() {
            return this.title;
        },
        v_shorten() {
            return (value,len) => {
                return CommonFunc.shortenString(value,len);
            };
        },
        v_pagination_label() {
            return (scope) => {
                //logger.log.debug("v_pagination_label=",scope);
                if ((! scope) ||(! scope.pagination)) return '';

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

            v_table_loaded: false,

            v_assets: new AssetListModel(),
            v_category: null,

            v_headers: [                
                { name:'cmc_rank', label: this.$t('name.rank'), field: 'cmc_rank', sortable: true, align:'left', style:"max-width:14px"},
                { name:'symbol', label: this.$t('name.symbol'), field: 'symbol', sortable: true, align:'left', required:true, },
                { name:'name', label: this.$t('name.name'), field: 'name', sortable: true, align:'left',},                
                { name:'date_added', label: this.$t('name.date_added'), field: 'date_added', sortable: true, align:'left',},
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
        clear() {
            this.v_assets.clear();
            this.$refs.loadMore.clear();
        },

        update(category) {
            const _this=this;
            
            let dicParam = {category:category, limit:this.$refs.loadMore.v_next.limit, offset:this.$refs.loadMore.v_next.offset};

            this.v_loading_table = true;                        
            this.v_assets.load(dicParam).then(response=>{
                logger.log.debug("AssetCommunityList.update : response=",response);
                _this.$refs.loadMore.setPageParameter(response.data);
                
                _this.v_pagination.rowsNumber = _this.$refs.loadMore.v_count;
                _this.v_loading_table = false;

                _this.v_table_loaded = true;

            }).catch(err=>{
                logger.log.error("AssetCommunityList.update : err=",err);
            });

        },

        updateByBookmarks() {
            logger.log.debug('AssetCommunityList.updateByBookmarks : bookmarks=',this.v_me.bookmarks.items);
            
            this.v_assets.items = this.v_me.bookmarks.items;
            this.v_loading_table = false;
            this.v_table_loaded = true;
        },

        updateByCategory(category) {
            this.v_category = category;
            this.update(this.v_category);
        },

        onClickAsset(asset) {
            logger.log.debug('AssetCommunityList.onClickAsset : asset = ',asset);          
            NavFunc.navAsset(this,asset.symbol,asset.id);
        },

        onClickMoreAsset: function() {
            logger.log.debug('AssetCommunityList.onClickMoreAsset');
            NavFunc.navAssetIndex(this);
        },
        onClickMore() {
            logger.log.debug('AssetCommunityList.onClickMore');
        },

        onClickLoadMore() {                        
            logger.log.debug('AssetCommunityList.onClickLoadMore : v_next=',this.$refs.loadMore.v_next);
            
            this.v_maxLength = 100000;
            this.update(this.$refs.loadMore.v_next.limit,this.$refs.loadMore.v_next.offset);
        },

        onScroll ({ to, ref }) {            
            this.v_maxLength = 100000;
            
            const lastIndex = this.v_assets.items.length - 1;
            const lastPage = Math.ceil(this.$refs.loadMore.v_count / this.v_pagination.rowsPerPage);

            logger.log.debug('AssetCommunityList.onScroll : ',to,lastIndex, this.v_next_page, lastPage);
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
            logger.log.debug('AssetCommunityList.onRequest : props=',props);
            this.update(this.$refs.loadMore.v_next.limit,this.$refs.loadMore.v_next.offset);
            this.v_pagination.page++; 
            this.v_pagination.rowsPerPage=20; 
        },

        onPagination(props) {
            logger.log.debug('AssetCommunityList.onPagination : props=',props);            
        },
        
		onSearch(asset) {
			logger.log.debug("AssetCommunityList.onSearch=", asset);
			//this.movePage(item);
            NavFunc.navAsset(this,asset.symbol,asset.id);
		},

        onClickAssetExtra(dicParam) {
            logger.log.debug("AssetCommunityList.onClickAssetExtra=", dicParam);
            NavFunc.navBookmark(this);
        }
    }
}
</script>


<style scope>
.boxPagination {
    justify-content: center;
}
</style>