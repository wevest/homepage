
<template>

    <div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreQuestion"></CTitle>

		<q-list separator class="rounded-borders">
			<q-item 
				clickable
				v-ripple
                class="q-pa-sm"
				v-for="(a_question, index) in v_questions.items"
                v-if="index<v_maxLength"
				:key="index"
				@click.stop="onClickQuestion(a_question)"
			>
				<q-item-section avatar top>
					<WAvatar :avatar="a_question.owner.avatar_thumb" :username="a_question.owner.username" />
				</q-item-section>
				<q-item-section top>
					<q-item-label lines="1">
                        <q-badge
                            class="RewardPoint q-mr-sm" 
                            color="purple-4"
                            text-color="white">
                            <span>{{a_question.reward}}</span>
                        </q-badge>

						<span class="gListTitle">{{ v_shorten(a_question.title) }}</span>
<!--
                        &nbsp;<q-icon name="done_all" v-if="a_question.closed" />
-->                        
					</q-item-label>
					<q-item-label lines="1">

						<WSubinfo 
							:username="a_question.owner.username" 
							:pub_date="a_question.pub_date" 
							like_count="-1" 
							dislike_count="-1" />

					</q-item-label>
				</q-item-section>
			</q-item>
			<q-separator class="loadmoreSeparator" size="1px" />

		</q-list>

		<LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />

  </div>  
  
</template>


<script>
import { store } from 'src/store/store';
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import WAvatar from "components/WAvatar.vue";
import WSubinfo from 'components/WSubinfo';
import LoadMore from "src/components/LoadMore";
import CTitle from 'components/CTitle';

import { PostPageModel, QuestionPageListModel } from "src/models/PageModel";

export default {
    components: {
        CTitle,
        WAvatar,
        WSubinfo,
        LoadMore
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
		symbol: {
			required:true,
			type:String,
			default: ""
		},
		objectId: {
			required:true,
			default:-1
		}
    },    
    computed: {
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,MoaConfig.setting.maxTitleLength);
            };
        }
    },
    data () {
        return {
            g_data: null,

            v_title: this.title,
            v_maxLength: this.maxLength,
            v_more_caption: this.moreCaption,								

            v_questions: new QuestionPageListModel(),

            v_questions_header: [
                { name:'avatar', label: 'name.name', align:'left', field: 'avatar' },
                { name:'detail', label: 'name.detail', field: 'detail', align:'left' },
    /*            
                { name:'reward', label: this.$t('name.reward'), sortable:true,  field: 'reward' ,
                format: (val, row) => `${Number(val).toLocaleString()}`, 
                },
                { name:'title', label: this.$t('name.title'), sortable:true, field: 'title',},
                { name:'pub_date', label: this.$t('name.homepage'), align:'left', field: 'pub_date'},
                { name:'username', label: this.$t('name.username'), align:'left', field: 'username'},
    */            
            ],

        }
    },

    methods: {

        update: function(dic_param) {
            const _this = this;

            this.v_questions.load(dic_param).then( response => {
                _this.g_data = response;
                _this.$refs.loadMore.setPageParameter(response.data);
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
            CommonFunc.navQADetail(this,jsonObject.id);            
            //this.$emit("onClickQuestion",jsonObject);          
        },

        onClickLoadMore: function() {                        
            let dic_param = {'parent_id':this.objectId};
			dic_param.limit = this.$refs.loadMore.v_next.limit;
			dic_param.offset = this.$refs.loadMore.v_next.offset;
            
            logger.log.debug('AssetQuestionList.onClickLoadMore : dic_param=',dic_param);

            this.update(dic_param);
        },

        onClickAvatar: function(username) {
            logger.log.debug('onClickAvatar');
            CommonFunc.navProfile(this,username);
        },

        onClickMoreQuestion:function() {
            logger.log.debug('AssetQuestionList.onClickMoreQuestion');
            CommonFunc.navQA(this,this.symbol,this.objectId);
        }

    }
}
</script>


<style scope>

.RewardPoint {
    font-size:15px;
}







</style>