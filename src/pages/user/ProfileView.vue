<template>
    <div class="q-pa-md">

        <div class="q-mt-md q-mb-sm">
            <CTitle title="$t('page.profile.title')" desc="$t('page.profile.desc')"></CTitle>
        </div>

        <ProfileBox ref="profileBox" :user="v_user" />

        <q-card class="q-mt-sm">
            <q-card-section>
                <div class="row q-py-md text-center">                    
                    <div class="col-4">
                        <div> 
                            <span class="gROILG" :style="v_color_style(v_roi)"> {{ v_roi }} % </span>
                        </div>
                        <div> 
                            <span class="gCaption"> ROI </span>
                        </div>
                    </div>
<!--                    
                    <div class="col-4">
                        <div> 
                            <span class="gROILG"> {{ v_user.portfolio.item_count }} </span>
                        </div>
                        <div> 
                            <span class="gCaption">Item count </span>
                        </div>
                    </div>             
-->                    
                    <div class="col-4" @click="onClickFollower(v_user)">
                        <div>
                            <span class="gROILG">{{v_user.follower_count}}</span>
                        </div>
                        <div>
                            <span class="gCaption">Follower</span>
                        </div>
                    </div>
                    <div class="col-4" @click="onClickFollower(v_user)">
                        <div>
                            <span class="gROILG">{{v_user.following_count}}</span>
                        </div>
                        <div>
                            <span class="gCaption">Following</span>
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>



        <div class="row q-col-gutter-md q-mt-md justify-center  q-mb-xl">
            <div v-if="! isOwner">
                <q-btn color="primary" label="Unfollow" @click="onClickFollow(-1)" v-if="v_user.is_following" />
                <q-btn v-else color="primary" label="Follow" @click="onClickFollow(1)" />
            </div>
            <div>
                <q-btn color="primary" label="Message" @click="onClickMessage" />
            </div>
        </div>

        <q-separator class="gSeparator" />

        <div>
            <div class="row q-mt-xl q-mb-sm">
                <CTitle ttype="subtitle" title="$t('page.profile.portfolio')" desc="$t('page.profile.portfolio')"></CTitle>
                <q-space />
                <div>   
                    <q-btn label="Portfolio" @click="onClickMorePortfolio" />&nbsp;
                    <q-btn v-if="isOwner" label="Add" @click="onClickAddPortfolio" />
                </div>
            </div>
            <PortfolioList ref='portfolioList' 
                :data="v_user.portfolio" 
                @onClickPortfolio="onClickPortfolio"></PortfolioList>
        </div>

        <div class="q-mt-xl q-mb-sm">
            <FriendList ref='followerList' title="$t('page.profile.follower')" 
                maxLength="10" moreCaption="" :user="v_user"></FriendList>
        </div>

        <div class="q-mt-xl q-mb-sm">
            <FriendList ref='followingList' title="$t('page.profile.following')" 
                maxLength="10" moreCaption="" :user="v_user"></FriendList>
        </div>

        <div class="q-mt-xl q-mb-sm">
            <UserFeedList ref='feedList' title="$t('page.profile.userfeed')" 
                maxLength="10" moreCaption="" user="v_user"></UserFeedList>
        </div>

        <MessageWriterDialog ref="messageWriter" />

    </div>

</template>

<script>
import AWS from 'aws-sdk';
import {MoaConfig} from 'src/data/MoaConfig';
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import UserModel from "src/models/UserModel";
import {MessageThreadModel, MessageThreadListModel, MessageModel, MessageListModel} from "src/models/MessageModel";

import AvatarCropper from "vue-avatar-cropper";
import CTitle from 'components/CTitle';
import WButton from 'components/WButton.vue';
import BlogList from 'components/lists/BlogList';
import UserFeedList from 'components/lists/UserFeedList';
import MessageWriterDialog from 'components/dialogs/MessageWriterDialog';
import ProfileBox from 'src/pages/user/component/ProfileBox';
import FriendList from 'src/pages/user/component/FriendList';
import PortfolioList from 'src/pages/portfolio/component/PortfolioList';


