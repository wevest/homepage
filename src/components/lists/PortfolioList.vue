<template>

    <div> 

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMorePortfolio"></CTitle>

        <q-card class="q-my-sm" bordered v-for="(a_portfolio,index) in v_portfolio.items" :key="index" >
            <q-card-section>  
                <div class="row boxContainer">
                    <div style="padding:7px 10px 0px 0px;">
                        <WAvatar :avatar="a_portfolio.api_user.avatar_thumb" :username="a_portfolio.api_user.username" />
                    </div>
                    <div class="boxInfo">
                        <div class="text-h6 text-weight-bold nameRoi">
                            <span>{{a_portfolio.api_user.username}}</span>
                        </div>
                        <div class="gCaption">
                            <span>{{a_portfolio.name}}</span>
                        </div>
                    </div>
                <q-space />
                <div class="text-h5 text-weight-bolder nameRoi">
                    <span :class="v_color(a_portfolio.roi)">{{v_format(a_portfolio.roi)}} %</span>
                </div>
                <div class="nameRoi">
                    <q-btn size="14px" flat dense icon="navigate_next" @click="onClickPortfolio(a_portfolio)" />
                </div>
                </div>                     
            </q-card-section>
            <q-card-section class="no-padding desc"> 
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
            
            CommonFunc.navPortfolio(this,this.v_user,a_portfolio);
        },

        onClickMorePortfolio: function() {
            logger.log.debug("PortfolioList.onClickMorePortfolio:");
        }
    },

}

</script>



<style scope> 

.boxContainer {
    display:flex;
    flex-direction: row;
}


.boxInfo {
    flex-grow:1;
}

.desc {
    padding:0px 16px 16px 16px !important;
}

.nameRoi {
    padding-top:15px;
}
</style>
