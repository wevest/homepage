
<template>
<!-- Blog Question List Page-->
    <div>

        <q-table
            row-key="name"       
            hide-header 
            :data="v_questions.items"
            :columns="v_questions_header"
            :rows-per-page-options="[50]"        
        >

            <template v-slot:body="props">
                <q-tr :props="props" >
                    <q-td class="gBlogAvatar" key="avatar" :props="props">                        
                        <WAvatar :avatar="props.row.owner.avatar_thumb" :username="props.row.owner.username" />
                    </q-td>

                    <q-td key="detail" :props="props" dense class="caption_color gBlogUserDateBox">
                        <div @click="onClickQuestion(props.row)">
                            <q-badge
                                class="RewardPoint" 
                                color="purple-4"
                                text-color="white">
                                <span>{{props.row.reward}}</span>
                            </q-badge>
                            <span class="gBlogTitle">&nbsp;{{props.row.title}}</span>
                        </div>
                        <div class="row">
                            <div>                                
                                <span class="gBlogUser">
                                    {{props.row.owner.username}}
                                </span> &nbsp;
                                <span class="gBlogDatetime">
                                    {{v_updated_at(props.row.pub_date)}}
                                </span>
                            </div>
                            <q-space />
                            <div class="gBlogRatingBox">
                                <span> 
                                    <q-btn 
                                        class="gBlogRatingBtn" 
                                        icon="thumb_up"
                                        dense
                                        flat  
                                        @click="onClickRating(1,props.row)" />
                                </span> 
                                    <span class="gBlogDateTime"> {{props.row.like_count}}</span>&nbsp;
                                <span>
                                    <q-btn 
                                        class="gBlogRatingBtn" 
                                        icon="thumb_down"
                                        dense
                                        flat 
                                        @click="onClickRating(-1,props.row)" />
                                </span>
                                    <span class="gBlogDateTime"> {{props.row.dislike_count}}</span>    
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

import WAvatar from "components/WAvatar.vue";

import { PostPageModel, QuestionPageListModel } from "src/models/PageModel";

export default {
    components: {
        WAvatar,
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

        v_questions: new QuestionPageListModel(),
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

        update: function(dic_param) {
            const _this = this;

            this.v_questions.load(dic_param).then( response => {
                _this.g_data = response;
            }).catch( err=> {

            });
            
        },

        addQuestion:function(response) {
            logger.log.debug('addQuestion : response = ',response);
            this.v_questions.addFirst(response.data);
        },


        onClickRating: function(value,question) {
            logger.log.debug('onClickRating : question = ',question);
            //let dic_param = {'rtype':rtype, 'obj':json_review};
            question.value = value;
            this.$emit("onClickQuestionRating",question);
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
        },

        onClickAvatar: function(username) {
            logger.log.debug('onClickAvatar');
            CommonFunc.navProfile(this,username);
        }

    }
}
</script>


<style scope>

.RewardPoint {
    font-size:20px;
}

.news-title {
    font-size:18px;
    color:#000000;
}

.news-date {
    font-size:10px;
    color:#888888;
}





</style>