<template>
	<div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreFriend"></CTitle>

		<div v-show="v_items">
			<q-list separator class="rounded-borders">
				<q-item 
					class="q-pa-sm"
					clickable
					:key="index"
					v-if="index<v_maxLength && v_items"
					v-for="(a_user, index) in v_items"				
				>
					<q-item-section class="avatar" avatar top>
						<WAvatar :avatar="a_user.avatar" :username="a_user.username" />
					</q-item-section>
					<q-item-section top @click.stop="onClickUser(a_user.username)">
						<q-item-label lines="1">
							<span class="gUserNameSM">{{ a_user.username }}</span>
						</q-item-label>
						<q-item-label lines="1">

							<WSubinfo 
								username="" 
								:pub_date="a_user.created_at" 
								:like_count="-1" 
								:dislike_count="-1" />

						</q-item-label>
					</q-item-section>
					
					<q-item-section side>
						<q-item-label lines="1">
							<q-btn ripple :outline="v_follow_color(a_user)" color="primary"
								:label="v_label_follow(a_user)" :ref="'btnFollow_'+index"
								@click="onClickFollow(a_user,index)" />

						</q-item-label>
					</q-item-section>

				</q-item>
				<q-separator class="loadmoreSeparator" size="1px" />

			</q-list>

			<LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />
		</div>

		<div v-show="(! v_items) || (v_items.length==0)">
			<q-icon name="email" style="color: #666666; font-size: 20px;" />
			<div class="Message">No Messages!!!</div>
		</div>

	</div>

</template>


<script>
import { store } from 'src/store/store';
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import WAvatar from "src/components/WAvatar";
import WSubinfo from 'components/WSubinfo';
import LoadMore from "src/components/LoadMore";
import UserModel from "src/models/UserModel";

export default {
	components: {
		CTitle,
		WAvatar,
		WSubinfo,
		LoadMore
	},
    props: {
		items: {
			default: null
		},
        maxLength: {
            default: 20,
        },
        limit: {
            default: 20,
        },
		title: {
			type:String,
			default: "Blog List"
		},
		moreCaption: {
			type:String,
			default: ""
		},
		mode: {
			type:String,
			default: "follower"
		},
		user: {
			required: true,
			default: null
		}
    },
    computed: {
		v_me() {			
			return store.getters.me;
		},
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,MoaConfig.setting.maxTitleLength);
            };
        },
		v_is_owner() {
			if (this.v_me.id==this.v_user.id) {
				return true;
			}
			return false;
		},
		v_label_follow: {
			get() {
				return (user) => {
					if (this.v_is_owner) {
						if (user.is_follower) {
							return "Follow";
						}
						return "Unfollow";					
					}

					return "Follow";
				}
			},
			set(value) {
				return value;
			}
		},
		v_follow_color: {
			get() {
				return (user) => {
					if (this.v_is_owner) {
						if (user.is_follower) {
							return true;
						}
						return false;
					}
					return true;
				}
			},
			set(value) {
				return value;
			}
		}
    },

	data() {
		return {
			g_data: null,
			
			v_title: this.title,
			v_maxLength: this.maxLength,
			v_more_caption: this.moreCaption,								
		
            v_pagination: {
                offset: 0,
                limit: this.limit,
            },

			v_user: null,
			v_items: null,

			//v_label_follow:'Follow',

			v_label_add_friend:'Follow',
			v_loading_add_friend:false,

			v_follow_loading:false,		
		};
	},

	methods: {
		update: function (user,offset=0) {
			this.setUser(user);
            this.v_pagination.offset = offset;
            this.loadRelation();
		},

		updateFollower: function (user,offset=0) {
			this.setUser(user);
            this.v_pagination.offset = offset;
            this.loadFollower();
		},

		updateFollowing: function (user,offset=0) {
			this.setUser(user);
            this.v_pagination.offset = offset;
            this.loadFollowing();
		},

		setUser(user) {
            logger.log.debug("setUser",user);
            this.v_user = user;
        },

        loadFollower() {
            const _this=this;
            this.v_user.loadFollower(this.v_pagination.offset,this.v_pagination.limit).then( response => {
                logger.log.debug("ProfileView.loadFollower - response=",response, _this.v_user.follower );                
                _this.v_items = _this.v_user.follower.items;
				_this.$refs.loadMore.setPagination(response.data.results,_this.v_pagination.offset,_this.v_pagination.limit);
            }).catch(err=>{
				logger.log.error("ProfileView.loadFollower - err=",err);
            });

        },

        loadFollowing() {
            const _this=this;
            this.v_user.loadFollowing(this.v_pagination.offset,this.v_pagination.limit).then( response => {
                logger.log.debug("ProfileView.loadFollowing - response=",response, _this.v_user.following );
                _this.v_items = _this.v_user.following.items;
				_this.$refs.loadMore.setPagination(response.data.results,_this.v_pagination.offset,_this.v_pagination.limit);
            }).catch(err=>{
				logger.log.error("ProfileView.loadFollowing - err=",err);
            });

        },

		onClickUser: function (username) {
			logger.log.debug("onClickUser : username = ", username);			
			CommonFunc.navProfile(this,username);
			//this.$emit("onClickBlog",{page_id:page_id});
		},

		onClickLoadMore: function() {
			logger.log.debug("onClickLoadMore : next_url = ", this.v_next_url);

			this.v_pagination.offset += this.v_pagination.limit;
			this.loadRelation();
		},

		onClickMoreFriend: function() {
			logger.log.debug("FriendList.onClickMoreFriend : 1");
			
			//store.getters.nav.add(this.$route);
            //CommonFunc.navProfile(this,this.v_user.username);
		},

		onClickFollow(user,index) {
			let a_btn = this.$refs['btnFollow_'+index][0];
			logger.log.debug("FriendList.onClickFollow:user=",user,a_btn);
			
            const _this=this;
            
			let value = 1;
			if (this.v_is_owner) {
				if (! user.is_follower) {
					value = -1;
				}
			}

            CommonFunc.checkButtonPermission(this,1,0).then(ret=>{
                logger.log.debug("ProfileView.onClickFollow : ret=",ret);
                if (ret==0) return;
                
                //_this.v_follow_loading = true;
                _this.v_me.follow(user.id,value).then( response => {
                    logger.log.debug("onClickFollow - response=",response);
                    
                    //let msg = "Followed";
                    //if (value==-1) msg = "Unfollowed";
                    //CommonFunc.showOkMessage(_this,msg);

					if (value==1) {
						user.is_follower = true;				
						//_this.v_follow_flat = false;
						//a_btn.label = "Unfollow";
					} else {
						user.is_follower = false;
						//a_btn.label = "Follow";
						//_this.v_follow_flat = true;
					}
					
					a_btn.label = _this.v_label_follow(user);
                    //_this.v_follow_loading = false;

                }).catch(err=>{
                    CommonFunc.showErrorMessage(_this,err.msg);
                    _this.v_follow_loading = false;
                });
            });

		},

	},
};
</script>


<style scope>
.avatar {
	margin-top:-4px;
}
.news-title {
	font-size: 18px;
	color: #000000;
}

.news-date {
	font-size: 10px;
	color: #888888;
}

.loadmoreSeparator {
	margin-bottom:10px;
}
</style>