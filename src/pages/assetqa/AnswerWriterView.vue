<template>

    <div class="q-pa-md q-gutter-sm">            
        <div class="row">
            <q-space />
            <div>
                <q-btn label="Save" @click="onClickSave" />
                <!--
                <q-btn label="Delete" @click="onClickDelete" v-if="! isNewPost" />
                -->
            </div>
        </div>

        <div class="row">
            <div class="col">
                <!--
                <q-input 
                    readonly
                    v-model="v_post.title" 
                    label="Title" 
                    :error="v_error.title.error"
                    :error-message="v_error.title.msg"
                />
                -->
                <BaseEditor ref="baseEditor" @onPostSave="onPostSave" />
                <div v-if="v_error.text.error">
                    {{v_error.text.msg}}
                </div>
                <!--
                <q-input v-model="v_post.tags" label="Tags" />
                -->
            </div>
        </div>
    </div>

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'components/CTitle';
import {AnswerPageModel} from "src/models/PageModel";
import BaseEditor from 'components/BaseEditor';


export default {
    name: 'AnswerWriterView',
    components: {
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

            v_post: new AnswerPageModel(),
            
            v_page: {title:this.$t('page.cryptovc.title'), desc:''},
            v_error: {
                title: {error:false, msg:''},
                text: {error:false, msg:''},
            },                    
        }
    },

    created: function () {
        logger.log.debug("AnswerWriterView.created");
    },
    mounted: function() {
        logger.log.debug("AnswerWriterView.mounted : param=",this.$route.params);
        this.setPost(this.$route.params.post);
        this.prepare();
    },
    updated: function() {
        
    },
    
    methods: {      
        setPost(post) {
            this.v_post = post;
        },

        prepare: function() {
            logger.log.debug("AnswerWriterView.prepare");
            if (this.$refs.baseEditor) {
                this.$refs.baseEditor.setPostModel(this.v_post);
            }            
        },

        validate: function(v_post) {
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
            logger.log.debug('onClickSave - ',this.v_post);

            if (! this.validate(this.v_post)) {
                return;
            }
            

            let v_post = this.v_post;
            v_post.question_id = this.v_post.question_id;
            this.$refs.baseEditor.save(v_post);
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
            logger.log.debug('onPostSave - ',dic_param);

            if (dic_param.ret==1) {
                this.postProcess(dic_param.response);
                CommonFunc.showOkMessage(this,'Blog posted');
            } else {
                CommonFunc.showErrorMessage(this,'Blog error');
            }
        },

    }

};
</script>


<style scoped>

</style>