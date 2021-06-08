<template>

    <div>

        <q-list bordered class="rounded-borders">

            <q-item class="boxItemList" clickable v-for="(a_review,index) in v_reviews" :key="index">
                <q-item-section avatar top>
                    <q-icon name="account_tree" color="black" size="34px" />
                </q-item-section>
                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="text-weight-medium news-title">{{a_review.user.username}}</span>
                    </q-item-label>
                    <q-item-label>
                        <q-rating v-model="a_review.rating" size="1.5em" icon="thumb_up" />                        
                        <span class="cursor-pointer news-date">{{a_review.creation_date}}</span>
                    </q-item-label>                        
                    <q-item-label>
                        <span class="cursor-pointer">{{a_review.content}}</span>
                    </q-item-label>
                    <q-item-label>
                            
                        <span class="boxReviewBtn"> <q-btn label="like" @click="onClickRating('like',a_review)" />  {{a_review.like_count}}</span>                            
                        <span class="boxReviewBtn">{{a_review.dislike_count}} <q-btn label="dislike" @click="onClickRating('dislike',a_review)" /> </span>
                        
                    </q-item-label>

                </q-item-section>

            </q-item>

        </q-list>

        <div v-if="v_visible_loadmore">>
            <q-btn label="load More" @click="onClickLoadMore" />
        </div>

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

        v_reviews: [],
        v_visible_loadmore: false,
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
        

        updateAssetReview:function(reviews) {
            logger.log.debug("updateAssetReview=",reviews);

            let v_posts = [];
            for (let index=0; index<reviews.length;index++) {
                let a_post = {
                    id:reviews[index].id, 
                    creation_date:reviews[index].creation_date,
                    rating: reviews[index].average_rating,
                    content: reviews[index].content,
                    user: reviews[index].api_owner,
                    object_id: reviews[index].object_id,
                    content_type_id: reviews[index].content_type_id,
                    like_count: reviews[index].like_count,
                    dislike_count: reviews[index].dislike_count,
                };
                v_posts.push(a_post);
            }

            this.v_reviews = v_posts;
        },

        update: function(json_data) {
            this.g_data = json_data;
                        
            if (this.g_data.next) {
                this.v_visible_loadmore = true;
            } else {
                this.v_visible_loadmore = false;
            }

            this.updateAssetReview(json_data.results);
        },

        onClickRating: function(rtype,json_review) {
            logger.log.debug('onClickRating : rtype = ',json_review);
            let dic_param = {'rtype':rtype, 'obj':json_review};
            this.$emit("onClickRating",dic_param);
        },

        onClickAsset: function(asset) {
          logger.log.debug('onClickBlog : asset = ',asset);
          
          let dic_param = { name:'asset', path:'asset', params:{ symbol:asset } };          
          this.$emit("onClickAsset",dic_param);          
        },

        onClickLoadMore: function() {
            logger.log.debug('onClickLoadMore');
            this.$emit("onClickLoadmore",{});
        }

    }
}
</script>


<style scope>
.news-title {
    font-size:18px;
    color:#000000;
}

.news-date {
    font-size:10px;
    color:#888888;
}

.boxItemList {
    border-bottom:1px solid #cccccc;
    padding: 15px 0px 15px 0px;
}

.boxReviewBtn {
    padding:10px;
}
</style>