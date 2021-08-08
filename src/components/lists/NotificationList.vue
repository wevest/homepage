<template>
	<div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreFeed"></CTitle>

		<q-skeleton v-if="!v_list_loaded" height="150px" square animation="pulse-x" />

		<div v-show="v_list_loaded">
			<div v-show="v_notification">
				<q-list separator class="rounded-borders">
					<q-item 
						class="q-pa-sm"
						clickable
						v-ripple
						:key="index"
						v-for="(a_feed, index) in v_notification.items"
						v-if="index<v_maxLength"
						@click.stop="onClickFeed(a_feed)"
					>
						<q-item-section class="feedAvatar" avatar top>
							<WAvatar :avatar="v_avatar(a_feed)" :username="v_username(a_feed)" />
						</q-item-section>
						<q-item-section top>
							<q-item-label class="q-pt-xs" lines="1">
								<span class="gListTitle">{{ v_title_item(a_feed) }}</span>
							</q-item-label>
							<q-item-label class="no-margin" lines="1">

								<WSubinfo 
									username="" 
									:pub_date="a_feed.pub_date" 
									like_count="-1" 
									dislike_count="-1" />

							</q-item-label>
						</q-item-section>

					</q-item>
					<q-separator class="q-mb-md" size="1px" /> 
					<!-- v-if="v_feeds.items>0"  -->
					


				</q-list>

				<LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />

			</div>

			<div v-if="(! v_notification) || (v_notification.items.length==0) ">
				<div class="gNoListTitle">No Notification</div>
				<div class="gNoListMessage">새로운 알림이 여기에 표시됩니다</div>
			</div>
		</div>

	</div>
</template>


<script>
import { store } from 'src/store/store';
import { MoaConfig } from 'src/data/MoaConfig';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import WAvatar from "src/components/WAvatar";
import WSubinfo from 'components/WSubinfo';
import LoadMore from "src/components/LoadMore";
import UserModel from "src/models/UserModel";
import {NotificationListModel} from "src/models/UserModel";


