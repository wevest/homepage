<template>
    
    <div class="q-ma-md">
        
		<q-list>
			<q-item class="q-pa-sm" v-if="v_tweet.owner">
				<q-item-section class="blogAvatar" avatar top>
					<WAvatar :avatar="v_tweet.owner.avatar_thumb" :username="v_tweet.owner.username" />
				</q-item-section>
				<q-item-section top>

					<q-item-label lines="1">
						<span class="gListTitle">{{ v_tweet.owner.display_name }}</span>
					</q-item-label>

					<q-item-label class="no-margin" lines="1">

						<WSubinfo 
							:pub_date="v_tweet.created_at" 
							:like_count="v_tweet.like_count" 
							:dislike_count="v_tweet.dislike_count" />

					</q-item-label>
				</q-item-section>

			</q-item>
			<q-separator class="q-mb-md" size="1px" />

		</q-list>


        <div class="gBodyLG" v-html="v_tweet.text"></div>

        <WRatingButton ref="ratingButton" :data="v_tweet" />

        <q-separator class="gSeparator" />
    

        <div class="q-ma-sm" v-if="v_tweet.comments">
<!--            
            <div class="q-my-md"> 
                <span class="gTextSubTitle">Comments : {{v_tweet.comments.items.length}}</span>
            </div>
-->
            <CommentList ref="commentBox" 
                :data="v_tweet" :contentType="v_content_type"
                @onCommentDelete="onClickDeleteComment" />

        </div>

    </div>    

</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import {TweetModel, TweetListModel} from "src/models/TweetModel";

import WAvatar from "src/components/WAvatar";
import WSubinfo from 'components/WSubinfo';
import CommentBox from "components/comments/CommentBox.vue";
import CommentList from "components/comments/CommentList.vue";
import WRatingButton from 'components/WRatingButton';

export default {
    name: 'TweetDetailView',
    components: {
        WAvatar,
        WSubinfo,
        CommentList,
        WRatingButton
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data() {
        return {
            v_content_type:'twitter.tweet',
            v_tweet: new TweetModel(),
        }
    },
    created: function() {
        this.validateQuery();
    },
    mounted: function() {
        //console.log("HomeView.mounted - ");
        console.log("TweetDetailView.mounted - symbol=",this.$route.query);
        this.setTweet(this.$route.query);        
        this.refresh();
    },
    methods: {
        validateQuery() {                        
            if (this.$route.query.hasOwnProperty('id')) {
                if (CommonFunc.isEmptyObject(this.$route.query.id)) {
                    CommonFunc.navError404(this);
                }
            }            
            
        },  
        setTweet(query) {
            this.v_tweet.id = query.id;
        },

        loadTweet() {            
            let dicParam = {tweet_id: this.v_tweet.id};
            
            const _this=this;
            let a_tweet = new TweetListModel();
            a_tweet.load(dicParam).then(response=>{
                logger.log.debug("TweetDetailView.loadTweet : response=",response);

                _this.v_tweet.assign(response.data.results[0]);

            }).catch(err=>{
                logger.log.error("TweetDetailView.loadTweet : err=",err);
            });
        },

        loadComment: function() {
            const _this=this;

            logger.log.debug("TweetDetailView.loadComment : v_tweet=",this.v_tweet);

            this.v_tweet.comments.load(this.v_tweet.id).then( response => {
                logger.log.debug("TweetDetailView.loadComment : response=",response);
                _this.$refs.commentBox.setPageParameter(response);
            });
        },

        refresh() {
            this.loadTweet();
            this.loadComment();
        },



        onClickDeleteComment() {
            logger.log.debug("TweetDetailView.loadTweet");
        }
    }
};

</script>



<style scoped>

</style>