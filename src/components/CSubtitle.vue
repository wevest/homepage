<template>

    <div class="ctitle">
        <h5 class="title">{{ $t(title) }}</h5>
        <p class="desc">
            {{ $t(desc)}}
        </p>
    </div>

</template>


<script>
export default {
    name: 'CSubtitle',
    components: {},
    props: {
        title: {
            type: String,
            default: '',
        },
        desc: {
            type: String,
            default: '',
        },
    },
    computed: {
    },
    data: function () {
        return {
            g_data: null,
            g_period: 200,
        }
    }
}
</script>            



<style scoped>

.ctitle {
/*    border-bottom: 1px solid #ccc; */
    margin-bottom: 0.0rem;    
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 0.0rem;    
}

.ctitle, .title {
    text-transform: uppercase;
    color: rgba(13, 27, 62, 0.7);
    font-weight: bold;
    font-size: 1.0rem;
}

</style>