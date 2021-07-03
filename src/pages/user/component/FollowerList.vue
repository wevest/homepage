<template>
    
    <div>

    </div>

</template>


<script>
import {store} from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";


export default {
    name:'FollowerList',    
    components: {

    },
    props: {},

    data: () => ({
        g_data: null,

        v_user: null,

    }),
    computed: {
        v_updated_at() {
            return (value) => {
                return CommonFunc.minifyDatetime(value);
            };
        },
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,MoaConfig.setting.maxPortfolioDescriptionLength);
            };
        }
    },

    mounted: function() {},

    methods: {        

        update: function(v_portfolio) {
            this.v_portfolio = v_portfolio;
        },
    }

};

</script>

<style scope> 

</style>
