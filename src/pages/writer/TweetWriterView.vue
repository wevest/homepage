<template>
    
    <div class="q-ma-md">

        <WWriterToolbar ref="writerToolbar" @onClickSave="onClickSave" />
        <q-btn label="Test" @click="onClickTest" />

        <div v-if="v_tweet">
            <div class="gBoxNoMargin">

                <froala ref="editor" :tag="'textarea'" id="v_text" name="v_text"
                    :immediateVueModelUpdate="true" :config="v_config"
                    v-model="v_text"></froala>
           
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
import { Config } from 'src/data/Config';
import NavFunc from 'src/util/NavFunc';
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
        VueFroala
        //BaseEditor
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_is_new() {
            if (this.v_tweet.id) {
                return false;
            }
            return true;
        },
    },
    data() {
        return {
            editor: null,

            g_page_id: null,
            g_category_id: null,
            
            v_update_flag: false,
            v_text: '',
            v_tweet: new TweetModel(),
                    
            v_page: {title:this.$t('page.cryptovc.title'), desc:''},
            v_error: {
                title: {error:false, msg:''},
                text: {error:false, msg:''},
            },        

            v_config: {
                key: Config.key.froala,
                attribution: false,
                //iframe: true,

                htmlRemoveTags: ["script"],
                immediateVueModelUpdate: true,
                codeMirrorOptions: {
                    indentWithTabs: true,
                    lineNumbers: true,
                    lineWrapping: true,
                    mode: "text/html",
                    tabMode: "indent",
                    tabSize: 2,
                },
                toolbarButtons: [
                    ['fontSize', 'textColor', 'backgroundColor'],
                    ['insertLink', 'insertImage', 'insertVideo', 'emoticons','embedly']
                ],
            }
        }
    },

    created () {
        this.validateQuery();
    },
    mounted() {        
        logger.log.debug("TweetWriterView.mounted : params=",this.$route.query);
        
        this.$nextTick(function() {
            // 모든 화면이 렌더링된 후 실행합니다.            
            this.prepare();
            //this.setContents();            
        });
        
    },
    beforeUpdate() {
        //logger.log.debug("TweetWriterView.beforeUpdated : params=",this.$route.query);
        //this.prepare();
    },
    updated() {
        logger.log.debug("TweetWriterView.Updated");
        this.setContents();
    },
    beforeDestroy() {
        //this.v_update_flag = false;
    },
    methods: {
        validateQuery() {            
            if (! CommonFunc.isEmptyObject(this.$route.query.id)) {
                return;
            }

            NavFunc.navError404(this);
        },
        prepare() {
            this.setTweet(this.$route);            
        },
        setContents() {
            //logger.log.debug("TwitterWriter.setContents : v_tweet=",this.v_update_flag,this.v_tweet);
            if (! this.v_update_flag) {
                //logger.log.debug("TwitterWriter.setContents :text=",this.v_tweet.text); 
                this.v_text = this.v_tweet.text;
                this.v_update_flag = true;
            }
        },
        setTweet(route) {
            logger.log.debug("TwitterWriter.setTweet : v_tweet=",this.v_tweet);
            this.v_tweet.asset_id = route.query.id;
            if (route.query.hasOwnProperty('tweet_id')) {
                //logger.log.debug("TwitterWriter.setTweet : contents=",route.params.contents);
                this.v_tweet.id = route.query.tweet_id;
                this.v_tweet.text = route.params.contents;
            }

            this.v_text = '1';
        },
        
        validate() {
            //this.v_tweet.text = this.v_text;
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

            this.v_tweet.text = this.v_text;
            if (! this.validate() ) {
                return;
            }
            this.save(this.v_tweet);
            //this.$refs.writerToolbar.setLoading(true);
            //this.$refs.baseEditor.save(this.v_tweet,[]);
        
        },

        onClickTest() {
            logger.log.debug('TweetWriterDialog.onClickTest');
            this.v_text = "this.$route.params.contents";
        }
    }

};
</script>


<style scoped>

</style>