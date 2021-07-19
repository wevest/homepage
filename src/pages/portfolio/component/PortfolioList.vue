<template>

    <div>
        
        <div v-show="data.items && data.items.length>0">
            <q-card class="q-my-sm" bordered v-for="(a_portfolio,index) in data.items" :key="index" >
                <q-card-section horizontal class="groupTitleBox"> 
                    <div @click="onClickPortfolio(a_portfolio)">
                        <div>
                            <span class="text-weight-bolder gListTitle">{{v_shorten(a_portfolio.name,15)}}</span>
                        </div>
                        <div> 
                            <span class="gCaption">{{ v_updated_at(a_portfolio.updated_at) }} </span>                        
                        </div>
                    </div> 
                    <q-space />
                    <div>
                        <div class="roiBox">
                            <div class="gROILG"> 
                                <span :style="v_color_style(a_portfolio.roi)" class="text-weight-bolder"> 
                                    {{ v_format(a_portfolio.roi) }} % 
                                </span>
                                
                            </div>
                            <div class="gCaption"> $ {{v_format(a_portfolio.estimated_value,3) }} </div>
                        </div>
                    </div>
                    <div>
                        <q-btn size="15px" flat color="grey-7" dense icon="navigate_next" @click="onClickPortfolio(a_portfolio)" />
                    </div>                       
                </q-card-section>
                
                <q-separator />
                
                <q-card-section>
                    <div>

                        <q-linear-progress size="20px" 
                            :value="v_progress(a_portfolio.roi)"
                            :style="v_color_style(a_portfolio.roi)"
                        />
                    </div>
                </q-card-section>

            </q-card>
        </div>

        <div v-if="(! data.items) || (data.items==0)" class="text-center">
			<div class="gListTitle"> 
				No Portfolio
			</div>
			<div class="gCaption">
				포트폴리오가 생성되면 여기에 표시됩니다.
			</div>
        </div>

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
    props: {
        data: {
            default: new PortfolioListModel()
        }
    },

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
            return (value,len) => {
                return CommonFunc.shortenString(value,len);
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
        v_color_style() {
            return (value) => {
                if (value>0) {
                    return "color:#c10015;"
                }
                return "color:#005dde;";
            };
        },
        v_format() {
            return (value,decimal=1) => {                
                if(!value) {
                    return '';
                }
                return CommonFunc.formatNumber(value,decimal);
                //return value.toLocaleString();
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


.groupTitleBox {
    padding:10px 0px 10px 10px;
}


.roiBox {
     text-align:center;
}    



.valueDate {
    font-size:13px;
    color:#999999;
    text-align:center;
}



</style>
