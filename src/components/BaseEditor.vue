<template>
    <div>
        <div>
            <div>

            </div>

            <div v-if="v_editor">
                <div>
                    <span class="ql-formats">
                        <q-btn label="Link" @click="onClickLink" />
                        <q-btn label="Image" />
                        <q-btn label="Youtube" @click="onClickYoutube" />
                        <q-btn label="Emoji" @click="onClickEmoji" />
                    </span>
                </div>            

                <TipTap :options="v_options"/>

<!--
                    <quill-editor
                        ref="editor"
                        class="boxEditor"
                        v-model="v_contents.text"
                        :options="v_option"
                        @blur="onEditorBlur($event)"
                        @focus="onEditorFocus($event)"
                        @ready="onEditorReady($event)"
                    />
-->
                <div class="scroll-container">
                </div>

<!--
                <editor-content :editor="v_editor" />
-->                
            </div>

<!--
-->

            <div v-if="v_contents.youtube && v_contents.youtube.length>0">
                <WIframe :src="v_contents.youtube" />
            </div>

            <div v-if="v_contents.link && v_contents.link.length>0">
                <WLinkPreview :url="v_contents.link" @click="onClickPreviewLink" />
            </div>

        </div>

        <EditDialog ref="dialogEdit" buttonCaption="OK"
            :title="$t('dialog.edit_dialog.biography.title')" 
            @onSave="onSaveEdit" />

  </div>

</template>

<script>
import { store } from 'src/store/store';
import { CONST } from 'src/data/const';
import { Config } from 'src/data/Config';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';
import APIService from 'src/services/apiService';

/*
import { Editor, EditorContent } from '@tiptap/vue-2';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
*/

import WIframe from "src/components/w/WIframe";
import WLinkPreview from "src/components/w/WLinkPreview";
import EditDialog from "src/components/dialogs/EditDialog";
import TipTap from "src/components/tiptap/TipTap";


//import { quillEditor } from 'vue-quill-editor';

import {PostPageModel} from "src/models/PageModel";

const toolbarOptions = {
    container: [
        [{ 'size': ['small', false, 'large', 'huge'] }],    // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'align': [] }],
        ['bold', 'italic', 'underline', 'strike'],          // toggled buttons
        [{ 'color': [] }, { 'background': [] }],            // dropdown with defaults from theme
        [{ 'header': 1 }, { 'header': 2 }],                 // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],        // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],            // outdent/indent
        [{ 'direction': 'rtl' }],                           // text direction
        ['clean'],                                          // remove formatting button
        ['blockquote', 'link', 'code-block', 'formula', 'image', 'video'] // media
    ],
};

