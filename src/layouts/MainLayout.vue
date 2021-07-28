<template>
	<q-layout view="lHh Lpr lFf">
		<q-header elevated>
			<div class="row flex">
				<q-toolbar class="col-6 bg-white text-black">
					<q-btn v-if="v_show_back_button"
						flat dense round
						ref="mainMenuBackButton"						
						color="black" align="centered" icon="arrow_back_ios" aria-label="Back"
						@click="onClickBack"
					/>
					
					<q-btn flat dense round
						ref="mainMenuButton"
						color="black" align="centered" icon="menu" aria-label="Menu"						
						@click="leftDrawerOpen = !leftDrawerOpen"
					/>
					
					<div class="toolbar_title" @click="onClickLogo">WeVest</div>

					<CryptoSelect ref="searchInput" @onSelect="onSearch" label="" filled="0" />

				</q-toolbar>

				<q-toolbar class="col-6 bg-white text-black">
					<q-space />

					<div v-if="v_login == true">
						<a href="#" @click="onClickSignOut">{{ $t('button.logout') }}</a>
						
						<q-btn flat round dense color="amber" icon="person" @click="onClickUser" />
						<q-btn flat round dense color="yellow" icon="mail" @click="onClickMessage" />
						<q-btn flat round dense color="red" icon="notifications_none" @click="onClickNotification" />

					</div>
					<div v-else>
						<a href="#" @click="onClickSignIn">{{ $t('button.login') }}</a>
					</div>
<!--
					<div class="toolbar_language full-width">
						<q-select
							v-model="language"
							:options="langs"
							borderless
							dense
							label=""
							behavior="menu"
							@input="onChangeLang"
						/>
					</div>
-->					
				</q-toolbar>
				<!--
          <q-toolbar class="col-2 bg-white text-black">          
-->
			</div>
		</q-header>

		<q-drawer
			v-model="leftDrawerOpen"
			show-if-above
			bordered
			content-class="bg-grey-1"
		>
			<SideBar ref="sidebar"></SideBar>
		</q-drawer>

		<q-page-container>	

			<PageTransition>
				<router-view :key="$route.fullPath"></router-view>			
			</PageTransition>

		</q-page-container>


		<WAlertDialog ref="alertDialog" />
		<WConfirmDialog ref="confirmDialog" title="Do you want to delete the item?" @onClickConfirm="onClickDeleteConfirm" />
		<AddPortfolioDialog ref="portfolioDialog" @onPortfolioItemAdded="onPortfolioItemAdded" />
		<StickyButtons ref="stickButton" @onClickPortfolio="onClickPortfolio" />

	</q-layout>
</template>


<script>
import SideBar from "./SideBar";
import Spinner from "src/components/Spinner";
import { mapState } from "vuex";

import { store } from "src/store/store";
import { CONST } from "src/data/const";
import { MoaConfig } from "src/data/MoaConfig";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import WAlertDialog from "src/components/dialogs/WAlertDialog";
import WConfirmDialog from "src/components/dialogs/WConfirmDialog";
import AddPortfolioDialog from 'components/dialogs/AddPortfolioDialog';
import PageTransition from "src/components/transition/PageTransition";
import StickyButtons from "src/layouts/components/StickyButtons";
import CryptoSelect from "src/components/CryptoSelect";

