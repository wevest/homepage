<template>
    
    <div>
        
		<div class="row justify-center loadMoreBox" v-if="v_next_url">
            <q-btn 
                class="expandMore" 
                dense flat ripple
                icon-right="expand_more" 
                :label="$t('button.lordmore')" 
                :loading="v_loading"
                @click="onClickLoadMore" />
		</div>            
    </div>

</template>


<script>
import { Config } from 'src/data/Config';
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

export default {
    name: 'WLoadMore',
    components: {
        //Spinner
    },
    data(){
        return {
            v_loading:false,
            v_next_url:null,
            v_count: 0,
            v_next: {
                limit:Config.setting.defaultLimit,
                offset:0,
                uuid:null,
            },
        }
    },

    methods: {
        clear() {
            this.v_next_url = null;
            this.v_count = 0;
            this.v_next = {
                limit:Config.setting.defaultLimit,
                offset:0,
                uuid:null,
            };
        },
        getCount() {
            return this.v_count;
        },
        setLoading(value) {
            if (value) {
                this.v_loading = true;
            } else {
                this.v_loading = false;
            }
        },        
        setPageParameter:function(result) {
            //logger.log.debug("LoadMore.setPageParameter : result=", result);

            this.v_count = result.count;
            this.v_next_url = result.next;

			const limit = CommonFunc.substrInBetween(this.v_next_url,'limit=','&');
			const offset = CommonFunc.substrInBetween(this.v_next_url+"&",'offset=','&');

            this.v_next.limit = limit[0];
            this.v_next.offset = offset[0];
            this.setLoading(false);
        },

        setPagination:function(items,offset,limit) {
            
            if (items.length<limit) {
                this.v_next_url = "";
            } else {
                this.v_next_url = "next_url";
            }
            
            this.v_next.limit = limit;
            this.v_next.offset = offset;
            this.setLoading(false);
        },

        setFeedPagination:function(next_url) {                                                
            this.v_next_url = next_url;
            this.v_next.uuid = CommonFunc.substrInBetween(next_url,"lt=","&limit")[0];
            this.v_next.limit = CommonFunc.substrInBetween(next_url+"*","limit=","*")[0];
            this.v_next.offset = null;
            
            this.setLoading(false);
            logger.log.debug("setFeedPagination:next_url=",next_url,this.v_next);
        },

        onClickLoadMore: function() {
            let dic_param = {next_url:this.v_next_url, param:this.v_next};
            this.setLoading(true);
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