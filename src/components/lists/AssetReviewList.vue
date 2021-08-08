<template>

    <div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreReview"></CTitle>

<!--
        <div>
            <span>Review Count : {{v_reviews_count}}</span>
        </div>
-->

        <q-skeleton v-if="!v_list_loaded" height="150px" square animation="pulse-x" />
        <div v-show="v_list_loaded"> 
            <div>
                <q-list separator class="rounded-borders">

                    <q-item 
                        clickable class="q-pa-sm"
                        :key="index"
                        v-for="(a_review,index) in v_reviews.items" 
                        v-if="index<v_max_length"
                    >
                        <q-item-section class="reviewAvatar" avatar top>
                            <WAvatar :avatar="a_review.user.avatar_thumb" :username="a_review.user.username" />
                        </q-item-section>

                        <q-item-section top>
                            <q-item-label>
                                <div class="row">
        <!--
                                    <div class="displayName q-px-md q-py-xs" :style="v_rating_color(a_review)">
                                        <span class="gUserNameSM text-white"> {{a_review.user.display_name}}</span>
                                        &nbsp;<q-icon class="q-ml-xs text-white vertical-top" 
                                            style="font-size: 1.5em;" 
                                            :name="v_icon_name(a_review.average_rating)" />
                                    </div>
        -->

                                    <div class="q-py-xs">
                                        <span class="gUserNameSM"> {{a_review.user.display_name}}</span>
                                    </div>

                                    <q-space />
                                    <div>
                                        <WCommandBar :data="a_review" :isOwner="a_review.is_owner" 
                                            updateBtn="" deleteBtn="delete" 
                                            @onClickUpdate="onClickEdit" 
                                            @onClickDelete="onClickDelete" 
                                        />
                                    </div>

                                </div>

                            </q-item-label>
                                            
                            <q-item-label>

                                <WSubinfo 
                                    :pub_date="a_review.creation_date" 
                                    like_count="-1" dislike_count="-1" read_count="-1" />
                            
                            </q-item-label>  
                            <q-item-label>
                                <q-rating
                                    v-model="a_review.average_rating"
                                    name="quality"
                                    max="5" readonly
                                    size="1.3em" color="red-5"
                                    icon="star_outline" icon-selected="star" icon-half="star_half"
                                    no-dimming style="padding-left:-5px;"
                            />
                            </q-item-label>

                            <q-item-label class="q-py-md">
                                <div v-html="a_review.content" class="gCommentMD"></div>
                            </q-item-label>
                        
                            <q-item-label>
                                
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
        <!--
                <div ref="reviewContainer">
                    <AssetReviewForm ref="reviewEditor" 
                        :category="category" :assetId="assetId"
                        @onClickReviewSave="onClickReviewSave" 
                    /> 
                </div>
        -->
            </div>

			<div v-if="(! v_reviews) || (v_reviews.items.length==0)" class="q-py-lg">
				<div class="gNoListTitle"> {{ $t('name.no_review') }} </div>
				<div class="gNoListMessage"> {{ $t('name.no_review_desc') }} </div>
			</div>

        </div>
    </div>  
  
</template>


<script>
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
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
        assetId: {
            required: true,
            type: Number,
            default:-1
        },
    },

    computed: {
        v_rating_color() {
            return (review) => {
                //logger.log.debug("review=",review.average_rating);
                if (review.average_rating==1) {
                    return "background-color:#ff0000;"
                }
                return "background-color:#0000ff;"
            }
        },
        v_icon_name() {
            return (value) => {
                //logger.log.debug("review=",review.average_rating);
                if (value==1) {
                    return "arrow_circle_up";
                }
                return "arrow_circle_down";
            }
        }
    },

    data () {
        return {
            v_list_loaded: false,
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
        //logger.log.debug("AssetReviewList.mounted : reviewEditor=",this.$refs.reviewEditor);
        //this.$refs.reviewEditor.hide();
    },
    beforeDestroy: function() {
        logger.log.debug("AssetReviewList.beforeDestroy");
    },
    methods: {
        update(dic_param) {                        
            const _this = this;            

            this.v_reviews.load(dic_param).then( response => {
                logger.log.debug("assetReviewList.update : response=",response.data);
                _this.$refs.loadMore.setPageParameter(response.data);
                _this.v_reviews_count = response.data.count;                
                _this.g_data = response.data;
                _this.v_list_loaded = true;
            }).catch(err=>{
                logger.log.error("assetReviewList.update : err=",err);
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



        onClickRating(dicParam) {
            logger.log.debug('AssetReviewList.onClickRating : dicParam = ',dicParam);
            
            let review = dicParam.data;
            review.value = -1;
            if (dicParam.value=="like") {
                review.value = 1;
            }

            const _this = this;
            review.vote().then(response => {
                logger.log.debug('onClickReviewRating - ',response);
                dicParam._this.setColor(dicParam.value);
                //CommonFunc.showOkMessage(_this,"Review voted");
            }).catch( err => {
                CommonFunc.showErrorMessage(_this,"Review voting error");
            });

            //this.$emit("onClickRating",review);
        },

        onClickAsset(asset) {
          logger.log.debug('onClickBlog : asset = ',asset);
          
          let dic_param = { name:'asset', path:'asset', params:{ symbol:asset } };          
          this.$emit("onClickAsset",dic_param);          
        },

        onClickLoadMore() {
            logger.log.debug('AssetReviewList.onClickLoadMore');
            this.$emit("onClickLoadmore",{});

            let dic_param = {'category':this.symbol, 'object_id':this.assetId};
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
            NavFunc.navReview(this,this.category,this.assetId);
        }
    }
}
</script>


<style scope>
.displayName {
    border: none;
    border-radius: 5px;
}

.reviewAvatar {     
    margin-top:-3px;    
 }

.ReviewBox {
    border-bottom:1px solid #cccccc;
    padding: 15px 0px 0px 0px;
}

</style>

