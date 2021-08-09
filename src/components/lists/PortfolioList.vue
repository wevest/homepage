<template>
    <div> 

		<CTitle ttype='subtitle' :title="title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMorePortfolio"></CTitle>

        <q-skeleton v-if="!v_list_loaded" height="150px" square animation="pulse-x" />                    

        <div v-show="v_list_loaded">
            <q-card class="q-my-sm" flat bordered 
                v-for="(a_portfolio,index) in v_portfolio.items" :key="index" 
                v-if="index<v_maxLength" >
                <q-card-section class="no-padding">  
                    <div class="row boxContainer">
                        <div class="portfolioAvatar q-pa-sm">
                            <WAvatar :avatar="a_portfolio.api_user.avatar_thumb" :username="a_portfolio.api_user.username" />
                        </div>
                        <div class="boxInfo q-pt-md" @click="onClickPortfolio(a_portfolio)">
                            <div class="gListTitle">
                                <span>{{v_shorten_name(a_portfolio.api_user,13)}}</span>
                            </div>                        
                            <div class="gCaption">
                                <WSubinfo dateFormat="0"
                                    username=""
                                    :pub_date="v_format_date(a_portfolio.created_at)"
                                    like_count="-1" 
                                    dislike_count="-1" />
                            </div>
                        </div>
                        <q-space />
                        <div class="gROILG q-pt-lg">
                            <span :class="v_color(a_portfolio.roi)">{{v_format(a_portfolio.roi*100)}} %</span>
                        </div>
                        <div class="q-pt-lg">
                        <q-btn class="q-mb-md" size="14px"  flat dense icon="navigate_next" @click="onClickPortfolio(a_portfolio)" />
                        </div>
                    </div>                     
                </q-card-section>
                <q-card-section class="gParagraphSM" v-if="showDescription=='1'"> 
                    <div>
                        <span class="text-body2 text-grey-8">{{v_shorten(a_portfolio.description)}}</span>
                    </div>
                </q-card-section>          

            </q-card>

            <LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />
        </div>

    </div>

</template>

<script>
import { Config } from 'src/data/Config';
import {store} from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import WAvatar from "src/components/WAvatar";
import CTitle from 'components/CTitle';
import WSubinfo from 'components/WSubinfo';
import LoadMore from "src/components/LoadMore";

import UserModel from "src/models/UserModel";
import { PortfolioListModel, PortfolioModel, PortfolioItemModel} from "src/models/PortfolioModel";


export default {
    components: {
        CTitle,
        WAvatar,
        LoadMore,
        WSubinfo
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
		},
        showDescription: {
            type:String,
            default:"1"
        }
    },

    computed: {
        v_format() {
            return (value) => {
                if(!value) {
                    return '';
                }
                //return value.toLocaleString();
                return CommonFunc.milifyNumber(value);
            };
        },
        v_format_date() {
            return (value) => {
                return value.substring(0,10);
            };
        },
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,Config.setting.maxPortfolioDescriptionLength);
            };
        },
        v_shorten_name() {
            return (user,len) => {
                let a_name = user.display_name;
                if (CommonFunc.isEmptyObject(a_name)) {
                    a_name = user.username;
                }
                return CommonFunc.shortenString(a_name,len);
            };
        },
        v_color() {
            return (value) => {                
                const a_color = CommonFunc.getPerfColor(value);
                logger.log.debug("PortfolioList.color=",a_color);
                return a_color;
            };            
        },
    },

    data () {
        return {
            v_list_loaded: false,

            g_data: null,

            //v_title: this.title,
            v_maxLength: this.maxLength,
            v_more_caption: this.moreCaption,								

            v_type:null,

            v_user: new UserModel(),
            v_portfolio: new PortfolioListModel(),
        }
    },

    methods: {        
        clear() {
            this.v_portfolio.clear();
        },

        update(type=null) {
            const _this=this;

            logger.log.debug("PortfolioList.update");
            
            //this.clear();
            
            let dicParam = {type:type, limit:this.$refs.loadMore.v_next.limit, offset:this.$refs.loadMore.v_next.offset};            
            this.v_portfolio.load(dicParam).then(response=>{
                _this.v_list_loaded = true;                
                logger.log.debug("PortfolioList.update:response=",response);
                _this.$refs.loadMore.setPageParameter(response.data);
            }).catch(err=>{
                _this.v_list_loaded = true;                
                logger.log.error("PortfolioList.update:err=",err);
            });
        },

        updateByType(type) {
            logger.log.debug("PortfolioList.updateByType");
            
            this.v_type = type;
            this.$refs.loadMore.clear();
            this.update(this.v_type);
        },

        onClickPortfolio(a_portfolio) {
            logger.log.debug("onClickPortfolio: portfolio=",a_portfolio);
            //this.$emit("onClickPortfolio",a_portfolio);

            this.v_user.id = a_portfolio.api_user.id;
            this.v_user.username = a_portfolio.api_user.username;
            
            NavFunc.navPortfolio(this,this.v_user.username,a_portfolio.id);
        },

		onClickLoadMore() {
			logger.log.debug("PortfolioList.onClickLoadMore : next_url = ", this.v_next_url);
			
			this.v_maxLength = 999999;
			this.update(this.v_type);
		},

        onClickMorePortfolio() {
            logger.log.debug("PortfolioList.onClickMorePortfolio:");
            NavFunc.navPortfolioIndexView(this);
        }
    },

}

</script>



<style scope> 
.portfolioAvatar {
    padding-top:8px;
}
.boxContainer {
    display:flex;
    flex-direction: row;
}


.boxInfo {
    flex-grow:1;
}

</style>
