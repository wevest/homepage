<template>
    <div>
        <div>
            <div class="scroll-container">
                <quill-editor
                    ref="editor"
                    v-model="v_contents.text"
                    :options="v_option"
                    @blur="onEditorBlur($event)"
                    @focus="onEditorFocus($event)"
                    @ready="onEditorReady($event)"
                />
            </div>


            <div v-if="v_contents.youtube && v_contents.youtube.length>0">
                <WIframe :src="v_contents.youtube" />
            </div>

            <div v-if="v_contents.link && v_contents.link.length>0">
                <WLinkPreview :url="v_contents.link" @click="onClickPreviewLink" />
            </div>

        </div>

        <div>
            <span class="ql-formats">
                <q-btn label="Link" @click="onClickLink" />
                <q-btn label="Image" />
                <q-btn label="Youtube" @click="onClickYoutube" />
                <q-btn label="Emoji" @click="onClickEmoji" />
            </span>
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


import WIframe from "src/components/w/WIframe";
import WLinkPreview from "src/components/w/WLinkPreview";
import EditDialog from "src/components/dialogs/EditDialog";

//import VueFroala from 'vue-froala-wysiwyg';

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
        }      ,        
        isNewPost() {
            if (this.g_page_id) {
                return false;
            }
            return true;
        }
    },
    data() {
        return {
            v_url: null,

            v_contents: {
                text: '',
                youtube: '',
                link: '',
                image: '',
            },

            v_post: new PostPageModel(),
            v_confirm: false,
            v_confirm_title: 'Do you want to quit?',

            v_option: {
                placeholder: this.placeholder,
                theme: this.theme,
                scrollingContainer: '.scroll-container',                
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
        this.v_editor.format('font-size', '20px');
    },

    updated() {},
    
    methods: {
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
			html = '<div class="link-preview-section" >';
			html += '<div class="link-description">';
			html += '<div class="domain">'
			html += '<span class="link-url">{{ preview.domain }}</span>';
			html += '</div>';
			html += '<div class="link-data">';
			html += '<div class="link-title">';
			html += '{{ preview.title }}';
			html += '</div>';
			html += '<div class="link-description">';
			html += '{{ preview.description }}';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '<div class="link-image">';
			html += '<img v-if="preview.img"';
			html += 'src="preview.img"';
			html += 'alt="preview.description" />';					
			html += '</div>';
			html += '</div>';

            return html;
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


<style scoped>

.scroll-container {
    overflow: auto;
    /* background-color: beige; */
    height: 180px;
}

.ql-container {
    font-size: 30px !important;
}

.link-preview-section {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	padding: 14px;
	border-radius: 5px;
	margin: 20px 0px;
	box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1),
		0 -4px 24px 2px rgba(0, 0, 0, 0.03);
	line-height: 1.5;
	cursor: pointer;
}
.link-preview-section .animated-background,
.link-preview-section .link-image-loader .img {
	animation-duration: 2.25s;
	animation-fill-mode: forwards;
	animation-iteration-count: infinite;
	animation-name: placeHolderShimmer;
	animation-timing-function: linear;
	background: #f6f6f6;
	background: linear-gradient(to right, #f6f6f6 8%, #f0f0f0 18%, #f6f6f6 33%);
	position: relative;
}
@keyframes placeHolderShimmer {
	0% {
		background-position: -468px 0;
	}
	100% {
		background-position: 468px 0;
	}
}
.link-preview-section .link-description {
	display: flex;
	flex-direction: column;
}
.link-preview-section .link-description .domain {
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-bottom: 4px;
}
.link-preview-section .link-description .domain img {
	height: 16px;
	width: 16px;
}
.link-preview-section .link-description .domain .link-url,
.link-preview-section .link-description .domain .link-url-loader {
	font-weight: 600;
}
.link-preview-section .link-description .domain .link-url-loader {
	background-color: #f6f6f6;
	color: #f6f6f6;
	border-radius: 10px;
}
.link-preview-section .link-description .link-data .link-title {
	color: #1364a2;
	font-weight: 600;
	font-size: 15px;
}
.link-preview-section .link-description .link-data .link-description {
	font-size: 14px;
	text-align: left;
}
.link-preview-section .link-description .link-data-loader .p1 {
	font-weight: 600;
	font-size: 15px;
}
.link-preview-section .link-description .link-data-loader .p2 {
	font-size: 14px;
}
.link-preview-section .link-description .link-data-loader .p1,
.link-preview-section .link-description .link-data-loader .p2 {
	background-color: #f6f6f6;
	color: #f6f6f6;
	border-radius: 10px;
	margin-bottom: 4px;
}
.link-preview-section .link-image {
	display: flex;
	align-content: center;
	align-items: center;
	height: 100%;
}
.link-preview-section .link-image img {
	max-height: 64px;
	object-fit: cover;
}
.link-preview-section .link-image-loader {
	display: flex;
	align-content: center;
	align-items: center;
}
.link-preview-section .link-image-loader .img {
	height: 64px;
	width: 64px;
}

</style>