import * as Mutations from 'src/store/constants';
import logger from "src/error/Logger";
//import ehandler from '@/error/EHandler';



export const mutations = {
	setData: function(state,payload) {
		state.data[payload.key] = payload.value;
	},

	
	[Mutations.SET_GLOBAL_DATA]:(state, json_data) => {
		logger.log.debug("Mutations.SET_GLOBAL_DATA , key,value=",json_data);		
		state.data[json_data.key] = json_data.value;
	},

	[Mutations.SET_COMPONENT]:(state, json_data) => {
		logger.log.debug("Mutations.SET_COMPONENT , key,value=",json_data);		
		state.components[json_data.key] = json_data.value;
	},
	
	[Mutations.SET_DATALIB]:(state, datalib) => {
		state.dataLib = datalib;
	},

	[Mutations.SET_SEED]:(state, seed) => null,
	[Mutations.SET_MNEMONIC]:(state, mnemonic) => state.mnemonic = mnemonic,

	[Mutations.PUSH_POPUP]:(state, popup) => state.popups.push(popup),
	[Mutations.RELEASE_POPUP]:(state, popup) => state.popups = state.popups.filter(p => p.id !== popup.id),
	[Mutations.SET_TOKENS]:(state, tokens) => state.tokens = tokens,
	[Mutations.SET_PRICES]:(state, prices) => state.prices = prices,
	[Mutations.SET_DAPP_DATA]:(state, data) => {
		state.dappData[data.key] = data.value;
	},
	[Mutations.RELEASE_PROCESS]:(state, p) => state.processes = state.processes.filter(x => x.id !== p.id),

	[Mutations.SET_PROCESS]:(state, p) => {
		const process = state.processes.find(x => x.id === p.id);
		if(!process) return state.processes.push(p);
		else process.progress = p.progress;
	},
	[Mutations.SET_RESOURCES]:(state, x) => state.resources = x,
	[Mutations.ADD_RESOURCES]:(state, x) => {
    Vue.set(state.resources, x.acc, x.res);
	},
	[Mutations.SET_BALANCES]:(state, x) => {
		let wallet = state.moa.getWallet(x.address,x.blockchain);
		if (CommonFunc.sanityCheck(x.balance)) {
			wallet.balance = parseFloat(x.balance);
		} else {
			wallet.balance = 0;
		}
		//Vue.set(state.balances, x.account, x.balances)
		//logger.log.debug("Mutations.SET_BALANCES",state.moa.wallets);
	},
	[Mutations.SET_FULL_BALANCES]:(state, x) => state.balances = x,
	[Mutations.REMOVE_BALANCES]:(state, accountKeys) => {
		accountKeys.map(key => {
			Vue.delete(state.balances, key);
		})
	},
	[Mutations.SET_HARDWARE]:(state, hardware) => Vue.set(state.hardware, hardware.name, hardware.transport),
	[Mutations.REMOVE_HARDWARE]:(state, key) => Vue.delete(state.hardware, key),
	[Mutations.NEW_KEY]:(state, x) => state.newKey = x,
	[Mutations.SET_LANGUAGE]:(state, x) => Vue.set(state.language, 'json', x),
	[Mutations.LOAD_HISTORY]:(state, x) => state.history = x,
	[Mutations.DELTA_HISTORY]:(state, x) => {
    	if(x === null) state.history = [];
    	else {
    		if(state.history.find(h => h.id === x.id)) state.history = state.history.filter(h => h.id !== x.id);
    		else state.history.unshift(x);
		}
	},

	[Mutations.AUTH_LOGIN]:(state,payload) => {
		logger.log.debug("Mutations.AUTH_LOGIN , moa",state.moa);

		state.moa.user.access_token = payload.idToken;
		state.moa.user.login = true;
		state.moa.user.username = payload.response.user.email;
		state.moa.user.uid = payload.response.user.uid;
		state.moa.user.firebase = payload.response.user;
		state.moa.user.loginAt = new Date();
		state.moa.user.logoutAt = null;
	},

	[Mutations.AUTH_LOGOUT]:(state,payload) => {
		logger.log.debug("Mutations.AUTH_LOGOUT , moa",state.moa);

		state.moa.user.login = false;
		state.moa.user.uid = null;
		state.moa.user.firebase = null;
		state.moa.user.access_token = null;

		state.moa.user.loginAt = null;
		state.moa.user.logoutAt = new Date();
	},

	[Mutations.AUTH_SIGNUP]:(state,payload) => {
		logger.log.debug("Mutations.AUTH_SIGNUP , payload",payload);
	},

	[Mutations.UPDATE_SUPPORTED_CURRENCY]:(state,items) => {
		state.moa.supportedCurrency = CommonFunc.clone(items);
		logger.log.debug("Mutations.UPDATE_SUPPORTED_CURRENCY",state.supportedCurrency);
	},

	[Mutations.UPDATE_WALLET]:(state,items) => {
		//state.moa.wallets = items;
		//Object.assign(state.moa.wallets,items);
		state.moa.wallets = CommonFunc.clone(items);
		logger.log.debug("Mutations.UPDATE_WALLET",state.moa.wallets);
	},

	[Mutations.ADD_CONTACT]:(state,item) => {
		//state.moa.wallets = items;
		//Object.assign(state.moa.wallets,items);
		let items = CommonFunc.clone(state.moa.contacts);
		items.push(item);
		state.moa.contacts = CommonFunc.clone(items);
		logger.log.debug("Mutations.ADD_CONTACT",item,state.moa.contacts);
	},

	[Mutations.REMOVE_CONTACT]:(state,item) => {
		//state.moa.wallets = items;
		//Object.assign(state.moa.wallets,items);
		logger.log.debug("Mutations.REMOVE_CONTACT",state.moa.contacts);
	},

	[Mutations.UPDATE_CONTACT]:(state,items) => {
		//state.moa.wallets = items;
		//Object.assign(state.moa.wallets,items);
		state.moa.contacts = CommonFunc.clone(items);
		logger.log.debug("Mutations.UPDATE_CONTACT",state.moa.contacts);
	},

	[Mutations.EDIT_CONTACT]:(state,contact) => {
		//let contacts = CommonFunc.clone(state.moa.contacts);
		logger.log.debug("Mutations.EDIT_CONTACT - Enter",contact);
		let newContacts = [];
		state.moa.contacts.forEach(function(item) {
			//logger.log.debug("Mutations.EDIT_CONTACT",item);
			if (item.email!=contact.email) {
				newContacts.push(item);
			}
		})
		newContacts.push(contact);
		state.moa.contacts = newContacts;
		logger.log.debug("Mutations.EDIT_CONTACT",state.moa.contacts);
	},

	[Mutations.SET_MOA]:(state,moa) => {
		logger.log.debug("Mutations.SET_MOA",moa,state.moa);
		if (state.moa) {
			Object.assign(state.moa,moa);
		} else {
			state.moa = moa.clone();
		}
	},

	[Mutations.UPDATE_EXCHANGE_RATE]:(state,rates) => {
		logger.log.debug("Mutations.UPDATE_EXCHANGE_RATE",rates);
		state.moa.exchangeRates = rates;
	},

	[Mutations.UPDATE_TX]:(state,params) => {
		logger.log.debug("Mutations.UPDATE_TX",params,state.moa.wallets);
		state.moa.getTednWallet(params.address).transactions = params.txs.slice();
	},

	[Mutations.UPDATE_ASSET_TX]:(state,params) => {
		logger.log.debug("Mutations.UPDATE_ASSET_TX",params,state.moa.assets);
		state.moa.getAssetWallet(params.asset_id).transactions = params.txs.slice();
	},

	[Mutations.UPDATE_ETH_TX]:(state,params) => {
		logger.log.debug("Mutations.UPDATE_ETH_TX",params,state.moa.wallets);
		state.moa.getWallet(params.address,params.blockchain).transactions = params.transactions;
	},

	[Mutations.UPDATE_PINCODE]:(state,pincode) => {
		logger.log.debug("Mutations.UPDATE_PINCODE",pincode,state.moa.user);
		state.moa.user.profile.pincode = pincode;
	},

	[Mutations.DECODE_PROFILE]:(state,payload) => {
		state.moa.user.profile = Profile.fromJson(payload);
	},

	[Mutations.ADD_NOTIFICATION]:(state,notification) => {
		let items = CommonFunc.clone(state.notifications);
		items.unshift(notification);
		state.notifications = CommonFunc.clone(items);
		//logger.log.debug("Mutations.ADD_NOTIFICATION",notification,state.notifications);
	},

	[Mutations.REMOVE_NOTIFICATION]:(state,notification) => {
		const clonedNotifications = CommonFunc.clone(state.notifications);
		let items = [];
		clonedNotifications.forEach(function(item) {
			//logger.log.debug("Mutations.REMOVE_NOTIFICATION",item,notification);
			if (item.id!==notification.id) {
				items.push(item);
			}
		});
		//logger.log.debug("Mutations.REMOVE_NOTIFICATION",items);
		state.notifications = CommonFunc.clone(items);
		//logger.log.debug("Mutations.REMOVE_NOTIFICATION",state.notifications);
	},

	[Mutations.UPDATE_HISTORY]:(state,arrPayload) => {
		let items = CommonFunc.clone(state.history);
		arrPayload.forEach(function (payload) {
			items.unshift(payload);
		});
		
		state.history = CommonFunc.clone(items);
		logger.log.debug("Mutations.UPDATE_HISTORY",arrPayload,state.history);		
	},

	[Mutations.UPDATE_PROFILE]:(state,item) => {
		state.moa.user.profile = item;
	},

	[Mutations.UPDATE_ASSET]:(state,assets) => {
		//state.assets = items;
		Object.assign(state.assets,assets);
	},

	[Mutations.UPDATE_ASSET_ITEM]:(state,item) => {
		//state.assets = items;
		
		let clonedAssets = state.assets.clone();
		const found = CommonFunc.getItemCount(clonedAssets.items,'assetId',item.assetId);
		if (found.count>0) {
			Object.assign(clonedAssets.items[found.index[0]],item);
			Object.assign(state.assets.items,clonedAssets.items);
		}
	},

	[Mutations.UPDATE_ASSET_ITEMS]:(state,items) => {
		//state.assets = items;
		Object.assign(state.assets.items,items);
	},

	[Mutations.UPDATE_MYASSET]:(state,items) => {
		//state.moa.assets = items;
		logger.log.debug("Mutations.UPDATE_MYASSET",items);
		Object.assign(state.moa.assets.items,items);
	},

	[Mutations.ADD_ASSET]:(state,item) => {
		let items = CommonFunc.clone(state.assets.items);
		const found = CommonFunc.getItemCount(items,'assetId',item.assetId);
		logger.log.debug("Mutations.ADD_ASSET",item,found);
		if ((!found) || (found.count==0)) {
			//logger.log.debug("Mutations.ADD_ASSET",item);
			items.push(item);
			Object.assign(state.assets.items,items);	
		}
	},

	[Mutations.SET_ASSET_BALANCES]:(state, x) => {
		logger.log.debug("Mutations.SET_ASSET_BALANCES",state.assets,x);
		ehandler.assertReference(state.assets,"moa.assets is null");
		if (CommonFunc.sanityCheck(state.assets)) {
			let items = CommonFunc.clone(state.moa.assets);
			items.forEach(function(item) {
				if (item.assetId==x.address) {
					item.balance = parseFloat(x.balance);
				}
			});
			state.assets = items;	
		}
	},

	[Mutations.SET_MYASSET_BALANCES]:(state, x) => {
		//logger.log.debug("Mutations.SET_MYASSET_BALANCES",state.moa.assets,x);
		ehandler.assertReference(state.moa.assets.items,"moa.assets is null");
		if (CommonFunc.sanityCheck(state.moa.assets.items)) {
			let clonedAssets = state.moa.assets.clone();
			clonedAssets.items.forEach(function(item) {
				if (item.assetId==x.address) {
					item.balance = parseFloat(x.balance);
				}
			});
			Object.assign(state.moa.assets.items,clonedAssets.items);	
		}
	},


	[Mutations.SET_CURRENT_CHANNEL]:(state, x) => {
		if (state.messager.currentChannel) {
			Object.assign(state.messager.currentChannel,x);
		} else {
			state.messager.currentChannel = CommonFunc.clone(x);
		}
		logger.log.debug("SET_CURRENT_CHANNEL",state.messager,x);		
	},

	[Mutations.SET_CHAT_PRIVATE]:(state, x) => {
		state.messager.isPrivate = x;
	},

	[Mutations.UPDATE_ASSET_HOLDERS]:(state, x) => {
		let holders = CommonFunc.clone(state.assets.items);
		//logger.log.debug("Mutations.UPDATE_ASSET_HOLDERS - 1.0",holders,x);
		CommonFunc.setArrayItem(holders,'assetId',x.assetId,'holders',x.holders);
		logger.log.debug("Mutations.UPDATE_ASSET_HOLDERS - 1.1",holders);
		Object.assign(state.assets.items,holders);
	},

	[Mutations.ADD_ASSET_FAVORITE]:(state,x) => {
		let items = CommonFunc.clone(state.moa.user.profile.assetFavorite);
		items.push(x);
		state.moa.user.profile.assetFavorite = CommonFunc.clone(items);
		logger.log.debug("Mutations.ADD_ASSET_FAVORITE",x);
	},

	[Mutations.SET_CHAT_PRIVATE_USER]:(state,x) => {
		state.messager.toUser = x;
	},

	[Mutations.UPDATE_CHANNELS]:(state,channels) => {
		Object.assign(state.messager.channels,channels);
	},

	[Mutations.UPDATE_PRIVATE_CHANNELS]:(state,x) => {
		state.messager.privateChannels = x;
	},

	[Mutations.ADD_CHANNEL]:(state,x) => {
		let items = CommonFunc.clone(state.messager.channels);
		items.push(x);
		Object.assign(state.messager.channels,items);
		logger.log.debug("Mutations.ADD_CHANNEL",items);
	},

	[Mutations.ADD_PRIVATE_CHANNEL]:(state,x) => {
		let items = CommonFunc.clone(state.messager.privateChannels);
		items.push(x);
		Object.assign(state.messager.privateChannels,items);
	},

	[Mutations.SET_MESSAGER]:(state,x) => {
		state.messager = x;
		//Object.assign(state.messager,x);
	},

	[Mutations.SET_PROCESSING]:(state,x) => {
		state.processing = x;
	},
	
	[Mutations.SET_TOKEN_BALANCE_CHECK_TIME]:(state,x) => {
		state.moa.tokenBalanceCheckTime = x;
	},

	[Mutations.SET_ASSET_BALANCE_CHECK_TIME]:(state,x) => {
		state.moa.assetBalanceCheckTime = x;
	},

	[Mutations.SET_ASSET_LIST_CHECK_TIME]:(state,x) => {
		state.moa.assetListCheckTime = x;
	},
	
	[Mutations.SET_MYASSET_BALANCE_CHECK_TIME]:(state,x) => {
		state.moa.myAssetBalanceCheckTime = x;
	},

	[Mutations.SET_EXCHANGE_RATE_CHECK_TIME]:(state,x) => {
		state.moa.exchangeRateCheckTime = x;
	},

	[Mutations.UPDATE_NOTIFICATION]:(state,x) => {
		Object.assign(state.notifications,x);		
	},

	[Mutations.SET_NEXT_ROUTE]:(state,x) => {
		state.nextRoute = x;
	},

	[Mutations.SET_WEBTOKEN]:(state, x) => {
		Object.assign(state.moa.webToken,x);
	},

};