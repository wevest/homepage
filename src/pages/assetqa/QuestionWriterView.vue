<template>

    <div class="q-pa-md q-gutter-sm">            
        <!-- <div> -->
            <!-- <CTitle class="gBoxNoMargin text-center" ttype='title' title="질문쓰기" desc=""></CTitle>           -->
        <!-- </div> -->

        <div>
            <div class="boxTitle">
                <div class="boxTitleInput">
                    <q-input
                        hide-bottom-space
                        v-model="v_post.title" 
                        label="Please type your question title" 
                        hint=""
                        :error="v_error.title.error"
                        :error-message="v_error.title.msg"
                    />
                </div>
                <div class="boxTitleReward">
                    <q-input 
                        hide-bottom-space
                        v-model="v_post.reward" 
                        label="Reward" 
                        hint=""
                        :error="v_error.reward.error"
                        :error-message="v_error.reward.msg"
                    />
                </div>

            </div>
            <div class="gBoxNoMargin">
                <BaseEditor ref="baseEditor" @onPostSave="onPostSave" />
            </div>
            <div v-if="v_error.text.error">
                {{v_error.text.msg}}
            </div>
<!--                
            <div>
                <q-input v-model="v_post.tags" label="Tags" />
            </div>
-->                
        </div>
        
        <div class="gBoxWriterSave q-my-md">
            <q-btn class="full-width" label="Save" color="primary" 
                :loading="v_loading"
                @click="onClickSave" />
        </div>

    </div>

</template>

<script>
import { CONST } from 'src/data/const';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'components/CTitle';
import {PostPageModel,QuestionPageModel} from "src/models/PageModel";
import BaseEditor from 'components/BaseEditor';


export default {
    name: 'BlogWriterDialog',
    components: {
        CTitle,
        BaseEditor,
    },
    computed: {
        isNewPost: function() {
            if (this.v_post.id) {
                return false;
            }
            return true;
        }
    },
    data: function () {
        return {
            g_data: '',
            
            v_show: false,
            v_loading: false,
            v_post: new QuestionPageModel(),
            
            v_page: {title:this.$t('page.cryptovc.title'), desc:''},
            v_error: {
                title: {error:false, msg:''},
                reward: {error:false, msg:''},
                text: {error:false, msg:''},
            },                    
        }
    },

    created: function () {
        
    },
    mounted: function() {
        logger.log.debug("QuestionWriterView.mounted:post=",this.$route.params.post);
        this.setPost(this.$route.params.post);
        this.fillData();
    },
    updated: function() {
        //logger.log.debug("QuestionWriterView.updated : post=",this.v_post);        
    },
    
    methods: {      
        setPost(post) {
            this.v_post = post;
        },

        fillData: function() {
            //this.$refs.baseEditor.setConent(this.v_post.body);
            if (this.$refs.baseEditor) {
                this.$refs.baseEditor.setPostModel(this.v_post);
            }            
        },

        refresh: function(page_id) {
            const _this = this;
        
            let funcs = [            
                //this.loadCalendarEffectData('1h'),
                this.loadBlogPost(page_id),
                //this.loadCryptoTopAssetData('1h')
            ];
            Promise.all(funcs).then(function() {
                
            });
        },
        

        validate: function(v_post) {
            if (CommonFunc.isEmptyObject(v_post.title)) {
                this.v_error.title.error = true;
                this.v_error.title.msg = 'Please type title';
                return false;
            }
            
            let a_text = this.$refs.baseEditor.getContents();
            if (CommonFunc.isEmptyObject(a_text)) {
                this.v_error.text.error = true;
                this.v_error.text.msg = 'Please type something';
                return false;
            }

            return true;
        },

        setPostID: function(id) {
            this.v_post.id = id;
        },

        postProcess: function(response) {
            this.setPostID(response.data.id);
            this.v_post.saved = true;
        },

        onClickSave: function() {                        
            if (! this.validate(this.v_post)) {
                return;
            }
            
            let a_tag = CONST.QUESTION_CATEGORY + this.v_post.category;
            this.v_loading = true;
            this.$refs.baseEditor.save(this.v_post,[a_tag,this.v_post.category]);
        },

        onClickBack: function() {
            logger.log.debug('onClickBack - ');
            this.hide();
        },
        
        onClickDelete: function() {
            logger.log.debug('onClickDelete - ');
            this.$refs.baseEditor.delete(this.v_post);
        },

        onPostSave: function(dic_param) {
            logger.log.debug('QuestionWriterDialog.onPostSave : dic_param=',dic_param);

            if (dic_param.ret==1) {
                this.postProcess(dic_param.response);
                CommonFunc.showOkMessage(this,'Blog posted');
            } else {
                CommonFunc.showErrorMessage(this,'Blog error');
            }
            
            this.v_loading = false;
            this.$emit("onQuestionAdded",dic_param);
        },

    }

};
</script>


<style scoped>
.boxTitle {
    display:flex;
}

.boxTitleInput {
    flex:1 auto;
}

.boxTitleReward {
    padding-left:10px;
    width:60px;
}

</style>