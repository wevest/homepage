<template>

    <div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreReview"></CTitle>

<!--
        <div>
            <span>Review Count : {{v_reviews_count}}</span>
        </div>
-->

        <q-list separator class="rounded-borders">

            <q-item 
                clickable class="q-pa-sm"
                :key="index"
                v-for="(a_review,index) in v_reviews.items" 
                v-if="index<v_max_length"
            >
                <q-item-section class="q-pl-sm reviewAvatar" avatar top>
                    <WAvatar :avatar="a_review.user.avatar_thumb" :username="a_review.user.username" />                    
                </q-item-section>

                <q-item-section top>
                    <q-item-label>
                        <div class="row">
                            <div>
                                <span class="gUserNameSM"> {{a_review.user.username}}</span>
                            </div>
                            <q-space />
                            <div>
                                <WCommandBar :data="a_review" :isOwner="a_review.is_owner" 
                                    updateBtn="update" deleteBtn="delete" 
                                    @onClickUpdate="onClickEdit" 
                                    @onClickDelete="onClickDelete" 
                                />
                            </div>
                        </div>

                    </q-item-label>
                                    
                    <q-item-label>

                        <WSubinfo 
                            :pub_date="a_review.creation_date" :rating="a_review.average_rating"
                            like_count="-1" dislike_count="-1" read_count="-1" />
                    
                    </q-item-label>  
                
                    <q-item-label class="q-pt-sm">
                        <p class="gCommentMD">
                            {{a_review.content}}                                
                        </p>
                    </q-item-label>
                
                    <q-item-label class="text-right q-pb-xs">
                        
                        <WRatingSmallButton ref="ratingButton" 
                            :data="a_review" :likeCount="a_review.like_count" :dislikeCount="a_review.dislike_count" 
                            @onClickRating="onClickRating" />

                    </q-item-label>

                    <q-item-label>
                        <div :ref="'editorContainer'+a_review.id" :id="'editorContainer'+a_review.id"></div>
                    </q-item-label>
                </q-item-section>
                                
            </q-item>

        </q-list>

        <LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />

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

import CTitle from 'components/CTitle';
import WAvatar from "components/WAvatar.vue";
import WSubinfo from 'components/WSubinfo';
import WCommandBar from "components/WCommandBar.vue";
import LoadMore from "src/components/LoadMore";
import WRatingSmallButton from 'components/WRatingSmallButton';
import AssetReviewForm from 'src/pages/assetreview/component/AssetReviewForm';


import { AssetReviewPageModel, AssetReviewPageListModel } from "src/models/PageModel";

export default {
    components: {
        CTitle,
        WAvatar,
        WSubinfo,
        WCommandBar,
        LoadMore,
        WRatingSmallButton,
        AssetReviewForm
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

    computed: {},

    data () {
        return {
            g_data: null,        

            v_title: this.title,
            v_max_length: this.maxLength,
            v_more_caption: this.moreCaption,

            v_reviews: new AssetReviewPageListModel(),
            v_reviews_count: 0,
            v_visible_loadmore: false,
            v_selected_review: null,

            v_show_editor: true,
        }
    },
    mounted: function() {
        logger.log.debug("AssetReviewList.mounted : reviewEditor=",this.$refs.reviewEditor);

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
                _this.$refs.loadMore.setPageParameter(response.data.next);
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
            this.$refs.reviewEditor.hide();
        },



        onClickRating: function(dicParam) {
            logger.log.debug('onClickRating : dicParam = ',dicParam);
            
            let review = dicParam.data;
            review.value = -1;
            if (dicParam.value=="like") {
                review.value = 1;
            }

            const _this = this;
            review.vote().then(response => {
                logger.log.debug('onClickReviewRating - ',response);
                CommonFunc.showOkMessage(_this,"Review voted");
            }).catch( err => {

            });

            //this.$emit("onClickRating",review);
        },

        onClickAsset: function(asset) {
          logger.log.debug('onClickBlog : asset = ',asset);
          
          let dic_param = { name:'asset', path:'asset', params:{ symbol:asset } };          
          this.$emit("onClickAsset",dic_param);          
        },

        onClickLoadMore: function() {
            logger.log.debug('AssetReviewList.onClickLoadMore');
            this.$emit("onClickLoadmore",{});

            let dic_param = {'category':this.symbol, 'object_id':this.objectId};
			dic_param.limit = this.$refs.loadMore.v_next.limit;
			dic_param.offset = this.$refs.loadMore.v_next.offset;
			this.update(dic_param);
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
                    _this.removeEditor();
                    _this.$emit("onClickDeleteReview",review);                        
                    CommonFunc.showOkMessage(_this,'Review post deleted');
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

        onClickMoreReview: function() {
            logger.log.debug('AssetReviewList.onClickMoreReview');

            store.getters.nav.add(this.$route);
            CommonFunc.navReview(this,this.category,this.objectId);
        }
    }
}
</script>


<style scope>
.reviewAvatar {     
    margin-top:-6px;    
 }

.ReviewBox {
    border-bottom:1px solid #cccccc;
    padding: 15px 0px 0px 0px;
}

</style>

