<template>
    <div>               
        <div class="row">
            <div class="col">
                <div>
                    <div class="row">
                        <div class="groupNameBox">
                            <span class="groupName"> {{v_portfolio.name}}  </span>             
                        </div>
                        
                            <q-space />
                        
                        <div class="groupDeleteBtn">
                            <q-btn icon="delete_outline" flat @click="onClickDeletePortfolio" />
                        </div>
                    </div>
                     <div class="ratingViewBox">
                            <q-icon class="ratingBtn"                           
                                name="thumb_up_off_alt" flat />                                                              
                                <span class="count">{{ v_portfolio.like_count }}</span>&nbsp;&nbsp;
                            
                            <q-icon class="ratingBtn"                               
                                name="thumb_down_off_alt" flat />   
                                <span class="count">{{ v_portfolio.dislike_count }}</span>&nbsp;&nbsp;
                            
                            <q-icon class="ratingBtn"              
                                name="chat_bubble_outline" flat />   
                                <span class="count">{{ v_portfolio.read_count }}</span>
                    </div> 
                </div>               

                <q-separator size="1px" />

                <div class="row box1">                    
                    <div class="col">
                        <div class="groupValue">{{ v_format(v_portfolio.roi) }}% </div>
                        <div class="name1">ROI</div>                         
                    </div>  

                    <q-separator vertical />
                    
                    <div class="col">   
                        <div class="groupValue">{{ v_format(v_portfolio.evaluated_value) }}</div>
                        <div class="name1">Evaluated Value</div>                         
                    </div>
                </div>
            </div>
        </div>
        <q-separator size="1px" />

        <div class="row">
            <div class="col">
                <div>
                    <h6 class="chartTitleBox"> ROI Chart </h6>
                </div>
                <q-separator size="1px" />
                <PortfolioChart ref="portfolioChart" />
                <div class="q-gutter-sm text-center thumb">
                    <q-btn icon=thumb_up_off_alt flat size="15px" @click="onClickVote(1)" />
                    <q-btn icon=thumb_down_off_alt flat size="15px" @click="onClickVote(-1)" />
                </div>
            </div>
        </div>

        <div class="row cardBox">
            <div class="col">
                <q-card class="q-my-sm" flat bordered v-for="(a_portfolio,index) in v_portfolio.items" :key="index">
                    <q-card-section class="cardSection">
                        <div class="row">
                            <div class="box2">  
                                <q-icon class="coinIcon" name="account_tree" color="black" size="34px" />                                    
                            </div>    
                            <div @click="onClickSymbol(a_portfolio.api_asset.symbol)">
                                <div class="symbolBox">
                                    <span class="symbolName"> {{a_portfolio.api_asset.symbol}}</span>
                                    <span class="coinName"> ({{a_portfolio.api_asset.name}}) </span>
                                </div>
                                <div>
                                    <span class="inceptionDate">{{v_updated_at(a_portfolio.updated_at)}}</span>
                                </div>
                            </div>        
                            <q-space />
                            <div class="q-gutter-xs btns">
                                <q-btn flat dense size="11px" icon="content_copy" v-if="! v_is_owner" 
                                    @click="onClickAddToMyPortfolio(a_portfolio)" />
                                <q-btn flat dense size="11px" icon="mode_edit_outline" />
                                <q-btn flat dense size="11px" icon="delete_outline" @click="onClickDelete(a_portfolio)"/>                                
                            </div>                            
                        </div>  
                    </q-card-section>

                    <q-card-section class="cardSection2">                        
                        <div class="row">
                            <div class="col box2-3 align-items">
                                <span class="name2">ROI</span>
                                <br>
                                <span class="roiValue">{{v_format(a_portfolio.roi)}} %</span>
<!--    
                                <br>
                                <span class="text-grey-8">{{ v_format(a_portfolio.last*a_portfolio.qty)}} </span>
-->                                
                            </div>    

                            <div class="col">  
                                <span class="name2">Current Price</span>
                                <br>
                                <span class="roiValue">{{ v_format(a_portfolio.last) }}</span>                                
                            </div>

