<template>
	<div class="row no-wrap q-pa-md ReviewTextBox" :style="v_style" v-show="visible" @click="onClick">
		<div class="col">
			<div class="q-pb-lg row" v-if="v_me.loggedIn">
				<div class="q-pr-md">
					<WAvatar :avatar="v_me.avatar_thumb" :username="v_me.username" />
				</div>
				<div class="gUserNameSM q-pt-md"> {{v_me.username}} </div>
			</div>

			<div class="q-pb-sm">
				<WTextArea
					ref="descText"				
					hint="Please Type your review"                
					v-model="v_comments"
					:rows="v_rows"
                    @onFocus="onFocus"
                    @onFocusOut="onFocusOut"
				/>
			</div>

			<q-rating
				v-if="v_me.loggedIn"
				v-model="v_rating"
				size="2.0em"
				icon="star_border"
				icon-selected="star"
				color="red-5"
			/>

			<div class="row">
				
				<q-space />

				<div align="right" v-if="v_me.loggedIn">
					<q-btn
						class="gButtonMD" label="save" ripple
						:loading="v_loading"
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
import { CONST } from 'src/data/const';
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";
import WTextArea from "src/components/WTextArea";
import WAvatar from "src/components/WAvatar";

import {AssetReviewPageModel} from "src/models/PageModel";


export default {
	name: "review-form",
	components: {
		WAvatar,
		WTextArea,
	},
	//mixins: [hasComments],
	props: {
        category: {
            required: false,
            type:String,
            default: ''
        },
        objectId: {
            required: false,
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
	computed: {
        v_me() {
            return store.getters.me;
        },
	},
	data() {
		return {
            v_review: null,

			v_comments: "",
			v_style: "",
			v_loading: false,

			v_rows: "1",
			v_rating: 5,
			v_error: {
				error: false,
				msg: "",
			},
		};
	},
	watch: {},

	mounted() {
		logger.log.debug("AssetReviewForm.mounted");
		this.prepare();
	},

	methods: {
		prepare() {
			//logger.log.debug("Comment-Form.prepare : v_me=",this.v_me);
			if (this.v_me.loggedIn) {
				this.$refs.descText.setHint("Please type your review");
				this.$refs.descText.setEnabled(true);
			} else {
				this.$refs.descText.setHint("Please log-in to write comments");
				this.$refs.descText.setEnabled(false);
			}
		},

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
			this.$refs.descText.setStyle("border:none;");
            this.$refs.descText.setValue(this.v_comments);
			this.$refs.descText.setRows(1);
        },

		setReview(review) {
			logger.log.debug("AssetReviewForm.setReview=", review);
			
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
            
			let tags = [this.category,CONST.REVIEW_CATEGORY + this.category];
			let dic_param = {
				object_id: 1,
                category: this.category,
                review: CommonFunc.addHashTag(this.v_comments,tags),
				rating: this.v_rating,
			};
            
            let a_review = this.v_review;
            if (! this.v_review) {
                a_review = new AssetReviewPageModel();
            }
            
            dic_param.id = a_review.id;
            logger.log.debug('AssetView.onClickReviewSave - ',dic_param);       

			this.v_loading = true;
            a_review.save(dic_param).then( response => {
                logger.log.debug('AssetView.onClickReviewSave - response = ',response);
                //_this.$refs.reviewList.addReview(response.data);
                _this.clear();
				_this.v_loading = false;
				dic_param.response = response;                
				CommonFunc.showOkMessage(_this,'review posted');
                _this.$emit("onClickReviewSave", dic_param);
            }).catch( err => {
				_this.v_loading = false;
                CommonFunc.showErrorMessage(_this,'review posting error');
            });
        },



		/**
		 * Save the new comment and reset the form states
		 */
		onClickSubmit() {

            this.v_comments = this.$refs.descText.getValue();
			if (! this.validate()) {
                this.$refs.descText.setErrorMessage('Please type your review');
				return;
            }
			this.$refs.descText.setErrorMessage(null);
            this.save();
		},

		onFocus(event) {
			logger.log.debug("onFocus=", this.$parent);
			if (! this.v_me.isLoggedIn()) {
				return;
			}
			this.$refs.descText.setStyle("border:1px solid #e0e0e0;");
			this.$refs.descText.setRows(7);
			this.$emit("onEditorFocus", event);
		},

		onFocusOut(event) {
			logger.log.debug("onFocusOut=", this.$parent);			
			this.$emit("onEditorFocusOut", event);
		},

		onClick() {
			logger.log.debug("AssetReviewForm.onClick : parent=",this.$parent);

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
.ReviewTextBox {
	border: 1px solid #cccccc;
	border-radius: 8px;
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