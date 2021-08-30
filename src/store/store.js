import Vue from 'vue';
import Vuex from 'vuex';

import {mutations} from 'src/store/mutations';
import {actions} from 'src/store/actions';
//import {getters} from './getters';
import logger from "src/error/Logger";
import User from "src/models/UserModel";
import { DataModel, NavBackModel } from "src/models/DataModel";
import { AssetModel, TickerListModel, AssetListModel } from "src/models/AssetModel";
import { PriceModel, PriceListModel } from "src/models/PriceModel";

Vue.use(Vuex);

const state = {
    data: {},
    
    components:new DataModel(),
    nav: new NavBackModel(),
    me: new User(),
    
    prices: new PriceListModel(),
    assets: new AssetListModel(),    
    tickers: new TickerListModel(),
};

const getters = {
    me:state => state.me,    
    data:state => state.data,    
    components:state => state.components,

    nav: state => state.nav,

    isLoggedIn:state => {        
        return state.me.isLoggedIn();
    },
    token:state => {
        return state.me.getToken();
    },
    
    totalBalances:(state, getters) => {
    	return WalletService.totalBalances(false);
    },

    fullTotalBalances:(state, getters) => {
	    return WalletService.totalBalances(true);
    },

    //showNotifications:state => state.moa.settings.showNotifications,ß
};


export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})