<template>
    <q-dialog v-model="v_show">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <q-header class="bg-primary">
          <q-toolbar>
            <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
            <q-toolbar-title>Header</q-toolbar-title>
            <q-btn flat @click="drawerR = !drawerR" round dense icon="menu" />
            <q-btn flat v-close-popup round dense icon="close" />
          </q-toolbar>
        </q-header>

        <q-footer class="bg-black text-white">
          <q-toolbar inset>
            <q-toolbar-title>Footer</q-toolbar-title>
          </q-toolbar>
        </q-footer>

        <q-drawer bordered v-model="drawer" :width="200" :breakpoint="600" content-class="bg-grey-3 q-pa-sm">
          <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
        </q-drawer>

        <q-drawer side="right" bordered v-model="drawerR" :width="200" :breakpoint="300" content-class="bg-grey-3 q-pa-sm">
          <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
        </q-drawer>

        <q-page-container>
          <q-page padding>
            <p v-for="n in contentSize" :key="n">
              {{ lorem }}
            </p>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>        
</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import CMSAPI from 'src/services/cmsService';
import logger from "src/error/Logger";


export default {
    computed: {
        contentSize () {
            return this.moreContent ? 150 : 5
        }
    },

    data () {
        return {
            v_tab: 'upbit',
            g_data: null,
            g_exchange: null,
            g_sector: null,

            v_show: false,

            moreContent: true,
            drawer: false,
            drawerR: false,
            lorem: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus, ratione eum minus fuga, quasi',
        }
    },

    methods: {
        show: function() {
            this.v_show = true;
        },

        close: function() {
            this.v_show = false;
        },

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
