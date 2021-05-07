<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-full.svg"
    >
    <highcharts class="hc" :options="g_chart['chart1']" ref="chart1"></highcharts>    
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',

  data: function () {
    return {
        g_chart: {
            'chart1': {
                series: [{data:[1,2,3,1,2,3,4,1,2]}],                  
            },
            'chart2': {
                series: [],                  
            },
        },
      }
  }  
};
</script>
