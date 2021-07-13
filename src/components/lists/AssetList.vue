<template>

    <div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreAsset"></CTitle>

        <q-list separator class="rounded-borders">

            <q-item clickable v-ripple 
                v-for="(a_post,index) in v_posts.items" :key="index" 
                v-if="index<v_maxLength"
                @click.stop="onClickAsset(a_post)">
                <q-item-section avatar top>
                    <q-icon class="gBlogAvatar" name="paid" color="black" size="55px" />
                </q-item-section>

                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="gListTitle">{{a_post.title}}</span>
                    </q-item-label>
                    <q-item-label lines="1">
                        <span class="gCaption">{{a_post.slug}}</span>
                    </q-item-label>
                </q-item-section>

            </q-item>

        </q-list>

  </div>  
  
</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import { AssetPageListModel } from "src/models/PageModel";


export default {
	components: {
		CTitle,
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
		}
    },

    data () {
        return {
            g_data: null,

            v_title: this.title,
            v_maxLength: this.maxLength,
            v_more_caption: this.moreCaption,								

            v_posts: new AssetPageListModel(),
        }
    },

    methods: {


        update: function() {
            
            this.v_posts.load().then(response=>{
                logger.log.debug("AssetList.update : response=",response);

            }).catch(err=>{

            });

        },

        onClickAsset: function(post) {
          logger.log.debug('onClickBlog : asset = ',post);
          
          let dic_param = { name:'asset', path:'asset', query:{ symbol:post.title, id:post.id } };          
          store.getters.nav.add(this.$route);
          this.$router.push(dic_param);          
        },

        onClickMoreAsset: function() {
            logger.log.debug('AssetList.onClickMoreAsset');
        }
    }
}
</script>


<style lang="sass">
</style>
<style scope>
.news-title {
    font-size:18px;
    color:#000000;
}

.news-date {
    font-size:10px;
    color:#888888;
}

.gBlogAvatar {
    margin:-3px 0px 0px -3px;
}
</style>