<template>

    <div class="q-pa-md q-gutter-sm">            
        <div>
            <CTitle class="gBoxNoMargin" ttype='title' title="글쓰기" desc=""></CTitle>          
        </div>

        <div class="row">
            <div class="col">
                <div>
                    <q-input 
                        v-model="v_post.title" 
                        label="Title" 
                        :error="v_error.title.error"
                        :error-message="v_error.title.msg"
                    />
                </div>
                <div>
                    <q-input 
                        v-model="v_post.reward" 
                        label="Reward" 
                        :error="v_error.reward.error"
                        :error-message="v_error.reward.msg"
                    />
                </div>
                <div class="gBoxNoMargin">
                    <BaseEditor ref="baseEditor" @onPostSave="onPostSave" />
                </div>
                <div v-if="v_error.text.error">
                    {{v_error.text.msg}}
                </div>
                <div>
                    <q-input v-model="v_post.tags" label="Tags" />
                </div>
            </div>
        </div>

        <div>
            <q-btn class="full-width" label="Save" @click="onClickSave" />
        </div>

    </div>

</template>

<script>
import { MoaConfig } from 'src/data/MoaConfig';
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
        logger.log.debug("QuestionWriterView.created");
    },
    mounted: function() {
        this.setPost(this.$route.params.post);
    },
    updated: function() {
        logger.log.debug("QuestionWriterView.updated : post=",this.v_post);
        this.fillData();
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

            this.$refs.baseEditor.save(this.v_post);
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
            
            this.$emit("onQuestionAdded",dic_param);
        },

    }

};
</script>


<style scoped>

</style>