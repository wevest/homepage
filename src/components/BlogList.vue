<template>
	<div>
		<q-list separator class="rounded-borders">
			<q-item 
				class="gBlogTitleBox"
				clickable
				v-ripple
				v-for="(a_post, index) in v_posts.items"
				:key="index"
				@click.stop="onClickBlog(a_post.id)"
			>
				<q-item-section avatar top>
					<WAvatar :avatar="a_post.api_owner.avatar_thumb" :username="a_post.api_owner.username" />
				</q-item-section>
				<q-item-section top>
					<q-item-label lines="1">
						<span class="gBlogTitle">{{ a_post.title }}</span>
					</q-item-label>
					<q-item-label lines="1">
						<span class="gBlogUser">{{a_post.api_owner.username}}</span>&nbsp;
						<span class="gBlogDatetime">{{ v_updated_at(a_post.pub_date) }}</span>
					</q-item-label>
				</q-item-section>
				<!--
                <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs"></div>
                </q-item-section>
-->
			</q-item>
		</q-list>
	</div>
</template>


<script>
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import WAvatar from "src/components/WAvatar";

import { PostPageModel, PostPageListModel } from "src/models/PageModel";



export default {
	components: {
		WAvatar
	},
    computed: {
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        },
    },

	data() {
		return {
			v_tab: "upbit",
			g_data: null,
			g_exchange: null,
			g_sector: null,

			v_posts: new PostPageListModel(),
		};
	},

	methods: {
		loadBlogData: function (param) {
			const _this = this;

			this.v_posts
				.load(param)
				.then((response) => {
					_this.g_data = response.data;
					logger.log.debug(
						"BlogList.loadBlogData - response",
						_this.g_data
					);
				})
				.catch((err) => {});
		},


		update: function () {
			let dic_param = {
				user_id: null,
				category: null,
				content_type: null,
			};
			this.loadBlogData(dic_param);
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
			this.$emit("onClickBlog",{page_id:page_id});
		},
	},
};
</script>


<style lang="sass">
</style>
<style scope>
.news-title {
	font-size: 18px;
	color: #000000;
}

.news-date {
	font-size: 10px;
	color: #888888;
}
</style>