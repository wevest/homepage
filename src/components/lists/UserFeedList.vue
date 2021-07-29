<template>
	<div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreFeed"></CTitle>

		<div v-show="v_feeds">
			<q-list separator class="rounded-borders">
				<q-item 
					class="q-pa-sm"
					clickable
					v-ripple
					:key="index"
					v-for="(a_feed, index) in v_feeds.items"
					v-if="index<v_maxLength"
					@click.stop="onClickFeed(a_feed)"
				>
					<q-item-section class="feedAvatar" avatar top>
						<WAvatar :avatar="a_feed.avatar" :username="a_feed.username" />
					</q-item-section>
					<q-item-section top>
						<q-item-label class="q-pt-xs" lines="1">
							<span class="gListTitle">{{ v_title_item(a_feed) }}</span>
						</q-item-label>
						<q-item-label class="no-margin" lines="1">

							<WSubinfo 
								:username="a_feed.username" 
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

		<div class="text-center" v-if="(! v_feeds) || (v_feeds.items.length==0) ">
			<div class="gListTitle">No Userfeed</div>
			<div class="gCaption">팔로우 한 사람의 새로운 소식이 여기에 표시됩니다</div>
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
import {FeedListModel} from "src/models/UserModel";


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
			default: "User Feeds List"
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
			g_data: null,
			
			v_title: this.title,
			v_maxLength: this.maxLength,
			v_more_caption: this.moreCaption,								

            v_pagination: {
                limit: this.limit,
                uuid:''
            },

			v_type: 'user',
			v_user: this.user,
			v_feeds: new FeedListModel(),
		};
	},

	methods: {
		getTitleMsg(feed) {
			let msg = "";
			
			if (feed.verb=="ReviewVote") {
				msg = "Like a Review : " + feed.category;
			} else if (feed.verb=="AnswerVote") {
				msg = "Like a Answer";
			} else if (feed.verb=="PortfolioVote") {
				msg = "Like a Portfolio : " + feed.title;
			} else if (feed.verb=="PostPageVote") {
				msg = "Like a Post : " + feed.title;
			} else if (feed.verb=="Review") {
				msg = "Write a Review : " + feed.category;
			} else if (feed.verb=="PortfolioItem") {
				msg = "Portfolio : "+feed.title;
			} else if (feed.verb=="AnswerComment") {
				msg = "Write a Comment on AnswerPage : "+feed.title;
			} else if (feed.verb=="AnswerCommentVote") {
				msg = "Like a Comment on AnswerPage : "+feed.title;
			} else if (feed.verb=="QuestionComment") {
				msg = "Write a Comment on QuestionPage : "+feed.title;
			} else if (feed.verb=="QuestionCommentVote") {
				msg = "Like a Comment on QuestionPage : "+feed.title;
			} else if (feed.verb=="CustomComment") {
				
				let target = "";
				let action = "";

				if (feed.parent=="portfolio.portfolio") {
					target = "Portfolio";
				} else {
					target = "Blog";
				}

				if (feed.hasOwnProperty('extra')) {
					if (feed.extra=="CommentLike") {
						action = "Like";
					} else {
						action = "Write";
					}
				} else {
					action = "Write";
				}
				
				msg = action + " a Comment on " + target + " : " + feed.title;

			} else if (feed.verb=="PostPage") {
				msg = "Write a Post" + feed.title;
			} else {
				msg = feed.title;
			}

			return msg;
		},

		update: function (user) {
			logger.log.debug("UserFeedList.update - user",user);
			this.v_type = "user";
			this.setUser(user);
            this.loadFeeds();
		},

		updateMine: function (user) {
			logger.log.debug("UserFeedList.updateMine - user",user);
			this.v_type = "mine";
			this.setUser(user);
            this.loadMyFeeds();
		},

		setUser(user) {
            logger.log.debug("setUser",user);
            this.v_user = user;
        },

		loadFeeds: function () {
			
			logger.log.debug("UserFeedList.loadFeeds");
			if (CommonFunc.isEmptyObject(this.v_user.id)) {
				return;
			}

			const _this = this;
			this.v_feeds.load(this.v_user.id,this.v_user.username,this.v_pagination.limit,this.v_pagination.uuid).then(response=>{
				_this.g_data = response.data;
				_this.$refs.loadMore.setFeedPagination(response.data.next);
				logger.log.debug("UserFeedList.loadFeeds - response",_this.g_data);
			}).catch(err=>{
				logger.log.error("UserFeedList.loadFeeds - err",err);
			});
		
		},


		loadMyFeeds: function () {
			
			logger.log.debug("UserFeedList.loadMyFeeds : v_user=",this.v_user);
			if (CommonFunc.isEmptyObject(this.v_user.id)) {
				return;
			}

			const _this = this;
			this.v_feeds.loadMine(this.v_user.id,this.v_user.username,this.v_pagination.offset,this.v_pagination.limit,this.v_pagination.uuid).then(response=>{
				_this.g_data = response.data;
				logger.log.debug("UserFeedList.loadMyFeeds - response",_this.g_data);
				_this.$refs.loadMore.setFeedPagination(response.data.next);
				
			}).catch(err=>{
				logger.log.error("UserFeedList.loadMyFeeds - err",err);
			});

		},

		onClickFeed: function (feed) {
			logger.log.debug("onClickFeed : feed = ", feed);			
			//return;
			
			if (feed.verb=="PostPage") {
                CommonFunc.navBlogDetail(this,feed.id);
			} else if (feed.verb=="PostPageVote") {
				CommonFunc.navBlogDetail(this,feed.parent_id);
			} else if (feed.verb=="Review") {
				CommonFunc.navReview(this,feed.category,feed.id);
			} else if (feed.verb=="ReviewVote") {
				CommonFunc.navReview(this,feed.category,feed.id);
			} else if (feed.verb=="QuestionPage") {
				CommonFunc.navQADetail(this,feed.id);
			} else if (feed.verb=="AnswerVote") {
				CommonFunc.navQADetail(this,feed.question_id);

			} else if (feed.verb=="CustomComment") {

				if (feed.parent=="portfolio.portfolio") {
					CommonFunc.navPortfolio(this,feed.owner,feed.parent_id);
				} else {
					CommonFunc.navBlogDetail(this,feed.parent_id);
				}
				
			} else if (feed.verb=="AnswerPage") {
				CommonFunc.navQADetail(this,feed.question_id);
			} else if (feed.verb=="AnswerComment") {
				CommonFunc.navQADetail(this,feed.question_id);
			} else if (feed.verb=="AnswerCommentVote") {
				CommonFunc.navQADetail(this,feed.question_id);
			} else if (feed.verb=="QuestionComment") {
				CommonFunc.navQADetail(this,feed.parent_id);
			} else if (feed.verb=="QuestionCommentVote") {
				CommonFunc.navQADetail(this,feed.question_id);
			} else if (feed.verb=="PortfolioVote") {
				CommonFunc.navPortfolio(this,feed.owner,feed.parent_id);
			} else if (feed.verb=="PortfolioItem") {
				CommonFunc.navPortfolio(this,feed.owner,feed.parent_id);
			}

			return;
			
		},

		onClickLoadMore: function() {
			logger.log.debug("onClickLoadMore : next_url = ", this.$refs.loadMore.v_next);

			this.v_pagination.uuid = this.$refs.loadMore.v_next.uuid;
			this.v_pagination.limit = this.$refs.loadMore.v_next.limit;
			this.v_maxLength = 9999999;

			if (this.v_user=="user") {
				this.loadFeeds();
			} else {
				this.loadMyFeeds();
			}
			
		},

		onClickMoreFeed: function() {
			logger.log.debug("BlogList.onClickMoreFeed : 1");
			
            CommonFunc.navFeeds(this);
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