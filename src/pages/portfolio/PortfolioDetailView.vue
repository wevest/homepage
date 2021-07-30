<template>
    <div class="q-ma-md">                       
        <div>
            <div class="q-my-lg">
                <div class="row">
                    <div>
                        <span class="text-h4 text-weight-bolder"> {{v_portfolio.name}}  </span>             
                    </div>
                    
                    <q-space />
                    
                    <div>
                        
                        <WCommandBar 
                            :data="v_portfolio" :isOwner="v_is_owner" 
                            shareBtn="" updateBtn="" deleteBtn="delete" 
                            @onClickDelete="onClickDeletePortfolio" 
                        />

                    </div>
                </div>
                <div class="q-my-sm">
                    <WSubinfo 
                        :username="v_user.username" 
                        :pub_date="v_portfolio.created_at" 
                        :like_count="v_portfolio.like_count" 
                        :dislike_count="v_portfolio.dislike_count" 
                        :read_count="v_portfolio.read_count" />
                </div> 
            </div>                           

            <div class="q-my-md">
                <div class="row">
                    <div>
                        <span class="gCaption"> {{ $t('name.portfolio_description') }} </span>
                    </div>
                    <q-space />
                    <div>
                        <q-btn class="q-mb-xs gButtonSM" flat ripple
                            @click="onClickEdit" v-show="v_is_owner" :label="$t('button.edit')" />
                    </div>
                </div>
                <div >
                    <q-input filled counter type="textarea" class="text-body1" maxlength="500"
                        v-model="v_portfolio.description" :readonly="! v_mode.length>0" />
                </div>
            </div>

            <div class="row q-my-lg text-center">                    
                <div class="col">
                    <div class="text-h4 text-weight-bolder" :style="v_color(v_portfolio.roi)">{{ v_format(v_portfolio.roi) }}% </div>
                    <div class="gCaption">{{ $t('name.roi') }}</div>                         
                </div>  

                <q-separator vertical />
                
                <div class="col">   
                    <div class="text-h4 text-weight-bold">$ {{ v_format(v_portfolio.estimated_value) }}</div>
                    <div class="gCaption">{{ $t('name.estimated_value') }}</div>                         
                </div>
            </div>
        </div>

        
        <q-separator class="gSeparator" />

        <div>
            <div class="q-my-lg">
                <span class="gSubTitleLG"> {{ $t('page.portfolio_detail.roi_chart.title') }} </span>
            </div>
            
            <PortfolioChart ref="portfolioChart" />
            
            <div class="q-my-xl">
                <WRatingButton ref="ratingButton" 
                    :data="v_portfolio"
                    :likeCaption="$t('button.portfolio_like')" :dislikeCaption="$t('button.portfolio_dislike')" />
            </div>

            <div v-if="! v_is_owner" class="q-my-xl">
                <WUserProfileBox ref="userProfile" 
                    :data="v_portfolio"
                    :avatar="v_user.avatar_thumb"
                    :username="v_user.username"
                    :userid="v_user.id"
                    :biography="v_user.biography"
                    :isOwner="v_is_owner" 
                    shortenBiography="0" />            
            </div>

        </div>

        <q-separator class="gSeparator" />

        <div class="q-py-xs">
            <q-card class="q-my-md " flat bordered v-for="(a_portfolio,index) in v_portfolio.items" :key="index">
                <q-card-section>
                    <div class="row">
                        <div class="row iconBox">
                            <div class="q-pr-sm">  
                                <q-icon class="coinIcon" name="monetization_on" color="black" size="34px" v-if="! a_portfolio.api_asset.logo_thumb" />
                                <q-img :src="a_portfolio.api_asset.logo_thumb" 
                                    crossorigin="anonymous" width="32px" height="32px"
                                    v-if="a_portfolio.api_asset.logo_thumb" />
                            </div>    
                            <div @click="onClickMore(a_portfolio)" v-ripple>
                                <div class="symbolBox">
                                    <span class="text-h6 text-weight-bold"> {{a_portfolio.api_asset.symbol}}</span>
                                    <span class="text-caption text-grey-6"> &nbsp; ({{a_portfolio.api_asset.name}}) </span>
                                </div>
                                <div>
                                    <span class="text-caption text-grey-6 q-mt-sm">
                                        {{v_updated_at(a_portfolio.updated_at)}}</span>
                                </div>
                            </div>        
                        </div>    
                        <q-space />
                        <div>

                            <WCommandBar :data="a_portfolio" :isOwner="v_is_owner" 
                                shareBtn="" updateBtn="update" deleteBtn="delete" copyBtn="copy"
                                @onClickUpdate="onClickUpdate" 
                                @onClickCopy="onClickAddToMyPortfolio"
                                @onClickDelete="onClickDelete" 
                            />                            

                        </div>
                        <div>
                            <q-btn class="q-mt-lg NavigationBtn" flat label=">" @click="onClickMore(a_portfolio)" />
                        </div>
                    </div>  
                </q-card-section>

                <q-card-section class="cardSection2">                        
                    <div class="row">
                        <div class="col align-items">
                            <span class="gCaption">{{ $t('name.roi') }}</span>
                            <br>
                            <span class="text-h5 text-weight-bolder" :style="v_color(a_portfolio.roi)">{{v_format(a_portfolio.roi)}} %</span>
                        </div>    
                        <div class="col">  
                            <span class="gCaption">{{ $t('name.current_price') }}</span>
                            <br>
                            <span class="text-h5 text-weight-bold">$ {{ v_format_price(a_portfolio.last) }}</span>
                        </div>                            
                    </div>

                </q-card-section>

                <q-card-section class="cardSection2">

                    <div class="gParagraphSM q-pr-md"> 
                        <p>{{a_portfolio.description}}</p>
                    </div>
                    
                </q-card-section>

            </q-card>

        </div>

        <q-separator class="gSeparator" />

        <div class="q-mt-md">
            <CommentBox ref="commentBox"             
                :contentType="v_content_type" :post="v_portfolio" :items="v_portfolio.comments.items" />            
        </div>
