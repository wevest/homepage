<template>
	<div class="commentBox rounded-borders" v-show="visible" @click="onClick">
		<div class="q-px-md">
			
			<div class="row gParagraphSM" :class="v_text_class" v-show="v_show">
				<div class="commentWriterIcon">
					<WAvatar :avatar="v_me.avatar_thumb" :username="v_me.username" />
				</div>
				<div class="gUserNameSM q-ml-md q-mt-md"> {{v_me.display_name}} </div>
			</div>

			<div :class="v_text_class">
				<WTextArea ref="descText"  
					v-model="v_comments" :rows="v_rows" :maxlength="maxlength" 
					customClass="gCommentMD"
					label="Please type your comments" 
					hint="Please write comments"
					@onTextChange="onTextChange"
					@onFocus="onFocus"
					@onFocusOut="onFocusOut" />
			</div>

			<div v-if="v_show" class="row">
				<div class="typeLength">
					<span> {{v_length_msg}} </span>
				</div>	
				<q-space />				
				<q-btn class="q-mb-sm gButtonMD" :label="$t('button.save')" ripple
					@click.stop="onClickSubmit" :loading="v_loading"
					v-if="showSaveButton" />&nbsp;

				<q-btn 
					class="q-mb-sm gButtonMD" :label="$t('button.close')" ripple
					@click="onClickClose" />
	<!--
				<q-btn 
					class="q-mb-sm gButtonMD"
					label="Close" 
					@click="onClickClose" 
					v-if="type=='reply'" />
	-->				
			</div>
		</div>
	</div>

</template>


<script>
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import WAvatar from "src/components/WAvatar";
import WTextArea from "src/components/WTextArea";


