<template>

    <div class="widget-box widget-biglabel" :class="bg_color" @click="onClick">
<!--
        <div class="icon-wrapper rounded-circle">
            <div class="icon-wrapper-bg bg-primary"></div>
            <i class="lnr-cog text-primary"></i>
        </div>
-->            
        <div class="widget-title text-white">
            <span class="label-name">{{title}}</span>            
            <q-badge :color="badge_color" class="badge text-black" v-if="tag">
                <q-icon
                    name="warning"
                    size="14px"
                    class="q-ml-xs"
                />&nbsp;          
                {{tag}}
            </q-badge>
        </div>

        <div class="widget-value" :class="text_color">{{value}}</div>
        <div class="widget-value-ret" :class="text_color">
            <q-icon class="widget-value-icon" :name="icon"/>
            <span class="pl-1"><span>{{value_pct_change}}%</span></span>
        </div>
    </div>

</template>

<script>
//import {HChart} from 'highcharts-vue';
//import stockInit from 'highcharts/modules/stock';
import CommonFunc from 'src/util/CommonFunc';


export default {
    name:'CBigLabel',
    components: {},
    props: {
        onclick: {
            type: Function,
            default: null,
        }
    },
    data: function () {
        return {
            title:'dsfsdfsdfd',
            tag:null,
            value:0,
            value_pct_change:0,
            
            bg_color:'bg-positive',
            text_color:'text-white',
            badge_color:'yellow-9',
            icon:'arrow_drop_down',
        }
    },

    methods: {
        update: function(json_label) {
            //widget[a_exchange]['endVal'] = parseFloat(CommonFunc.formatNumber(a_ret*100,2));

            this.title = json_label.title;
            this.tag = json_label.tag;
            this.value = CommonFunc.formatNumber(json_label.value,2);            
            this.value_pct_change = CommonFunc.formatNumber(json_label.value_pct_change*100,2);

            if (json_label.value_pct_change>0) {
                this.bg_color = 'bg-positive';
                this.icon = "arrow_drop_up";
            } else {
                this.bg_color = 'bg-negative';
                this.icon = "arrow_drop_down";
            }
        },

        onClick: function() {
            if (! this.onclick) {
                return;
            }
            
            this.onclick();
        }

    }
}

</script>



<style scoped>

.widget-box {
    -webkit-box-shadow: 0 0.46875rem 2.1875rem rgb(4 9 20 / 3%), 0 0.9375rem 1.40625rem rgb(4 9 20 / 3%), 0 0.25rem 0.53125rem rgb(4 9 20 / 5%), 0 0.125rem 0.1875rem rgb(4 9 20 / 3%);
    box-shadow: 0 0.46875rem 2.1875rem rgb(4 9 20 / 3%), 0 0.9375rem 1.40625rem rgb(4 9 20 / 3%), 0 0.25rem 0.53125rem rgb(4 9 20 / 5%), 0 0.125rem 0.1875rem rgb(4 9 20 / 3%);
    border-width: 0;
    -webkit-transition: all .2s;
    transition: all .2s;
}

.widget-box-border {
    -webkit-box-shadow: 0 0 0 transparent;
    box-shadow: 0 0 0 transparent;
    border-width: 1.0px;
}

.widget-biglabel {
    text-align: center;
    padding: 0.2rem;
    position: relative;
    }

.widget-biglabel .widget-value {
    font-weight: bold;
    font-size: 1.4rem;
    display: block;
    line-height: 0.9em;
    margin: 0.05rem auto;
}

.widget-biglabel .widget-title {
    /* 
        margin: -0.5rem 0 0; 
        opacity: .6;
    */
    font-weight: bold;
    font-size: 1.2rem;    
    display: block;   
}

.widget-biglabel .widget-value-ret {
    /* margin: 1rem 0 0; */
    font-size: 1.0rem;
}

.pl-1, .px-1 {
    padding-left: 0.09rem !important;
    font-size:0.9rem;
}


.widget-biglabel .badge {
    font-size: 0.8rem;
    margin: -0.7rem 0 0 0.4rem;     
}


.widget-biglabel .widget-value-icon {
    font-size: 1.5rem;
    margin: 0.1rem 0 0;   
}

.label-name {
    font-size:1.0rem;
}


</style>