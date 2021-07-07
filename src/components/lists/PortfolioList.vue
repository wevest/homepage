<template>

    <div> 

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMorePortfolio"></CTitle>

        <q-card class="portfolioListBox" bordered 
            v-for="(a_portfolio,index) in v_portfolio.items" :key="index" >
            <q-card-section class="no-margin no-padding"> 
                <div class="row boxContainer q-my-md">
                    <div class="boxAvatar q-mr-xs">
                        <WAvatar :avatar="a_portfolio.api_user.avatar_thumb" :username="a_portfolio.api_user.username" />
                    </div>
                    <div class="boxInfo">
                        <div class="row">
                            <div>
                                <span>{{a_portfolio.name}}</span>
                            </div>
                            <q-space />
                            <div>
                                123.4243%
                            </div>
                        </div>
                        <div>
                            <span class="groupDesc">{{v_shorten(a_portfolio.description)}}</span>
                        </div>
                    </div>
                    
                    <div class="boxMore">
                        <q-btn size="14px" flat dense icon="navigate_next" @click="onClickPortfolio(a_portfolio)" />
                    </div>                       

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

.portfolioListBox {
     margin:10px 0px; 
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

.boxContainer {
    display:flex;
    flex-direction: row;
}

.boxAvatar {

}

.boxInfo {
    flex-grow:1;
}

.boxMore {

}

</style>
