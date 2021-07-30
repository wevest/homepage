<template>
	<div class="q-pa-md">
		<div>
			<CTitle
				ttype="title"
				:title="$t('page.portfolioIndex.title')"
				:desc="$t('page.portfolioIndex.desc')"
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
				{label:'Crypto VC들이 사랑하는 포트폴리오', value:'vc', icon:'event', selected:true},
				{label:'수익율이 좋은 포트폴리오', value:'roi', icon:'event', selected:false},
				{label:'사람들이 좋아하는 포트폴리오', value:'voted', icon:'event', selected:false},
				{label:'모두 보기', value:'all', selected:false},
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