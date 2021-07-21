<template>
    
    <div class="q-ma-md">

        <WWriterToolbar ref="writerToolbar" @onClickSave="onClickSave" />

        <div v-if="v_post">
            <div>
                <q-input 
                    hide-bottom-space
                    v-model="v_post.title" 
                    label="Title" 
                    hide-bottom-space
                    :error="v_error.title.error"
                    :error-message="v_error.title.msg"
                />
            </div>
            <div class="gBoxNoMargin">
                <BaseEditor ref="baseEditor" @onPostSave="onPostSave" />
<!--                
                <Editor 
                    hide-bottom-space
                    ref="toastEditor"
                    :value="v_post.text"
                    :options="editorOptions"
                    :visible="editorVisible"
                    :initialValue="editorHtml"
                    previewStyle="vertical"
                    height="360px"
                    mode="wysiwyg"
                    initialEditType="wysiwyg"
                />
-->                
                <div class="gErrorMsg" v-if="v_error.text.error">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{v_error.text.msg}}
                </div>
            </div>
<!--            
            <div style="padding-top:10px;">
                <q-input v-model="v_post.tags" label="Tags" />
            </div>
            <div>
                <q-select v-model="v_category" :options="v_options" behavior="menu" label="Category" />
            </div>
-->            
        </div>

    </div>

</template>

<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import {TweetModel} from "src/models/TweetModel";
import CTitle from 'components/CTitle';
import BaseEditor from 'components/BaseEditor';
import WWriterToolbar from 'components/WWriterToolbar';

export default {
    name: 'PageBlogWriter',
    components: {
        CTitle,
        WWriterToolbar,
        BaseEditor
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
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
            g_page_id: null,
            g_category_id: null,
            
            v_tweet: new TweetModel(),
                    
            v_page: {title:this.$t('page.cryptovc.title'), desc:''},
            v_error: {
                title: {error:false, msg:''},
                text: {error:false, msg:''},
            },        
        }
    },

    created: function () {
        console.log("BlogWriterView.created");
    },
    mounted: function() {        
        logger.log.debug("BlogWriterView.mounted : params=",this.$route.params);
        this.prepare();
    },
    updated: function() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        prepare() {
            this.setPost(this.$route.params.post);
            this.fillData();
        },

        setPost(post) {
            this.v_post = post;
        },
        setPageID(page_id) {
            this.g_page_id = page_id;
        },

        fillData: function() {
            if (this.$refs.baseEditor) {
                this.$refs.baseEditor.setPostModel(this.v_post);
            }            
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

        onPostSave: function(dic_param) {
            logger.log.debug('QuestionWriterDialog.onPostSave : dic_param=',dic_param);

            this.$refs.writerToolbar.setLoading(false);

            if (dic_param.ret==1) {
                this.$refs.writerToolbar.onClickClose();
                //this.postProcess(dic_param.response);
                //CommonFunc.showOkMessage(this,'Blog posted');
            } else {
                CommonFunc.showErrorMessage(this,'Blog error');
            }        
        },

        onClickSave: function() {
            if (! this.validate(this.v_post)) {
                return;
            }

            this.$refs.writerToolbar.setLoading(true);
            this.$refs.baseEditor.save(this.v_post,[this.v_post.category_name]);
            
        },

    }

};
</script>


<style scoped>

</style>