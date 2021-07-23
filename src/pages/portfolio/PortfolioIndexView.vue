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
			<!--
			<q-btn-toggle v-model="v_category" toggle-color="primary"
				:options="v_options" />
			-->
			
			<WCategoryChip ref="categoryChip" :data="v_options" />

		</div>

		<div>
			<PortfolioList
				ref="pfVC"
				:title="$t('page.home.portfoliolist.vc.title')"
				maxLength="10"
				moreCaption=""
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
			v_category: '',
			v_options: [
				{label:'수익율이 좋은 포트폴리오', value:'roi', icon:'event'},
				{label:'사람들이 좋아하는 포트폴리오', value:'voted', icon:'event'},
				{label:'Crypto VC들이 사랑하는 포트폴리오', value:'vc'},
				{label:'댓글이 가장 많은 포트폴리오', value:'comment'},
			],
		};
	},
	created() {
		//console.log("HomeView.created");
	},
	mounted() {
		//console.log("HomeView.mounted - ");
		this.refresh();
	},
	updated() {
		//console.log("HomeView.updated");
	},

	methods: {
		refresh: function () {
			const _this = this;

			let funcs = [
				this.loadPortfolioList(),
			];
			Promise.all(funcs).then(function () {});
		},


		loadPortfolioList: function () {
			this.$refs.pfVC.updateByType("vc");
			//this.$refs.pfROI.updateByType("roi");
			//this.$refs.pfRated.updateByType("voting");
		},

	},
};
</script>


<style scoped>
</style>