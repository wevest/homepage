<template>

    <div>

        <q-list bordered class="rounded-borders">

            <q-item clickable v-for="(a_post,index) in v_posts" :key="index" @click.stop="onClickBlog(a_post.id)">
                <q-item-section avatar top>
                    <q-icon name="account_tree" color="black" size="34px" />
                </q-item-section>

                <q-item-section top class="col-2 gt-sm">
                    <q-item-label class="q-mt-sm">{{a_post.title}}</q-item-label>
                </q-item-section>

                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="text-weight-medium">[quasarframework/quasar]</span>
                        <span class="text-grey-8"> - GitHub repository</span>
                    </q-item-label>
                    <q-item-label caption lines="1">
                        @rstoenescu in #3: > Generic type parameter for props
                    </q-item-label>
                    <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                        <span class="cursor-pointer">{{a_post.last_published_at}}</span>
                    </q-item-label>
                </q-item-section>

                <q-item-section top side>
                    <div class="text-grey-8 q-gutter-xs">
                        <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
                        <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
                        <q-btn size="12px" flat dense round icon="more_vert" />
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
        v_tab: 'upbit',
        g_data: null,
        g_exchange: null,
        g_sector: null,

        v_posts: [],
      }
    },

    methods: {

        loadBlogData: function(category) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                let a_today = CommonFunc.getToday(false);
                let dic_param = {category:category};
                logger.log.debug("BlogList.loadBlogData - dic_param=",dic_param);

                CMSAPI.getBlogData(dic_param,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("BlogList.loadBlogData - response",_this.g_data);
                    _this.updateBlogpost(_this.g_data.results);
                    resolve();
                },function(err) {
                    logger.log.error("BlogList.loadBlogData - error",err);
                    reject();
                });
            });            
        },
        

        updateBlogpost:function(posts) {
            logger.log.debug("updateBlogpost=",posts);

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

        update: function(category) {
            this.loadBlogData(category);
        },


        onClickBlog: function(page_id) {
          logger.log.debug('onClickBlog : page_id = ',page_id);
          
          let dic_param = { name:'blog', path:'blog', params:{ page_id:page_id } };
          this.$router.push(dic_param);
        },

    }
}
</script>


<style lang="sass">
</style>