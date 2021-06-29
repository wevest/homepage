<template>
	<div class="row no-wrap q-pa-md boxEditor" v-show="visible">
		<!-- items-center-->
		<div class="col">
			<div>
                <WTextArea v-model="v_comments" :rows="v_rows" ref="descText" 
                    label="Please type your comments" 
                    @onFocus="onFocus"
                    @onFocusOut="onFocusOut"                
                />
<!--
				<q-field
					label="Please type your comments"
					borderless
					stack-label
				>
					<template v-slot:control>
						<textarea
							class="self-center full-width boxEditor2"
							tabindex="0"
							v-model="v_comments"
							:rows="v_rows"
							@focus="onFocus"
							@focusout="onFocusOut"
						></textarea>
					</template>
				</q-field>
-->
				<!--              
            <q-input
                label="Please type your comments"
                filled counter
                v-model="v_comments"
                @focus="onFocus"
                autogrow
                type="textarea"
                id="contentInput"
                ref="contentInput"            
                input-class="boxMessageTextarea"
                :input-style="v_style"
                :error="v_error.error"
                :error-message="v_error.msg"
            />
-->
			</div>

			<div class="boxEditorCommand" align="right">
				<q-btn
					class="blogCommentSave"
					label="save"
					size="12px"
					color="primary"
					@click.stop="onClickSubmit"
					v-if="showSaveButton"
				>
				</q-btn>
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
	},
	data() {
		return {
			saving: false,
			ownerMessage: null,
			v_comments: null,
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
		//this.$emit("update:saving", this.saving);
	},

	/**
	 * Emit changes to local properties
	 */
	watch: {},

	methods: {
		show() {
			// this.visible = true
			this.$emit("update:visible", true);
		},
		hide() {
			this.$emit("update:visible", false);
		},
		remove() {
			this.$el.remove();
		},
		setOwnerMessage(data) {
			console.log("CommentForm.setOwnerMessage=", data);
			this.ownerMessage = data;
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
	},
};
</script>


<style scoped>

.blogCommentSave {
	margin-top:10px;
}

.boxEditor {
	border: 1px solid #cccccc;
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