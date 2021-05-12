<template>
    
    <div class="row">        
        <div class="ctitle" v-if="ttype==='title'">
            <h5 class="title">{{ title }} <span class="desc">{{ desc }} </span></h5> 
        </div>
        <div class="ctitle" v-if="ttype==='subtitle'">
            <h6 class="title">{{ title }} &nbsp; <span class="desc">{{ desc }} </span></h6> 
        </div>

    </div>

</template>


<script>
export default {
    name: 'CTitle',
    components: {},
    props: {
        ttype: {
            type: String,
            default: 'title',            
        },
        title: {
            type: String,
            default: '',
        },
        desc: {
            type: String,
            default: 'jhgjhgjhgjhgjhgjhg',
        },
    },
    computed: {
    },
    data: function () {
        return {
        }
    }
}
</script>            



<style scoped>

.ctitle {
    margin-bottom: 0.0rem;    
    padding: 0.0rem;        
    
    border-bottom: 1px solid #ccc;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    
}

.ctitle, .title {
    text-transform: uppercase;
    font-weight: bold;
    margin: 0.5rem 0 0.5rem 0;
    /* 
        font-size: 1.0rem; 
        color: rgba(13, 27, 62, 0.7);        
    */
}

.ctitle, .desc {
    color: rgba(13, 27, 62, 0.7);
    font-size: 0.7rem;
    padding-left: 0.0rem;
    /* font-weight: bold; */
}

</style>