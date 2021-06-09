<template>

    <div>

        <q-list bordered class="rounded-borders">

            <q-item class="boxItemList" clickable v-for="(a_question,index) in v_questions" :key="index">
                <q-item-section avatar top>
                    <q-icon name="account_tree" color="black" size="34px" />
                </q-item-section>
                <q-item-section top>
                    <q-item-label lines="1">
                        <span class="text-weight-medium news-title">{{a_question.user.username}}</span>
                    </q-item-label>
                    <q-item-label>
                        <span class="cursor-pointer news-date">{{a_question.pub_date}}</span>
                    </q-item-label>                        

                    <q-item-label @click="onClickQuestion(a_question)">
                        <span class="cursor-pointer"> {{a_question.reward}} {{a_question.title}} </span>
                        <div v-html="a_question.content">  </div>
                    </q-item-label>

                    <q-item-label>
                            
                        <span class="boxReviewBtn"> <q-btn label="like" @click="onClickRating(1,a_question)" />  {{a_question.like_count}}</span>
                        <span class="boxReviewBtn">{{a_question.dislike_count}} <q-btn label="dislike" @click="onClickRating(-1,a_question)" /> </span>
                        
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

        v_questions: [],
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
        

        updateAssetQuestion:function(questions) {
            logger.log.debug("updateAssetQuestion=",questions);

            let v_questions = [];
            for (let index=0; index<questions.length;index++) {
                let a_question = {
                    id:questions[index].id, 
                    title:questions[index].title,
                    pub_date:questions[index].pub_date,
                    content: questions[index].description,
                    user: questions[index].api_owner,
                    parent_id: questions[index].parent_id,
                    closed: questions[index].closed,
                    like_count: questions[index].like_count,
                    dislike_count: questions[index].dislike_count,
                    comment_count: questions[index].comment_count,
                    reward: questions[index].reward,
                };
                v_questions.push(a_question);
            }

            this.v_questions = v_questions;
        },

        update: function(json_data) {
            this.g_data = json_data;
                        
            if (this.g_data.next) {
                this.v_visible_loadmore = true;
            } else {
                this.v_visible_loadmore = false;
            }

            this.updateAssetQuestion(json_data.results);
        },

        onClickRating: function(value,json_question) {
            logger.log.debug('onClickRating : json_question = ',json_question);
            //let dic_param = {'rtype':rtype, 'obj':json_review};
            json_question.value = value;
            this.$emit("onClickQuestionRating",json_question);
        },

        onClickAsset: function(asset) {
          logger.log.debug('onClickBlog : asset = ',asset);
          
          let dic_param = { name:'asset', path:'asset', params:{ symbol:asset } };          
          this.$emit("onClickAsset",dic_param);          
        },

        onClickQuestion: function(jsonObject) {
            logger.log.debug('onClickQuestion - ',jsonObject);
            this.$emit("onClickQuestion",jsonObject);          
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