export default {
    components: {
        CTitle,
        WButton,
        BlogList,
        AvatarCropper,
        MessageWriterDialog,
        PortfolioList,
        FriendList,
        UserFeedList,
        ProfileBox
    },
    props: {},
    computed: {
        v_me() {
            return store.getters.me;
        },
        isOwner() {
            if (CommonFunc.isEmptyObject(this.$route.query.username)) return true;                
            if (this.$route.query.username==this.v_me.username) return true;

            return false;
        },
        v_roi() {
            if (! this.v_user.portfolio.roi) {
                return 0;
            }
            return CommonFunc.formatNumber(this.v_user.portfolio.roi,2);
        },
        v_evaluated_value() {
            if (! this.v_user.portfolio.evaluated_value) {
                return 0;
            }
            return CommonFunc.formatNumber(this.v_user.portfolio.evaluated_value,2);
        },
        v_color_style() {
            return (value) => {
                if (value>0) {
                    return "color:#c10015;"
                }
                return "color:#005dde;";
            };
        },
    },
    data: () => ({
        g_data: null,
        v_user: new UserModel(),        
    }),
    created: function() {
        this.validateQuery();
    },
    mounted: function() {
        //console.log("HomeView.mounted - ");
        console.log("ProfileView.mounted - symbol=",this.$route.query);
        this.setUser(this.$route.query);        
        this.refresh();
    },

    methods: {
        validateQuery() {                        
            if (this.$route.query.hasOwnProperty('username')) {
                if (CommonFunc.isEmptyObject(this.$route.query.username)) {
                    CommonFunc.navError404(this);
                }
            }            
            
        },        

        setUser: function(query) {            
            if (this.isOwner) {
                this.v_user = this.v_me;
                return;
            }

            this.v_user.username = query.username;
        },

        loadProfile() {
            const _this = this;
            this.v_user.loadProfile().then( a_user => {

                _this.loadFollower();
                _this.loadFollowing();

                _this.$refs.profileBox.update(_this.v_user);

                _this.v_user.loadPortfolio().then( response => {
                    logger.log.debug("setUser=>",response);
                    _this.updatePortfolioWidget();
                });
            });
        },

        updatePortfolioWidget: function() {
            const _this = this;

            store.state.prices.load().then( response => {
                logger.log.debug("updatePortfolioWidget",response);
                _this.v_user.portfolio.calcPerformance(store.state.prices);
                //_this.$refs.portfolioList.update(_this.v_user.portfolio);
            });
        },

        refresh: function() {
            const _this = this;
                    
            let funcs = [
                this.loadProfile(),
                this.loadFeeds(),
            ];
            Promise.all(funcs).then(function() {

            });
        },

        loadBlogList: function(user_id) {
            this.$refs.blogList.updateByUser(user_id);
        },

        loadFeeds() {
            this.$refs.feedList.updateMine(this.v_user,0);
        },

        loadFollower() {
            logger.log.debug("UserProfileView.loadFollower");
            this.$refs.followerList.updateFollower(this.v_user,0);
        },

        loadFollowing() {
            logger.log.debug("UserProfileView.loadFollower");
            this.$refs.followingList.updateFollowing(this.v_user,0);
        },

        doFollow() {

        },

        onClickMessage: function() {
            logger.log.debug("ProfileView.onClickMessage");

            const _this=this;
            CommonFunc.checkButtonPermission(this,1,0).then(ret=>{
                logger.log.debug("ProfileView.onClickMessage : ret=",ret);
                if (ret==0) return;

                let v_message = new MessageThreadModel();
                v_message.to_user = _this.v_user.id;
                v_message.to_username = _this.v_user.username;
                v_message.avatar = _this.v_user.avatar;
                _this.$refs.messageWriter.show(v_message);
            });
        },

        onClickFollow: function(value) {
            logger.log.debug("onClickFollow");
                        
            const _this=this;

            CommonFunc.checkButtonPermission(this,1,0).then(ret=>{
                logger.log.debug("ProfileView.onClickFollow : ret=",ret);
                if (ret==0) return;

                _this.v_user.follow(_this.v_user.id,value).then( response => {
                    logger.log.debug("onClickFollow - response=",response);
                    
                    let msg = "Followed";
                    if (value==-1) msg = "Unfollowed";
                    CommonFunc.showOkMessage(_this,msg);

                }).catch(err=>{

                });
            });

        },

        onClickAddPortfolio: function() {
            logger.log.debug("onClickAddPortfolio");
            this.$refs.addPortfolio.show(this.v_user,null);
        },

        onClickMorePortfolio: function() {
            logger.log.debug("ProfileView.onClickMorePortfolio");
        },

        onClickPortfolio: function(portfolio) {
            logger.log.debug("ProfileView.onClickPortfolio:portfolio=",portfolio);
            //this.$refs.addPortfolio.show();
            CommonFunc.navPortfolio(this,this.v_user,portfolio);
            //store.getters.nav.add(this.$route);
            //let dic_param = { name:'portfolio_detail', path:'portfolio_detail', params:{ user:this.v_user, portfolio:portfolio, back:true } };
            //this.$router.push(dic_param);
        },

        onClickFollower: function(user) {
            logger.log.debug("onClickFollower",user);
        },

        onClickMoreFollower: function() {
            logger.log.debug("ProfileView.onClickFollower");
        },

        onClickFriend: function() {
            logger.log.debug("ProfileView.onClickFriend");
        }
    },

}

</script>


<style scope> 

</style>
