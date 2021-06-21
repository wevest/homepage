<template>

    <div>
        <q-dialog v-model="v_show" 
            class="full-width window-height"
            position="bottom"
            persistent
            transition-show="slide-up"
            transition-hide="slide-down"
        >
            <q-card>
                <q-card-section>
                    <div class="q-pa-md q-gutter-sm">            
                        <div class="row">
                            <div>
                                <q-btn label="Back" @click="onClickBack" />
                            </div>
                            <q-space />
                            <div>
                                <q-btn label="Save" @click="onClickSave" />
                                <q-btn label="Delete" @click="onClickDelete" v-if="! isNewPost" />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col">
                                <q-input 
                                    v-model="v_post.title" 
                                    label="Title" 
                                    :error="v_error.title.error"
                                    :error-message="v_error.title.msg"
                                />
                                <q-input 
                                    v-model="v_post.reward" 
                                    label="Reward" 
                                    :error="v_error.reward.error"
                                    :error-message="v_error.reward.msg"
                                />
                                <BaseEditor ref="baseEditor" @onPostSave="onPostSave" />
                                <div v-if="v_error.text.error">
                                    {{v_error.text.msg}}
                                </div>
                                <q-input v-model="v_post.tags" label="Tags" />
                            </div>
                        </div>
                    </div>
                </q-card-section>        
            </q-card>

        </q-dialog>

    </div>

</template>

<script>
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';

import CTitle from 'components/CTitle';
import {PostPageModel,QuestionPageModel} from "src/models/PageModel";
import BaseEditor from 'components/BaseEditor';


export default {
    name: 'BlogWriterDialog',
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
        console.log("BlogWriterView.created");
    },
    mounted: function() {},
    updated: function() {},
    
    methods: {      
        setPost(post) {
            this.v_post = post;
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
        

        loadBlogPost: function(page_id) {
            const _this = this;

            return new Promise(function(resolve,reject) {
                //logger.log.debug("CWatchView.loadCryptoWatchData - dic_param=",dic_param);
                CMSAPI.getPostData(page_id,function(response) {
                    _this.g_data = response.data;
                    logger.log.debug("BlogWriterView.loadBlogPost - response",_this.g_data);
                    _this.handlePostPage(_this.g_data);
                    resolve();

                },function(err) {
                    logger.log.error("BlogWriterView.loadBlogPost - error",err);
                    reject();
                });
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


        show: function(v_post) {
            logger.log.debug("BlogWriterDialog.show",v_post);
            this.setPost(v_post);
            this.v_show = true;
        },

        hide: function() {
            this.v_show = false;
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