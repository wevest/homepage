<template>

    <div>

        <q-list separator class="rounded-borders">

            <q-item clickable v-ripple v-for="(a_post,index) in v_posts.items" :key="index" 
                @click.stop="onClickAsset(a_post)"
            >
                <q-item-section avatar top>
                    <q-icon class="gBlogAvatar" name="paid" color="black" size="34px" />
                </q-item-section>

                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="gBlogTitle">{{a_post.title}}</span>
                    </q-item-label>
                    <q-item-label lines="1">
                        <span class="gBlogDatetime">{{a_post.slug}}</span>
                    </q-item-label>
                </q-item-section>

            </q-item>

        </q-list>

  </div>  
  
</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import CMSAPI from 'src/services/cmsService';
import logger from "src/error/Logger";

import { AssetPageListModel } from "src/models/PageModel";


export default {
    data () {
      return {
        g_data: null,
        g_exchange: null,
        g_sector: null,

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
          
          let dic_param = { name:'asset', path:'asset', params:{ symbol:post.title, id:post.id } };          
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