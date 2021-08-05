<template>

    <div class="row q-gutter-sm text-center">        
        <div class="col">
            <q-skeleton v-if="!v_index_loaded" height="95px" square animation="pulse-x" />                    
            <CBigLabel ref='labelBtc' 
                title="BTC" moreButton=" "
                :value="v_data.btc.price" 
                :valueRet="v_format(v_data.btc.ret)"
                :updatedAt="v_data.btc.updated_at"
                extraCaption=""
                extraClass=""
                v-show="v_index_loaded"
                @onClick="onClick('BTC')"></CBigLabel>
            
        </div>
        <div class="col">
            <q-skeleton v-if="!v_index_loaded" height="95px" square animation="pulse-x" />                    
            <CBigLabel ref='labelEth' 
                title="ETH" moreButton=" "
                :value="v_data.eth.price" 
                :valueRet="v_format(v_data.eth.ret)"
                :updatedAt="v_data.eth.updated_at"
                extraCaption=""
                extraClass=""
                v-show="v_index_loaded"
                @onClick="onClick('ETH')"></CBigLabel>

        </div>
    </div>
    
</template>

<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

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
    computed: {
        v_format() {
            return (value) => {
                if (value>0) {
                    return "+"+CommonFunc.formatNumber(value,2);    
                }
                return CommonFunc.formatNumber(value,2);
            };            
        },
    },
    data() {
        return {
            v_data: {
                btc: {
                    price:0, ret:0, updated_at:''
                },
                eth: {
                    price:0, ret:0, updated_at:''
                },
            },
            v_index_loaded: false,
        }
    },
    methods: {
        update() {
            const _this = this;

            store.state.prices.load().then( response => {
                let a_btc = store.state.prices.getPrice('BTC');
                _this.v_data.btc.price = a_btc.last;
                _this.v_data.btc.ret = a_btc.change_percentage;
                _this.v_data.btc.updated_at = a_btc.updated_at;

                let a_eth = store.state.prices.getPrice('ETH');
                _this.v_data.eth.price = a_eth.last;
                _this.v_data.eth.ret = a_eth.change_percentage;
                _this.v_data.eth.updated_at = a_eth.updated_at;

                _this.v_index_loaded = true;
            })            

        },

        onClick(symbol) {
            logger.log.debug("MarketIndexWidget.onClick");
            let dicParam = {symbol:symbol};
            
            dicParam['id'] = 1;
            if (symbol=='ETH') dicParam['id'] = 1027;        
            this.$emit("onClick",dicParam);
        }
    }
};


</script>

<style scoped>

</style>
