<template>

    <div>

        <q-table
            row-key="name"       
            hide-header 
            :data="v_questions"
            :columns="v_questions_header"
            :rows-per-page-options="[50]"        
        >

            <template v-slot:body="props">
                <q-tr :props="props" >
                    <q-td key="avatar" :props="props" class="gBlogAvatar">                        
                        <q-img :src="props.row.avatar_thumb" v-if="props.row.avatar_thumb.length>0" />
                        <q-icon v-else name="person" size="50px" />
                    </q-td>

                    <q-td key="detail" :props="props" class="caption_color">
                        <div @click="onClickQuestion(props.row)">
                            <q-badge color="purple-4" text-color="white">
                                <span>{{props.row.reward}}</span>
                            </q-badge>
                            <span class="gBlogTitle">&nbsp;{{props.row.title}}</span>
                        </div>
                        <div class="row">
                            <div>                                
                                <span class="gBlogUser">
                                    {{props.row.username}}
                                </span> &nbsp;
                                <span class="gBlogDatetime">
                                    {{props.row.pub_date}}
                                </span>
                            </div>
                            <q-space />
                            <div class="boxReviewBtn">
                                <span> 
                                    <q-btn dense class="gBlogRatingBtn" flat icon="thumb_up" @click="onClickRating(1,props.row)" />
                                </span> 
                                <span> {{props.row.like_count}}</span>
                                <span>
                                    <q-btn flat dense class="gBlogRatingBtn" icon="thumb_down" @click="onClickRating(-1,props.row)" />
                                </span>
                                <span> {{props.row.dislike_count}}</span>    
                            </div>
                        </div>                        
                    </q-td>
                </q-tr>
            </template>
        </q-table>

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
        v_questions_header: [
            { name:'avatar', label: this.$t('name.name'), align:'left', field: 'avatar' },
            { name:'detail', label: this.$t('name.detail'), field: 'detail' },
/*            
            { name:'reward', label: this.$t('name.reward'), sortable:true,  field: 'reward' ,
              format: (val, row) => `${Number(val).toLocaleString()}`, 
            },
            { name:'title', label: this.$t('name.title'), sortable:true, field: 'title',},
            { name:'pub_date', label: this.$t('name.homepage'), align:'left', field: 'pub_date'},
            { name:'username', label: this.$t('name.username'), align:'left', field: 'username'},
*/            
        ],

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
                    pub_date: CommonFunc.minifyDatetime(questions[index].pub_date),
                    content: questions[index].description,
                    userid: questions[index].api_owner.id,
                    username: questions[index].api_owner.username,
                    avatar_thumb: questions[index].api_owner.avatar_thumb,
                    parent_id: questions[index].parent_id,
                    closed: questions[index].closed,
                    like_count: questions[index].like_count,
                    dislike_count: questions[index].dislike_count,
                    comment_count: questions[index].comment_count,
                    reward: questions[index].reward,
                };
                v_questions.push(a_question);
            }

            logger.log.debug("updateAssetQuestion : v_questions=",v_questions);
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
    font-size:10px;
}

.boxReviewBtn span {
    padding-left:3px;
}

</style>