<template>

     <div class="row no-wrap q-pa-md ReviewTextBox" v-show="visible">
        <div class="col">
            <div>
                <q-field label="Please type your review" 
                         borderless 
                         stack-label>            
                        <template v-slot:control>
                          <textarea 
                              class="self-center full-width ReviewTextBorder" 
                              tabindex="0" 
                              v-model="v_comments" 
                              :rows="v_rows" 
                              @focus="onFocus" @focusout="onFocusOut">
                          </textarea>
                        </template>              
                </q-field>
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

              <div  
                class="ReviewSaveBtn" 
                align="right">
                <q-btn
                  label="save"                                           
                  @click.stop="onClickSubmit"
                  v-if="showSaveButton">
                </q-btn>          
              </div> 
            </div>        
        </div>
    </div>

</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';


export default {
    name: "review-form",
    //mixins: [hasComments],
    props: {
        /**
         * Whether to show the save button.
         */
        showSaveButton: {
          type: Boolean,
          default: true
        },
        type: {
          validator(value) {
            return ['comment', 'reply'].includes(value)
          },
          default: 'comment'
        },
        visible: {
          type: Boolean,
          default: true
        },
  },

  data() {
    return {
      v_comments: 'reviews',
      v_style:'',
      v_rows:'1',
      v_rating: 5,
      v_error: { 
          error:false, msg:'',
      }
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
            this.$emit('update:visible', true)
        },
        hide() {
            this.$emit('update:visible', false)
        },
        remove() {
            this.$el.remove()
        },
        setOwnerMessage(data)     {
            console.log("CommentForm.setOwnerMessage=",data);
            this.ownerMessage = data;
        },
        activate() {
            // await this.$nextTick()
            if (this.$refs.contentInput) {
                this.$refs.contentInput.focus()
            } else if (this.$el.querySelector('#contentInput')) {
                this.$el.querySelector('#contentInput').focus()
            }
        },

        validate() {       
            console.log("CommentForm.validate");

            if (CommonFunc.isEmptyObject(this.v_comments)) {
                //return this.$message.warning('请输入内容')
                this.v_error.error = true;
                this.v_error.msg = "Please type something";
                return;
            }

            let dic_payload = {review:this.v_comments, rating:this.v_rating};
            //console.log("CommentForm.validate = ",dic_payload, this.type);

            this.$emit('onClickReviewSave', dic_payload);
        },

        /**
         * Save the new comment and reset the form states
         * @returns {Promise<Comment>}
         */
        onClickSubmit() {
            this.validate();
        },

        onFocus(event) {
            logger.log.debug("onFocus=",this.$parent);
            this.$emit('onEditorFocus',event);
        },

        onFocusOut(event) {
            logger.log.debug("onFocusOut=",this.$parent);
            this.$emit('onEditorFocusOut',event);
        }

    },

};
</script>


<style scoped>

.ReviewTextBox {
  border:1px solid #cccccc;  
  
}


.ReviewTextBorder {
  border:1px solid #cccccc;
}

.ReviewSaveBtn {
  padding-top:8px;
  color:#555555;
  width:100px;
}

.boxEditorTextarea {
  height:150px !important;
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
  height:150px !important;
  max-height:200px;
}

</style>