<template>

    <div class="row ctitle">
        <div :class="v_class">                
            {{ title }}
        </div>
        <q-space v-if="loadMoreCaption.length>0" />
        <div>                
            <q-btn :label="loadMoreCaption" @click="onClickMore" v-if="loadMoreCaption.length>0" />
        </div>
    </div>

</template>


<script>
import logger from "src/error/Logger";


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
        loadMoreCaption: {
            type:String,
            default:""
        }
    },
    computed: {
        v_class() {
            if (this.ttype=="title") {
                return "text-h4 text-weight-bolder q-my-lg text-center";
            }
            return "text-h6 text-weight-bold q-my-md";
        },
    },
    data: function () {
        return {
        }
    },
    methods: {        
        onClickMore: function() {
            this.$emit("onClickTitleMore",{});
        }
    }
}
</script>            



<style scoped>

.ctitle {
    text-transform: uppercase;
/*     
    margin-top: 1.5rem;    
    margin-bottom: 1.0rem;     
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
    border-bottom: 3px solid #777777;     
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