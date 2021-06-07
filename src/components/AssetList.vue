<template>

    <div>

        <q-list bordered class="rounded-borders">

            <q-item clickable v-for="(a_post,index) in v_posts" :key="index" @click.stop="onClickAsset(a_post.title)">
                <q-item-section avatar top>
                    <q-icon name="account_tree" color="black" size="34px" />
                </q-item-section>
                <q-item-section top>
                    <q-item-label lines="1">
                        <span 
                        class="text-weight-medium news-title">{{a_post.title}}</span>
                    </q-item-label>
                    <q-item-label lines="1">
                        <span class="cursor-pointer news-date">{{a_post.last_published_at}}</span>
                    </q-item-label>
                </q-item-section>

                <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                    </div>
                </q-item-section>
            </q-item>

        </q-list>

  </div>  
  
</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import CMSAPI from 'src/services/cmsService';
import logger from "src/error/Logger";


export default {
    data () {
      return {
        g_data: null,
        g_exchange: null,
        g_sector: null,

        v_posts: [],
      }
    },

    methods: {

        loadAssetPage: function() {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                let dic_param = {};
                logger.log.debug("AssetList.loadAssetPage - dic_param=",dic_param);

                CMSAPI.getAssetPage(dic_param,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("AssetList.loadAssetPage - response",_this.g_data);
                    _this.updateAssetPage(_this.g_data.results);
                    resolve();
                },function(err) {
                    logger.log.error("AssetList.loadAssetPage - error",err);
                    reject();
                });
            });            
        },
        

        updateAssetPage:function(posts) {
            logger.log.debug("updateAssetPage=",posts);

            let v_posts = [];
            for (let index=0; index<posts.length;index++) {
                let a_post = {id:posts[index].id, slug:posts[index].slug, 
                    title:posts[index].title, last_published_at:posts[index].last_published_at
                };
                v_posts.push(a_post);
            }

            this.v_posts = v_posts;
        },

        showReportList: function(exchange,sector,category) {
            const table_items = this.getReportList(this.g_data,exchange,sector,category);
            console.log('showReportList : result = ',table_items);
            this.items = table_items;
        },

        update: function() {
            this.loadAssetPage();
        },


        onClickAsset: function(asset) {
          logger.log.debug('onClickBlog : asset = ',asset);
          
          let dic_param = { name:'asset', path:'asset', params:{ symbol:asset } };          
          this.$emit("onClickAsset",dic_param);          
        },

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
</style>