export default {
    name: 'BaseEditor',
    components: {
        TipTap,
        WIframe,
        WLinkPreview,
        EditDialog
    },
    props: {
        data: {
            default: null
        },
        contents: {
            default:null,
        },
        customSave: {
            default: '0'
        },
        placeholder: {
            default: ''
        },
        theme: {
            default: 'bubble'
        }
    },
    computed: {
        v_me() {
            return store.getters.me;
        },

        v_editor() {
            return this.$refs.editor.quill;
        },        

        isNewPost() {
            if (this.g_page_id) {
                return false;
            }
            return true;
        }
    },
    data() {
        return {
            //v_editor: null,

            v_contents: {
                text: '',
                youtube: '',
                link: '',
                image: '',
            },

            v_post: new PostPageModel(),
            v_confirm: false,
            v_confirm_title: 'Do you want to quit?',

            v_options: {
                content: '<blockquote><p>Testing...</p></blockquote><ul><li><p><b>bold</b></p></li><li><p><i>italic</i></p></li><li><p><u>underline</u></p></li></ul>',
                editable: true,
                supportImage: true,
                supportVideo: true
            },

            v_option: {
                placeholder: this.placeholder,
                theme: this.theme,
                //scrollingContainer: '.scroll-container',                
                modules: {
                    toolbar: {
                        handlers: {
                            'image': this.imageHandler
                        }
                    }
                }
            },
        }
    },

    created() {
        logger.log.debug("BaseEditor.created");
    },
    mounted() {
        //this.v_editor.format('font-size', '20px');
        this.prepare();
    },

    updated() {},
    beforeDestroy() {
        //this.v_editor.destroy();
    },

    methods: {
        prepare() {
/*            
            this.v_editor = new Editor({
                extensions: [
                    StarterKit,
                    Document,
                    Paragraph,
                    Text,                    
                ],
                content: 'hello',
            });
*/            
        },
        setContents(content) {            
            logger.log.debug("BaseEditor.setContent : contents=",content);
            this.v_contents.text = content;
        },

        getContents() {
          //let a_text = this.$refs.toastEditor.invoke('getMarkdown');
          return this.v_contents.text;
        },

        setPostModel(post) {
            logger.log.debug("BlogWriterView.setPostModel : post=",post);
            this.v_post.assign(post);
            //this.setContent(this.v_post.body);
        },

        showConfirm(msg) {
          this.v_confirm_title = msg;
          this.v_confirm = true;
        },

        hideConfirm() {
          this.v_confirm = false;
        },

        save(v_post,a_tag) {                        
            const _this = this;
            let a_text = this.getContents();
            
            let dic_param = {
                id: v_post.id,
                title: v_post.title,
                tags: v_post.tags, 
                category_id: v_post.category, 
                content_type: v_post.content_type,
                asset_id: v_post.asset_id,
                token:store.getters.token,
                text: CommonFunc.addHashTag(a_text,a_tag)
            };

            if (v_post.content_type==CONST.CONENT_TYPE_ASSET_ANSWER) {
                dic_param.question_id = v_post.question_id; 
            }

            logger.log.debug("BaseEditor.onClickSave : dic_param=",dic_param);

            v_post.post(dic_param).then( response => {
                logger.log.debug("onClickSave : response=",response);
                _this.$emit("onPostSave",{ret:1, response:response});
            }).catch(err=>{
                _this.$emit("onPostSave",{ret:0, response:error});
            });

/*
            } else {

                CMSAPI.postBlogPost(dic_param,function(response) {
                    logger.log.debug("onClickSave : response=",response);
                    _this.$emit("onPostSave",{ret:1, response:response});
                }, function(error) {
                    _this.$emit("onPostSave",{ret:0, response:error});
                });

            }
*/

        },

        delete(v_post) {                        
            const _this = this;
            let dic_param = { id:v_post.id, token:store.getters.token};
            logger.log.debug('onClickDelete - ',dic_param);
            CMSAPI.deleteBlogPost(dic_param,function(response) {
              _this.$emit("onPostDelete",{ret:1, response:response});
            }, function(error) {
              _this.$emit("onPostDelete",{ret:0, response:error});
            });
        },

        uploadToEditor(dicUrls) {
            const range = this.v_editor.getSelection(true);

            for (let a_key in dicUrls) {
                this.v_editor.insertEmbed(range.index, 'image', dicUrls[a_key]); 

            }
        },

        insertEmbed(mtype,url) {
            const range = this.v_editor.getSelection(true);
            this.v_editor.insertEmbed(range.index, mtype, url); 
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
            }

        },


        extractVideoUrl(url) {
            let match =
                url.match(
                /^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtube\.com\/watch.*v=([a-zA-Z0-9_-]+)/,
                ) ||
                url.match(/^(?:(https?):\/\/)?(?:(?:www|m)\.)?youtu\.be\/([a-zA-Z0-9_-]+)/);
            if (match) {
                return `${match[1] || 'https'}://www.youtube.com/embed/${
                match[2]
                }?showinfo=0`;
            }
            // eslint-disable-next-line no-cond-assign
            if ((match = url.match(/^(?:(https?):\/\/)?(?:www\.)?vimeo\.com\/(\d+)/))) {
                return `${match[1] || 'https'}://player.vimeo.com/video/${match[2]}/`;
            }
            return url;
        },

        getLinkPreviewHTML(preview) {
            let html = '';
			html = '<div class="gLinkPreviewBox" >';
			html += '  <div class="gLinkDescription">';
			html += '    <div class="domain">'
			html += '      <span class="link-url">' + preview.url + '</span>';
			html += '    </div>';
			html += '    <div class="link-data">';
			html += '      <div class="link-title">';
			html += preview.title ;
			html += '      </div>';
			html += '      <div class="gLinkDescription">';
			html += preview.description;
			html += '      </div>';
			html += '    </div>';
			html += '  </div>';
			html += '  <div class="gLinkImage">';
			html += '    <img v-if="' + preview.image +'"';
			html += '       src="' + preview.image + '"';
			html += '       alt="' + preview.description + '" />';					
			html += '  </div>';
			html += '</div>';

            return html;
        },
        insertLinkPreview(url) {
            const _this=this;

            APIService.getLinkPreview({url:url}).then(resp=>{
                logger.log.debug("insertLinkPreview : resp=",resp);
                
                let html = _this.getLinkPreviewHTML(resp.data.data);
                logger.log.debug("insertLinkPreview : html=",html);

                const range = _this.v_editor.getSelection(true);
                //const delta = _this.v_editor.clipboard.convert(html)
                const delta = _this.v_editor.clipboard.dangerouslyPasteHTML(range.index,html)
                //_this.v_editor.insertText(range.index,html,'user');
                //_this.v_editor.insertEmbed(range.index,html,'user');

            }).catch(err=>{

            });
        },


        onEditorBlur(quill) {
            //logger.log.debug('editor blur!', quill);
        },
        onEditorFocus(quill) {
            //logger.log.debug('editor focus!', quill);
        },
        onEditorReady(quill) {
            //logger.log.debug('editor ready!', quill);
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
            //logger.log.debug('onClickLink : html=',this.v_editor.root.innerHTML);
            logger.log.debug('onClickLink : html=',this.v_contents.text);
            this.$refs.dialogEdit.setMaxlength(200);
            this.$refs.dialogEdit.show('link','text',"",'Link');            
        },

        onSaveEdit(dicParam) {
            logger.log.debug("TweetWriter.onSaveEdit : ",dicParam);

            if (dicParam.tag=="youtube") {
                this.v_contents.youtube = this.extractVideoUrl(dicParam.value);
                //this.v_url = this.v_contents.youtube;
            } else if (dicParam.tag=="link") {
                this.v_contents.link = dicParam.value;
                //this.insertLinkPreview(this.v_contents.link);
            }

            //this.updateUserProfile(this.v_user);

        },


        onClickConfirm(value) {
          this.v_confirm = false;
          this.$emit("onClickConfirm",value);
        },

        onClickPreviewLink(preview) {
            logger.log.debug('click', preview.domain, preview.title, preview.description, preview.img);
        }

    }
};
</script>


<style lang="scss" scoped>
.scroll-container {
    display: flex;
    flex-direction: column;
    .boxEditor {
      height: 40rem;
      overflow: hidden;
    }
    .output {
      width: 100%;
      height: 20rem;
      margin: 0;
      border: 1px solid #ccc;
      overflow-y: auto;
      resize: vertical;
      &.code {
        padding: 1rem;
        height: 16rem;
      }
      &.ql-snow {
        border-top: none;
        height: 24rem;
      }
    }
  }
</style>