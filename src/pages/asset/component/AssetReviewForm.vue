<template>
	<div class="row no-wrap q-pa-md ReviewTextBox" :style="v_style" v-show="visible">
		<div class="col">
			<div>
				<WTextArea
					label="Please Type your review"                
					v-model="v_comments"
					:rows="v_rows"
					ref="descText"
                    @onFocus="onFocus"
                    @onFocusOut="onFocusOut"
				/>
				
			</div>

			<q-rating
				v-model="v_rating"
				size="2.0em"
				icon="star_border"
				icon-selected="star"
				color="amber-9"
			/>

			<div class="row">
				
				<q-space />

				<div class="ReviewSaveBtn" align="right">
					<q-btn
						label="save"
						@click.stop="onClickSubmit"
						v-if="showSaveButton"
					>
					</q-btn>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";
import WTextArea from "src/components/WTextArea";

import {AssetReviewPageModel} from "src/models/PageModel";


export default {
	name: "review-form",
	components: {
		WTextArea,
	},
	//mixins: [hasComments],
	props: {
        category: {
            required: true,
            type:String,
            default: ''
        },
        objectId: {
            required: true,
            type: Number,
            default:-1
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
            v_review: null,

			v_comments: "",
			v_style: "",

			v_rows: "1",
			v_rating: 5,
			v_error: {
				error: false,
				msg: "",
			},
		};
	},

	computed: {},
	watch: {},

	mounted() {
		// Emit initial values of local properties
		//this.$emit("update:saving", this.saving);
	},

	methods: {
		show() {
			// this.visible = true
			this.v_style="display:block";
		},
		hide() {
			this.v_style="display:none";
		},

        clear() {
            this.v_comments = "";
            this.v_rating = 5;
            this.$refs.descText.setValue(this.v_comments);
        },

		setReview(review) {
			console.log("AssetReviewForm.setReview=", review);
			
            this.v_review = review;
            this.v_comments = this.v_review.content;
            this.v_rating = this.v_review.average_rating;
            this.$refs.descText.setValue(this.v_comments);
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
			console.log("AssetReviewForm.validate");

			if (CommonFunc.isEmptyObject(this.v_comments)) {
				this.v_error.error = true;
				this.v_error.msg = "Please type something";
				return false;
			}

            return true;
		},

        save: function() {
            const _this = this;
            
			let dic_param = {
				object_id: this.objectId,
                category: this.category,
                review: this.v_comments,
				rating: this.v_rating,
			};
            
            let a_review = this.v_review;
            if (! this.v_review) {
                a_review = new AssetReviewPageModel();
            }
            
            dic_param.id = a_review.id;
            logger.log.debug('AssetView.onClickReviewSave - ',dic_param);       

            a_review.save(dic_param).then( response => {
                logger.log.debug('AssetView.onClickReviewSave - response = ',response);
                //_this.$refs.reviewList.addReview(response.data);
                dic_param.response = response;
                CommonFunc.showOkMessage(_this,'review posted');
                _this.$emit("onClickReviewSave", dic_param);
            }).catch( er => {
                CommonFunc.showErrorMessage(_this,'review posting error');
            });
        },



		/**
		 * Save the new comment and reset the form states
		 */
		onClickSubmit() {

            this.v_comments = this.$refs.descText.getValue();
			if (! this.validate()) {
                return;
            }
            this.save();
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
.ReviewTextBox {
	border: 1px solid #cccccc;
}

.ReviewTextBorder {
	border: 1px solid #cccccc;
}

.ReviewSaveBtn {
	padding-top: 5px;
	color: #555555;
	width: 100px;
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