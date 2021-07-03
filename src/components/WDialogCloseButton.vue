<template>
    <div>
        <q-icon name="clear" :size="v_size" @click="onClickClose" />
    </div>
</template>

<script>


export default {
    props: {
        size: {
            type: String,
            default: '28px'
        }
    },
    data () {
        return {
            v_size: this.size,
        }
    },
    methods: {
        onClickClose() {
            this.$emit("onClick",{});
        },
    }
};

</script>
