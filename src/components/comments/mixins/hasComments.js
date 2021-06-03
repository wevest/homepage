import Comment from "src/store/PostModel";

export default {
  props: {
    /**
     * The commentable entity ID to use for creating or querying comments
     * @see Comment
     */
    commentableId: {
      type: Number,
      required: false // Not required to account for usage on /launch/new/
    },

    /**
     * The commentable entity type to use for creating or querying comments
     * @see Comment
     */
    commentableType: {
      type: String,
      required: true,
      validator: value => ["launches", "tasks"].indexOf(value) !== -1
    }
  }
};
