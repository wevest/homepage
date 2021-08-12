<template>
  	<div class="editor q-pa-md">

    	<editor-menu-bar
			:editor="editor"
			v-slot="{ commands, isActive, getMarkAttrs }"
			v-if="!options.readonly"
		>
      		<div class="menubar">

				<q-btn label="link" @click="onClickLink(commands.image)" />
				<q-btn label="image" @click="onClickImage(commands.image)" />
				<q-btn label="video" @click="onClickYoutube" />
				<q-btn label="Test" @click="onClickTest" />

				<span v-if="toolbar=='1'">
					<q-btn label="undo" @click="commands.undo" />        
					<q-btn label="redo" @click="commands.redo" />	

					<q-btn label="h1" :class="{ 'is-active': isActive.heading({ level: 1 }) }" @click="commands.heading({ level: 1 })" />
					<q-btn label="h2" :class="{ 'is-active': isActive.heading({ level: 2 }) }" @click="commands.heading({ level: 2 })" />
					<q-btn label="h3" :class="{ 'is-active': isActive.heading({ level: 3 }) }" @click="commands.heading({ level: 3 })" />

					<q-btn label="line" @click="commands.horizontal_rule" />

					<q-btn label="bold" :class="{ 'is-active': isActive.bold() }" @click="commands.bold" />
					<q-btn label="italic" :class="{ 'is-active': isActive.italic() }" @click="commands.italic" />
					<q-btn label="strike" :class="{ 'is-active': isActive.strike() }" @click="commands.strike" />
					<q-btn label="underline" :class="{ 'is-active': isActive.underline() }" @click="commands.underline" />
					<q-btn label="code" :class="{ 'is-active': isActive.code() }" @click="commands.code" />
					<q-btn label="link" :class="{ 'is-disabled': shouldDisableButton(isActive.link()), 'is-active': isActive.link() }" @click.prevent="isActive.link() ? changeLinkDialog(commands.link, getMarkAttrs('link')) : addLinkDialog(commands.link, getMarkAttrs('link'))" />

					<q-btn label="bullet" :class="{ 'is-active': isActive.bullet_list() }" @click="commands.bullet_list" />
					<q-btn label="order" :class="{ 'is-active': isActive.ordered_list() }" @click="commands.ordered_list" />
					<q-btn label="quote" :class="{ 'is-active': isActive.blockquote() }" @click="commands.blockquote" />
					<q-btn label="code" :class="{ 'is-active': isActive.code_block() }" @click="commands.code_block" />

					<q-btn label="table"
						@click="commands.createTable({
							rowsCount: 3,
							colsCount: 3,
							withHeaderRow: true
						})"
					/>

					<span v-if="isActive.table()">
						<q-btn label="DeleteTable" @click="commands.deleteTable" />
						<q-btn label="addCol" @click="commands.addColumnBefore" />
						<q-btn label="addCol2" @click="commands.addColumnAfter" />
						<q-btn label="addRow" @click="commands.addRowBefore" />
						<q-btn label="addRow2" @click="commands.addRowAfter" />
						<q-btn label="deleteCol" @click="commands.deleteColumn"/>
						<q-btn label="deleteRow" @click="commands.deleteRow" />
						<q-btn label="merge" @click="commands.toggleCellMerge" />
					</span>
				</span>

      		</div>

    	</editor-menu-bar>

    	<editor-content class="editor__content" :editor="editor" />
		
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

//import axios from 'axios';

export default {
    components: {
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
		}
	},
    data () {
        return {
			editor: null,
			imageDialog: false,
			videoDialog: false,
			imageTab: null,
			
			v_contents: {
				text: '',
				link: null,
				youtube: null,
			},

			fileURL: null,
			videoURL: null,
			selectedFile: null,
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


        shouldDisableButton(isActive) {
        	return !isActive & window.getSelection().isCollapsed;
        },
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

			let embed = '<iframe src={src}></iframe>'.replace('{src}', url);			
			this.insertHTML(this.editor, embed);

			return;

			//let src = this.videoURL;
			if (src.includes('youtube.com/') || src.includes('youtu.be/')) {
				axios({
					method: 'get',
					url: 'https://www.youtube.com/oembed?url={url}&format=json&maxwidth=640&maxheight=360'.replace('{url}', src),
				})
				.then(function (response) {
					const src = response.data['html'];
					vm.insertHTML(vm.editor, src);
					vm.videoURL = null;
					vm.videoDialog = false;
				})
        	}
			else {
				let embed = '<iframe src={src}></iframe>'.replace('{src}', src);
				this.insertHTML(vm.editor, embed);
				this.videoURL = null;
				this.videoDialog = false;
			}
        },

		insertEmoji() {
			//https://jangwonseok.me/logs/91
		},


        insertImage(command) {
			logger.log.debug("TipTap.insertImage : command=",command);
			this.imageHandler().catch(files=>{

			});
			return;
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

            this.v_me.uploadImage(formData).then(resp=>{
                logger.log.debug("uploadFiles.uploadImage : resp=",resp);
                if (resp.data.ret!=0) {
                    return;
                }
                _this.uploadToEditor(command,resp.data.data);

            }).catch(err=>{
                logger.log.error("uploadFiles.uploadImage : err=",err);

            });
            
        },

        uploadToEditor(command,dicUrls) {
			logger.log.debug('uploadToEditor : command=',command);
            for (let a_key in dicUrls) {
				//this.v_editor.insertEmbed(range.index, 'image', dicUrls[a_key]); 
				const a_url = dicUrls[a_key];
				logger.log.debug('uploadToEditor : url=',a_url);

				command({ src:a_url });
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




		onClickYoutube() {			
			logger.log.debug('onClickLink : html=',this.v_contents.text);
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

        onSaveEdit(dicParam) {
            logger.log.debug("TweetWriter.onSaveEdit : ",dicParam);

            if (dicParam.tag=="youtube") {
                this.v_contents.youtube = this.extractVideoUrl(dicParam.value);
				this.insertVideo(this.v_contents.youtube);
            } else if (dicParam.tag=="link") {
                this.v_contents.link = dicParam.value;
                this.insertLinkPreview(this.v_contents.link);
            }

            //this.updateUserProfile(this.v_user);

        },

    }
}
</script>

<style lang="scss">
@import 'src/assets/sass/main.scss';
</style>