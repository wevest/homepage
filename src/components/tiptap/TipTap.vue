<template>
  	<div class="editor q-pa-md">
		<div v-if="v_loading_image">
    		<q-linear-progress indeterminate size="md" />
		</div>

    	<editor-menu-bar
			:editor="editor"
			v-slot="{ commands, isActive, getMarkAttrs }"
			v-if="!options.readonly"
		>
      		<div class="menubar">

				<span v-if="toolbar=='1'">
					<span>
						<q-btn flat dense label="undo" @click="commands.undo" />        
						<q-btn flat dense label="redo" @click="commands.redo" />	
					</span>										

					<span class="q-pl-sm">
						<q-btn flat dense label="h1" :class="{ 'is-active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })" />
						<q-btn flat dense label="h2" :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })" />
						<q-btn flat dense label="h3" :class="{ 'is-active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })" />

						<q-btn flat dense label="bold" icon="bold" :class="{ 'is-active': isActive.bold() }" @click="commands.bold" />
						<q-btn flat dense label="italic" :class="{ 'is-active': isActive.italic() }" @click="commands.italic" />
						<q-btn flat dense label="strike" :class="{ 'is-active': isActive.strike() }" @click="commands.strike" />
						<q-btn flat dense label="underline" :class="{ 'is-active': isActive.underline() }" @click="commands.underline" />
						<q-btn flat dense label="code" :class="{ 'is-active': isActive.code() }" @click="commands.code" />
						<q-btn flat dense label="link" :class="{ 'is-disabled': shouldDisableButton(isActive.link()), 'is-active': isActive.link() }" @click.prevent="isActive.link() ? changeLinkDialog(commands.link, getMarkAttrs('link')) : addLinkDialog(commands.link, getMarkAttrs('link'))" />

						<q-btn flat dense label="bullet" :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list" />
						<q-btn flat dense label="order" :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list" />
						<q-btn flat dense label="quote" :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote" />
						<q-btn flat dense label="code" :class="{ 'is-active': isActive.code_block() }" @click="commands.code_block" />
						<q-btn flat dense label="line" @click="commands.horizontal_rule" />

						<q-btn flat dense label="table"
							@click="commands.createTable({
								rowsCount: 3,
								colsCount: 3,
								withHeaderRow: true
							})"
						/>

						<span v-if="isActive.table()">
							<q-btn flat dense label="DeleteTable" @click="commands.deleteTable" />
							<q-btn flat dense label="addCol" @click="commands.addColumnBefore" />
							<q-btn flat dense label="addCol2" @click="commands.addColumnAfter" />
							<q-btn flat dense label="addRow" @click="commands.addRowBefore" />
							<q-btn flat dense label="addRow2" @click="commands.addRowAfter" />
							<q-btn flat dense label="deleteCol" @click="commands.deleteColumn"/>
							<q-btn flat dense label="deleteRow" @click="commands.deleteRow" />
							<q-btn flat dense label="merge" @click="commands.toggleCellMerge" />
						</span>
					</span>
				</span>

				<q-btn flat dense label="link" @click="onClickLink(commands.image)" />
				<q-btn flat dense label="image" :loading="v_loading_image" @click="onClickImage(commands.image)" />
				<q-btn flat dense label="video" @click="onClickYoutube" />
<!--				
				<q-btn flat label="EMOJI" :color="v_emoji_color" @click="onClickEmoji" />
				<q-btn flat label="Test" @click="onClickTest" />
-->

      		</div>

    	</editor-menu-bar>

    	<editor-content class="editor__content" :editor="editor" />
		
		<Picker :data="emojiIndex" set="twitter" @select="showEmoji" v-show="v_show_emoji" />

        <EditDialog ref="dialogEdit" buttonCaption="OK"
            :title="$t('dialog.edit_dialog.biography.title')" 
            @onSave="onSaveEdit" />
		
  	</div>

</template>

<script>
import { DOMParser } from 'prosemirror-model';
import { Editor,EditorContent,EditorMenuBar,} from "tiptap";

import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    HorizontalRule,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Italic,
    Link,
    Image,
    Strike,
    Underline,
    Code,
    Table,
    TableHeader,
    TableCell,
    TableRow,
    History,
    TrailingNode,
} from "tiptap-extensions";

import Iframe from 'src/components/tiptap/Iframe.js';
import EditDialog from "src/components/dialogs/EditDialog";

