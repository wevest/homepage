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
                            shareBtn="share" updateBtn="" deleteBtn="delete" 
                            @onClickShare="onClickShare" 
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

            <div class="row box1">                    
                <div class="col">
                    <div class="text-h4 text-weight-bolder" :style="v_color(v_portfolio.roi)">{{ v_format(v_portfolio.roi) }}% </div>
                    <div class="name1">ROI</div>                         
                </div>  

                <q-separator vertical />
                
                <div class="col">   
                    <div class="text-h4 text-weight-bold">$ {{ v_format(v_portfolio.evaluated_value) }}</div>
                    <div class="name1">Evaluated Value</div>                         
                </div>
            </div>
        </div>

        
        <q-separator class="gSeparator" />

        <div>
            <div class="q-my-lg">
                <span class="text-h5 text-weight-bold"> ROI Chart </span>
            </div>
            
            <PortfolioChart ref="portfolioChart" />
            <div>
                <WRatingButton ref="ratingButton" 
                    likeCaption="훌륭합니다." dislikeCaption="리밸런싱해요"
                    @onClickRating="onClickVote" />
            </div>
        </div>

        <q-separator class="gSeparator" />

        <div class="cardBox">
            <q-card class="q-my-md" flat bordered v-for="(a_portfolio,index) in v_portfolio.items" :key="index">
                <q-card-section>
                    <div class="row">
                        <div class="boxIcon">  
                            <q-icon class="coinIcon" name="account_tree" color="black" size="34px" />                                    
                        </div>    
                        <div @click="onClickSymbol(a_portfolio.api_asset.symbol)">
                            <div class="symbolBox">
                                <span class="text-h6 text-weight-bold"> {{a_portfolio.api_asset.symbol}}</span>
                                <span class="text-caption text-grey-6"> &nbsp; ({{a_portfolio.api_asset.name}}) </span>
                            </div>
                            <div>
                                <span class="text-caption text-grey-6 q-mt-sm">{{v_updated_at(a_portfolio.updated_at)}}</span>
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
                    </div>  
                </q-card-section>

                <q-card-section class="cardSection2">                        
                    <div class="row">
                        <div class="col align-items">
                            <span class="text-caption text-grey-6">ROI</span>
                            <br>
                            <span class="text-h5 text-weight-bolder" :style="v_color(a_portfolio.roi)">{{v_format(a_portfolio.roi)}} %</span>
                        </div>    
                        <div class="col">  
                            <span class="text-caption text-grey-6">Current Price</span>
                            <br>
                            <span class="text-h5 text-weight-bold">$ {{ v_format(a_portfolio.last) }}</span>                                
                        </div>                            
                    </div>

                </q-card-section>

                <q-card-section class="cardSection2">

                    <div class="text-body2 text-grey-8"> 
                        {{a_portfolio.description}} 
                    </div>
                    
                </q-card-section>

            </q-card>

        </div>

        <q-separator class="gSeparator" />

        <div class="q-ma-sm">
            <CommentBox ref="commentBox"             
                :contentType="v_content_type" :post="v_portfolio" :items="v_portfolio.comments.items" />            
        </div>

        <AddPortfolioDialog ref="addPortfolio" @onPortfolioItemAdded="onPortfolioItemAdded" />

        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" color="accent" @click="onClickAdd" />
        </q-page-sticky>

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

import AddPortfolioDialog from 'components/dialogs/AddPortfolioDialog';
import PortfolioChart from 'src/pages/portfolio/component/PortfolioChart';
import WSubinfo from 'components/WSubinfo';
import WCommandBar from "components/WCommandBar.vue";
import WRatingButton from 'components/WRatingButton';