<!--
                            <q-separator vertical inset />                                
                            <div class="col">
                                <span class="value">{{ v_format(a_portfolio.price) }}</span><br>
                                <span class="name2 cursor-pointer">Fist Price</span>
                            </div>
                            <q-separator vertical inset />
                            <div class="col">
                                <span class="value">{{v_updated_at(a_portfolio.updated_at)}}</span><br>
                                <span class="name2">Inception Date</span>
                            </div>
-->                            
                        </div>
                    </q-card-section>

                    <q-card-section class="cardSection2">

                        <div class="desc"> 
                            {{a_portfolio.description}} 
                        </div>
                        
                    </q-card-section>

                </q-card>

            </div>
        </div>

        <q-separator class="separator" />


        <div class="row">
            <div class="col q-mx-sm">
                <CommentForm ref="commentForm" type="comment"
                    :contentType="v_content_type" :post="v_portfolio"
                    @onClickCommentSave="onClickCommentSave" />

<!--                
                @onEditorFocus="onEditorFocus" @onEditorFocusOut="onEditorFocusOut" />
-->

                <CommentTree ref="commentTree" 
                    :data-list="v_portfolio.comments.items" 
                    :contentType="v_content_type" :post="v_portfolio"
                    @onClickCommentReply="onClickCommentReply"
                    @onClickLoadMore="onClickLoadMore"
                    @onClickRate="onClickRate"                    
                />

            </div>
        </div>

        <AddPortfolioDialog ref="addPortfolio" @onPortfolioItemAdded="onPortfolioItemAdded" />
<!--        
        <br /><br /><br />
        
        <WConfirmDialog ref="confirmDialog" title="Do you want to delete the item?" @onClickConfirm="onClickDeleteConfirm" />
-->
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
import {PortfolioModel,PortfolioItemModel} from "src/models/PortfolioModel";

import CommentForm from "components/comments/comment-form.vue";
import CommentTree from "components/comments/comment-tree.vue";

//import WConfirmDialog from 'components/dialogs/WConfirmDialog';
import AddPortfolioDialog from 'components/dialogs/AddPortfolioDialog';
import PortfolioChart from 'src/pages/user/component/PortfolioChart';



