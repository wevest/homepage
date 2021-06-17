<template>

    <div class="row">
        <div class="col">
            <div> 

                <q-card class="portfolioListBox" bordered v-for="(a_portfolio,index) in v_portfolio.items" :key="index" >
                    <q-card-section class="row groupTitleBox"> 
                        <div class="row" >                       
                            <div class="groupName">{{a_portfolio.name}}</div> &nbsp;| &nbsp;
                            <span class="groupDesc">{{a_portfolio.description}}</span>
                            <q-space />
                            <div><q-btn side size="12px" flat dense round icon="navigate_next" @click="onClickPortfolio(a_portfolio)" />
                        </div>
                        </div>
                        
                    </q-card-section>
                    <q-separator />
                    <q-card-section>
                        <div class="row">                            
                            <div class="col-4 roiBox">
                                <div class="groupDesc">ROI</div>
                                <span class="aaaa"> {{ Number(a_portfolio.roi).toLocaleString() }} %</span>
                            </div>
                            <div class="col-4 marketBox">
                                <div class="groupDesc">Market</div>
                                <span>$ {{a_portfolio.evaluated_value.toLocaleString() }} </span>                            
                            </div>                           
                            <div class="col-4 timeBox">
                                 <div class="groupDesc">Time</div>
                                <span>{{ v_updated_at(a_portfolio.updated_at) }} </span>
                            <!-- </div> -->
                            <!-- <div class="col-4 editBox" > -->
                                <!-- <div class="text-grey-8"> -->
                                    <!-- <q-btn size="12px" flat dense round icon="add" @click="onClickAdd(a_portfolio)" /> -->
                                    <!-- <q-btn size="12px" flat dense round icon="remove" @click="onClickDelete(a_portfolio)" /> -->
                                    <!-- <q-btn size="12px" flat dense round icon="edit" @click="onClickEdit(a_portfolio)" /> -->
                                <!-- </div> -->
                            </div>                                     
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

import { PortfolioListModel, PortfolioModel, PortfolioItemModel} from "src/store/PortfolioModel";

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
    padding:10px 0px 3px 10px;
}

.groupName {
    font-size:14px;
    color:#222222;

}

.groupDesc {
   font-size:14px;
   color:#cccccc;
}

.aaaa {
    color:#5a9591;
    font-weight:700;
}


.roiBox {
    padding:0px 0px 0px 0px;
    text-align:center;
    ;
}

.marketBox {
    padding:0px 0px 0px 0px;
    text-align:center;
}

.timeBox {
    padding:0px 0px 0px 0px;
    text-align:center;
}


</style>