export default {
	components: {
		CTitle,
		WAvatar,
		WSubinfo,
		LoadMore
	},
    props: {
        limit: {
            default: MoaConfig.setting.feedLimit,
        },
        maxLength: {
            default: 20,
        },
		title: {
			type:String,
			default: "Notification List"
		},
		moreCaption: {
			type:String,
			default: ""
		},
		mode: {
			type:String,
			default:'follower'
		},
        user: {
            default: new UserModel()
        },
    },
    computed: {
		v_avatar() {
            return (feed) => {
				if ( (feed.extra) && (feed.extra.hasOwnProperty('target_avatar'))) {
					return feed.extra.target_avatar;
				} 
				return '';
            };
        },    
		v_username() {
            return (feed) => {
				if ( (feed.extra) && (feed.extra.hasOwnProperty('target_user'))) {
					return feed.extra.target_user;
				}
				return '';
            };
        },    
		v_title_item() {
            return (feed) => {
				return CommonFunc.shortenString(this.getTitleMsg(feed),MoaConfig.setting.maxTitleLength);
            };
        },
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,MoaConfig.setting.maxTitleLength);
            };
        }

    },

	data() {
		return {
			v_list_loaded:false,

			g_data: null,
			
			v_title: this.title,
			v_maxLength: this.maxLength,
			v_more_caption: this.moreCaption,								

            v_pagination: {
                limit: this.limit,
                uuid:''
            },

			v_user: this.user,
			v_notification: new NotificationListModel(),
		};
	},

	methods: {
		getTitle(feed,action,target) {
			let msg = "";
			if ( (! feed.extra) || (! feed.extra.hasOwnProperty('target_display_name')) )  {
				msg = "someone " + action + " " + feed.title;
			} else {
				let username = feed.extra.target_name;
				if (feed.extra.target_display_name) {
					username = feed.extra.target_display_name;
				}				
				msg = username + " " + action + " " + target;
			}
			return msg;
		},	

		getTitleMsg(feed) {
			let msg = "";			
			let title = "";

			if (feed.verb.indexOf('Vote')>-1) {
				if (feed.verb=="PortfolioVote") title = " portfolio " + feed.title;
				if (feed.verb=="PostPageVote") title = feed.title;
				if (feed.verb=="TweetVote") title = " your tweet ";				
				if (feed.verb=="ReviewVote") title = " your review on " + feed.category;
				if (feed.verb=="AnswerVote") title = " your answer on " + feed.title;				
				
				if (feed.verb=="AnswerCommentVote") title = " your comment on " + feed.title;
				if (feed.verb=="QuestionCommentVote") title = " your comment on " + feed.title;
				if (feed.verb=="TweetCommentVote") title = " your comment on tweet";
				if (feed.verb=="CustomCommentVote") {
					title = " your comment on " + feed.title;
					if (feed.parent=="portfolio.portfolio") {
						title = " your comment on Portfolio " + feed.title;
					}
				}
				msg = this.getTitle(feed,'like',title);

			} else if (feed.verb.indexOf('Comment')>-1) {
			
				title = " on " + feed.title;
				if (feed.parent=="portfolio.portfolio") {
					title = " on Portfolio " + feed.title;
				}
				msg = this.getTitle(feed,' write comments ',title);

			} else if (feed.verb.indexOf('WeVestUser')>-1) {
				msg = this.getTitle(feed,' follows you','');
			}

			return msg;
		},

		update(user) {
			logger.log.debug("NotificationList.update - user",user);
			this.setUser(user);
            this.loadNotification();
		},

		setUser(user) {
            logger.log.debug("NotificationList.setUser",user);
            this.v_user = user;
        },

		loadNotification() {			
			logger.log.debug("NotificationList.loadNotification");
			if (CommonFunc.isEmptyObject(this.v_user.id)) {
				return;
			}

			const _this = this;
			this.v_notification.load(this.v_user.id,this.v_user.username,this.v_pagination.limit,this.v_pagination.uuid).then(response=>{
				_this.g_data = response.data;
				_this.$refs.loadMore.setFeedPagination(response.data.next);
				logger.log.debug("NotificationList.loadNotification - response",_this.g_data);
				_this.v_list_loaded = true;
			}).catch(err=>{
				logger.log.error("NotificationList.loadNotification - err",err);
				_this.v_list_loaded = true;
			});
		
		},


		onClickFeed(feed) {
			logger.log.debug("onClickFeed : feed = ", feed);			
			//return;
			
			if (feed.verb=="PostPage") {
                NavFunc.navBlogDetail(this,feed.id);
			} else if (feed.verb=="PostPageVote") {
				NavFunc.navBlogDetail(this,feed.parent_id);
			} else if (feed.verb=="Review") {
				NavFunc.navReview(this,feed.category,feed.id);
			} else if (feed.verb=="ReviewVote") {
				NavFunc.navReview(this,feed.category,feed.id);
			} else if (feed.verb=="QuestionPage") {
				NavFunc.navQADetail(this,feed.id);
			} else if (feed.verb=="AnswerVote") {
				NavFunc.navQADetail(this,feed.question_id);

			} else if (feed.verb=="CustomComment") {

				if (feed.parent=="portfolio.portfolio") {
					NavFunc.navPortfolio(this,feed.owner,feed.parent_id);
				} else {
					NavFunc.navBlogDetail(this,feed.parent_id);
				}
				
			} else if (feed.verb=="AnswerPage") {
				NavFunc.navQADetail(this,feed.question_id);
			} else if (feed.verb=="AnswerComment") {
				NavFunc.navQADetail(this,feed.question_id);
			} else if (feed.verb=="AnswerCommentVote") {
				NavFunc.navQADetail(this,feed.question_id);
			} else if (feed.verb=="QuestionComment") {
				NavFunc.navQADetail(this,feed.parent_id);
			} else if (feed.verb=="QuestionCommentVote") {
				NavFunc.navQADetail(this,feed.question_id);
			} else if (feed.verb=="PortfolioVote") {
				NavFunc.navPortfolio(this,feed.owner,feed.parent_id);
			} else if (feed.verb=="PortfolioItem") {
				NavFunc.navPortfolio(this,feed.owner,feed.parent_id);
			}

			return;
			
		},

		onClickLoadMore() {
			logger.log.debug("onClickLoadMore : next_url = ", this.$refs.loadMore.v_next);

			this.v_pagination.uuid = this.$refs.loadMore.v_next.uuid;
			this.v_pagination.limit = this.$refs.loadMore.v_next.limit;
			this.v_maxLength = 9999999;

			this.loadNotification();
			
		},

		onClickMoreFeed() {
			logger.log.debug("NotificationList.onClickMoreFeed : 1");
			
            NavFunc.navFeeds(this);
		}

	},
};
</script>


<style lang="sass">
</style>
<style scope>

.feedAvatar {
margin-top:2px;
}

</style>