import Vue from 'vue';
import Vuex from 'vuex';

import {mutations} from 'src/store/mutations';
import {actions} from 'src/store/actions';
//import {getters} from './getters';
import logger from "src/error/Logger";
import { PriceModel, PriceListModel } from "src/store/PriceModel";


Vue.use(Vuex);

const state = {
    version:0.18,
    prices: new PriceListModel(),
    components:{},
};

const getters = {
    data:state => state.data,
    components:state => state.components,

    //showNotifications:state => state.scatter.settings.showNotifications,

    totalBalances:(state, getters) => {
    	return WalletService.totalBalances(false);
    },

    fullTotalBalances:(state, getters) => {
	    return WalletService.totalBalances(true);
    },

};

const codes = {
    getCodes:() => {

    },
};


export const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    codes
})