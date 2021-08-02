<template>
    
    <div class="q-ma-md">

        <WWriterToolbar ref="writerToolbar" @onClickSave="onClickSave" />

        <div v-if="v_tweet">
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
    name: 'TweetWriter',
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
            if (this.v_tweet.id) {
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
            
            v_tweet: new TweetModel(),
                    
            v_page: {title:this.$t('page.cryptovc.title'), desc:''},
            v_error: {
                title: {error:false, msg:''},
                text: {error:false, msg:''},
            },        
        }
    },

    created () {},
    mounted() {        
        logger.log.debug("TweetWriterView.mounted : params=",this.$route.query);
        this.prepare();
    },
    updated() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        prepare() {
            this.setTweet(this.$route.query.id);
            this.fillData();
        },

        setTweet(asset_id) {
            this.v_tweet.asset_id = asset_id;
        },

        fillData: function() {
            if (this.$refs.baseEditor) {
                //this.$refs.baseEditor.setPostModel(this.v_tweet);
            }            
        },
        
        validate: function() {
            this.v_tweet.text = this.$refs.baseEditor.getContents();
            if (CommonFunc.isEmptyObject(this.v_tweet.text)) {
                this.v_error.text.error = true;
                this.v_error.text.msg = 'Please type something';
                return false;
            }

            return true;
        },

        save(tweet) {
            const _this = this;

            let dic_param = {
                id: tweet.id,
                asset_id: tweet.asset_id,
                text: CommonFunc.addHashTag(tweet.text,[])
            };
            
            tweet.post().then( response => {
                logger.log.debug("onClickSave : response=",response);
                //_this.$emit("onPostSave",{ret:1, response:response});
                _this.$refs.writerToolbar.setLoading(false);
                _this.$refs.writerToolbar.onClickClose();
            }).catch(err=>{
                logger.log.error("onClickSave : err=",err);
                _this.$refs.writerToolbar.setLoading(false);
                CommonFunc.showErrorMessage(_this,'Posting error');
                //_this.$emit("onPostSave",{ret:0, response:error});
            });            
        },

        onPostSave: function(dic_param) {
            logger.log.debug('TweetWriterDialog.onPostSave : dic_param=',dic_param);

            this.$refs.writerToolbar.setLoading(false);

            if (dic_param.ret==1) {
                this.$refs.writerToolbar.onClickClose();
                //this.postProcess(dic_param.response);
                //CommonFunc.showOkMessage(this,'Blog posted');
            } else {
                
            }        
        },

        onClickSave: function() {
            logger.log.debug('TweetWriterDialog.onClickSave');

            if (! this.validate() ) {
                return;
            }
            this.save(this.v_tweet);
            //this.$refs.writerToolbar.setLoading(true);
            //this.$refs.baseEditor.save(this.v_tweet,[]);
        
        },

    }

};
</script>


<style scoped>

</style>