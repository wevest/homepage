<template>
    
    <div class="q-ma-md">
        		
		<div v-if="v_tweet.owner">
            <div class="boxToolbar">
			    <div class="boxAvatar">
                    <WAvatar :avatar="v_tweet.owner.avatar_thumb" :username="v_tweet.owner.username" />
                </div>
                <div class="q-pa-sm boxToolbarTitle">
					<div class="boxToolbar">

                        <div class="gListTitle boxToolbarTitle">{{ v_tweet.owner.display_name }}</div>
                        <div>
                            <WCommandBar :data="v_tweet" :isOwner="v_is_owner" 
                                shareBtn="" updateBtn="update" deleteBtn="delete" 
                                @onClickUpdate="onClickUpdate" 
                                @onClickDelete="onClickDelete" 
                            />
                        </div>

					</div>

                    <div>

						<WSubinfo 
							:pub_date="v_tweet.created_at" 
							:like_count="v_tweet.like_count" 
							:dislike_count="v_tweet.dislike_count" />

					</div>
				</div>
			</div>			
		</div>

        <q-separator />

        <div class="q-pt-sm gBodyLG" v-html="v_tweet.body"></div>
         
        <WRatingButton ref="ratingButton" :data="v_tweet" :likeCaption="$t('button.blog_like')" :dislikeCaption="$t('button.blog_dislike')" />

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
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import {TweetModel, TweetListModel} from "src/models/TweetModel";

import WAvatar from "src/components/w/WAvatar";
import WSubinfo from 'components/WSubinfo';
import CommentBox from "components/comments/CommentBox.vue";
import CommentList from "components/comments/CommentList.vue";
import WRatingButton from 'components/WRatingButton';
import WCommandBar from "components/WCommandBar.vue";

export default {
    name: 'TweetDetailView',
    components: {
        WAvatar,
        WCommandBar,
        WSubinfo,
        CommentList,
        WRatingButton
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_is_owner() {
            if (this.v_tweet.owner.id==this.v_me.id) {
                return true;
            }
            return false;
        }
    },
    data() {
        return {
            v_content_type:'twitter.tweet',
            v_tweet: new TweetModel(),
        }
    },
    created() {
        this.validateQuery();
    },
    mounted() {
        //console.log("HomeView.mounted - ");
        logger.log.debug("TweetDetailView.mounted - symbol=",this.$route.query);
        this.setTweet(this.$route.query);        
        this.refresh();
    },
    methods: {
        validateQuery() {                        
            if (this.$route.query.hasOwnProperty('id')) {
                if (CommonFunc.isEmptyObject(this.$route.query.id)) {
                    NavFunc.navError404(this);
                }
            }            
            
        },  
        setTweet(query) {
            this.v_tweet.id = query.id;
        },

        loadTweet() {            
            let dicParam = {id: this.v_tweet.id};
            
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


        onClickUpdate() {
            logger.log.debug("TweetDetailView.onClickUpdate : tweet=",this.v_tweet);
            NavFunc.navTweetWriter(this,this.v_tweet.asset.id,this.v_tweet.id,this.v_tweet.body);
        },

        onClickDelete() {                        
            const _this = this;
            //let dic_param = { id:this.v_post.id, token:store.getters.token};
            logger.log.debug('TweetDetailView.onClickDelete');
            
            this.v_tweet.remove().then( response => {
                CommonFunc.showOkMessage(_this,'Tweet deleted');       
                NavFunc.navBack(_this);
            }).catch(err=>{
                CommonFunc.showErrorMessage(_this,err.data.msg);
            });

        },

        onClickDeleteComment() {
            logger.log.debug("TweetDetailView.loadTweet");
        }
    }
};

</script>



<style scoped>

.boxToolbar {
    display:flex;
}

.boxToolbarTitle {
    flex:1 auto;
}

.boxAvatar {
    width:50px;
}

</style>