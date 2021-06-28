<template>

    <div>
        <div>
            <span>Review Count : {{v_reviews_count}}</span>
        </div>

        <q-list separator class="rounded-borders">

            <q-item class="ReviewBox" clickable v-for="(a_review,index) in v_reviews.items" :key="index">
                <q-item-section avatar top>
                    <WAvatar :avatar="a_review.user.avatar_thumb" :username="a_review.user.username" />
                </q-item-section>

                <q-item-section top>
                    <q-item-label>
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
                
                    <q-item-label>
                        <p class="ReviewText">
                            {{a_review.content}}                                
                        </p>
                    </q-item-label>
                
                    <q-item-label class="q-pa-md ReviewRatingBox">

                        <q-btn flat label="edit" @click="onClickEdit(a_review)" v-if="a_review.is_owner" />
                        <q-btn flat label="delete" @click="onClickDelete(a_review)" v-if="a_review.is_owner" />

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

                    <q-item-label>
                        <div :ref="'editorContainer'+a_review.id" :id="'editorContainer'+a_review.id"></div>
                    </q-item-label>
                </q-item-section>
                                
            </q-item>

        </q-list>

        <LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />
<!--
        <div v-if="v_visible_loadmore">>
            <q-btn label="load More" @click="onClickLoadMore" />
        </div>
-->

        <div ref="reviewContainer">
            <AssetReviewForm ref="reviewEditor" 
                :category="category" :objectId="objectId"
                @onClickReviewSave="onClickReviewSave" 
            /> 
        </div>



  </div>  
  
</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import CMSAPI from 'src/services/cmsService';
import logger from "src/error/Logger";

import WAvatar from "components/WAvatar.vue";
import LoadMore from "src/components/LoadMore";
import AssetReviewForm from 'src/pages/asset/component/AssetReviewForm';

import { AssetReviewPageModel, AssetReviewPageListModel } from "src/models/PageModel";

export default {
    components: {
        WAvatar,
        LoadMore,
        AssetReviewForm
    },
	props: {
        category: {
            required: true,
            type:String,
            default: ''
        },
        objectId: {
            required: true,
            type: Number,
            default:-1
        },
    },

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
            v_reviews_count: 0,
            v_visible_loadmore: false,
            v_selected_review: null,

            v_show_editor: true,
        }
    },
    mounted: function() {
        logger.log.debug("AssetReviewList.mounted");

        this.$refs.reviewEditor.hide();
    },
    beforeDestroy: function() {
        logger.log.debug("AssetReviewList.beforeDestroy");
    },

    methods: {
        update: function(dic_param) {                        
            const _this = this;            

            this.v_reviews.load(dic_param).then( response => {
                logger.log.debug("assetReviewList.update : response=",response.data);
                _this.v_reviews_count = response.data.count;
                _this.g_data = response.data;
            });

        },

        addReview(reviews) {
            logger.log.debug("assetReviewList.update : reviews=",reviews);
            
            this.v_reviews_count = this.v_reviews_count + 1;
            this.v_reviews.addFirst(reviews);
        },

        removeReview(review) {
            logger.log.debug("assetReviewList.removeReview : review=",review);
            
            if (this.v_reviews_count>0) {
                this.v_reviews_count = this.v_reviews_count - 1;
            }            
            this.v_reviews.delete(review.id);
        },

        appendEditor(review) {
            const target = "editorContainer"+review.id;
            const container = this.$refs[target][0];

            logger.log.debug("appendEditor : target=",target,container,this.$refs.reviewEditor);

            this.$refs.reviewEditor.show();
            this.$refs.reviewEditor.setReview(review);

            if (!container.contains(this.$refs['reviewContainer'])) {                
                logger.log.debug("appendEditor : 1");    

                container.appendChild(this.$refs.reviewContainer);
                logger.log.debug("appendEditor : 2");

                //this.v_show_editor = true;
            } else {
                logger.log.debug("appendEditor : 3");
            }
            
        },

        removeEditor() {
            this.v_show_editor = false;
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
        },

        onClickEdit: function(review) {
            logger.log.debug('onClickEdit : review=',review);
            this.v_selected_review = review;
            this.appendEditor(review);
        },

        onClickDelete: function(review) {
            logger.log.debug('onClickDelete : review=',review);

            const _this=this;
            review.remove().then(response=>{
                if (response.data.ret==0) {
                    _this.removeReview(review);
                    CommonFunc.showOkMessage(_this,'Review post deleted');
                    _this.$emit("onClickDeleteReview",review);
                }
            }).catch(err=>{
                CommonFunc.showErrorMessage(_this,'Review delete error');
            });
        },

        onClickReviewSave: function(dic_param) {
            logger.log.debug('AssetReviewList.onClickReviewSave : dic_param=',dic_param);
            
            this.v_selected_review.content = dic_param.review;
            this.v_selected_review.average_rating = dic_param.rating;

            this.$refs.reviewEditor.clear();
            this.$refs.reviewEditor.hide();
            //this.v_show_editor = false;
            //this.$emit("onClickReviewSave",review);
        },

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

