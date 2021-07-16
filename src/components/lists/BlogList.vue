<template>
	<div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreBlog"></CTitle>

		<q-list separator class="rounded-borders">
			<q-item 
				class="q-pa-sm"
				clickable
				v-ripple
				:key="index"
				v-for="(a_post, index) in v_posts.items"
				v-if="index<v_maxLength"
				@click.stop="onClickBlog(a_post.id)"
			>
				<q-item-section class="blogAvatar" avatar top>
					<WAvatar :avatar="a_post.api_owner.avatar_thumb" :username="a_post.api_owner.username" />
				</q-item-section>
				<q-item-section top>
					<q-item-label lines="1">
						<span class="gListTitle">{{ v_shorten(a_post.title) }}</span>
					</q-item-label>
					<q-item-label class="no-margin" lines="1">

						<WSubinfo 
							:username="a_post.api_owner.username" 
							:pub_date="a_post.pub_date" 
							:like_count="a_post.like_count" 
							:dislike_count="a_post.dislike_count" />

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

import CTitle from 'components/CTitle';
import WAvatar from "src/components/WAvatar";
import WSubinfo from 'components/WSubinfo';
import LoadMore from "src/components/LoadMore";
import { PostPageModel, PostPageListModel } from "src/models/PageModel";


export default {
	components: {
		CTitle,
		WAvatar,
		WSubinfo,
		LoadMore
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
		objectId: {
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

			v_posts: new PostPageListModel(),
		};
	},

	methods: {
		loadBlogData: function (param) {
			const _this = this;

			this.v_posts.load(param).then((response) => {
				_this.g_data = response.data;
				_this.$refs.loadMore.setPageParameter(response.data.next);
				logger.log.debug("BlogList.loadBlogData - response",_this.g_data);
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

		updateByContentType: function (content_type) {
			let dic_param = {
				user_id: null,
				category: null,
				content_type: content_type,
			};
			this.loadBlogData(dic_param);
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

		onClickBlog: function (page_id) {
			logger.log.debug("onClickBlog : page_id = ", page_id);			
			CommonFunc.navBlogDetail(this,page_id);
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
		}

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