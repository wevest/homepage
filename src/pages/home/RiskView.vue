<template>

    <div class="q-ma-md">

        <div>
            
            <div>
                <q-img src="~assets/images/asian_man.png" />
            </div>
            <div>
                win-win
            </div>

        </div>

    </div> 


</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
import logger from "src/error/Logger";
import CTitle from 'src/components/CTitle';

export default {
    name: 'CSectorChart',
    components: {
        CTitle
    },
    data() {
        return {
            g_data: null,
            g_period: 200,
            g_height: "500",
            g_title:"",

            g_chart: {
                'chart1': {
                    series: [],                  
                },
                'chart2': {
                    series: [],                  
                },
                'chartTick': {
                    series: [],                  
                },
            },
        }
    },


    methods: {
    
    }
}
</script>