<template>
    
    <div>
        
		<div class="row justify-center loadMoreBox" v-if="v_next_url">
            <q-btn 
                class="expandMore" 
                icon-right="expand_more" 
                label="Loadmore" 
                dense 
                flat 
                @click="onClickLoadMore" />
		</div>    
             <!-- <q-separator class="loadmoreSeparator2" size="1px" /> -->
    </div>

</template>


<script>
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";


export default {
    name: 'LoadingSpinner',
    components: {
        //Spinner
    },
    data(){
        return {
            v_next_url:null,
            v_next: {
                limit:null,
                offset:null
            },
        }
    },

    methods: {
        setPageParameter:function(next_url) {
            this.v_next_url = next_url;

			const limit = CommonFunc.substrInBetween(this.v_next_url,'limit=','&');
			const offset = CommonFunc.substrInBetween(this.v_next_url+"&",'offset=','&');

            this.v_next.limit = limit[0];
            this.v_next.offset = offset[0];
        },

        onClickLoadMore: function() {
            let dic_param = {next_url:this.v_next_url, param:this.v_next};
            this.$emit("onClickLoadMore",dic_param);
        }
    }
}
</script>


<style scope>

.loadmoreSeparator1 {
    margin-bottom:10px;
}

.loadmoreSeparator2 {
    margin-bottom:10px;

}

.loadMoreBox {
    padding:5px 0px;
    color:#333333;

}
</style>