export default {
    name: 'PortfolioDetail',
    props: [],
    components: {
        AddPortfolioDialog,
        PortfolioChart,
        WSubinfo,
        WCommandBar,        
        WRatingButton,
        CommentBox,
    },    
    mixins: [],
    computed: {
        v_me() {
            return store.getters.me;
        },
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
            
            v_selected: null,
        }
    },
    created() {
        logger.log.debug("PortfolioDetailView.created");
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
        prepare() {
            this.v_user.username = this.$route.query.username;
            this.v_portfolio.id = this.$route.query.portfolio_id;

            this.v_query = this.$route.query;
        },

        updateRead(portfolio_id) {
            this.v_user.portfolio.readPortfolio(portfolio_id).then(response=>{
                logger.log.debug("PortfolioDetailView.updateRead : response=",response);    
            });
        },

        selectPortfolio(portfolio_id) {
            const _this=this;
            this.v_portfolio = this.v_user.portfolio.getItem(parseInt(portfolio_id));

            logger.log.debug("PortfolioDetailView.setPortfolio : v_portfolio=",portfolio_id,this.v_portfolio);

            store.state.prices.load().then( response => {
                _this.v_portfolio.calcPerformance(store.state.prices);
                _this.$refs.portfolioChart.update(_this.v_portfolio);
            })            
        },

        refresh: function() {
            const _this=this;
            this.v_user.loadPortfolio().then( response => {
                logger.log.debug("PortfolioDetailView.refresh=>",response);
                _this.selectPortfolio(_this.v_query.portfolio_id);
                _this.loadComments(_this.v_query.portfolio_id);
                _this.forceUpdate();
            });
        },

        forceUpdate: function() {
            let items = [];
            for (let index=0;index<this.v_portfolio.items.length;index++) {
                items.push(this.v_portfolio.items[index]);
            }
            this.v_portfolio.items = items;
            this.v_user.portfolio.calcPerformance(store.state.prices);
        },

        loadComments: function(limit=null,offset=null) {
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




        onClickBack: function() {
            logger.log.debug("PortfolioDetail.onClickBack");
            CommonFunc.navBack(this);
        },

        onClickAdd: function() {
            logger.log.debug("PortfolioDetail.onClickAdd");
            this.$refs.addPortfolio.show(this.v_user,null);
        },
        
        onClickDelete: function(portfolio_item) {
            logger.log.debug("PortfolioDetail.onClickDelete : v_selected=",portfolio_item);
            
            this.v_selected = portfolio_item;
            this.handlePortfolioItemDelete();
        },

        onClickDeletePortfolio: function() {
            logger.log.debug("PortfolioDetail.onClickDeletePortfolio = ",this.v_portfolio);

            this.v_selected = this.v_portfolio;            
            this.handlePortfolioDelete();
        },

        onClickVote: function(dicParam) {
            const _this=this;

            logger.log.debug("PortfolioDetail.onClickVote = ",dicParam);
            
            let dic_param = {id:this.v_portfolio.id, value:dicParam.value};
            this.v_portfolio.vote(dic_param).then(response => {
                logger.log.debug('onClickReviewRating - ',response);
                CommonFunc.showOkMessage(_this,'Voted');
            }).catch( err => {

            });

        },

        onPortfolioItemAdded: function(jsonItem) {
            logger.log.debug("PortfolioDetail.onPortfolioItemAdded = ",jsonItem);
            this.v_user.portfolio.addPortfolioItem(jsonItem.portfolio_item);
            this.v_user.portfolio.calcPerformance(store.state.prices);
        },

        onClickCommentSave: function(payload) {            
            logger.log.debug('onClickCommentSave - ',payload);
            CommonFunc.showOkMessage(this,'Comments posted');  
        },


        onClickCommentReply: function(payload) {
            logger.log.debug('onClickCommentReply - ',payload);
            CommonFunc.showOkMessage(this,'Comments posted');  
        },

        onClickRate: function(dic_payload) {
            const _this = this;
            logger.log.debug("BlogPage.onClickRate=",dic_payload);

            let dic_param = {comment: dic_payload.data.id, flag:dic_payload.rate};
            this.v_portfolio.comments.vote(dic_param).then( response => {
                CommonFunc.showOkMessage(_this,'Comments rate updated');
            });
        },

        onClickLoadMore: function() {
            logger.log.debug("BlogPage.onClickLoadMore!!!",this.g_data_comments.next);
            
            if (! this.g_data_comments.next) {
                return;
            }

            const dic_query = CommonFunc.getURLQuery(this.g_data_comments.next);
            this.loadBlogComments(this.g_page_id,dic_query.limit,dic_query.offset);
        },

        onClickAddToMyPortfolio: function(jsonPortfolio) {
            logger.log.debug("PortfolioDetail.onClickAddToMyPortfolio : portfolio=",jsonPortfolio);
            
            const _this=this;
            
            let portfolio = new PortfolioItemModel();
            portfolio.assign(jsonPortfolio);
            portfolio.portfolio_id = -1;
            portfolio.description += '\r\n Copied from ' + this.v_user.username;

            portfolio.addToServer().then(response=>{
                logger.log.debug("PortfolioDetail.onClickAddToMyPortfolio : response=",response);    
                if (response.data.ret==0) {
                    CommonFunc.showOkMessage(_this,'portfolio added');
                } else {
                    CommonFunc.showErrorMessage(_this,response.data.msg);
                }
                
            }).catch(err=>{
                logger.log.error("PortfolioDetail.onClickAddToMyPortfolio : err=",err);    
            });
        },

        onClickSymbol:function(symbol) {
            logger.log.debug("PortfolioDetail.onClickSymbol : symbol=",symbol);        
            CommonFunc.navAsset(this,symbol);
        },

        onClickUpdate:function(portfolio) {
            logger.log.debug("PortfolioDetail.onClickEdit : portfolio=",portfolio);
            this.$refs.addPortfolio.show(this.v_user,portfolio);
        },

		onClickLoadMore: function() {
			logger.log.debug("PortfolioDetail.onClickLoadMore : next_url = ", this.v_next_url);

			this.v_query.limit = this.$refs.loadMore.v_next.limit;
			this.v_query.offset = this.$refs.loadMore.v_next.offset;
			//this.loadBlogData(this.v_query);
		},
        onClickShare: function(data) {
            let a_url = CommonFunc.navPortfolio(this,this.v_user,this.v_portfolio,true);
            logger.log.debug("PortfolioDetail.onClickShare=",data,a_url);            
            CommonFunc.copyUrl(this,a_url);
        }

    }
};
</script>


<style scoped>

.boxIcon {
    padding-right:15px; 
}

.cardBox {
    padding:10px 10px 10px 10px;
}

.coinIcon {
    height:50px;
    margin-top:-3px;
}

.symbolBox {
    margin-bottom:-7px;
}


.coinName {
    font-size:12px;
    color:#999999;
}

.cardSection2 {
    padding:5px 10px 5px 59px;
}

</style>
