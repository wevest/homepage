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
import {AnswerPageModel} from "src/models/PageModel";
import BaseEditor from 'components/BaseEditor';


export default {
    name: 'AnswerWriterDialog',
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

    created() {
        logger.log.debug("BlogWriterView.created");
    },
    mounted() {},
    updated() {
        this.fillData();
    },
    
    methods: {      
        setPost(post) {
            this.v_post = post;
        },

        fillData() {
            //this.$refs.baseEditor.setConent(this.v_post.body);
            if (this.$refs.baseEditor) {
                this.$refs.baseEditor.setPostModel(this.v_post);
            }            
        },

        validate(v_post) {
            let a_text = this.$refs.baseEditor.getContents();
            if (CommonFunc.isEmptyObject(a_text)) {
                this.v_error.text.error = true;
                this.v_error.text.msg = 'Please type something';
                return false;
            }

            return true;
        },


        show(v_post) {
            logger.log.debug("AnswerWriterDialog.show : v_post=",v_post);
            this.setPost(v_post);
            this.v_show = true;
        },

        hide() {
            this.v_show = false;
        },

        setPostID(id) {
            this.v_post.id = id;
        },

        postProcess(response) {
            this.setPostID(response.data.id);
            this.v_post.saved = true;
        },

        onClickSave() {                        
            logger.log.debug('onClickSave - ',this.v_post);

            if (! this.validate(this.v_post)) {
                return;
            }
            

            let v_post = this.v_post;
            v_post.question_id = this.v_post.question_id;
            this.$refs.baseEditor.save(v_post);
        },

        onClickBack() {
            logger.log.debug('onClickBack - ');
            this.hide();
        },
        
        onClickDelete() {
            logger.log.debug('onClickDelete - ');
            this.$refs.baseEditor.delete(this.v_post);
        },

        onPostSave(dic_param) {
            logger.log.debug('onPostSave - ',dic_param);

            if (dic_param.ret==1) {
                this.postProcess(dic_param.response);
                CommonFunc.showOkMessage(this,'Blog posted');
            } else {
                CommonFunc.showErrorMessage(this,'Blog error');
            }
            this.$emit("onAnswerAdded",dic_param);
        },

    }

};
</script>


<style scoped>

</style>