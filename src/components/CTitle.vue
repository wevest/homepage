<template>

    <div>

        <div class="ctitle" v-if="ttype==='title'">
            <h5 class="title">{{ title }} <span class="desc">{{ desc }} </span></h5> 
        </div>
        <div class="ctitle" v-if="ttype==='subtitle'">
            <h6 class="subtitle">{{ title }} &nbsp; <span class="desc">{{ desc }} </span></h6> 
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
            default: 'description',
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
    text-transform: uppercase;
    margin-top: 1.5rem;    
    margin-bottom: 1.0rem; 

    /* 
    padding: 0.0rem;       
    border-bottom: 1px solid #ccc;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    */
}

.title {
    font-weight: bold;
    color:#343434;
    margin-block-start:0.5rem;
    margin-block-end:0.2rem;
    border-bottom: 3px solid #333333; 

    /* 
        margin : 0.1rem 0 0.1rem 0;    
        font-size: 1.0rem; 
        color: rgba(13, 27, 62, 0.7);        
    */
}

.subtitle {
    font-weight: bold;
    color:343434;
    margin-block-start:0.5rem;
    margin-block-end:0.5rem;
    /* 
    font-weight: bold; 
    margin-top: 0.5rem;     
    */
}

.desc {
  text-transform: lowercase;
  color:#555555;
  font-size: 0.7rem;
  font-weight: 400;
  padding-left: 0.8rem;  
}

/* box-shadow: 5px 5px 5px; */
</style>