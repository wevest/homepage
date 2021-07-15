<template>

    <div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreReview"></CTitle>


        <q-list separator class="rounded-borders">

            <q-item 
                clickable class="q-pa-sm"
                :key="index"
                v-for="(a_review,index) in v_reviews.items" 
                v-if="index<v_max_length"
                @click.stop="onClickAsset(a_review)"
            >
                <q-item-section top>
                    
                    <q-item-label lines="1">
                        <q-badge
                            class="RewardPoint q-mr-sm" 
                            color="purple-4"
                            text-color="white">
                            <span>{{v_format(a_review.average_rating)}}</span>
                        </q-badge>

						<span class="gListTitle">{{ a_review.category }}</span>
					</q-item-label>            

                    <q-item-label>

                        <WSubinfo 
                            :pub_date="a_review.updated_at"
                            like_count="-1" dislike_count="-1" read_count="-1" />
                    
                    </q-item-label>  
                
                </q-item-section>
                                
            </q-item>

        </q-list>

        <LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />

  </div>  
  
</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import WAvatar from "components/WAvatar.vue";
import WSubinfo from 'components/WSubinfo';
import WCommandBar from "components/WCommandBar.vue";
import LoadMore from "src/components/LoadMore";
import WRatingSmallButton from 'components/WRatingSmallButton';

import { AssetReviewStatListModel } from "src/models/PageModel";


export default {
    components: {
        CTitle,
        WAvatar,
        WSubinfo,
        WCommandBar,
        LoadMore,
        WRatingSmallButton,
    },
	props: {
        maxLength: {
            default: 20,
        },
		title: {
			type:String,
			default: "Review Stat List"
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
    },

    computed: {
        v_format() {
            return (value) => {
                return CommonFunc.formatNumber(value,1);
            };
        }
    },

    data () {
        return {
            g_data: null,        

            v_title: this.title,
            v_max_length: this.maxLength,
            v_more_caption: this.moreCaption,

            v_reviews: new AssetReviewStatListModel(),
            v_visible_loadmore: false,
            v_selected_review: null,
        }
    },
    mounted: function() {
        logger.log.debug("ReviewStatList.mounted");
    },
    beforeDestroy: function() {
        logger.log.debug("ReviewStatList.beforeDestroy");
    },
    methods: {
        update: function(category) {                        
            const _this = this;            

            this.v_reviews.load(category).then( response => {
                logger.log.debug("ReviewStatList.update : response=",response.data);
                _this.$refs.loadMore.setPageParameter(response.data.next);
                //_this.v_reviews_count = response.data.count;                
                _this.g_data = response.data;
            });

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
            logger.log.debug('onClickAsset : asset = ',asset);          
            CommonFunc.navReview(this,asset.category);     
        },

        onClickLoadMore: function() {
            logger.log.debug('AssetReviewList.onClickLoadMore');
            this.$emit("onClickLoadmore",{});

            let dic_param = {'category':this.symbol, 'object_id':this.objectId};
			dic_param.limit = this.$refs.loadMore.v_next.limit;
			dic_param.offset = this.$refs.loadMore.v_next.offset;
			this.update(dic_param);
        },

        onClickMoreReview: function() {
            logger.log.debug('AssetReviewList.onClickMoreReview');

            //store.getters.nav.add(this.$route);
            CommonFunc.navReview(this,this.category,this.objectId);
        }
    }
}
</script>


<style scope>
.reviewAvatar {     
    margin-top:-3px;    
 }

.ReviewBox {
    border-bottom:1px solid #cccccc;
    padding: 15px 0px 0px 0px;
}

</style>

