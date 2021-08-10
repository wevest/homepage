<template>
    
    <div class="q-ma-md">

        <WWriterToolbar ref="writerToolbar" @onClickSave="onClickSave" />

        <div v-if="v_tweet">
            <div class="gBoxNoMargin">
<!--
                <froala ref="editor" :tag="'textarea'" id="v_text" name="v_text"
                    :immediateVueModelUpdate="true" :config="v_config"
                    v-model="v_text"></froala>
-->

                <BaseEditor ref="editor" :data="v_tweet" :contents="v_tweet.text" 
                    theme="snow" placeholder="Please type something" />

                <div class="gErrorMsg" v-if="v_error.text.error">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{v_error.text.msg}}
                </div>

            </div>

            <div class="q-pa-md" v-if="v_contents.youtube.length>0">
                <q-video :src="v_contents.youtube" />
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
import BaseEditor from 'components/BaseEditor';
import WWriterToolbar from 'components/WWriterToolbar';

export default {
    name: 'TweetWriter',
    components: {
        CTitle,
        WWriterToolbar,
        BaseEditor
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
        v_editor() {
            return this.$refs.editor.quill;
        }      
    },
    data() {
        return {
            //editor: null,

            g_page_id: null,
            g_category_id: null,
            
            v_update_flag: false,
            v_tweet: new TweetModel(),
            
            v_contents: {
                text: '',
                youtube: '',
                link: '',
                image: '',
            },
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
            },

            v_option: {
                placeholder: '',
                theme: 'snow',

                modules: {
                    toolbar: {
                        handlers: {
                            'image': this.imageHandler
                                //document.getElementById('getFile').click();
                        }
                    }
                }
 
            },

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
                this.v_contents.text = this.v_tweet.text;
                
                this.v_update_flag = true;
            }
            this.$refs.editor.setContents("this.v_tweet.text");
        },
        setTweet(route) {
            logger.log.debug("TwitterWriter.setTweet : v_tweet=",this.v_tweet);
            this.v_tweet.asset_id = route.query.id;
            if (route.query.hasOwnProperty('tweet_id')) {
                //logger.log.debug("TwitterWriter.setTweet : contents=",route.params.contents);
                this.v_tweet.id = route.query.tweet_id;
                this.v_tweet.text = route.params.contents;
            }

            this.v_contents.text = '1';
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

        uploadFunction(e){        
            //you can get images data in e.target.files
            //an single example for using formData to post to server
            logger.log.debug("uploadFunction : e=",e);

            var range = this.v_editor.getSelection();
            //var value = prompt('please copy paste the image url here.');
            if (range) {
                //this.v_editor.insertEmbed(range.index, 'image', e.target.files, Quill.sources.USER);
                this.v_editor.insertEmbed(range.index, 'image', e.target.files, "user");
            } else {
                this.v_editor.insertEmbed(0, 'image', e.target.files[0], "user");                
            }
            
            
            var form = new FormData()
            form.append('file[]', e.target.files[0])            
        },

/*
    imageHandler() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        input.onchange = async function() {
            const file = input.files[0];
            console.log('User trying to uplaod this:', file);

            const id = await uploadFile(file); // I'm using react, so whatever upload function
            const range = this.quill.getSelection();
            const link = `${ROOT_URL}/file/${id}`;

            // this part the image is inserted
            // by 'image' option below, you just have to put src(link) of img here. 
            this.quill.insertEmbed(range.index, 'image', link); 
        }.bind(this); // react thing
    }
*/
        uploadToEditor(dicUrls) {
            const range = this.v_editor.getSelection(true);

            for (let a_key in dicUrls) {
                this.v_editor.insertEmbed(range.index, 'image', dicUrls[a_key]); 

            }
        },

        async convertFile(file) {
            let img = await CommonFunc.loadImageFile(file);
            logger.log.debug("imageHandler : img=",img);
            let blob = await CommonFunc.slimImage(img);
            logger.log.debug("imageHandler : blob=",blob);
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

                // Save current cursor state
                const range = this.v_editor.getSelection(true);

                // Insert temporary loading placeholder image
                //_this.v_editor.insertEmbed(range.index, 'image', `${ window.location.origin }/images/loaders/placeholder.gif`); 

                // Move cursor to right side of image (easier to continue typing)
                //_this.v_editor.setSelection(range.index + 1);

                //const res = await apiPostNewsImage(formData); // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'

                // Remove placeholder image
                //_this.v_editor.deleteText(range.index, 1);

                // Insert uploaded image
                //_this.v_editor.insertEmbed(range.index, 'image', res.body.image); 

                //_this.v_editor.uploader.upload(range, input.files);

                //_this.v_editor.insertEmbed(range.index, 'image', ''); 
            }

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

            this.v_tweet.text = this.v_contents.text;
            if (! this.validate() ) {
                return;
            }
            this.save(this.v_tweet);
            //this.$refs.writerToolbar.setLoading(true);
            //this.$refs.baseEditor.save(this.v_tweet,[]);
        
        },

        onClickTest() {
            logger.log.debug('TweetWriterDialog.onClickTest');
            this.v_contents.text = "this.$route.params.contents";
        },

        onEditorBlur(quill) {
            logger.log.debug('editor blur!', quill);
        },
        onEditorFocus(quill) {
            logger.log.debug('editor focus!', quill);
        },
        onEditorReady(quill) {
            logger.log.debug('editor ready!', quill);
        },

        onClickYoutube() {
            logger.log.debug('onClickYoutube');

            this.$refs.dialogEdit.setMaxlength(200);
            this.$refs.dialogEdit.show('youtube','text',"",'Youtube Link');
        },

        onClickEmoji() {
            logger.log.debug('onClickEmoji : veditor=',this.v_editor);
            this.v_editor.theme.modules.toolbar.handlers.image();

        },

        onClickLink() {
            logger.log.debug('onClickLink : html=',this.v_editor.root.innerHTML);
        },

        onSaveEdit(dicParam) {
            logger.log.debug("TweetWriter.onSaveEdit : ",dicParam);

            if (dicParam.tag=="youtube") {
                this.v_contents.youtube = dicParam.value;
            } else if (dicParam.tag=="link") {
                this.v_contents.link = dicParam.value;
            }

            //this.updateUserProfile(this.v_user);

        }

    }

};
</script>


<style scoped>

</style>