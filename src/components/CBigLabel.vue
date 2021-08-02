<template>

    <div v-if="!v_loaded">
        <q-skeleton height="100px" square animation="fade" />
    </div>

    <div v-else class="widget-box" :class="v_color(valueRet)" @click="onClick" >
<!--
        <div class="icon-wrapper rounded-circle">
            <div class="icon-wrapper-bg bg-primary"></div>
            <i class="lnr-cog text-primary"></i>
        </div>
-->            
        <div v-if="(title) && (title.length>0)">
            <div>
                <span class="gListTitle text-white">{{title}}</span>   
                <q-badge :color="badge_color" class="badge text-black" v-if="tag">
                    <q-icon name="warning" size="14px" class="q-ml-xs" />&nbsp;          
                    {{tag}}
                </q-badge>
            </div>
        </div>
        <div class="text-left q-ml-md">
            
            <div v-if="(! title) || (title.length==0)" class="q-pt-md"></div>
            
            <div class="row" :class="text_color">
                <div>
                    $ {{v_format(value)}}
                </div>
                <q-space />
                <div v-if="moreButton.length>0"> 
                    <q-btn flat dense :label="moreButton" size="10px" icon-right="navigate_next" />
                </div>
            </div>
                    
            <div class="iconBox widget-value-ret" :class="v_color(valueRet)">
                <q-icon class="q-pt-xs widget-value-icon" size="30px" :name="v_icon(valueRet)"/>
                <span class="pl-1"><span>{{valueRet}}%</span></span>
            </div>

            <div v-if="extraCaption && (extraCaption.length>0)">
                <span class="text-grey-1" :class="extraClass">{{extraCaption}}</span>
            </div>

            <div v-if="updatedAt && (updatedAt.length>0)" class="gNoMargin">
                <span class="gCaption text-grey-1">{{updatedAt}}</span>
            </div>
        </div>
    </div>

</template>

<script>
//import {HChart} from 'highcharts-vue';
//import stockInit from 'highcharts/modules/stock';
import logger from "src/error/Logger";
import CommonFunc from 'src/util/CommonFunc';

export default {
    name:'CBigLabel',
    components: {},
    props: {
        data: {
            default:null,
        },
        tag: {
            default: null
        },
        title: {
            type:String,
            default: ''
        },
        value: {
            default:0,
        },
        valueRet: {
            default:0,
        },
        updatedAt:{
            default:''
        },
        extraCaption: {
            default:''
        },
        extraClass: {
            default:''
        },
        moreButton: {
            default:""
        }
    },
    computed: {
        v_format() {
            return (value) => {
                if(!value) {
                    return '';
                }
                if (value<100) {
                    return CommonFunc.formatNumber(value,3);    
                }
                return CommonFunc.formatNumber(value,0,true);
            };
        },
        v_color() {
            return (value) => {
                if (value<0) {
                    return 'bg-positive';
                }
                return 'bg-negative';
            }
        },
        v_icon() {
            return (value) => {
                if (value>0) {
                    return 'arrow_drop_up';
                }
                return 'arrow_drop_down';
            }
        },
    },
    data: function () {
        return {
            //title:'',
            //tag:n,
            //value:0,
            //value_pct_change:0,
            
            bg_color:'bg-positive',
            text_color:'text-white',
            badge_color:'yellow-9',
            icon:'arrow_drop_down',

            v_loaded: true
        }
    },

    methods: {
        update: function(json_label) {
            //widget[a_exchange]['endVal'] = parseFloat(CommonFunc.formatNumber(a_ret*100,2));

            this.title = json_label.title;
            this.field = json_label.field;
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
            this.v_loaded = true;
        },

        onClick: function() {            
            this.$emit("onClick",this.data);
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

    font-size:22px;
    font-weight: bold;
    color:#111111;
}

.widget-box-border {
    -webkit-box-shadow: 0 0 0 transparent;
    box-shadow: 0 0 0 transparent;
    border-width: 1.0px;
}

.widgetValue {
    font-weight: bold;
    font-size: 1.4rem;
    display: block;
    line-height: 0.9em;
    margin: 0.05rem auto;
}

.widget-value-ret {
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

.iconBox {
    margin-top:-8px;
    margin-left:-9px;
}
</style>