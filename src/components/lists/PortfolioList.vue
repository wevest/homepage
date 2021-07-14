<template>
    <div> 

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMorePortfolio"></CTitle>

        <q-card class="q-my-sm" bordered v-for="(a_portfolio,index) in v_portfolio.items" :key="index" >
            <q-card-section class="no-padding">  
                <div class="row boxContainer">
                    <div class="portfolioAvatar q-px-md">
                        <WAvatar :avatar="a_portfolio.api_user.avatar_thumb" :username="a_portfolio.api_user.username" />
                    </div>
                    <div class="boxInfo q-pt-lg" @click="onClickPortfolio(a_portfolio)">
                        <div class="gListTitle">
                            <span>{{v_shorten_name(a_portfolio.api_user.username,13)}}</span>
                        </div>                        
                        <div class="gCaption">
                            <span>{{a_portfolio.name}}</span>
                        </div>
                    </div>
                    <q-space />
                    <div class="gROILG q-pt-lg">
                        <span :class="v_color(a_portfolio.roi)">{{v_format(a_portfolio.roi)}} %</span>
                    </div>
                    <div class="q-pt-lg">
                      <q-btn class="q-mb-md" size="14px"  flat dense icon="navigate_next" @click="onClickPortfolio(a_portfolio)" />
                    </div>
                </div>                     
            </q-card-section>
            <q-card-section class="gParagraphSM"> 
                <div>
                     <span class="text-body2 text-grey-8">{{v_shorten(a_portfolio.description)}}</span>
                </div>
            </q-card-section>                   
        </q-card>

    </div>

</template>

<script>
import { MoaConfig } from 'src/data/MoaConfig';
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import WAvatar from "src/components/WAvatar";
import CTitle from 'components/CTitle';

import UserModel from "src/models/UserModel";
import { PortfolioListModel, PortfolioModel, PortfolioItemModel} from "src/models/PortfolioModel";


export default {
    components: {
        CTitle,
        WAvatar
    },
    props: {
        maxLength: {
            default: 20,
        },
		title: {
			type:String,
			default: "Portfolio List"
		},
		moreCaption: {
			type:String,
			default: ""
		}
    },

    computed: {
        v_format() {
            return (value) => {
                if(!value) {
                    return '';
                }
                return value.toLocaleString();
            };
        },
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
        v_shorten_name() {
            return (value,len) => {
                return CommonFunc.shortenString(value,len);
            };
        },
        v_color() {
            return (value) => {                
                return CommonFunc.getPerfColor(value);
            };            
        },
    },

    data () {
        return {
            g_data: null,

            v_title: this.title,
            v_maxLength: this.maxLength,
            v_more_caption: this.moreCaption,								

            v_user: new UserModel(),
            v_portfolio: new PortfolioListModel(),

        }
    },

    methods: {        

        update: function() {
            logger.log.debug("PortfolioList.update");
            this.v_portfolio.load(null,null).then(response=>{
                logger.log.debug("update:response",response);
            }).catch(err=>{
                logger.log.error("update:response",err);
            });
        },

        onClickPortfolio: function(a_portfolio) {
            logger.log.debug("onClickPortfolio: portfolio=",a_portfolio);
            //this.$emit("onClickPortfolio",a_portfolio);


            this.v_user.id = a_portfolio.api_user.id;
            this.v_user.username = a_portfolio.api_user.username;
            
            CommonFunc.navPortfolio(this,this.v_user.username,a_portfolio.id);
        },

        onClickMorePortfolio: function() {
            logger.log.debug("PortfolioList.onClickMorePortfolio:");
        }
    },

}

</script>



<style scope> 
.portfolioAvatar {
    padding-top:18px;
}
.boxContainer {
    display:flex;
    flex-direction: row;
}


.boxInfo {
    flex-grow:1;
}


</style>
