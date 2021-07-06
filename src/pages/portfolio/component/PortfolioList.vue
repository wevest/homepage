<template>

    <div class="row">
        <div class="col">
            <div> 

                <q-card class="portfolioListBox" bordered v-for="(a_portfolio,index) in v_portfolio.items" :key="index" >
                    <q-card-section horizontal class="groupTitleBox"> 
                        <div>
                            <span>{{a_portfolio.name}}</span>
                            <!--
                            &nbsp;| &nbsp; 
                            <span class="groupDesc">{{v_shorten(a_portfolio.description)}}</span>
                            -->
                        </div> 
                        <q-space />
                        <div>
                            <q-btn size="14px" flat dense icon="navigate_next" @click="onClickPortfolio(a_portfolio)" />
                        </div>                       
                    </q-card-section>
                    
                    <q-separator />
                    
                    <q-card-section>
                        <div class="row">                            
                            <div class="col-4 roiBox">
                                <div class="roiValue"> {{ Number(a_portfolio.roi).toLocaleString() }} % </div>
                                <div class="valueTitle">ROI</div>
                            </div>
                            <div class="col-4">
                                <div class="value"> $ {{a_portfolio.evaluated_value.toLocaleString() }} </div>
                                <div class="valueTitle">Current Price</div>                            
                            </div>                           
                            <div class="col-4">
                                <div class="value"> {{ v_updated_at(a_portfolio.updated_at) }} </div>
                                <div class="valueTitle">Inception Date</div>
                            </div>
                            <!-- </div> -->
                            <!-- <div class="col-4 editBox" > -->
                                <!-- <div class="text-grey-8"> -->
                                    <!-- <q-btn size="12px" flat dense round icon="add" @click="onClickAdd(a_portfolio)" /> -->
                                    <!-- <q-btn size="12px" flat dense round icon="remove" @click="onClickDelete(a_portfolio)" /> -->
                                    <!-- <q-btn size="12px" flat dense round icon="edit" @click="onClickEdit(a_portfolio)" /> -->
                                <!-- </div> -->                                                              
                        </div>
                    </q-card-section>

                </q-card>

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
        }
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
    font-weight:700;
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
