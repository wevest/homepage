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
			<PortfolioList
				ref="pfVC"
				:title="$t('page.home.portfoliolist.vc.title')"
				maxLength="10"
				moreCaption=""
			></PortfolioList>
		</div>

		<div>
			<PortfolioList
				ref="pfROI"
				:title="$t('page.home.portfoliolist.roi.title')"
				maxLength="10"
				showDescription="0"
				moreCaption=""
			></PortfolioList>
		</div>

		<div>
			<PortfolioList
				ref="pfRated"
				:title="$t('page.home.portfoliolist.highvoted.title')"
				maxLength="10"
				showDescription="0"
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
import CBigLabel from "components/CBigLabel";

import PortfolioList from "components/lists/PortfolioList";


export default {
	name: "PageIndex",
	components: {
		CTitle,
		PortfolioList,
	},
	computed: {
		v_me() {
			return store.getters.me;
		},
	},

	data() {
		return {
			v_tab: "upbit",
			v_tab_toplist: "ret",
			v_toplist_visible: false,
			v_page: { title: "page.home.title", desc: "" },
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
			this.$refs.pfROI.updateByType("roi");
			this.$refs.pfRated.updateByType("voting");
		},

	},
};
</script>


<style scoped>
</style>