<!--
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" @click="onClickAdd" />
        </q-page-sticky>
-->

    </div>
</template>


<script>
import {store} from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";
import UserModel from "src/models/UserModel";
import {PortfolioModel,PortfolioItemModel} from "src/models/PortfolioModel";

import CommentBox from "components/comments/CommentBox.vue";

import PortfolioChart from 'src/pages/portfolio/component/PortfolioChart';
import WSubinfo from 'components/WSubinfo';
import WCommandBar from "components/WCommandBar.vue";
import WRatingButton from 'components/WRatingButton';
import WUserProfileBox from 'components/WUserProfileBox';

export default {
    name: 'PortfolioDetail',
    props: [],
    components: {
        PortfolioChart,
        WSubinfo,
        WCommandBar,        
        WRatingButton,
        CommentBox,
        WUserProfileBox
    },    
    mixins: [],
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_format() {
            return (value,decimal=1) => {                
                //logger.log.debug("v_format : value=",value);
                if(!value) {
                    return '';
                }
                //return CommonFunc.formatNumber(value,decimal);
                return CommonFunc.milifyNumber(value,decimal);
                //return value.toLocaleString();
            };
        },
        v_format_price() {
            return (value) => {                
                //logger.log.debug("v_format : value=",value);
                if(!value) return '';

                //return CommonFunc.formatNumber(value,decimal);
                let decimal = 0;
                if (value<1) decimal=5;
                return CommonFunc.milifyNumber(value,decimal);
                //return value.toLocaleString();
            };
        },
        v_updated_at() {
            return (value) => {
                //return value;
                return CommonFunc.minifyDatetime(value,2);
            };
        },
        v_is_owner() {
            if (! this.v_user) {
                return false;
            }
            if (this.v_me.username==this.v_user.username) {
                return true;
            }
            return false;
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
        }

    },
    data() {
        return {
            v_content_type:"portfolio.portfolio",
            
            v_query: null,
            v_user: new UserModel(),
            v_portfolio: new PortfolioModel(),
            
            v_mode: "",
            v_edit_button: 'Edit',

            v_selected: null,
        }
    },
    created() {
        logger.log.debug("PortfolioDetailView.created");
        this.validateQuery();
    },
    beforeMount() {
        logger.log.debug("PortfolioDetailView.beforeMounted - query=",this.$route.query);    
    },
    mounted() {
        logger.log.debug("PortfolioDetailView.mounted");

        this.prepare();
        this.refresh();
        this.updateRead(this.v_query.portfolio_id);
        //this.$refs.portfolioChart.update(this.v_portfolio);
    },
    beforeDestroy() {
        logger.log.debug("PortfolioDetailView.beforeDestroy");
        //this.$parent.$parent.$refs.header.setBackArrow(false,this);
    },

    methods: {
        validateQuery() {            
            if (! CommonFunc.isEmptyObject(this.$route.query.username)) {
                if (! CommonFunc.isEmptyObject(this.$route.query.portfolio_id)) {
                    return;
                }                
            }                

            CommonFunc.navError404(this);
        },        

        prepare() {
            this.v_user.username = this.$route.query.username;
            this.v_portfolio.id = this.$route.query.portfolio_id;

            this.v_query = this.$route.query;
        },

        updateRead(portfolio_id) {
            if (! this.v_me.isLoggedIn()) {
                return;
            }

            this.v_me.portfolio.readPortfolio(portfolio_id).then(response=>{
                logger.log.debug("PortfolioDetailView.updateRead : response=",response);    
            });
        },

        selectPortfolio(portfolio_id) {
            const _this=this;
            this.v_portfolio = this.v_user.portfolio.getItem(parseInt(portfolio_id));

            logger.log.debug("PortfolioDetailView.setPortfolio : v_portfolio=",portfolio_id,this.v_portfolio);
        },
        calcPerformance() {
            const _this=this;
            store.state.prices.load().then( response => {
                _this.v_portfolio.calcPerformance(store.state.prices);
                _this.$refs.portfolioChart.update(_this.v_portfolio);
            })            
        },

        loadProfile(username) {
            const _this=this;
            UserModel.loadProfile(username).then( a_user => {
                _this.v_user = a_user;
                //_this.$refs.profileBox.update(_this.v_user);

                _this.v_user.loadPortfolio().then( response => {
                    //logger.log.debug("setUser=>",response);
                    _this.selectPortfolio(_this.v_query.portfolio_id);
                    _this.calcPerformance();
                    _this.loadComments(_this.v_query.portfolio_id);
                    _this.forceUpdate();
                });
            });
        },

        refresh() {
            this.loadProfile(this.$route.query.username);
            return;

            const _this=this;
            this.v_user.loadPortfolio().then( response => {
                logger.log.debug("PortfolioDetailView.refresh=>",response);
                _this.selectPortfolio(_this.v_query.portfolio_id);
                _this.loadComments(_this.v_query.portfolio_id);
                _this.forceUpdate();
            });
        },

        forceUpdate() {
            let items = [];
            for (let index=0;index<this.v_portfolio.items.length;index++) {
                items.push(this.v_portfolio.items[index]);
            }
            this.v_portfolio.items = items;
            logger.log.debug("PortfolioDetailView.forceUpdate");
            this.v_user.portfolio.calcPerformance(store.state.prices);
        },

        loadComments(limit=null,offset=null) {
            const _this = this;
            
            logger.log.debug("PortfolioDetailView.loadComments - v_portfolio=",this.v_portfolio);

            //let dic_param = {content_type:'portfolio-portfolio' , id:page_id, limit:limit, offset:offset};
            this.v_portfolio.loadComments('portfolio-portfolio',offset,limit).then(response=>{
                logger.log.debug("PortfolioDetailView.loadComments - comments=",_this.v_portfolio);
                _this.$refs.commentBox.update(_this.v_portfolio,_this.v_portfolio.comments.items);
            }).catch(err=>{

            });
        },

        handlePortfolioDelete: function() {
            const _this=this;
            logger.log.debug("handlePortfolioDelete");
            this.v_user.portfolio.deletePortfolio(this.v_portfolio.id).then( response => {                
                CommonFunc.showOkMessage(_this,'Portfolio deleted');
                store.getters.nav.back(_this);
            });
        },

        handlePortfolioItemDelete: function() {
            const _this=this;
            this.v_user.portfolio.deletePortfolioItem(this.v_selected.portfolio_id,this.v_selected.id,this.v_selected.api_asset.id).then( response => {                
                //let a_portfolio = _this.v_user.portfolio.getItem(_this.v_portfolio.id);
                logger.log.debug("handlePortfolioItemDelete.items=",_this.v_portfolio.items);

                _this.forceUpdate();
                _this.v_selected = null;

                CommonFunc.showOkMessage(_this,'Portfolio deleted');
            });
        },



        onClickEdit: function() {
            logger.log.debug("PortfolioDetailView.onClickEdit");
            
            if (this.v_mode.length==0) {
                this.v_mode = "edit";
                this.v_edit_button = "Save";
                return;
            }
            
            const _this=this;
            this.v_portfolio.update(this.v_portfolio.description).then(response=>{
                logger.log.debug("PortfolioDetailView.onClickEdit - response=",response);
                _this.v_edit_button = "Edit";
                _this.v_mode = "";
                CommonFunc.showOkMessage(_this,'Success');
            }).catch(err=>{
                logger.log.error("PortfolioDetailView.onClickEdit - err=",err);
            });  
        },

        onClickAdd: function() {
            logger.log.debug("PortfolioDetail.onClickAdd");
            
            store.getters.components.getComponent('portfolioDialog').show(this.v_user,null); 
            //this.$refs.addPortfolio.show(this.v_user,null);
        },

        onClickUpdate(portfolio) {
            logger.log.debug("PortfolioDetail.onClickEdit : portfolio=",portfolio);

            store.getters.components.getComponent('portfolioDialog').show(this.v_user,portfolio); 
            //this.$refs.addPortfolio.show(this.v_user,portfolio);
        },

        onClickDelete(portfolio_item) {
            logger.log.debug("PortfolioDetail.onClickDelete : v_selected=",portfolio_item);
            
            this.v_selected = portfolio_item;
            this.handlePortfolioItemDelete();
        },

        onClickDeletePortfolio() {
            logger.log.debug("PortfolioDetail.onClickDeletePortfolio = ",this.v_portfolio);

            this.v_selected = this.v_portfolio;            
            this.handlePortfolioDelete();
        },


        onPortfolioItemAdded(jsonItem) {
            logger.log.debug("PortfolioDetail.onPortfolioItemAdded = ",jsonItem);
            this.v_user.portfolio.addPortfolioItem(jsonItem.portfolio_item);
            this.v_user.portfolio.calcPerformance(store.state.prices);
        },

        onClickCommentSave(payload) {            
            logger.log.debug('onClickCommentSave - ',payload);
            CommonFunc.showOkMessage(this,'Comments posted');  
        },


        onClickCommentReply(payload) {
            logger.log.debug('onClickCommentReply - ',payload);
            CommonFunc.showOkMessage(this,'Comments posted');  
        },

        onClickRate(dic_payload) {
            const _this = this;
            logger.log.debug("BlogPage.onClickRate=",dic_payload);

            let dic_param = {comment: dic_payload.data.id, flag:dic_payload.rate};
            this.v_portfolio.comments.vote(dic_param).then( response => {
                CommonFunc.showOkMessage(_this,'Comments rate updated');
            });
        },

        onClickLoadMore() {
            logger.log.debug("BlogPage.onClickLoadMore!!!",this.g_data_comments.next);
            
            if (! this.g_data_comments.next) {
                return;
            }

            const dic_query = CommonFunc.getURLQuery(this.g_data_comments.next);
            this.loadBlogComments(this.g_page_id,dic_query.limit,dic_query.offset);
        },

        onClickAddToMyPortfolio(jsonPortfolio) {
            logger.log.debug("PortfolioDetail.onClickAddToMyPortfolio : portfolio=",jsonPortfolio);
            
            const _this=this;
            
            let portfolio = new PortfolioItemModel();
            portfolio.assign(jsonPortfolio);
            portfolio.portfolio_id = -1;
            portfolio.description += '\r\n Copied from ' + this.v_user.username;

            portfolio.addToServer().then(response=>{
                logger.log.debug("PortfolioDetail.onClickAddToMyPortfolio : response=",response);    
                if (response.data.ret==0) {
                    jsonPortfolio._this.setColor(true);
                    CommonFunc.showOkMessage(_this,'portfolio added');
                } else {
                    jsonPortfolio._this.setColor(false);
                    CommonFunc.showErrorMessage(_this,response.data.msg);
                }
                
            }).catch(err=>{                
                logger.log.error("PortfolioDetail.onClickAddToMyPortfolio : err=",err);    
                jsonPortfolio._this.setColor(false);
                CommonFunc.showErrorMessage(_this,response.data.msg);
            });
        },

        onClickSymbol(symbol) {
            logger.log.debug("PortfolioDetail.onClickSymbol : symbol=",symbol);        
            //CommonFunc.navAsset(this,symbol);
        },

		onClickLoadMore() {
			logger.log.debug("PortfolioDetail.onClickLoadMore : next_url = ", this.v_next_url);

			this.v_query.limit = this.$refs.loadMore.v_next.limit;
			this.v_query.offset = this.$refs.loadMore.v_next.offset;
			//this.loadBlogData(this.v_query);
		},
        onClickMore(portfolio_item) {
            logger.log.debug("PortfolioDetail.onClickMore : portfolio_item=",portfolio_item);
            
            //store.getters.nav.add(this.$route);
            CommonFunc.navAsset(this,portfolio_item.api_asset.symbol,portfolio_item.api_asset.id);
        }

    }
};
</script>


<style scoped>

/* .boxIcon { */
    /* padding-right:15px;  */
/* } */


.coinIcon {
    height:50px;
    margin:-3px 3px 0px -8px;
}

.symbolBox {
    margin-bottom:-7px;
}


.cardSection2 {
     padding:5px 0px 5px 53px; 
}

.NavigationBtn {
   font-size:25px;
   color:#999999;
   margin:-18px -20px 0px 0px;
}

.iconBox {
    margin-top:-6px;
}

</style>
