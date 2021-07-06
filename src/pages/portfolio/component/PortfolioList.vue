<template>

    <div>
        
        <q-card class="portfolioListBox" bordered v-for="(a_portfolio,index) in v_portfolio.items" :key="index" >
            <q-card-section horizontal class="groupTitleBox"> 
                <div>
                    <div>
                        <span>{{a_portfolio.name}}</span>
                    </div>
                    <div> 
                        <span class="value">{{ v_updated_at(a_portfolio.updated_at) }} </span>                        
                    </div>
                </div> 
                <q-space />
                <div>
                    <div class="roiBox">
                        <div class="roiValue"> 
                            <span :style="v_color_style(a_portfolio.roi)" class="text-weight-bolder"> 
                                {{ Number(a_portfolio.roi).toLocaleString() }} % 
                            </span>
                            
                        </div>
                        <!--
                        <div class="valueTitle">ROI</div>
                        -->
                        <div class="value"> $ {{a_portfolio.evaluated_value.toLocaleString() }} </div>
                    </div>
                </div>
                <div>
                    <q-btn size="14px" flat dense icon="navigate_next" @click="onClickPortfolio(a_portfolio)" />
                </div>                       
            </q-card-section>
            
            <q-separator />
            
            <q-card-section>
                <div>

                    <q-linear-progress class="q-mt-md" size="20px" 
                        :value="v_progress(a_portfolio.roi)"
                        :color="v_color(a_portfolio.roi)"
                    />
                </div>
            </q-card-section>

        </q-card>

    </div>

</template>

<script>
import {store} from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import { PortfolioListModel, PortfolioModel, PortfolioItemModel} from "src/models/PortfolioModel";

export default {
    components: {},
    props: {},

    data: () => ({
        g_data: null,

        v_user: null,
        v_portfolio: new PortfolioListModel(),

    }),
    computed: {
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        },
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,MoaConfig.setting.maxPortfolioDescriptionLength);
            };
        },
        v_progress() {
            return (value) => {
                let a_roi = Math.abs(value/100);
                if (a_roi>1.0) {
                    return 1.0;
                }
                
                return a_roi;
            };
        },
        v_color() {
            return (value) => {
                if (value>0) {
                    return "negative"
                }
                return "#005dde";
            };
        },
        v_color_style() {
            return (value) => {
                if (value>0) {
                    return "color:#c10015;"
                }
                return "color:#005dde;";
            };
        },

    },

    mounted: function() {},

    methods: {        

        update: function(v_portfolio) {
            this.v_portfolio = v_portfolio;
        },

        onClickPortfolio: function(a_portfolio) {
            logger.log.debug("onClickPortfolio: portfolio=",a_portfolio);
            this.$emit("onClickPortfolio",a_portfolio);
        }
    },

}

</script>



<style scope> 

.portfolioListBox {
    margin:10px 0px;
}

.groupTitleBox {
    padding:10px 0px 10px 10px;
}

.groupName {
    font-size:14px;
    color:#202124;

}

.valueTitle {
   font-size:14px;
   color:#cccccc;
}

.roiBox {
    padding:0px 0px 0px 0px;
    text-align:center;
}    

.roiValue {
    font-size:15px;
    color:#5a9591;
}

.value {
    font-size:14px;
    color:#202124;
    text-align:center;
}
.valueTitle {
    font-size:12px;
    text-align:center;
}


</style>