export default {
	name: "MainLayout",
	components: {
		SideBar,
		Spinner,
		PageTransition,
		WAlertDialog,
		WConfirmDialog,
		AddPortfolioDialog,
		StickyButtons,
		CryptoSelect
	},
	computed: {
		v_login: function () {
			return store.getters.isLoggedIn;
		},
        v_me: function() {
            return store.getters.me;
        }
	},
	data() {
		return {
			v_show_back_button: false,
			//lang: this.$i18n.locale,

			leftDrawerOpen: false,
			language: "한글",
			langs: ["English", "한글"],
		};
	},

	created() {
		this.v_me.loadFromCookie();
	},
	mounted() {
		//CommonFunc.setAppData('spinner',this.$refs.loading);
		logger.log.debug("MainLayout.mounted");
		this.prepare();
	},
	updated() {
		//logger.log.debug("MainLayout.updated");
	},

	methods: {
		prepare() {
			store.getters.components.addToolbar(this);
			store.getters.components.addComponent('alertDialog',this.$refs.alertDialog);			
			store.getters.components.addComponent('confirmDialog',this.$refs.confirmDialog);
			store.getters.components.addComponent('portfolioDialog',this.$refs.portfolioDialog);

			//this.setLanguage();
			//logger.log.debug("MainLayout.prepare");
		},
		setBackButton(value) {
			this.v_show_back_button = value;
		},

		setLocale(locale) {
			logger.log.debug("MainToolbar.setLocale : locale=",locale);
			// set the Vue-i18n locale
			this.$i18n.locale = locale;
			// load the Quasar language pack dynamically
			import(`src/i18n/${locale}`).then(({ default: messages }) => {
				this.$q.lang.set(messages);
			});
		},

		setLanguage() {
			//set language
			if ( (! this.v_me) || (!this.v_me.default_lang)) {
				this.setLocale('en');
			} else {
				
				if (this.v_me.default_lang.indexOf('en')>-1) {
					this.setLocale('en');
				} else {
					this.setLocale(this.v_me.default_lang);
				}				
			}
		},

		loadCoinCodes() {
			let codes = store.state.assets.loadFromCookie();
			return codes;
		},

		movePage(item) {
			logger.log.debug("movePage=", item);

			//this.$refs.mainMenuButton.focus();
			this.$refs.searchInput.clear();

			if (this.$router.currentRoute.name == "asset") {
        		let r = this.$router.resolve({
        			name: this.$route.name, // put your route information in
        			params: this.$route.params, // put your route information in
        			query: {symbol:item.symbol, id:item.id}
      			});
      			window.location.assign(r.href);
				return;	
			}

			CommonFunc.navAsset(this, item.symbol, item.id);
		},


		onSearch(item) {
			logger.log.debug("MainLayout.onSearch=", item);
			this.movePage(item);
		},
		onChangeLang() {
			logger.log.debug("onChangeLang=", this.language);
			if (this.language == "English") {
				this.setLocale("en-us");
			} else {
				this.setLocale("kr");
			}
		},

		onClickUser() {
			logger.log.debug("MainToolbar.onClickUser : $route=",this.$route);
			let dic_param = { name: "profile", params: {} };
			this.$router.push(dic_param);
		},

		onClickMessage() {
			logger.log.debug("MainToolbar.onClickMessage");
			store.getters.nav.clear();
			let dic_param = { name: "message", params: {} };
			this.$router.push(dic_param);
		},

		onClickNotification() {
			logger.log.debug("MainLayout.onClickNotification");
			CommonFunc.navNotification(this);
		},

		onClickSignIn() {
			logger.log.debug("onClickSignIn");
			let dic_param = { name: "signin", params: {} };
			this.$router.push(dic_param);
		},

		onClickLogo() {
			logger.log.debug("onClickLogo");
			let dic_param = { name: "home", query: {}, meta:{transition:'overlay-up-full'} };
			this.$router.push(dic_param);
		},

		onClickSignOut() {
			logger.log.debug("onClickSignOut");

			const _this = this;
			this.v_me
				.signOut()
				.then(response => {
					//_this.setSigninMenu();
					store.getters.nav.clear();
					CommonFunc.showOkMessage(_this,'Loggout');
				})
				.catch(err => {
					logger.log.error('MainLayout.onClickSignOut:err2=',err);

					//_this.setSigninMenu();
					_this.v_me.processLogout();
					store.getters.nav.clear();

					CommonFunc.showErrorMessage(_this,err.data.detail);
				});
		},

		onClickBack() {
			logger.log.debug("MainLayout.onClickBack");			
			store.getters.nav.back(this);
		},

		onClickDeleteConfirm() {
			logger.log.debug("MainLayout.onClickDeleteConfirm");
		},

        onPortfolioItemAdded(jsonItem) {
            logger.log.debug("MainLayout.onPortfolioItemAdded = ",jsonItem);
            //this.v_user.portfolio.addPortfolioItem(jsonItem.portfolio_item);
            //this.v_user.portfolio.calcPerformance(store.state.prices);
        },

		onClickPortfolio() {
			logger.log.debug("MainLayout.onClickPortfolio");
			store.getters.components.getComponent('portfolioDialog').show(this.v_me,null); 
		},

	},
};
</script>

<style scoped>
.toolbar_language {
	width: 60px !important;
	box-sizing: unset;

	/* 
    margin-right: 1.5rem;   
    width: 100px !important;    
    left: 0px;
    padding-left: 0.5rem;   
    border-bottom: 1px solid #ccc;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    */
}

.toolbar_title {
	font-size: 1.5em;
	font-weight: bolder;
	/* 
  text-overflow: none !important;
  width:100%; */
}

</style>