<template>

    <div class="q-pa-md" style="background-color: #00e324;">

        <div>
            
            <div style="padding:100px;">
                <q-img src="~assets/images/white_woman.png" style="background-color: #00e324; border-style:solid;border-width:10px;border-top-style:none;" />
            </div>
            <div class="text-center">
                <h3 class="title1">
                    <b>‘VAR and ADAPTIVE’</b>
                    <br>
                    risk management 
                </h3>
                <p class="description">
                   We measure risk via var, based on the var value<br> 
                wevest protocol dynamically adjust collateral ratio to minimize risk exposure
                </p>
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