<template>
    <div>
        <div class="row backBtn">
            <div>
                <q-btn label="back" @click="onClickBack" />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="groupNameBox">
                    <span class="groupName"> {{v_portfolio.name}}  </span> &nbsp;|&nbsp;
                    <span class="name1"> {{v_portfolio.description}}  </span>
                </div>

                <q-separator size="2px" />

                <div class="row box1">                    
                    <div class="col">
                        <div class="bigValue">{{ v_format(v_portfolio.roi) }}% </div>
                        <div class="name1">ROI</div>                         
                    </div>  

                    <q-separator vertical />
                    
                    <div class="col">   
                        <div class="bigValue">{{ v_format(v_portfolio.evaluated_value) }}</div>
                        <div class="name1">Evaluated Value</div>                         
                    </div>
                </div>

                <div>
                    <div> like : {{ v_portfolio.like_count }} </div>
                    <div> dislike : {{ v_portfolio.dislike_count }} </div>        
                </div>

            </div>
        </div>
        <q-separator size="2px" />

        <div class="row">
            <div class="col">
                <div>
                    <h4 class="chartTitleBox"> ROI Chart </h4>
                </div>
                <q-separator size="2px" />
                <PortfolioChart ref="portfolioChart" />
                <div>
                    <q-btn label="like" @click="onClickVote(1)" />
                    <q-btn label="dislike" @click="onClickVote(-1)" />

                </div>
            </div>
        </div>

        <div class="row cardBox">
            <div class="col">
                <q-card class="coinBox" flat bordered v-for="(a_portfolio,index) in v_portfolio.items" :key="index">
                    <q-card-section>
                        <div class="row box2">
                            <div class="box2-1">  
                                <q-icon class="coinIcon" name="account_tree" color="black" size="34px" />                                    
                            </div>    
                            <div class="box2-2">
                                <span class="symbolName"> ({{a_portfolio.api_asset.symbol}})<br> {{a_portfolio.api_asset.name}} </span>                        
                            </div>                            
                            <div class="col box2-3">                            
                                <span class="name2">ROI</span><br><span class="roiValue">{{v_format(a_portfolio.roi)}} %</span><br>                                                       
                                <span class="text-grey-8">{{ v_format(a_portfolio.last*a_portfolio.qty)}} </span>                            
                            </div>    
                        </div>  
                        <q-separator size="1px" />
                    </q-card-section>
                    <q-card-section>                        
                        <div class="row box3">
                            <div class="col">  
                                <span class="value">{{ v_format(a_portfolio.last) }}</span><br>
                                <span class="name2">last Price</span>
                            </div>
                            <q-separator vertical inset />
                            <div class="col">
                                <span class="value">{{ v_format(a_portfolio.price) }}</span><br>
                                <span class="name2 cursor-pointer">Current Price</span>
                            </div>
                            <q-separator vertical inset />
                            <div class="col">
                                <span class="value">{{v_updated_at(a_portfolio.updated_at)}}</span><br>
                                <span class="name2">Inception Date</span>
                            </div>
                        </div>
                    </q-card-section>

                     <q-separator size="1px" />

                    <q-card-section>
                        <div class="desc"> 
                            {{a_portfolio.description}} 
                        </div>
                        
                    </q-card-section>
                    
                    <q-separator size="1px" />
                </q-card>

                    <q-card-actions>
                        <div class="text-grey-8 q-gutter-xs">
                            <q-btn size="15px" flat dense round icon="delete" @click="onClickDelete(a_portfolio)"/>&nbsp;
                            <q-btn size="15px" flat dense round icon="done" />&nbsp;
                            <q-btn size="15px" flat dense round icon="more_vert" />
                        </div>                            
                    </q-card-actions>                        
                


<!--
                <q-list>
                    <q-item clickable v-for="(a_portfolio,index) in v_portfolio.items" :key="index">

                        <q-item-section avatar top>
                            <q-icon name="account_tree" color="black" size="34px" />
                        </q-item-section>

                        <q-item-section size="30px">
                            <q-item-label>{{a_portfolio.api_asset.name}}</q-item-label>
                        </q-item-section>

                        <q-item-section top>
                            <q-item-label lines="1">
                                <span class="text-weight-medium">{{v_format(a_portfolio.roi)}}</span>
                            </q-item-label>
                            <q-item-label caption>
                                <span class="text-grey-8"> {{ v_format(a_portfolio.last*a_portfolio.qty)}} </span>
                            </q-item-label>
                        </q-item-section>
                        
                        <q-item-section top>
                            <q-item-label lines="1">
                                {{ v_format(a_portfolio.last) }}
                            </q-item-label>
                            <q-item-label caption lines="1">
                                <span class="cursor-pointer">{{ v_format(a_portfolio.price) }}</span>
                            </q-item-label>
                        </q-item-section>                        
                        
                        <q-item-section top side>
                            <span>{{v_updated_at(a_portfolio.updated_at)}}</span>
                            <div class="text-grey-8 q-gutter-xs">
                                <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="onClickDelete(a_portfolio)"/>
                                <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
                                <q-btn size="12px" flat dense round icon="more_vert" />
                            </div>                            
                        </q-item-section>
                    </q-item>
                        
                </q-list>