import { store } from 'src/store/store';
import { CONST } from 'src/data/const';
import { Config } from 'src/data/Config';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import APIService from 'src/services/apiService';


import data from "emoji-mart-vue-fast/data/all.json";
// Import default CSS
import "emoji-mart-vue-fast/css/emoji-mart.css";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast";

let emojiIndex = new EmojiIndex(data);

export default {
    components: {
		Picker,
        EditDialog,
		EditorContent,
        EditorMenuBar,
    },
    props: {
        options: Object,
		toolbar: {
			default: '0'
		},
        contents: {
			type:String,
			default: '',
		}
        // readonly: read only if true
        // autoFocus: Focus the editor on init
        // supportImage: upload and link images
        // supportVideo: embed video
    },
	computed: {
		v_me() {
			return store.getters.me;
		},
		v_emoji_color() {
			if (this.v_show_emoji) {
				return "primary";
			}
			return "";
		}
	},
    data () {
        return {
			v_show_emoji: false,
			v_loading_image: false,

			editor: null,
			imageDialog: false,
			videoDialog: false,
			imageTab: null,
			
			v_contents: {
				body: '',
				link_url: null,
				youtube_url: null,
			},

			fileURL: null,
			videoURL: null,
			selectedFile: null,

 			emojiIndex: emojiIndex,
      		emojisOutput: ""			
        }
    },
    mounted () {
		this.prepare();
    },
    beforeDestroy () {
        this.editor.destroy();
    },
    methods: {
		prepare() {
			this.editor = new Editor ({
				editable: !this.options.readonly,
				extensions: [
					new Blockquote(),
					new CodeBlock(),
					new HardBreak(),
					new Heading({ levels: [1, 2, 3] }),
					new HorizontalRule(),
					new BulletList(),
					new OrderedList(),
					new ListItem(),
					new TodoItem(),
					new TodoList(),
					new Bold(),
					new Italic(),
					new Link({openOnClick: true,target: '_blank',}),
					new Image(),
					new Strike(),
					new Underline(),
					new Code(),
					new Table({resizable: true,}),
					new TableHeader(),
					new TableCell(),
					new TableRow(),
					new History(),
					new TrailingNode(),
					new Iframe()
				],
				onUpdate: ({ getHTML }) => {
					this.options.content = getHTML()
				},
				content: this.contents,
				autoFocus: this.options.autoFocus,
			})
		},

		getContents() {			
			this.v_contents.body = this.editor.getHTML();
			return this.v_contents;
		},
		setContents(txt) {
			this.v_contents.body = txt;
			this.editor.setContent(this.v_contents.body);
		},

        shouldDisableButton(isActive) {
        	return !isActive & window.getSelection().isCollapsed;
        },
/*		
        addLinkDialog: async function (command) {
			if (window.getSelection().isCollapsed) {
				return;
			}
			let res = await window.prompt('Add link', 'https://');
			if (res && res != 'https://' && res != 'http://') {
				command({ href: res });
			}
        },
        changeLinkDialog: async function (command, attr) {
			let res = await window.prompt('Change link', attr.href);
			if (res != undefined) {
				if (res == 'http://' || res == 'https://') {
					res = '';
				}
				command({ href: res });
			}
        },
*/
        insertHTML({ state, view }, value) {
			logger.log.debug("insertHTML:value=",value);

			const { selection } = state;
			const element = document.createElement('div');
			element.innerHTML = value.trim();
			const slice = DOMParser.fromSchema(state.schema).parseSlice(element);
			const transaction = state.tr.insert(selection.anchor, slice.content);
			view.dispatch(transaction);
		},

        insertVideo(url) {
			if ( (!url.includes('youtube.com/')) && (!url.includes('youtu.be/'))) {
				CommonFunc.showErrorMessage(this,'Please use youtube link');
				return;
			}

			//let embed = '<iframe src={src} width="320" height="180"></iframe>'.replace('{src}', url);			
			//let embed = '<iframe src={src}></iframe>'.replace('{src}', url);			
			let embed = '<iframe src={src} style="display:block; width:40vw; height: 40vh"></iframe>'.replace('{src}', url);
			this.insertHTML(this.editor, embed);

			return;
        },

		insertEmoji() {
			//https://jangwonseok.me/logs/91
		},


		insertLinkPreview(url) {
			const _this=this;
			logger.log.debug("TipTap.insertLinkPreview : url=",url);

            APIService.getLinkPreview({url:url}).then(resp=>{
                logger.log.debug("insertLinkPreview : resp=",resp);
                
                let a_html = _this.getLinkPreviewHTML(resp.data.data);
                logger.log.debug("insertLinkPreview : html=",a_html);
				_this.insertHTML(_this.editor, a_html);

            }).catch(err=>{

            });
		},

        async convertFile(file) {
            let img = await CommonFunc.loadImageFile(file);
            logger.log.debug("imageHandler : img=",img);
            let blob = await CommonFunc.slimImage(img);
            logger.log.debug("imageHandler : blob=",blob);
            return blob;
        },

        async uploadFiles(command,files) {
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
			
			this.v_loading_image = true;			
            this.v_me.uploadImage(formData).then(resp=>{
                logger.log.debug("uploadFiles.uploadImage : resp=",resp);
                if (resp.data.ret!=0) {
                    return;
                }
                _this.uploadToEditor(command,resp.data.data);

				_this.v_loading_image = false;
            }).catch(err=>{
                logger.log.error("uploadFiles.uploadImage : err=",err);
				_this.v_loading_image = false;
            });
            
        },

        uploadToEditor(command,dicUrls) {
			logger.log.debug('uploadToEditor : command=',command);
            for (let a_key in dicUrls) {
				//this.v_editor.insertEmbed(range.index, 'image', dicUrls[a_key]); 
				const a_url = dicUrls[a_key];
				logger.log.debug('uploadToEditor : url=',a_url);

				command({ src:a_url });
				this.insertHTML(this.editor, "<br>");
            }
        },

        imageHandler(command) {     
            const _this=this;
			
			return new Promise(function(resolve, reject) {
				const input = document.createElement('input');
				input.setAttribute('type', 'file');
				input.setAttribute('accept', 'image/*');
				input.setAttribute('multiple','true');
				input.click();

				input.onchange = async () => {
					_this.uploadFiles(command,input.files);
					resolve(input);
				}
			});

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

    	showEmoji(emoji) {
			//https://github.com/serebrov/emoji-mart-vue
      		this.emojisOutput = this.emojisOutput + emoji.native;
			logger.log.debug('showEmoji : emoji=',this.emojisOutput);
    	},

        postToServer(v_post,a_tag) {                        
            const _this = this;
            //let a_text = this.getContents();
            
            let dic_param = {
                id: v_post.id,
                title: v_post.title,
                tags: v_post.tags, 
                category_id: v_post.category, 
                content_type: v_post.content_type,
                asset_id: v_post.asset_id,
                youtube_url: v_post.youtube_url,                
                image_url: v_post.image_url,
                link_url: v_post.link_url, 
                text: CommonFunc.addHashTag(v_post.body,a_tag),                
                token:store.getters.token,                
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
        },


		onClickYoutube() {			
			logger.log.debug('onClickLink : html=',this.v_contents.body);
            this.$refs.dialogEdit.setMaxlength(200);
            this.$refs.dialogEdit.show('youtube','text',"",'Youtube Link');
		},

		onClickLink(command) {
            logger.log.debug('onClickLink : command=',command);
            this.$refs.dialogEdit.setMaxlength(200);
            this.$refs.dialogEdit.show('link','text',"",'Link');
		},
		onClickImage(command) { 
			logger.log.debug('onClickImage : command=',command);
			this.imageHandler(command);
		},
		onClickTest() {
			logger.log.debug("TweetWriter.onClickTest");
			let a_html = "<div style='font-size:20px;'> asfsdafasdf</div>";
			this.insertHTML(this.editor, a_html);
		},

		onClickEmoji() {
			this.v_show_emoji = ! this.v_show_emoji;
		},

        onSaveEdit(dicParam) {
            logger.log.debug("TweetWriter.onSaveEdit : ",dicParam);

            if (dicParam.tag=="youtube") {
                this.v_contents.youtube_url = this.extractVideoUrl(dicParam.value);
				this.insertVideo(this.v_contents.youtube_url);
            } else if (dicParam.tag=="link") {
                this.v_contents.link_url = dicParam.value;
                this.insertLinkPreview(this.v_contents.link_url);
            }

            //this.updateUserProfile(this.v_user);

        },

    }
}
</script>

<style lang="scss">
@import 'src/assets/sass/main.scss';
</style>