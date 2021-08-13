<template>
    
    <div class="q-ma-md">

        <WWriterToolbar ref="writerToolbar" @onClickSave="onClickSave" />

        <div v-if="v_tweet">
            <div class="gBoxNoMargin">
<!--
                <froala ref="editor" :tag="'textarea'" id="v_text" name="v_text"
                    :immediateVueModelUpdate="true" :config="v_config"
                    v-model="v_text"></froala>

                <BaseEditor ref="editor" :data="v_tweet" :contents="v_tweet.text" 
                    theme="snow" placeholder="Please type something" />
-->

                <TipTap ref="editor" :options="v_options" />

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
import EditDialog from "src/components/dialogs/EditDialog";

//import VueFroala from 'vue-froala-wysiwyg';
//import BaseEditor from 'components/BaseEditor';
import TipTap from 'components/tiptap/TipTap';
import WWriterToolbar from 'components/WWriterToolbar';

export default {
    name: 'TweetWriter',
    components: {
        CTitle,
        WWriterToolbar,
        TipTap
        //VueFroala
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
            g_page_id: null,
            g_category_id: null,
            
            v_update_flag: false,
            v_tweet: new TweetModel(),
            
            v_contents: {
                body: '',
                youtube: '',
                link: '',
                image: '',
            },
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

    created () {
        this.validateQuery();
    },
    mounted() {        
        logger.log.debug("TweetWriterView.mounted : params=",this.$route.query);
        
        this.$nextTick(function() {
            // 모든 화면이 렌더링된 후 실행합니다.            
            this.prepare();
            this.setContents();            
        });
        
    },
    beforeUpdate() {
        //logger.log.debug("TweetWriterView.beforeUpdated : params=",this.$route.query);
        //this.prepare();

    },
    updated() {
        logger.log.debug("TweetWriterView.Updated");
        //this.setContents();
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
                this.v_contents.body = this.v_tweet.body;                
                this.v_update_flag = true;
            }
            this.$refs.editor.setContents(this.v_contents.body);
        },
        setTweet(route) {
            logger.log.debug("TwitterWriter.setTweet : v_tweet=",this.v_tweet);
            this.v_tweet.asset_id = route.query.id;
            if (route.query.hasOwnProperty('tweet_id')) {
                //logger.log.debug("TwitterWriter.setTweet : contents=",route.params.contents);
                this.v_tweet.id = route.query.tweet_id;
                this.v_tweet.body = route.params.contents;
            }

            //this.v_contents.body = '1';
        },
        
        validate() {
            //this.v_tweet.text = this.v_text;
            if (CommonFunc.isEmptyObject(this.v_tweet.body)) {
                this.v_error.text.error = true;
                this.v_error.text.msg = 'Please type something';
                return false;
            }

            return true;
        },

        uploadToEditor(dicUrls) {
            const range = this.v_editor.getSelection(true);

            for (let a_key in dicUrls) {
                this.v_editor.insertEmbed(range.index, 'image', dicUrls[a_key]); 

            }
        },

        async convertFile(file) {
            let img = await CommonFunc.loadImageFile(file);
            //logger.log.debug("imageHandler : img=",img);
            let blob = await CommonFunc.slimImage(img);
            //logger.log.debug("imageHandler : blob=",blob);
            return blob;
        },

        async uploadFiles(files) {
            const _this = this;
            
            const formData = new FormData();
            for (let index=0;index<files.length;index++) {
                let img = await CommonFunc.loadImageFile(files[index]);
                //logger.log.debug("imageHandler : img=");
                let blob = await CommonFunc.slimImage(img,0.7);
                //logger.log.debug("imageHandler : blob=",blob);
                //form.append(avatar.uploadFormName, blob_avatar, avatar.filename); 
                formData.append('files',blob,files[index].name);                
            }
            //logger.log.debug("imageHandler : formData=",formData);

            this.v_me.uploadImage(formData).then(resp=>{
                logger.log.debug("uploadFiles.uploadImage : resp=",resp);
                if (resp.data.ret!=0) {

                    return;
                }
                _this.uploadToEditor(resp.data.data);

            }).catch(err=>{
                logger.log.error("uploadFiles.uploadImage : err=",err);

            });
            
        },

        imageHandler() {     
            const _this=this;

            const input = document.createElement('input');

            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');
            input.setAttribute('multiple','true');
            input.click();

            input.onchange = async () => {
                _this.uploadFiles(input.files);
            }

        },


        save(tweet) {
            const _this = this;
            
            _this.$refs.writerToolbar.setLoading(true);
            tweet.post().then( response => {
                logger.log.debug("onClickSave : response=",response);
                //_this.$emit("onPostSave",{ret:1, response:response});
                _this.$refs.writerToolbar.setLoading(false);
                _this.$refs.writerToolbar.onClickClose();
                CommonFunc.showOkMessage(_this,'Posting ok');
                
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
            } else {
                
            }        
        },

        onClickSave() {            
            //logger.log.debug('TweetWriterDialog.onClickSave : editor=',this.$refs.editor);

            this.v_contents = this.$refs.editor.getContents();
            logger.log.debug('TweetWriterDialog.onClickSave : v_contents=',this.v_contents);
            
            this.v_tweet.body = this.v_contents.body;
            if (!CommonFunc.isEmptyObject(contents.youtube_url)) this.v_tweet.youtube_url = contents.youtube_url;
            if (!CommonFunc.isEmptyObject(contents.image_url)) this.v_tweet.image_url = contents.image_url;
            if (!CommonFunc.isEmptyObject(contents.link_url)) this.v_tweet.link_url = contents.link_url;

            if (! this.validate() ) {
                return;
            }
            this.save(this.v_tweet);
            //this.$refs.writerToolbar.setLoading(true);        
        },


    }

};
</script>


<style scoped>

</style>