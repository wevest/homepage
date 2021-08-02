<template>
	<div class="q-pa-md">
		<div>
			<CTitle
				ttype="title"
				:title="$t('page.portfolio_index.title')"
				:desc="$t('page.portfolio_index.desc')"
			></CTitle>
		</div>

		<div>
			
			<WCategoryChip ref="categoryChip" color="primary" textColor="white" 
				:data="v_options" @onClickCategory="onClickCategory"
			/>

		</div>

		<div>
			<PortfolioList
				ref="pfList"
				:title="v_list_title"
				maxLength="2000" moreCaption=""
			></PortfolioList>
		</div>

	</div>
</template>


<script>
import { store } from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import CTitle from "components/CTitle";
import WCategoryChip from "components/WCategoryChip";

import PortfolioList from "components/lists/PortfolioList";


export default {
	name: "PageIndex",
	components: {
		CTitle,
		WCategoryChip,
		PortfolioList,
	},
	computed: {
		v_me() {
			return store.getters.me;
		},
	},

	data() {
		return {
			v_options: [
				{label:this.$t('name.crypto_vc'), value:'vc', icon:'event', selected:true},
				{label:this.$t('name.good_roi'), value:'roi', icon:'event', selected:false},
				{label:this.$t('name.trending'), value:'voted', icon:'event', selected:false},
				{label:this.$t('name.all'), value:'all', selected:false},
			],
			v_category: null,			
			v_list_title: '',
		};
	},
	created() {
		//console.log("HomeView.created");
	},
	mounted() {
		//console.log("HomeView.mounted - ");
		this.prepare();
		this.refresh();
	},
	updated() {
		//console.log("HomeView.updated");
	},

	methods: {
		prepare() {
			this.v_category = this.v_options[0];
		},
		refresh() {			
			this.v_list_title = this.v_category.label;

			this.$refs.pfList.clear();
			if (this.v_category.value=="vc") {
				this.$refs.pfList.updateByType("vc");
			} else if (this.v_category.value=="roi") {
				this.$refs.pfList.updateByType("roi");
			} else if (this.v_category.value=="voting") {
				this.$refs.pfList.updateByType("voting");
			} else if (this.v_category.value=="all") {
				this.$refs.pfList.updateByType(null);
			}

		},

		onClickCategory(option) {
			logger.log.debug("PortfolioIndexView.onClickCategory : option=",option);
			this.v_category = option;
			this.refresh();
		}
	},
};
</script>


<style scoped>
</style>