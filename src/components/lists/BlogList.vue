<template>
	<div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreBlog"></CTitle>

		<q-skeleton v-if="!v_list_loaded" height="150px" square animation="pulse-x" />                    
		<div v-show="v_list_loaded">
			<div>
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
									:username="a_post.api_owner.display_name ? a_post.api_owner.display_name:a_post.api_owner.username" 
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

			<div v-if="(! v_posts) || (v_posts.items.length==0)" class="q-pb-lg">
				<div class="gNoListTitle"> {{ $t('name.no_blogpost') }} </div>
				<div class="gNoListMessage"> {{ $t('name.no_blogpost_desc') }} </div>
			</div>

		</div>

	</div>
</template>

<script>
import { store } from 'src/store/store';
import { Config } from 'src/data/Config';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import WAvatar from "src/components/w/WAvatar";
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
		},
		tab: {
			default:''
		},
		updateType: {
			default:"0"
		}
    },
    computed: {
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,Config.setting.maxTitleLength);
            };
        }
    },

	data() {
		return {
			g_data: null,
			
			v_list_loaded: false,
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
    created() {
        logger.log.debug("BlogList.created");
    },
    mounted() {
        logger.log.debug("BlogList.mounted");
    },
	methods: {
		loadBlogData(param) {
			const _this = this;

			this.v_posts.load(param).then((response) => {
				_this.g_data = response.data;
				_this.$refs.loadMore.setPageParameter(response.data);
				logger.log.debug("BlogList.loadBlogData - response",_this.g_data);

				_this.v_list_loaded = true;
			})
			.catch((err) => {

			});
		},
		clear() {
			this.v_posts.clear();
		},

		update() {
			this.v_query.user_id = null;
			this.v_query.category = null;
			this.v_query.content_type= null;	

			this.loadBlogData(this.v_query);
		},

		updateByContentType(content_type) {
			this.v_query.user_id = null;
			this.v_query.category = null;
			this.v_query.content_type = content_type;
			this.v_query.asset_id = null;

			this.loadBlogData(this.v_query);
		},

		updateByCategory(category) {
			let dic_param = {
				user_id: null,
				category: category,
				content_type: null,
				asset_id: null,
			};
			
			this.v_query.user_id = null;
			this.v_query.category = category;
			this.v_query.content_type = null;
			this.v_query.asset_id = null;
			
			this.loadBlogData(this.v_query);
		},

		updateByAsset(asset_id) {
			this.v_query.user_id = null;
			this.v_query.category = null;
			this.v_query.content_type = null;
			this.v_query.asset_id = asset_id;

			this.loadBlogData(this.v_query);
		},

		updateByUser(user_id) {
			let dic_param = {
				user_id: user_id,
				category: null,
				content_type: null,
				asset_id: null,
			};

			this.v_query.user_id = user_id;
			this.v_query.category = null;
			this.v_query.content_type = null;
			this.v_query.asset_id = null;

			this.loadBlogData(this.v_query);
		},

		addBlog(response) {
			logger.log.debug("BlogList.addBlog : response = ", response);
			this.v_posts.addFirst(response.data);
		},

		deleteBlog(post_id) {
			logger.log.debug("BlogList.deleteBlog : post_id = ", post_id);
			this.v_posts.delete(post_id);
			//this.v_posts.items = this.v_posts.delete(post_id);
		},

		onClickBlog(page_id) {
			logger.log.debug("onClickBlog : page_id = ", page_id);
			NavFunc.navBlogDetail(this,page_id);
			//this.$emit("onClickBlog",{page_id:page_id});
		},

		onClickLoadMore() {
			logger.log.debug("BlogList.onClickLoadMore : next_url = ", this.v_next_url);
			
			this.v_maxLength = 999999;
			this.v_query.limit = this.$refs.loadMore.v_next.limit;
			this.v_query.offset = this.$refs.loadMore.v_next.offset;
/*
			if (this.updateType=="0") {
				this.v_query.user_id = null;
				this.v_query.category = category;
				this.v_query.content_type = null;
				this.v_query.asset_id = null;
			}
*/
			this.loadBlogData(this.v_query);
		},

		onClickMoreBlog() {
			logger.log.debug("BlogList.onClickMoreBlog : 1");			
            NavFunc.navBlog(this,this.category,this.symbol,this.objectId);
		}

	},
};
</script>


<style scope>
.blogAvatar {
	margin-top:-4px;
}
</style>