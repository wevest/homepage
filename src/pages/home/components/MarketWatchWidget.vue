<template>
    
    <div class="q-pa-md flex flex-center text-center">        
        <div class="col-6" @click="onClickKnob">
            <span class="btc-eth">BTC</span><br>
            <q-knob
                show-value readonly class="text-green q-ma-md box_knob"
                :min="0" :max="10"
                v-model="v_risk.btc.value" size="110px" :thickness="0.30"                            
                :color="v_risk.btc.color" track-color="grey-3">
                <q-icon :name="v_risk.btc.icon" class="q-mr-xs box_knob"  />
                <span class="box_knob">{{ v_risk.btc.value }}</span>
            </q-knob>
        </div>
        <div class="col-6" @click="onClickKnob">
            <span class="btc-eth">ETH</span><br>
            <q-knob
                show-value readonly  class="text-green q-ma-md box_knob"
                :min="0" :max="10"
                v-model="v_risk.eth.value" size="110px" :thickness="0.30"                            
                :color="v_risk.eth.color" track-color="grey-3">
                <q-icon :name="v_risk.eth.icon" class="q-mr-xs box_knob" />
                <span class="box_knob">{{ v_risk.eth.value }}</span>
            </q-knob>
        </div>
    </div>

</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';


export default {
    name:'MarketWatchWidget',

    data:function() {
        return {
                v_risk: {
                btc: {value:56, color:'red'}, 
                eth: {value:56, color:'green'}, 
            },        
        }
    },

    methods: {
        update: function(data) {
            logger.log.debug('updteAlert - ',data);
            //this.g_data_watch = data;

            let dic_columns = CommonFunc.getColumnDic(data['BTC'].columns,[],[]);            
            this.v_subpage.cwatch.desc = 'UTC ' + data['BTC'].values[data['BTC'].values.length-1][dic_columns['utc_trade_date']];

            let btc_value = CommonFunc.getCWatchValueAndColor(data['BTC'].values[data['BTC'].values.length-1][dic_columns['rise_prob']]);
            this.v_risk.btc.value = btc_value.value;
            this.v_risk.btc.color = btc_value.color;
            this.v_risk.btc.icon = btc_value.icon;
            logger.log.debug('updteAlert - ',btc_value);

            let eth_value = CommonFunc.getCWatchValueAndColor(data['ETH'].values[data['ETH'].values.length-1][dic_columns['rise_prob']]);
            this.v_risk.eth.value = eth_value.value;
            this.v_risk.eth.color = eth_value.color;
            this.v_risk.eth.icon = eth_value.icon;
        },

        onClickKnob: function() {
            logger.log.debug('onClickKnob');
            let dic_param = { name:'cwatch', path:'cwatch', params:{} };
            this.$router.push(dic_param);            
        },

    }

}

</script>
