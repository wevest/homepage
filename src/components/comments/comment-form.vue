<template>
	<div class="row no-wrap q-pa-md commentBox" v-show="visible">
		<!-- items-center-->
		<div class="col">
			<div>
                <WTextArea v-model="v_comments" :rows="v_rows" :maxlength="maxlength" ref="descText" 
                    label="Please type your comments" 
                    @onTextChange="onTextChange"
					@onFocus="onFocus"
                    @onFocusOut="onFocusOut"                
                />
			</div>

			<div class="row boxEditorCommand">
				<div class="typeLength">
					<span> {{v_length_msg}} </span>
				</div>	
						<q-space />				
					<q-btn
						class="saveBtn"
						label="save"
						size="12px"
						@click.stop="onClickSubmit"
						v-if="showSaveButton" />&nbsp;

					<q-btn 
						class="saveBtn"
						label="Close" 
						size="12px"
						@click="onClickClose" 
						v-if="type=='reply'" />
			</div>
		</div>
	</div>
</template>


<script>
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import WTextArea from "src/components/WTextArea";


export default {
	name: "comment-form",
    components: {
        WTextArea,
    },
	//mixins: [hasComments],
	props: {
		/**
		 * Whether to show the save button.
		 */
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
		}
	},
    computed: {
        v_me() {
            return store.getters.me;
        },
	},
	data() {
		return {
			saving: false,
			ownerMessage: null,
			v_comments: null,
			v_comment_item: null,

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
		logger.log.debug("Comment-Form.mounted");
		this.prepare();
	},

	/**
	 * Emit changes to local properties
	 */
	watch: {},

	methods: {
		prepare() {
			logger.log.debug("Comment-Form.prepare : v_me=",this.v_me);
			if (this.v_me.loggedIn) {
				this.$refs.descText.setHint("");
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
			this.v_comments = null;
			this.$refs.descText.clear();
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
            const _this = this;
            this.post.comments.post(dic_param).then( response => {
                dic_param.response = response;
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
			logger.log.debug("onFocus=", this.$parent);
			this.$emit("onEditorFocus", event);
		},
		onFocusOut(event) {
			logger.log.debug("onFocusOut=", this.$parent);
			this.$emit("onEditorFocusOut", event);
		},

		onClickClose:function() {
			logger.log.debug("onClickClose : parent=",this.$parent);
			this.$emit("onClickClose", {});
		},

		onTextChange: function(value) {
			//logger.log.debug("onTextChange : value=",value);
			this.v_input = value;
		}


	},
};
</script>


<style scoped>

.commentBox {
	border: 1px solid #cccccc;
	border-radius: 7px; 
	height:125px;
}
.saveBtn {
	margin-top:8px;
	font-weight:700;
	color:#FFFFFF;
	background-color:#B0B3BE;
	width:50px;
}

.typeLength {
	color:#999999;
	padding-top:10px;
}


.boxEditor2 {
	border: 1px solid #cccccc;
}

.boxEditorTextarea {
	height: 150px !important;
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

/* override quasar css */
.boxMessageTextarea {
	height: 150px !important;
	max-height: 200px;
}


</style>