export default {
    name: 'PortfolioDetail',
    props: [],
    components: {
        CommentForm,
        CommentTree,
        AddPortfolioDialog,
        //WConfirmDialog,
        PortfolioChart
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
            if (this.v_me.id==this.v_user.id) {
                return true;
            }
            return false;
        },
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,MoaConfig.setting.maxPortfolioDescriptionLength);
            };
        }
    },
    data() {
        return {
            v_content_type:"portfolio.portfolio",
            v_user: null,
            //v_portfolio: new PortfolioModel(),
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
        this.setPortfolio(this.$route.params.portfolio);
        this.updateRead();
    },
    mounted() {
        logger.log.debug("PortfolioDetailView.mounted");

        //this.$parent.$parent.$refs.header.setBackArrow(true,this);
        //this.profile = store.getters.moa.user.profile;
        //this.avatarUrl = store.getters.moa.user.firebase.photoURL;
        //this.getProfile();
        this.loadComments(this.v_portfolio.id);
        //this.$refs.portfolioChart.update(this.v_portfolio);
    },
    beforeDestroy() {
        logger.log.debug("PortfolioDetailView.beforeDestroy");
        //this.$parent.$parent.$refs.header.setBackArrow(false,this);
    },

    methods: {
        updateRead() {
            this.v_user.portfolio.readPortfolio(this.v_portfolio.id).then(response=>{
                logger.log.debug("PortfolioDetailView.updateRead : response=",response);    
            });
        },

        setPortfolio(portfolio) {
            //this.v_portfolio = this.v_user.portfolio.getItem(portfolio_id);
            this.v_portfolio = portfolio;
            
            const _this=this;
            store.state.prices.load().then( response => {
                _this.v_portfolio.calcPerformance(store.state.prices);
                _this.$refs.portfolioChart.update(_this.v_portfolio);
            })
            logger.log.debug("PortfolioDetailView.setPortfolio : v_portfolio=",this.v_portfolio);
        },

        refresh: function() {
            const _this=this;
            this.v_user.loadPortfolio().then( response => {
                logger.log.debug("PortfolioDetailView.refresh=>",response);
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

        loadComments: function(page_id,limit=null,offset=null) {
            const _this = this;
            
            let dic_param = {content_type:'portfolio-portfolio' , id:page_id, limit:limit, offset:offset};
            this.v_portfolio.comments.load(dic_param).then( response => {
                //_this.g_data_comments = response.data;
                //_this.handleComments(_this.g_data_comments);
            }).catch( err => {
                logger.log.error("BlogView.loadBlogComments - error",err);
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
            
            const _this=this;
            store.getters.components.getComponent('confirmDialog').show('Do you want to delete?',function(value) {
                logger.log.debug("AssetQAView.onClickAnswer - confirm=",value,_this.$route);
                if (! value) return;
                _this.onClickDeleteConfirm();
            });
        },

        onClickDeletePortfolio: function() {
            logger.log.debug("PortfolioDetail.onClickDeletePortfolio = ",this.v_portfolio);

            this.v_selected = this.v_portfolio;
            
            const _this=this;
            store.getters.components.getComponent('confirmDialog').show('Do you want to delete?',function(value) {
                logger.log.debug("AssetQAView.onClickAnswer - confirm=",value,_this.$route);
                if (! value) return;
                _this.onClickDeleteConfirm();
            });
        },

        onClickDeleteConfirm: function() {            
            //let a_portfolio_item = this.v_portfolio.getItem(this.v_selected.id);
            logger.log.debug("PortfolioDetail.onClickDeleteConfirm");
            //logger.log.debug("PortfolioDetail.onClickDeleteConfirm",this.v_selected.constructor.name);
                        
            if (this.v_selected instanceof PortfolioModel) {
                this.handlePortfolioDelete();
            } else {
                this.handlePortfolioItemDelete();
            }

            //this.v_selected = null;
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
        }

    }
};
</script>


<style scoped>
.groupDeleteBtn {
    color:#999999;
    padding:23px 0px 0px 0px; 

}

.groupNameBox {
    padding:10px 0px 5px 10px;
}

.groupName {
    font-size:30px;
    font-weight:bold;
    color:#222222;

}


.name1 {
    font-size:15px;
    color:#8C8C8C;
    text-align:center;

}

.name2 {
    font-size:14px;
    color:#8C8C8C;
    text-align:center;

}

.groupValue {
   font-size:35px ;
   color: darkgreen;
}


.box1 {
    padding:20px 0px 20px 10px;
    text-align:center;
}

.box2 {
    padding-right:15px; 
}



.box3 {
    padding:0px 0px 15px 0px;
}

.cardBox {
    padding:10px 10px 10px 10px;
}

.chartTitleBox {
    color:#222222;
    margin:15px 20px 15px 20px;

}

.coinIcon {
    height:50px;
    margin-top:-3px;
}

.symbolBox {
    margin-bottom:-7px;
}

.symbolName {
    font-size:20px;
    color:#222222;
    font-weight:bold;
}

.coinName {
    font-size:12px;
    color:#999999;
}


.inceptionDate {
    font-size:11px;
    color:#999999;
}

.roiValue {
    font-size:25px;
    color:#222222;
}

.desc {
    font-size:13px;
    color:#999999;
}

.ratingViewBox {
    padding:0px 0px 10px 12px;
    margin-top:-10px;
}


.ratingBtn {
    font-size:13px;
    color:#999999;
    padding-right:2px;
}
.count {
    font-size:13px;
    color:#999999;
}

.cardSection {
    padding:10px 10px 5px 10px;
}

.cardSection2 {
    padding:5px 10px 5px 59px;
}

.btns {
    color:#999999;
}

.thumb {
    color:#999999;
}

.separator {
  margin:0px 0px 15px 0px;
  height:10px;
  background: #f0f1f6;
}
</style>
