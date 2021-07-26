<template>
    <div>
        <q-select
            class="full-width"
            ref="assetSearch"
            :value="v_search"
            :loading="v_loading"
            use-input fill-input hide-selected borderless use-chips
            input-debounce="10"
            :label="label"
            :filled="v_filled"
            :options="v_options"
            @filter="filterFn"
            @input.native="filter($event.target.value)"
            @input="onSearchInput"
            @input-value="onSearchChange"
            @new-value="onSearch"
            @keyup.enter.native="onSearchEnter"
            behavior="menu"
        >

<!--            
            
-->            

            <template v-slot:prepend>
                <q-icon name="search" @click.stop />
            </template>

            <template v-slot:option="scope">
                <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents"
                >
                    <q-item-section>
                        <q-item-label v-html="scope.opt.label" />
                        <q-item-label caption>{{
                            scope.opt.value
                        }}</q-item-label>
                    </q-item-section>
                </q-item>
            </template>

            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                        No results
                    </q-item-section>
                </q-item>
            </template>
        </q-select>
    </div>

</template>

<script>
import { store } from "src/store/store";
import { MoaConfig } from "src/data/MoaConfig";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";
import {AssetListModel} from "src/models/AssetModel";
import _ from 'lodash';

import { debounce } from 'quasar';

export default {
    name: 'Index',
    props: {
        label: {
            default:'',
        },
        filled: {
            default:'0'
        }
    },
    computed: {
        v_filled() {
            if (this.filled=="1") return true;
            return false;
        }
    },
    data() {
        return {
            v_assets: new AssetListModel(),

            v_loading:false,
			v_search: null,
			v_options: [],
            g_options: [],
        };
    },
    created() {
        // filter 함수 debounce 처리(입력할때 마다 필터링 하지 않고 살짝 딜레이 줘서 필터링 되게)
        this.filter = debounce(this.filter, 500);
    },
    methods: {
        clear() {
            this.v_loading = false;
            this.v_search = "";
            this.g_options = [];
            this.v_options = [];
            this.$refs.assetSearch.refresh(-1);
            this.$refs.assetSearch.blur();
        },
        setValue(value){
            logger.log.debug("AutoComplete.setValue : value=",value);
            this.v_search = value;

        },
        getItem(items,label) {
            //logger.log.debug("getPrice.pair=",this.items);
            return _.find(items,{label:label} );
        },

		filter(keyword) {
			this.$refs.assetSearch.filter(keyword);
			this.v_asset = keyword;
		},
		filterFn(val, update, abort) {
			/*
        	if (val.length < 1) {
            	abort()
            	return
        	}
        	*/
			update(() => {
				const needle = val.toLowerCase();
				this.v_options = this.g_options.filter(
					(v) => v.label.toLowerCase().indexOf(needle) > -1
				);
			});
		},
		isValidInput(value) {
			if (! value) return false;

            if (value.length > 1) {
				return true;
			}
			return false;
		},
        querySearch(value) {
            const _this=this;

            this.g_options = [];
            this.v_loading=true;
            this.v_assets.query(value).then(resp=>{
                logger.log.debug("AutoComplete.querySearch : value=",value,resp);
                if (resp.data.length==0) return;

                for (let index=0;index<resp.data.length;index++) {                    
                    _this.g_options.push({label:resp.data[index].symbol +" - "+resp.data[index].name, 
                        symbol:resp.data[index].symbol, 
                        id: resp.data[index].id}
                    );
                }
                _this.filter(value);
                _this.v_loading=false;
            }).catch(err=>{
                logger.log.debug("AutoComplete.querySearch : err=",err);
                _this.v_loading=false;
            });
        },

		onSearch(value) {
			//logger.log.debug('onSearch=',value);
		},
		onSearchInput(item) {
			logger.log.debug("AutoComplete.onSearchInput=", this.v_search,item);
			//this.g_input = item;            
            this.v_search = item;

            if (this.isValidInput(item.label)) {
				this.$emit("onSelect",item);
			}
		},
		onSearchChange(value) {						
			if (value.length==0) {                
                this.g_options = [];
            } else if (value.length==1) {
				if (this.g_options.length==0) {
                    this.querySearch(value);
                }                
            }

            logger.log.debug("CryptoSelect.onSearchChange=", this.v_search,value);

		},
		onSearchEnter(event) {
			let a_item = this.getItem(this.g_options,event.target.value);
            //logger.log.debug("AutoComplete.onSearchEnter : item=",a_item);
			
            if (! this.isValidInput(this.g_input)) {			
                return;
            }
            
            logger.log.debug("AutoComplete.onSearchEnter : item2=",a_item);
            
            this.g_input = a_item;

            event.target.blur();
            this.$refs.assetSearch.refresh(-1);			            
            this.$emit("onSelect",a_item);
/*            
            const _this=this;
            setTimeout( ()=> {
                _this.$refs.assetSearch.refresh(-1);			
                _this.$emit("onSelect",a_item);
            },300);
*/

		},

    },
};
</script>