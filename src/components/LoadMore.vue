<template>
    
    <div>
		<div v-if="v_next_url">
			<q-btn label="loadMore" @click="onClickLoadMore" />
		</div>    
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


<style>

</style>