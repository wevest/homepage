<template>
    
    <div class="q-ma-md">
        <CTitle ttype='title' :title="$t('page.asset_index.title')" :desc="$t('page.asset_index.desc')"></CTitle>

        <div>
			<WCategoryChip ref="categoryChip" color="primary" textColor="white" 
				:data="v_options" @onClickCategory="onClickCategory"
			/>
        </div>

        <AssetList ref='assetList' :title="v_list_title" />

    </div>

</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import AssetList from 'components/lists/AssetList';
import CTitle from 'components/CTitle';
import WCategoryChip from "components/WCategoryChip";

export default {
    name:'assetIndexView',
    components: {
        CTitle,
        WCategoryChip,
        AssetList
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data() {
        return {
			v_options: [
				{label:this.$t('name.market_capital'), value:'market_capital', icon:'event', selected:true},
                {label:this.$t('name.price_surge'), value:'price_surge', icon:'event', selected:false},
				{label:this.$t('name.new_listing'), value:'new', icon:'event', selected:false},
				{label:this.$t('name.all'), value:'all', selected:false},
			],
			v_category: null,			
			v_list_title: '',
        }
    },

    mounted() {
        logger.log.debug("AssetIndexView.mounted");
        this.prepare();
        this.refresh();
    },
    methods: {
        prepare() {
            this.v_category = this.v_options[0];
        },

        refresh() {
			this.v_list_title = this.v_category.label;

			this.$refs.assetList.clear();
			if (this.v_category.value=="market_capital") {
				this.$refs.assetList.updateByCategory("market_capital");
			} else if (this.v_category.value=="roi") {
				this.$refs.assetList.updateByCategory("roi");
			} else if (this.v_category.value=="voting") {
				this.$refs.assetList.updateByCategory("voting");
			} else if (this.v_category.value=="all") {
				this.$refs.assetList.updateByCategory(null);
			}

        },

        loadAssetList() {
            this.$refs.assetList.update(20,null);
        },

		onClickCategory(option) {
			logger.log.debug("AssetIndexView.onClickCategory : option=",option);
			this.v_category = option;
			this.refresh();
		}
    }
};

</script>
