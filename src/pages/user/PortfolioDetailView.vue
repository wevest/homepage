<template>
    <div>
        <div class="row backBtn">
            <div>
<!--                
                <q-btn label="back" @click="onClickBack" />
-->                
                <q-btn label="delete" @click="onClickDeletePortfolio" />
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="groupNameBox">
                    <span class="groupName"> {{v_portfolio.name}}  </span> 
<!--
                    &nbsp;|&nbsp;
                    <span class="name1"> {{v_shorten(v_portfolio.description)}}  </span>
-->                    
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
                    <div> read : {{ v_portfolio.read_count }} </div>
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
                                <span class="name2">Current Price</span>
                            </div>
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
                        </div>
                    </q-card-section>

                     <q-separator size="1px" />

                    <q-card-section>
                        <div class="desc"> 
                            {{a_portfolio.description}} 
                        </div>
                        
                    </q-card-section>
                    
                    <q-separator size="1px" />

                    <q-card-actions>
                        <div class="text-grey-8 q-gutter-xs">
                            <q-btn size="15px" flat dense round icon="delete" @click="onClickDelete(a_portfolio)"/>&nbsp;
                            <q-btn size="15px" flat dense round icon="done" />&nbsp;
                            <q-btn size="15px" flat dense round icon="more_vert" />
                        </div>                            
                    </q-card-actions>                        

                </q-card>

            </div>
        </div>

        <div class="row">
            <div class="col">
                <CommentForm ref="commentForm" @onClickCommentSave="onClickCommentSave" />
<!--                
                @onEditorFocus="onEditorFocus" @onEditorFocusOut="onEditorFocusOut" />
-->

                <CommentTree ref="commentTree" :data-list="v_portfolio.comments.items" 
                    @onClickCommentReply="onClickCommentReply"
                    @onClickLoadMore="onClickLoadMore"
                    @onClickRate="onClickRate"                    
                />

            </div>
        </div>

        <AddPortfolioDialog ref="addPortfolio" @onPortfolioItemAdded="onPortfolioItemAdded" />

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
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";
import {PortfolioModel,PortfolioItemModel} from "src/models/PortfolioModel";

import CommentForm from "components/comments/comment-form.vue";
import CommentTree from "components/comments/comment-tree.vue";

import AddPortfolioDialog from 'components/dialogs/AddPortfolioDialog';
import PortfolioChart from 'src/pages/user/component/PortfolioChart';



export default {
    name: 'PortfolioDetail',
    props: [],
    components: {
        CommentForm,
        CommentTree,
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
        v_isowner() {
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
            v_confirm: false,

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
        this.setPortfolio(this.$route.params.portfolio_id);
        this.updateRead();
    },
    mounted() {
        logger.log.debug("PortfolioDetailView.mounted");

        //this.$parent.$parent.$refs.header.setBackArrow(true,this);
        //this.profile = store.getters.moa.user.profile;
        //this.avatarUrl = store.getters.moa.user.firebase.photoURL;
        //this.getProfile();
        this.loadComments(this.v_portfolio.id);
        this.$refs.portfolioChart.update(this.v_portfolio);
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

        setPortfolio(portfolio_id) {
            this.v_portfolio = this.v_user.portfolio.getItem(portfolio_id);
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
                CommonFunc.navBack(_this);
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

        postComment: function(dic_param) {
            const _this = this;
            this.v_portfolio.comments.post(dic_param).then( response => {
                CommonFunc.showOkMessage(_this,'comments posted');                
            }).catch( err=> {

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
            this.v_confirm = true;
        },

        onClickDeletePortfolio: function() {
            logger.log.debug("PortfolioDetail.onClickDeletePortfolio = ",this.v_portfolio);

            this.v_selected = this.v_portfolio;
            this.v_confirm = true;
        },

        onClickDeleteConfirm: function() {            
            this.v_confirm = false;       

            //let a_portfolio_item = this.v_portfolio.getItem(this.v_selected.id);
            //logger.log.debug("PortfolioDetail.onClickDeleteConfirm",a_portfolio_item.name);
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
            let dic_param = {
                content_type:"portfolio.portfolio",
                object_pk:this.v_portfolio.id, 
                name: this.v_me.username,  
                avatar: this.v_me.avatar_thumb,
                email:'', followup:'FALSE', reply_to:0,
                comment:payload.comments,                
            };

            logger.log.debug('onClickCommentSave - ',payload,dic_param);
            this.postComment(dic_param);
        },


        onClickCommentReply: function(payload) {
            let dic_param = {
                content_type:"portfolio.portfolio",
                object_pk:this.v_portfolio.id, 
                name:this.v_me.username,  
                email:'', followup:'FALSE', reply_to:payload.data.id,
                comment:payload.comments,                
            };

            logger.log.debug('onClickCommentReply - ',payload,dic_param);
            this.postComment(dic_param);
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
