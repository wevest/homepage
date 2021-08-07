<template>
    
    <div class="q-ma-md">

        <WWriterToolbar ref="writerToolbar" @onClickSave="onClickSave" />
        <q-btn label="Test" @click="onClickTest" />

        <div v-if="v_tweet">
            <div class="gBoxNoMargin">

                <Froala :tag="'textarea'" :config="v_config" v-model="v_tweet.text"></Froala>

<!--                
                <BaseEditor ref="baseEditor" :contents="v_tweet.text" @onPostSave="onPostSave" />

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

import VueFroala from 'vue-froala-wysiwyg';
//import BaseEditor from 'components/BaseEditor';
import WWriterToolbar from 'components/WWriterToolbar';

export default {
    name: 'TweetWriter',
    components: {
        CTitle,
        WWriterToolbar,
        //BaseEditor
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_is_new: function() {
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

            v_config: {
                charCounterCount: true,
                toolbarBottom: true,
                toolbarButtons: {
                    indexOf: key => Object.keys(this).indexOf(key),
                }
            }
        }
    },

    created () {
        this.validateQuery();
    },
    mounted() {        
        logger.log.debug("TweetWriterView.mounted : params=",this.$route.query);
        this.prepare();
    },
    updated() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        validateQuery() {            
            if (! CommonFunc.isEmptyObject(this.$route.query.id)) {
                return;
            }

            CommonFunc.navError404(this);
        },        
        prepare() {
            this.setTweet(this.$route);
            //this.fillData();
        },

        setTweet(route) {
            this.v_tweet.asset_id = route.query.id;
            if (route.query.hasOwnProperty('tweet_id')) {
                logger.log.debug("TwitterWriter.setTweet : contents=",route.params.contents);

                this.v_tweet.id = route.query.tweet_id;
                //this.v_tweet.text = route.params.contents;
                this.v_tweet.text = "route.params.content";
            }
        },
        
        validate() {
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



        onPostSave(dic_param) {
            logger.log.debug('TweetWriterDialog.onPostSave : dic_param=',dic_param);

            this.$refs.writerToolbar.setLoading(false);

            if (dic_param.ret==1) {
                this.$refs.writerToolbar.onClickClose();
                //this.postProcess(dic_param.response);
                //CommonFunc.showOkMessage(this,'Blog posted');
            } else {
                
            }        
        },

        onClickSave() {
            logger.log.debug('TweetWriterDialog.onClickSave');

            if (! this.validate() ) {
                return;
            }
            this.save(this.v_tweet);
            //this.$refs.writerToolbar.setLoading(true);
            //this.$refs.baseEditor.save(this.v_tweet,[]);
        
        },

        onClickTest() {
            logger.log.debug('TweetWriterDialog.onClickTest');
            this.v_tweet.text = this.$route.params.contents;
        }
    }

};
</script>


<style scoped>

</style>