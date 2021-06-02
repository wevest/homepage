<template>

    <div>
        <q-input
            :label="`Add ${this.parentId ? 'reply' : 'comment'}`"
            :value="value_.comment"
            @input="handleInput('comment', $event)"
            autogrow
            hide-details
            multi-line
            ref="input"
            rows="1"
            type="textarea"
        />

        <q-btn
            :class="[saveButtonIsDisabled ? 'grey--text text--darken-2' : 'primary--text']"
            :disabled="saveButtonIsDisabled"
            @click.stop="submit"
            v-if="showSaveButton">
        {{ saving ? 'Saving...' : 'Save' }}
        </q-btn>
        
    </div>

</template>


<script>
import _get from "lodash.get";

// Models
import Comment from "src/store/Comment";

// Mixins
import hasComments from "components/comments/mixins/hasComments";


export default {
  name: "comment-form",
  mixins: [hasComments],
  props: {
    /**
     * Whether to show the save button.
     */
    showSaveButton: {
      type: Boolean,
      default: true
    },

    /**
     * The parent comment
     */
    parent: [Object, Comment],

    /**
     * The current value of the comment
     */
    value: [Object, Comment]
  },

  data() {
    return {
      saving: false
    };
  },

  computed: {
    /**
     * The parent comment's ID
     */
    parentId() {
      return _get(this.parent, "id", null);
    },

    /**
     * Disable the save button when the field is empty or already saving
     */
    saveButtonIsDisabled() {
      return !Boolean(this.value_.comment) || this.saving;
    },

    /**
     * Prevent mutating state by using a instance of `value`, and emit any changes.
     * @returns {Array}
     * @see this.value
     */
    value_: {
      get() {
        if (!this.value) return this.getNewComment();
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      }
    }
  },

  methods: {
    /**
     * Initialize a blank comment
     * @returns {Comment}
     */
    getNewComment() {
      const idPrefix = ["tmp"];
      if (this.parentId) {
        idPrefix.push(this.parentId);
      }
      const id = idPrefix.join("_");
      const currentUser = this.$store.getters["entities/users/currentUser"];

      return new Comment({
        id,
        commentable_id: this.commentableId,
        commentable_type: this.commentableType,
        user_id: currentUser.id,
        user: currentUser,
        parent_id: this.parentId,
        parent: this.parent
      });
    },

    /**
     * On input, update the local value and emit the change
     * @prop {string} key - The property of the value to change
     * @prop {string} value - The new value of that property
     */
    handleInput(key, value) {
      this.$set(this.value_, key, value);
    },

    /**
     * Save the new comment and reset the form states
     * @returns {Promise<Comment>}
     */
    submit() {
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
    }
  },

  mounted() {
    // Emit initial values of local properties
    this.$emit("update:saving", this.saving);
  },

  /**
   * Emit changes to local properties
   */
  watch: {
    saving(newVal, oldVal) {
      this.$emit("update:saving", newVal);
    }
  }
};
</script>