export default {
	name: "comment-form",
    components: {
		WAvatar,
        WTextArea,
    },
	//mixins: [hasComments],
	props: {
        post: {
            default: null,
        },
        contentType: {
            type:String,
            default:'',
        },

		showSaveButton: {
			type: Boolean,
			default: true,
		},
		save: {
			type:String,
			default: null,
		},
		type: {
			validator(value) {
				return ["comment", "reply"].includes(value);
			},
			default: "comment",
		},
		visible: {
			type: Boolean,
			default: true,
		},
		maxlength: {
			type:Number,
			default:300,
		},
		hint: {
			type:String,
			default: "Please type comments"
		}
	},
    computed: {
        v_me() {
            return store.getters.me;
        },
/*		
		v_text_class() {
			if (this.v_show) {
				logger.log.debug("v_text_class:q_pt_md");
				return 'q-pt-md';
			}
			logger.log.debug("v_text_class");
			return '';
		}
*/		
	},
	data() {
		return {
			saving: false,
			ownerMessage: null,
			
			v_comments: null,
			v_comment_item: null,

			v_show: false,
			v_text_class: '',
			v_loading: false,

			v_input: "",
			v_style: "",
			v_rows: "1",
			v_error: {
				error: false,
				msg: "",
			},
		};
	},

	computed: {
        v_me() {
            return store.getters.me;
        },
		v_length_msg() {
			//return "0 / ";
			return this.v_input.length.toString() + " / " + this.maxlength.toString();
		},
		editorLabelTitle() {
			return this.type === "comment"
				? "Comments"
				: this.type === "reply"
				? "Reply"
				: "Comments";
		},
	},

	mounted() {
		// Emit initial values of local properties
		//logger.log.debug("Comment-Form.mounted");
		this.prepare();
	},

	/**
	 * Emit changes to local properties
	 */
	watch: {},

	methods: {
		prepare() {
			//logger.log.debug("Comment-Form.prepare : v_me=",this.v_me);
			this.$refs.descText.hideBorder();
			if (this.v_me.loggedIn) {
				const msg = this.v_me.display_name + "    " + this.hint;
				this.$refs.descText.setHint(msg);
				this.$refs.descText.setEnabled(true);
			} else {				
				this.$refs.descText.setHint("Please log-in to write comments");
				this.$refs.descText.setEnabled(false);
			}
		},

		show() {
			// this.visible = true
			this.$emit("update:visible", true);			
		},
		hide() {
			this.$emit("update:visible", false);
		},
		clear() {
			this.v_input = "";
			this.v_comments = null;
			this.v_show = false;	
			this.v_text_class = '';
			this.v_loading = false;
			
			this.$refs.descText.hideBorder();
			this.$refs.descText.clear();
			this.$refs.descText.setRows(1);
		},
		remove() {
			this.$el.remove();
		},
		setOwnerMessage(data) {
			console.log("CommentForm.setOwnerMessage=", data);
			this.ownerMessage = data;
		},
		setCommentItem(item) {
			this.v_comment_item = item;
		},		
		activate() {
			// await this.$nextTick()
			if (this.$refs.contentInput) {
				this.$refs.contentInput.focus();
			} else if (this.$el.querySelector("#contentInput")) {
				this.$el.querySelector("#contentInput").focus();
			}
		},

		validate() {
			if (CommonFunc.isEmptyObject(this.v_comments)) {
				//return this.$message.warning('请输入内容')
				this.v_error.error = true;
				this.v_error.msg = "Please type something";
				return false;
			}

            return true;

		},

        postComment: function(dic_param) {

			if (this.save) {
				dic_param.post = this.post;
				dic_param.editor = this;
				this.clear();
				this.$emit("onClickCommentSave", dic_param);
				return;
			}

            const _this = this;
			this.v_loading = true;
            this.post.comments.post(dic_param).then( response => {
                dic_param.response = response;
                _this.clear();
				_this.$emit("onClickCommentSave", dic_param);
                //CommonFunc.showOkMessage(_this,'comments posted');                
            }).catch( err=> {

            });
        },

		/**
		 * Save the new comment and reset the form states
		 * @returns {Promise<Comment>}
		 */
		onClickSubmit() {
			
            this.v_comments = this.$refs.descText.getValue();
            if (! this.validate()) {
                return;
            }

			logger.log.debug("CommentForm.onClickSubmit = ownerMessage : ", this.ownerMessage);

            let dic_param = {
                content_type: this.contentType,
                object_pk:this.post.id, 
                name: this.v_me.username,  
                avatar: this.v_me.avatar_thumb,
                email:'', followup:'FALSE',
                comment:this.v_comments,                
            };

			if (this.type === "reply") {
				dic_param.reply_to = this.ownerMessage.id;
                dic_param.data = this.ownerMessage;
			} else {
                dic_param.reply_to = 0;
            }

            logger.log.debug('CommentForm.onClickSubmit : dic_param=',dic_param);
            this.postComment(dic_param);
			//console.log("CommentForm.validate = ",dic_payload, this.type);
		},

		onFocus(event) {
			logger.log.debug("CommentForm.onFocus=", this.$parent);
            //this.$refs.commentForm.v_comments = "";
            
			this.v_show = true;	
			this.v_text_class = 'q-pt-md';
			
			setTimeout( () => {
				this.$refs.descText.showBorder();
				this.$refs.descText.setRows(5);		
				this.$refs.descText.setFocus();			
			},100);

			//this.$emit("CommentForm.onEditorFocus", event);
		},
		onFocusOut(event) {
			logger.log.debug("onFocusOut=", this.$parent);
			//this.$refs.descText.setRows(1);
			//this.$emit("onEditorFocusOut", event);
		},

		onClickClose:function() {
			logger.log.debug("onClickClose : parent=",this.$parent);
			this.clear();
			this.$emit("onClickClose", {});
		},

		onTextChange: function(value) {
			//logger.log.debug("onTextChange : value=",value);
			this.v_input = value;
		},

		onClick: function() {
			logger.log.debug("CommentForm.onClick : parent=",this.$parent);

			if (this.v_me.isLoggedIn()) {
				return;
			}

			const _this=this;
            store.getters.components.getComponent('confirmDialog').show('Please login first',function(value) {
                logger.log.debug("AssetQAView.onClickAnswer - confirm=",value,_this.$route);
                if (value) {
					store.getters.nav.add(this.$route);					
                    CommonFunc.navSignin(_this);
                }
            });

		}
	},
};
</script>


<style scoped>

.commentBox {
	border: 1px solid #cccccc;
}

.typeLength {
	color:#999999;
	padding-top:10px;
}

.inline-items-wrapper {
	display: flex;
	> div {
		width: 50%;
	}
	.email-item {
		margin-right: 10px;
	}
}

.userName {
	padding:15px 0px 0px 10px;
}

</style>