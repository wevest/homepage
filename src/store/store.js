import Vue from 'vue';
import Vuex from 'vuex';

import {mutations} from 'src/store/mutations';
import {actions} from 'src/store/actions';
//import {getters} from './getters';
import logger from "src/error/Logger";
import User from "src/models/UserModel";
import { AssetModel, AssetListModel } from "src/models/AssetModel";
import { PriceModel, PriceListModel } from "src/models/PriceModel";

Vue.use(Vuex);


const state = {
    version:0.18,
    me: new User(),
    prices: new PriceListModel(),
    assets: new AssetListModel(),

};

const getters = {
    me:state => state.me,

    data:state => state.data,    

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

    //showNotifications:state => state.moa.settings.showNotifications,

};


export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})