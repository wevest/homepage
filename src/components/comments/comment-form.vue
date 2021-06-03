<template>

     <div class="row no-wrap items-center q-pa-md boxEditor" v-show="visible">
        <div class="col">
          <div>
            <q-input
                label="Please type your comments"
                filled counter
                v-model="v_comments"
                @focus="$emit('editor-focus',$event)"
                autogrow
                type="textarea"
                id="contentInput"
                ref="contentInput"            
                input-style=""
                :error="v_error.error"
                :error-message="v_error.msg"
            />
          </div>
          
          
          
          <div class="boxEditorCommand" align="right">
            <q-btn
              label="save"
              @click.stop="onClickSubmit"
              v-if="showSaveButton">
            </q-btn>
          
          </div>        

      </div>

    </div>

</template>


<script>
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';
import CMSAPI from 'src/services/cmsService';


export default {
  name: "comment-form",
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
      saving: false,
      ownerMessage: null,
      v_comments: null,
      v_error: { 
          error:false, msg:'',
      }
    };
  },

  computed: {
    editorLabelTitle() {
      return this.type === 'comment'
        ? 'Comments'
        : this.type === 'reply'
        ? 'Reply'
        : 'Comments'
    }
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
      if (CommonFunc.isEmptyObject(this.v_comments)) {
        //return this.$message.warning('请输入内容')
        this.v_error.error = true;
        this.v_error.msg = "Please type something";
        return;
      }
    
      console.log("CommentForm.validate = owner : ", this.ownerMessage);

      let dic_payload = {"comments":this.v_comments};
      if (this.type === 'reply') {
        dic_payload.data = this.ownerMessage;
      }

      //console.log("CommentForm.validate = ",dic_payload, this.type);

      this.$emit('onClickCommentSave', dic_payload);
    },

    /**
     * Save the new comment and reset the form states
     * @returns {Promise<Comment>}
     */
    onClickSubmit() {
      this.validate();
/*      
      this.saving = true;

      return new Promise((resolve, reject) => {
        Comment.dispatch("createComment", this.value_)
          .then(comment => {
            this.value_ = this.getNewComment();
            this.$emit("saved", comment);

            return resolve(comment);
          })
          .finally(() => {
            this.saving = false;
          });
      });
*/      
    }
  },

  mounted() {
    // Emit initial values of local properties
    //this.$emit("update:saving", this.saving);
  },

  /**
   * Emit changes to local properties
   */
  watch: {
  }
};
</script>


<style scoped>

.boxEditor {
  /* padding:10px; */
  border:1px solid #cccccc;
  height:250px;
}

.boxEditorCommand {
  border-top:1px solid #cccccc;
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
</style>