-->

            </div>
        </div>

        <AddPortfolioDialog ref="addPortfolio" />

        <q-dialog v-model="v_confirm" persistent ref="confirmDialog">
            <q-card>
                <q-card-section class="row items-center">
                    <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
                    <span class="q-ml-sm">Do you want to delete the item?</span>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="primary" v-close-popup />
                    <q-btn flat label="Delete" color="primary" @click="onClickDeleteConfirm" />
                </q-card-actions>
            </q-card>
        </q-dialog>


        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" @click="onClickAdd" />
        </q-page-sticky>

    </div>
</template>


<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";
import {PortfolioModel, ThreadListModel} from "src/models/PortfolioModel";

import AddPortfolioDialog from 'components/dialogs/AddPortfolioDialog';
import PortfolioChart from 'src/pages/user/component/PortfolioChart';



export default {
    name: 'PortfolioDetail',
    props: [],
    components: {
        AddPortfolioDialog,
        PortfolioChart
    },    
    mixins: [],
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_format() {
            return (value) => {
                return value.toLocaleString();
            };
        },
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        },
        v_isowner() {
            if (this.v_me.id==this.v_user.id) {
                return true;
            }
            return false;
        }
    },
    data() {
        return {
            v_confirm: false,

            v_user: null,
            v_portfolio: null,
            v_selected: null,
        }
    },
    created() {
        logger.log.debug("PortfolioDetailView.created");
    },
    beforeMount() {
        logger.log.debug("PortfolioDetailView.beforeMounted - params=",this.$route.params);
        this.v_user = this.$route.params.user;
        this.v_portfolio = this.$route.params.portfolio;        
    },
    mounted() {
        logger.log.debug("PortfolioDetailView.mounted");

        //this.$parent.$parent.$refs.header.setBackArrow(true,this);
        //this.profile = store.getters.moa.user.profile;
        //this.avatarUrl = store.getters.moa.user.firebase.photoURL;
        //this.getProfile();

        this.$refs.portfolioChart.update(this.v_portfolio);
    },
    beforeDestroy() {
        logger.log.debug("PortfolioDetailView.beforeDestroy");
        //this.$parent.$parent.$refs.header.setBackArrow(false,this);
    },

    methods: {

        handleDelete: function() {

        },

        onClickAdd: function() {
            logger.log.debug("PortfolioDetail.onClickAdd");
            this.$refs.addPortfolio.show(this.v_user,null);
        },
        
        onClickDelete: function(portfolio_item) {
            logger.log.debug("PortfolioDetail.onClickDelete : item=",portfolio_item);
            this.v_selected = portfolio_item;
            this.v_confirm = true;
        },

        onClickDeleteConfirm: function() {            
            this.v_confirm = false;       

            let a_portfolio_item = this.v_portfolio.getItem(this.v_selected.id);
            //logger.log.debug("PortfolioDetail.onClickDeleteConfirm",a_portfolio_item.name);
            //logger.log.debug("PortfolioDetail.onClickDeleteConfirm",this.v_selected.constructor.name);
            
            const _this = this;
            this.v_user.portfolio.deletePortfolioItem(this.v_portfolio.id,this.v_selected.id).then( response => {                
                //let a_portfolio = _this.v_user.portfolio.getItem(_this.v_portfolio.id);
                logger.log.debug("onClickDeleteConfirm.items=",_this.v_portfolio.items);            
                _this.v_selected = null;

                CommonFunc.showOkMessage(_this,'Portfolio deleted');
            });

            //this.v_selected = null;
        },

        onClickBack: function() {
            logger.log.debug("PortfolioDetail.onClickBack");
            CommonFunc.navBack(this);
        },

        onClickVote: function(value) {
            const _this=this;

            logger.log.debug("PortfolioDetail.onClickVote = ",value);
            
            let dic_param = {id:this.v_portfolio.id, value:value};
            this.v_portfolio.vote(dic_param).then(response => {
                logger.log.debug('onClickReviewRating - ',response);
                CommonFunc.showOkMessage(_this,'ok');
            }).catch( err => {

            });

        },


    }
};
</script>


<style scoped>
.backBtn {
    padding:20px 0px 15px 10px; 

}

.groupNameBox {
    padding:10px 0px 5px 10px;
}

.groupName {
    font-size:15px;

}


.name1 {
    font-size:15px;
    color:#8C8C8C;
    text-align:center;

}

.name2 {
    font-size:15px;
    color:#8C8C8C;
    text-align:center;

}

.bigValue {
   font-size:35px ;
   color: darkgreen;
}

.value {
    font-size:14px;
    color:#202124;
    text-align:center;
}
.box1 {
    padding:20px 0px 20px 10px;
    text-align:center;
}

.box2 {
    padding:0px 0px 5px 0px;
}

.box3 {
    padding:0px 0px 15px 0px;
}

.cardBox {
    padding:10px 10px 10px 10px;
}

.box2-1 {
width:50px;
height:88px;
}

.box2-3 {
    padding:0px 10px;
    text-align:center;
}

.box3 div {
    padding-top:0px;
    text-align:center;
    font-size:16px;
    color:#8C8C8C;
}



.chartTitleBox {
    color:#555555;
    margin:15px 20px 15px 20px;

}

.coinIcon {
    height:50px;
}

.symbolName {
    font-size:14px;
    color:#555555;
    font-weight:bold;
}

.roiValue {
    font-size:25px;
    color:darkgreen;
}

.desc {
    font-size:15px;
    color:#222222;
}
</style>
