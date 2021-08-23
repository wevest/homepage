<template>
    
    <div class="q-ma-md">

        <WWriterToolbar ref="writerToolbar" :data="v_post" @onClickSave="onClickSave" />
<!--        
        <div class="q-mt-sm gBoxNoMargin" style="border-bottom:1px solid #cccccc;">
            <div class="row q-pa-sm">
                <q-btn ripple flat icon="highlight_off" size="14px" @click="onClickClose" />
                <q-space />
                <q-btn label="Save" color="primary" flat
                    :loading="v_loading"
                    @click="onClickSave" />
            </div>
        </div>
-->

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
                
                <TipTap ref="editor" :options="v_options" toolbar="1" @onPostSave="onPostSave" />

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

import {PostPageModel} from "src/models/PageModel";
import CTitle from 'components/CTitle';
import TipTap from 'components/tiptap/TipTap';
import WWriterToolbar from 'components/WWriterToolbar';

export default {
    name: 'PageBlogWriter',
    components: {
        CTitle,
        WWriterToolbar,
        TipTap
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        isNewPost() {
            if (this.v_post.id) {
                return false;
            }
            return true;
        }
    },
    data() {
        return {
            g_data: '',
            g_page_id: null,
            g_category_id: null,
            
            v_update_flag: false,

            v_post: new PostPageModel(),
                    
            v_page: {title:this.$t('page.cryptovc.title'), desc:''},
            v_error: {
                title: {error:false, msg:''},
                text: {error:false, msg:''},
            },    
            
            v_options: {
                content: '<blockquote><p>Testing...</p></blockquote><ul><li><p><b>bold</b></p></li><li><p><i>italic</i></p></li><li><p><u>underline</u></p></li></ul>',
                editable: true,
                supportImage: true,
                supportVideo: true
            }            
        }
    },

    created() {
        logger.log.debug("BlogWriterView.created");
    },
    mounted() {        
        logger.log.debug("BlogWriterView.mounted : params=",this.$route.params);
        this.prepare();
    },
    updated() {
        logger.log.debug("BlogWriterView.updated");
        if (! this.v_update_flag) {
            this.$refs.editor.setContents(this.v_post.body);
            this.v_update_flag = true;
        }
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

        fillData() {
            if (this.$refs.baseEditor) {
                logger.log.debug("BlogWriterView.fillData");
                this.$refs.baseEditor.setPostModel(this.v_post);
            }            
        },
        
        validate(v_post) {
            if (CommonFunc.isEmptyObject(v_post.title)) {
                this.v_error.title.error = true;
                this.v_error.title.msg = 'Please type title';
                return false;
            }
            
            let contents = this.$refs.editor.getContents();
            if (CommonFunc.isEmptyObject(contents.body)) {
                this.v_error.text.error = true;
                this.v_error.text.msg = 'Please type something';
                return false;
            }

            return true;
        },

        onPostSave(dic_param) {
            logger.log.debug('BlogWriterDialog.onPostSave : dic_param=',dic_param);

            this.$refs.writerToolbar.setLoading(false);

            if (dic_param.ret==1) {
                //this.$refs.writerToolbar.onClickClose();
                //this.postProcess(dic_param.response);
                CommonFunc.showOkMessage(this,'Blog posted');
            } else {
                CommonFunc.showErrorMessage(this,'Blog error');
            }        
        },

        onClickSave() {
            if (! this.validate(this.v_post)) {
                return;
            }

            let contents = this.$refs.editor.getContents();    
            this.v_post.body = contents.body;
            if (!CommonFunc.isEmptyObject(contents.youtube_url)) this.v_post.youtube_url = contents.youtube_url;
            if (!CommonFunc.isEmptyObject(contents.image_url)) this.v_post.image_url = contents.image_url;
            if (!CommonFunc.isEmptyObject(contents.link_url)) this.v_post.link_url = contents.link_url;

            this.$refs.writerToolbar.setLoading(true);
            this.$refs.editor.postToServer(this.v_post,[this.v_post.category_name]);            
        },

    }

};
</script>


<style scoped>

</style>