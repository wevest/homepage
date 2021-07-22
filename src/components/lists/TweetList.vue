<template>
	<div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreBlog"></CTitle>

		<q-list separator class="rounded-borders">
			<q-item 
				class="q-pa-sm"
				clickable
				:key="index"
				v-for="(a_tweet, index) in v_tweets.items"
				v-if="index<v_maxLength"
			>
				<q-item-section class="blogAvatar" avatar top>
					<WAvatar :avatar="a_tweet.owner.avatar_thumb" :username="a_tweet.owner.username" />
				</q-item-section>
				<q-item-section top>
					<q-item-label class="no-margin" lines="1" @click.stop="onClickTweet(a_tweet.id)" v-ripple>
						<div class="gUserNameSM">
                            {{a_tweet.owner.display_name}}
                        </div>
                        <WSubinfo 
							:pub_date="a_tweet.created_at" 
							like_count="-1" 
							dislike_count="-1" />

                        <div class="gBodyLG" v-html="a_tweet.text"></div>
                        
					</q-item-label>
                    <q-item-label>
                        <WRatingSmallButton ref="ratingButton" 
                            :data="a_tweet" :likeCount="a_tweet.like_count" :dislikeCount="a_tweet.dislike_count" 
                            @onClickRating="onClickRating" />
                    </q-item-label>

				</q-item-section>

			</q-item>
			<q-separator class="q-mb-md" size="1px" />

		</q-list>

		<LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />

	</div>
</template>

<script>
import { store } from 'src/store/store';
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import { TweetListModel } from "src/models/TweetModel";

import CTitle from 'components/CTitle';
import WAvatar from "src/components/WAvatar";
import WSubinfo from 'components/WSubinfo';
import LoadMore from "src/components/LoadMore";
import WRatingSmallButton from 'components/WRatingSmallButton';



export default {
	components: {
		CTitle,
		WAvatar,
		WSubinfo,
		LoadMore,
        WRatingSmallButton
	},
    props: {
        maxLength: {
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
		category: {
			required:true,
			default: ""
		},
		symbol: {
			required:true,
			default: ""
		},
		assetId: {
			required:true,
			default:-1
		}
    },
    computed: {
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
		
			v_query: {
				user_id: null,
				category: null,
				content_type: null,
			},

			v_tweets: new TweetListModel(),
		};
	},

	methods: {
		loadTweet: function (param) {
			const _this = this;

			this.v_tweets.load(param).then((response) => {
				_this.g_data = response.data;
				_this.$refs.loadMore.setPageParameter(response.data);
				logger.log.debug("TweetList.loadTweet - response",_this.g_data);
			})
			.catch((err) => {

			});
		},


		update: function () {
			this.v_query.user_id = null;
			this.v_query.category = null;
			this.v_query.content_type= null;			
			this.loadBlogData(this.v_query);
		},

		updateByAsset: function (asset_id) {
			let dic_param = {
				asset_id: asset_id,
			};
			this.loadTweet(dic_param);
		},

		updateByCategory: function (category) {
			let dic_param = {
				user_id: null,
				category: category,
				content_type: null,
			};
			this.loadBlogData(dic_param);
		},

		updateByUser: function (user_id) {
			let dic_param = {
				user_id: user_id,
				category: null,
				content_type: null,
			};
			this.loadBlogData(dic_param);
		},

		addBlog:function(response) {
			logger.log.debug("BlogList.addBlog : response = ", response);
			this.v_posts.addFirst(response.data);
		},

		deleteBlog:function(post_id) {
			logger.log.debug("BlogList.deleteBlog : post_id = ", post_id);
			this.v_posts.delete(post_id);
			//this.v_posts.items = this.v_posts.delete(post_id);
		},

		onClickTweet(id) {
			logger.log.debug("onClickTweet : id = ", id);			
			CommonFunc.navTweetDetail(this,id);
			//this.$emit("onClickBlog",{page_id:page_id});
		},

		onClickLoadMore: function() {
			logger.log.debug("BlogList.onClickLoadMore : next_url = ", this.v_next_url);
			
			this.v_maxLength = 999999;
			this.v_query.limit = this.$refs.loadMore.v_next.limit;
			this.v_query.offset = this.$refs.loadMore.v_next.offset;
			this.loadBlogData(this.v_query);
		},

		onClickMoreBlog: function() {
			logger.log.debug("BlogList.onClickMoreBlog : 1");			
            CommonFunc.navBlog(this,this.category,this.symbol,this.objectId);
		},

        onClickRating: function(dicParam) {
            logger.log.debug('AssetReviewList.onClickRating : dicParam = ',dicParam);
            
            let tweet = dicParam.data;
            tweet.value = -1;
            if (dicParam.value=="like") {
                tweet.value = 1;
            }

            let dic_param = { id:tweet.id, value:tweet.value, method: 'vote' };
            const _this = this;
            tweet.vote(dic_param).then(response => {
                logger.log.debug('onClickReviewRating - ',response);
                dicParam._this.setColor(dicParam.value);
                //CommonFunc.showOkMessage(_this,"Review voted");
            }).catch( err => {
                CommonFunc.showErrorMessage(_this,"Tweet voting error");
            });

            //this.$emit("onClickRating",review);
        },        

	},
};
</script>


<style lang="sass">
</style>
<style scope>
.blogAvatar {
	margin-top:-4px;
}

</style>