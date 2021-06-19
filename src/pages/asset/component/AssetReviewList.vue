<template>

    <div>

        <q-list separator class="rounded-borders">

            <q-item class="ReviewBox" clickable v-for="(a_review,index) in v_reviews.items" :key="index">
                
                <q-item-section avatar top>
                    <q-avatar>
                        <q-img :src="a_review.user.avatar_thumb" v-if="a_review.user.avatar_thumb.length>0" />
                        <q-icon v-else name="person" size="50px" />
                    </q-avatar>
                </q-item-section>

                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="ReviewTitle"> {{a_review.user.username}}</span>
                    </q-item-label>
                    
                 
                    <q-item-label>
                        <q-rating                        
                            dense
                            class="rating-icon" 
                            v-model="a_review.average_rating" 
                            size="1.2em" 
                            icon="star_border" 
                            icon-selected="star" 
                            color="amber-9"
                        />                        
                        <span class="cursor-pointer ReviewDate">{{v_updated_at(a_review.creation_date)}}</span>
                    </q-item-label>  
                    <p class="content">                   
                        <q-item-label>
                            <span class="ReviewText">
                                {{a_review.content}}                                
                            </span>
                        </q-item-label>
                    </p>
                    <div class="float-right">
                    <q-item-label class="q-pa-md ReviewRatingBox float-right">                            
                        <span> 
                            <q-btn class="gCommentRatingBtn"                            
                            icon="thumb_up"                            
                            flat                    
                            @click="onClickRating('like',a_review)" />  
                            <span class="gCommentRatingCount">
                                {{a_review.like_count}}
                            </span>
                        </span>                            
                        <span> 
                            <q-btn class="gCommentRatingBtn"
                            icon="thumb_down"                            
                            flat 
                            @click="onClickRating('dislike',a_review)" /> 
                            <span class="gCommentRatingCount">{{a_review.dislike_count}}
                            </span>
                        </span>                
                    </q-item-label>
                    </div>
    
                </q-item-section>

            </q-item>

        </q-list>

        <div v-if="v_visible_loadmore">>
            <q-btn label="load More" @click="onClickLoadMore" />
        </div>

  </div>  
  
</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import CMSAPI from 'src/services/cmsService';
import logger from "src/error/Logger";

import { AssetReviewPageModel, AssetReviewPageListModel } from "src/models/PageModel";


export default {
    computed: {
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        },
        
    },
    data () {
        return {
            g_data: null,        
            v_reviews: new AssetReviewPageListModel(),
            v_visible_loadmore: false,
        }
    },
    mounted: function() {
        logger.log.debug("AssetReviewList.mounted");
    },
    beforeDestroy: function() {
        logger.log.debug("AssetReviewList.beforeDestroy");
    },

    methods: {

        update: function(dic_param) {                        
            const _this = this;            

            this.v_reviews.load(dic_param).then( response => {
                _this.g_data = response.data;
            });

        },

        addReview(reviews) {
            logger.log.debug("assetReviewList.update : reviews=",reviews);
            this.v_reviews.addFirst(reviews);
        },


        onClickRating: function(rtype,review) {
            logger.log.debug('onClickRating : rtype = ',review);
            
            review.value = -1;
            if (rtype=="like") {
                review.value = 1;
            }
            this.$emit("onClickRating",review);
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
.ReviewTitle {
    font-size:14px;
    color:#111111;
}

.ReviewDate {
    font-size:10px;
    color:#666666;
    margin-left:8px;
}

.ReviewText {
    font-size:16px;
}

.ReviewRatingBox {
     padding:5px 0px;
}


.ReviewBtnBox {     
    color:#222222;
}



.ReviewBox {
    border-bottom:1px solid #cccccc;
    padding: 15px 0px 0px 0px;
}




.cursor-pointer {
    color:#222222;
}


.rating-icon {
    margin-left:0px;
}

.content {
    margin:10px 0px;
}
</style>

