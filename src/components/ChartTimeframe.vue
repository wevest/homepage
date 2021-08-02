<template>

  <div class="tab_bgcolor">
        <div v-if="period==='daily'">
            <q-tabs v-model="tab" active-color="primary" shrink  dense align="left">
                <q-tab name="d1" :label="$t('name.d1')" @click="onClickTab('1d')"/>
                <q-tab name="w1" :label="$t('name.w1')" @click="onClickTab('w1')"/>
                <q-tab name="m1" :label="$t('name.m1')" @click="onClickTab('m1')"/>
                <q-tab name="m3" :label="$t('name.m3')" @click="onClickTab('m3')"/>
                <q-tab name="y1" :label="$t('name.y1')" @click="onClickTab('y1')"/>
            </q-tabs>
        </div>

        <div v-if="period==='weekly'">
            <q-tabs v-model="tab" active-color="primary" shrink dense align="left">
                <q-tab name="w1" :label="$t('name.w1')" @click="onClickTab('w1')"/>
                <q-tab name="m1" :label="$t('name.m1')" @click="onClickTab('m1')"/>
                <q-tab name="m3" :label="$t('name.m3')" @click="onClickTab('m3')"/>
                <q-tab name="y1" :label="$t('name.y1')" @click="onClickTab('y1')"/>
            </q-tabs>
        </div>

        <div v-if="period==='monthly'">
            <q-tabs v-model="tab" shrink dense  active-color="primary" align="left">
                <q-tab name="m1" :label="$t('name.m1')" @click="onClickTab('m1')"/>
                <q-tab name="m3" :label="$t('name.m3')" @click="onClickTab('m3')"/>
                <q-tab name="m6" :label="$t('name.m6')" @click="onClickTab('m6')"/>
                <q-tab name="y1" :label="$t('name.y1')" @click="onClickTab('y1')"/>                    
            </q-tabs>
        </div>

        <div v-if="period==='yearly'">
            <q-tabs v-model="tab" shrink dense  active-color="primary" align="left">
                <q-tab name="m3" :label="$t('name.m3')" @click="onClickTab('m3')"/>
                <q-tab name="m6" :label="$t('name.m6')" @click="onClickTab('m6')"/>
                <q-tab name="y1" :label="$t('name.y1')" @click="onClickTab('y1')"/>                    
                <q-tab name="y3" :label="$t('name.y3')" @click="onClickTab('y3')"/>                    
                <q-tab name="y5" :label="$t('name.y5')" @click="onClickTab('y5')"/>
                <q-tab name="y10" :label="$t('name.y10')" @click="onClickTab('y10')"/>
            </q-tabs>
        </div>

        <div v-if="period==='all'">
            <q-tabs v-model="tab" shrink dense align="left"  active-color="primary">
                <q-tab name="d1" :label="$t('name.d1')" @click="onClickTab('1m')"/>
                <q-tab name="w1" :label="$t('name.w1')" @click="onClickTab('1h')"/>
<!--
                <q-tab name="m1" :label="$t('name.m1')" @click="onClickTab('1d')"/>
                <q-tab name="m3" :label="$t('name.m3')" @click="onClickTab('1d')"/>
-->                
                <q-tab name="y1" :label="$t('name.y1')" @click="onClickTab('1d')"/>
                <q-tab name="all" :label="$t('name.all')" @click="onClickTab('1w')"/>
            </q-tabs>
        </div>

  </div>

</template>


<script>
export default {
    name:'ChartTimeframe',
    components: {},

    props: {
        onclick: {
            type: Function,
            default: null,
        },
        period: {
            type: String,
            default: 'daily',
        },
        selected: {
            type: String,
            default: 'd1'
        }
    },
    watch: { 
      	selected: function(newVal, oldVal) { // watch it
          //logger.log.debug('Prop changed: ', newVal, ' | was: ', oldVal);
          this.tab = newVal;
        }
    },

    data() {
        return {
            tab: this.selected,
        }
    },

    methods: {
        update: function(json_label) {
        },

        setTimeframe: function(timeframe) {
            this.selected = timeframe;
            this.tab = timeframe;
        },

        getOffset: function(value) {
            let ioffset = 0;
            if (value=='m1') {
                ioffset = 30;
            } else if (value=='m3') {
                ioffset = 30*3;
            }
            else if (value=='m6') {
                ioffset = 30*6;
            }
            else if (value=='y1') {
                ioffset = 30*12;
            }            
            else if (value=='y3') {
                ioffset = 30*12*3;
            }            
            else if (value=='y5') {
                ioffset = 30*12*5;
            }            
            else if (value=='y10') {
                ioffset = 30*12*10;
            }            

            return ioffset;
        },

        onClickTab(timeframe) {
            logger.log.debug("ChartTimeframe=",timeframe);
            let ioffset = this.getOffset(timeframe);
            this.$emit("onClick",{timeframe:timeframe});
        }
    }
}

</script>



<style scoped>

</style>