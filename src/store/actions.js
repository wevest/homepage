import * as Actions from 'src/store/constants';
import logger from "src/error/Logger";
/*
import firebase from "firebase";
import StorageService from '../services/StorageService';
import SocketService from '../services/SocketService';
import SecurityService from '../services/SecurityService';
import BackupService from '../services/BackupService';
//import PluginRepository from '../plugins/PluginRepository';
import Hasher from '../util/Hasher'
import IdGenerator from '../util/IdGenerator'
import Mnemonic from '../util/Mnemonic'
import {store} from '../store/store';

import Identity from '../models/Identity';
import Moa from '../models/Moa';
import {DigitalAsset,DigitalAssetMeta, DAssets} from '../models/DigitalAsset';
import CommonFunc from '@/util/CommonFunc';

import AES from 'aes-oop';
import PopupService from "../services/PopupService";
import {Popup} from '../models/popups/Popup'
import {RUNNING_TESTS} from "../util/TestingHelper";
//import {ipcAsync} from "../util/ElectronHelpers";
import logger from "@/error/Logger";
*/


export const actions = {
    [Actions.SET_GLOBAL_DATA]:({commit}, key,value) => {
        logger.log.debug("actions.SET_GLOBAL_DATA , data=",key,value);
        commit(Actions.SET_GLOBAL_DATA, key,value);
    },

    [Actions.SET_DATALIB]:({commit}, datalib) => {
        logger.log.debug("actions.actions , datalib=",datalib);
        commit(Actions.SET_DATALIB, datalib);
    },

    [Actions.LOAD_SCATTER]:async ({commit, state, dispatch}) => {
        logger.log.debug("Actions=>LOAD_SCATTER");

        if(!state.scatter) {
            //logger.log.debug("Actions=>LOAD_SCATTER - 1");
            let scatter = StorageService.getScatter();
            logger.log.debug("Actions=>LOAD_SCATTER - 1.1",scatter);
            if (!scatter) return null;
            logger.log.debug("Actions=>LOAD_SCATTER - 1.2");
            return commit(Actions.SET_SCATTER, scatter);
        }

        if(await PasswordService.verifyPassword()){
            logger.log.debug("Actions=>LOAD_SCATTER - 2");
            const scatter = state.scatter.clone();

            if(!RUNNING_TESTS){
	            //await require('../migrations/migrator').default(scatter);
            }

            scatter.meta.regenerateVersion();
            await dispatch(Actions.SET_SCATTER, scatter);
        }

        return true;
    },

    [Actions.CREATE_SCATTER]:({state, commit, dispatch}, password) => {
        return new Promise(async (resolve, reject) => {
            const scatter = await Scatter.create();

            await SocketService.initialize();

            await StorageService.setSalt(Hasher.unsaltedQuickHash(IdGenerator.text(32)));

            dispatch(Actions.SET_SEED, password).then(mnemonic => {
                dispatch(Actions.SET_SCATTER, scatter).then(_scatter => {

                    PopupService.push(Popup.mnemonic(mnemonic));
                    resolve();
                })
            })
        })
    },

    [Actions.SET_SCATTER]:async ({commit, state}, scatter) => {
        logger.log.debug("Actions=>SET_SCATTER");

        return new Promise(async resolve => {

            //const seed = await ipcAsync('seed');
            StorageService.setScatter(AES.encrypt(scatter.savable(seed), seed)).then(() => {
	            BackupService.createAutoBackup()
            });

            commit(Actions.SET_SCATTER, scatter);
            resolve(scatter);
        })
    },


    [Actions.CREATE_MOA]: ({commit, state, dispatch}) => {
        logger.log.debug("Actions.CREATE_MOA");
/*        
        if(!state.moa) {
            let moa = StorageService.getMoa();
            if (!moa) return null;
            return commit(Actions.SET_MOA, moa);
        }
*/
        
        const moa = Moa.create();
        commit(Actions.SET_MOA, moa);
        //return moa;
        //resolve();
    },

    [Actions.LOAD_MOA]: ({commit, state, dispatch}) => 
    {
        if(!state.moa) {
            //logger.log.debug("Actions=>LOAD_SCATTER - 1");
            //let moa = StorageService.getMoa();
            //logger.log.debug("Actions=>LOAD_MOA - 1.0",moa);            
            dispatch(Actions.CREATE_MOA);
        }   

    },

/*
    [Actions.LOAD_MOA]: ({commit, state, dispatch}) => 
    {
        return new Promise(function(resolve,reject) {
            if(!state.moa) {
                //logger.log.debug("Actions=>LOAD_SCATTER - 1");
                //let moa = StorageService.getMoa();
                //logger.log.debug("Actions=>LOAD_MOA - 1.0",moa);
                
                let newMoa = null;
    
                newMoa = dispatch(Actions.CREATE_MOA);
                logger.log.debug("Actions=>LOAD_MOA - 1.1",newMoa);
                // Moa will not support auto login for security reason.
                dispatch(Actions.SET_MOA,newMoa).then(()=> {
                    resolve();
                })

            } else {
                resolve();
            }   
        });
    },
*/

    [Actions.SAVE_MOA]: ({commit, state, dispatch}) => {
        if(!state.moa) {
            dispatch(Actions.SET_MOA,state.moa).then( () => {
            });
        }
    },

    [Actions.SET_MOA]: ({commit, state},moa) => {
        logger.log.debug("Actions.SET_MOA = ",moa);
        commit(Actions.SET_MOA, moa);
/*        
        return new Promise(function(resolve,reject) {
            StorageService.setMoa(moa).then( () => {
                commit(Actions.SET_MOA, moa);
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
*/        
    },


    [Actions.SHOW_TERMS]:async ({commit, state, dispatch}) => {
        logger.log.debug("Actions=>SHOW_TERMS");
        return null;
    },


    [Actions.PUSH_POPUP]:({commit}, popup) => commit(Actions.PUSH_POPUP, popup),
    [Actions.RELEASE_POPUP]:({commit}, popup) => commit(Actions.RELEASE_POPUP, popup),
    [Actions.SET_HARDWARE]:({commit}, hardware) => commit(Actions.SET_HARDWARE, hardware),
    [Actions.REMOVE_HARDWARE]:({commit}, key) => commit(Actions.REMOVE_HARDWARE, key),
    [Actions.SET_TOKENS]:({commit}, tokens) => commit(Actions.SET_TOKENS, tokens),
    
    [Actions.SET_BALANCES]:({commit}, x) => 
    {
        //logger.log.debug("Actions.SET_BALANCES",x);
        commit(Actions.SET_BALANCES, x);
    },
    [Actions.SET_FULL_BALANCES]:({commit}, x) => {
        commit(Actions.SET_FULL_BALANCES, x);
    },
    [Actions.REMOVE_BALANCES]:({commit}, x) => commit(Actions.REMOVE_BALANCES, x),
    [Actions.SET_PRICES]:({commit}, prices) => commit(Actions.SET_PRICES, prices),
    [Actions.NEW_KEY]:({commit}, x) => commit(Actions.NEW_KEY, x),
    [Actions.SET_LANGUAGE]:({commit}, x) => {
	    commit(Actions.SET_LANGUAGE, x);
	    return StorageService.setTranslation(x);
    },
    [Actions.LOAD_LANGUAGE]:async ({commit}) => commit(Actions.SET_LANGUAGE, await StorageService.getTranslation()),
    
    [Actions.LOAD_HISTORY]:async ({commit}) => commit(Actions.LOAD_HISTORY, await StorageService.getHistory()),
    [Actions.UPDATE_HISTORY]:async ({commit}, items) => {
        //await StorageService.updateHistory(x);
        //commit(Actions.LOAD_HISTORY, await StorageService.getHistory())
        commit(Actions.UPDATE_HISTORY,items)
    },
    [Actions.DELTA_HISTORY]:({commit}, x) => {
        commit(Actions.DELTA_HISTORY, x);
        return StorageService.deltaHistory(x);
    },

    [Actions.UPDATE_SUPPORTED_CURRENCY]:async ({commit, state}, items) => {
        commit(Actions.UPDATE_SUPPORTED_CURRENCY, items);
    },
    [Actions.UPDATE_WALLET]:async ({commit, state}, items) => {
        commit(Actions.UPDATE_WALLET, items);
    },

    [Actions.UPDATE_CONTACT]:async ({commit, state}, items) => {
        commit(Actions.UPDATE_CONTACT, items);
    },

    [Actions.EDIT_CONTACT]:async ({commit, state}, contact) => {
        commit(Actions.EDIT_CONTACT, contact);
    },

    [Actions.AUTH_LOGIN]: ({commit, state, dispatch},response) => {
        //logger.log.debug("Actions.AUTH_LOGIN",response);
        response.user.getIdToken().then(function(idToken) {

            //logger.log.debug("Actions.AUTH_LOGIN - 1",idToken);   
            let payload = {'response':response, 'idToken':idToken};
            commit(Actions.AUTH_LOGIN, payload);   
            //logger.log.debug("Actions.AUTH_LOGIN - 2");            
/*
            dispatch(Actions.SET_MOA,state.moa)
            .then( () => {
                logger.log.debug("Actions.AUTH_LOGIN - 3");
            });
*/
        }).catch((error)=> {
            logger.log.error("Actions.AUTH_LOGIN - getIdToken Error");
        });

    },

    [Actions.AUTH_LOGOUT]: ({commit, state}) => {
        logger.log.debug("Actions.AUTH_LOGOUT");
        commit(Actions.AUTH_LOGOUT, {});
    },

    [Actions.AUTH_SIGNUP]: ({commit, state},payload) => {
        logger.log.debug("Actions.AUTH_SIGNUP");
        commit(Actions.AUTH_SIGNUP, payload);
    },

    [Actions.UPDATE_EXCHANGE_RATE]:async ({commit, state, dispatch},rates) => {
        logger.log.debug("Actions.UPDATE_EXCHANGE_RATE",rates);
        commit(Actions.UPDATE_EXCHANGE_RATE, rates);   
    },

    [Actions.UPDATE_TX]:async ({commit, state, dispatch},params) => {
        return new Promise(function(resolve,reject) {
            logger.log.debug("Actions.UPDATE_TX",params);

            let items = params.transactions.slice();
            logger.log.debug("Actions.UPDATE_TX - items",items);

            items.forEach(function(item) {
                if (params) {
                    item.tag = 0;
                }
            });
            const data = {'address':params.address, 'txs':items};
            commit(Actions.UPDATE_TX, data);
            resolve(data.txs);
        });
        
    },

    [Actions.UPDATE_ASSET_TX]:async ({commit, state, dispatch},params) => {
        return new Promise(function(resolve,reject) {
            logger.log.debug("Actions.UPDATE_ASSET_TX",params);

            let items = params.transactions.slice();
            logger.log.debug("Actions.UPDATE_ASSET_TX - items",items);

            items.forEach(function(item) {
                if (params) {
                    item.tag = 0;
                }
            });
            const data = {'asset_id':params.asset_id, 'txs':items};
            commit(Actions.UPDATE_ASSET_TX, data);
            resolve(data.txs);
        });
        
    },

    [Actions.UPDATE_ETH_TX]:async ({commit, state, dispatch},params) => {
        return new Promise(function(resolve,reject) {
            logger.log.debug("Actions.UPDATE_ETH_TX",params);
            let items = CommonFunc.formatETHTX(params.transactions);
              
            const data = {'address':params.address, 'transactions':items, 'blockchain':params.blockchain};
            commit(Actions.UPDATE_ETH_TX, data);
            resolve(data.items);
        });
        
    },

    [Actions.ADD_CONTACT]: ({commit, state},payload) => {
        logger.log.debug("Actions.ADD_CONTACT",payload);
        commit(Actions.ADD_CONTACT, payload);
    },

    [Actions.REMOVE_CONTACT]: ({commit, state},contact) => {
        logger.log.debug("Actions.REMOVE_CONTACT",contact);
        let contacts = moa.contacts.filter(x => x.email !== contact.email);
        commit(Actions.UPDATE_CONTACT, contacts);
    },

    [Actions.UPDATE_PINCODE]: ({commit, state},pincode) => {
        logger.log.debug("Actions.UPDATE_PINCODE",pincode);
        commit(Actions.UPDATE_PINCODE, pincode);
    },

    [Actions.DECODE_PROFILE]: ({commit, state}) => {
        const payload = state.moa.user.firebase.displayName;
        logger.log.debug("Actions.DECODE_PROFILE");
        commit(Actions.DECODE_PROFILE, payload);
    },

    [Actions.UPDATE_PROFILE]: ({commit, state},item) => {
        logger.log.debug("Actions.UPDATE_PROFILE");
        commit(Actions.UPDATE_PROFILE, item);
    },

    [Actions.ADD_NOTIFICATION]: ({commit, state},notification) => {
        //logger.log.debug("Actions.ADD_NOTIFICATION",notification);
        let found = CommonFunc.getItemCount(state.notifications,'id',notification.id);
        if (found.count==0) {
            commit(Actions.ADD_NOTIFICATION, notification);
        }
    },

    [Actions.REMOVE_NOTIFICATION]: ({commit, state},notification) => {
        //logger.log.debug("Actions.ADD_NOTIFICATION",notification);
        let found = CommonFunc.getItemCount(state.notifications,'id',notification.id);
        if (found.count>0) {
            commit(Actions.REMOVE_NOTIFICATION, notification);
        }
    },

    [Actions.ADD_ASSET]: ({commit, state},asset) => {
        //logger.log.debug("Actions.UPDATE_ASSET",assets);
        commit(Actions.ADD_ASSET, asset);
    },

    [Actions.LOAD_ASSET_FROM_SERVER]: ({commit, state},items) => {
        //logger.log.debug("Actions.UPDATE_ASSET",assets)
        let assets = DAssets.loadItems(items);
        commit(Actions.UPDATE_ASSET_ITEMS, assets);
    },

    [Actions.LOAD_ASSET_FROM_FIREBASE]: ({commit, state},docs) => {
        logger.log.debug("Actions.LOAD_ASSET_FROM_FIREBASE",state.assets);
        let clonedAssets = state.assets.updateItemsByFirebase(docs);
        commit(Actions.UPDATE_ASSET_ITEMS, clonedAssets.items);
    },

    [Actions.UPDATE_ASSET]: ({commit, state},assets) => {
        commit(Actions.UPDATE_ASSET, assets);
    },

    [Actions.UPDATE_ASSET_ITEM]: ({commit, state},asset) => {
        commit(Actions.UPDATE_ASSET_ITEM, asset);
    },

    [Actions.UPDATE_ASSET_ITEMS]: ({commit, state},assets) => {
        commit(Actions.UPDATE_ASSET_ITEMS, assets);
    },

    [Actions.UPDATE_MYASSET]: ({commit, state},assets) => {
        let clonedAssets = state.moa.assets.clone();
        logger.log.debug("Actions.UPDATE_MYASSET",clonedAssets);

        assets.forEach(function(asset) {
            //const newAsset = DigitalAsset.parseAssetJson(asset);            
            const found = CommonFunc.getItemCount(clonedAssets.items,'assetId',asset.asset_id);
            logger.log.debug("Actions.UPDATE_MYASSET - asset , found",asset,found);

            if ( (!found) || (found.count==0) ) {
                clonedAssets.add(asset);
            } else  {
                clonedAssets.update(asset);
            }
        });
        logger.log.debug("Actions.UPDATE_ASSET",clonedAssets);
        commit(Actions.UPDATE_MYASSET, clonedAssets.items);
    },

    [Actions.SET_ASSET_BALANCES]:({commit}, x) => 
    {
        //logger.log.debug("Actions.SET_ASSET_BALANCES",x);
        commit(Actions.SET_ASSET_BALANCES, x);
    },

    [Actions.SET_MYASSET_BALANCES]:({commit}, x) => 
    {
        //logger.log.debug("Actions.SET_ASSET_BALANCES",x);
        commit(Actions.SET_MYASSET_BALANCES, x);
    },

    [Actions.SET_CURRENT_CHANNEL]:({commit}, x) => {
        logger.log.debug("Actions.SET_CURRENT_CHANNEL",x);
        commit(Actions.SET_CURRENT_CHANNEL, x);
    },

    [Actions.SET_CHAT_PRIVATE]:({commit}, x) => {
        commit(Actions.SET_CHAT_PRIVATE, x);
    },

    [Actions.UPDATE_CHANNEL]:async ({commit, state, dispatch},x) => {
        let clonedChannels = CommonFunc.clone(state.messager.channels);
        const found = CommonFunc.getItemCount(clonedChannels,'name',x.old.name);
        if (found.count>0) {
            Object.assign(clonedChannels[found.index[0]],x.new);
        } else {
            clonedChannels.push(x.new);
        }
        commit(Actions.UPDATE_CHANNELS, clonedChannels);
    },

    [Actions.UPDATE_CHANNELS]:async ({commit, state, dispatch},x) => {
        commit(Actions.UPDATE_CHANNELS, x);
    },

    [Actions.UPDATE_PRIVATE_CHANNELS]:async ({commit, state, dispatch},x) => {
        commit(Actions.UPDATE_PRIVATE_CHANNELS, x);
    },

    [Actions.ADD_CHANNEL]:async ({commit, state, dispatch},x) => {
        logger.log.debug("Actions.ADD_CHANNEL",x);
        if (! state.messager.getChannel(x.name)) {
            commit(Actions.ADD_CHANNEL, x);
        }        
    },

    [Actions.ADD_PRIVATE_CHANNEL]:async ({commit, state, dispatch},x) => {
        logger.log.debug("Actions.ADD_PRIVATE_CHANNEL",x);
        if (! state.messager.getPrivateChannel(x.name)) {
            commit(Actions.ADD_PRIVATE_CHANNEL, x);
        }
    },

    [Actions.UPDATE_ASSET_HOLDERS]:({commit}, x) => {
        commit(Actions.UPDATE_ASSET_HOLDERS, x);
    },

    [Actions.ADD_ASSET_FAVORITE]:async ({commit, state, dispatch},x) => {
        commit(Actions.ADD_ASSET_FAVORITE, x);
    },

    [Actions.REMOVE_ASSET_FAVORITE]:async ({commit, state, dispatch},params) => {
    
    },

    [Actions.ADD_CONTACT_FAVORITE]:async ({commit, state, dispatch},params) => {
    
    },

    [Actions.REMOVE_CONTACT_FAVORITE]:async ({commit, state, dispatch},params) => {
    
    },


    [Actions.SET_CHAT_PRIVATE_USER]:async ({commit, state, dispatch},x) => {
        commit(Actions.SET_CHAT_PRIVATE_USER, x);
    },

    [Actions.SET_MESSAGER]:async ({commit, state, dispatch},x) => {
        commit(Actions.SET_MESSAGER, x);
    },
    
    [Actions.SET_PROCESSING]:({commit}, x) => 
    {
        commit(Actions.SET_PROCESSING, x);
    },

    [Actions.SET_ASSET_BALANCE_CHECK_TIME]:({commit}, x) => 
    {
        commit(Actions.SET_ASSET_BALANCE_CHECK_TIME, x);
    },

    [Actions.SET_ASSET_LIST_CHECK_TIME]:({commit}, x) => 
    {
        commit(Actions.SET_ASSET_LIST_CHECK_TIME, x);
    },

    [Actions.SET_MYASSET_BALANCE_CHECK_TIME]:({commit}, x) => 
    {
        commit(Actions.SET_MYASSET_BALANCE_CHECK_TIME, x);
    },

    [Actions.SET_TOKEN_BALANCE_CHECK_TIME]:({commit}, x) => 
    {
        commit(Actions.SET_TOKEN_BALANCE_CHECK_TIME, x);
    },

    [Actions.SET_EXCHANGE_RATE_CHECK_TIME]:({commit}, x) => 
    {
        commit(Actions.SET_EXCHANGE_RATE_CHECK_TIME, x);
    },
    
    [Actions.UPDATE_NOTIFICATION]:({commit}, x) => 
    {
        commit(Actions.UPDATE_NOTIFICATION, x);
    },

    [Actions.SET_NEXT_ROUTE]:({commit}, x) => 
    {
        commit(Actions.SET_NEXT_ROUTE, x);
    },

    [Actions.SET_WEBTOKEN]:({commit}, x) => 
    {
        commit(Actions.SET_WEBTOKEN, x);
    },
    
};
