<template>

    <div class="row q-gutter-sm text-center">
        <div class="col">
            <CBigLabel ref='labelBtc' 
                title="BTC" moreButton=" "
                :value="v_data.btc.price" 
                :valueRet="v_data.btc.ret"
                :updatedAt="v_data.btc.updated_at"
                extraCaption=""
                extraClass=""
                @onClick="onClick"></CBigLabel>
            
        </div>
        <div class="col">
            <CBigLabel ref='labelEth' 
                title="ETH" moreButton=" "
                :value="v_data.eth.price" 
                :valueRet="v_data.eth.ret"
                :updatedAt="v_data.eth.updated_at"
                extraCaption=""
                extraClass=""
                @onClick="onClick"></CBigLabel>

        </div>
    </div>
    
</template>

<script>
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import MoaBackendAPI from 'src/services/apiService';
import DataService from 'src/services/dataService';

import {TickerListModel} from 'src/models/AssetModel';

import CTitle from 'components/CTitle';
import CBigLabel from 'components/CBigLabel';


export default {
    name:'MarketIndexWidget',
    components: {
        CTitle,
        CBigLabel,
    },
	props: {
        data: {
            default:null,
        },
    },
    data() {
        return {
            v_tickers: new TickerListModel(),

            v_data: {
                btc: {
                    price:0, ret:0, updated_at:''
                },
                eth: {
                    price:0, ret:0, updated_at:''
                },
            }
        }
    },
    methods: {
        update() {
            const _this = this;

            this.v_tickers.load(null).then(resp=>{
                //logger.log.debug("MarketIndexWidget.update : items=",_this.v_tickers.items);

                const a_btc = _this.v_tickers.getByPair('BTC_USDT');                
                _this.v_data.btc.price = a_btc.last;
                _this.v_data.btc.ret = a_btc.change_percentage;
                _this.v_data.btc.updated_at = a_btc.updated_at;

                const a_eth = _this.v_tickers.getByPair('ETH_USDT');  
                //logger.log.debug("MarketIndexWidget.update : eth=",a_eth);
                _this.v_data.eth.price = a_eth.last;
                _this.v_data.eth.ret = a_eth.change_percentage;
                _this.v_data.eth.updated_at = a_eth.updated_at;

            }).catch(err=>{
                logger.log.error("MarketIndexWidget.update : err=",err);
            });
        },

        onClick() {
            logger.log.debug("MarketIndexWidget.onClick");
            this.$emit("onClick",{});
        }
    }
};


</script>

<style scoped>

</style>
