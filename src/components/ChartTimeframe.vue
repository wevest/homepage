<template>

  <div class="q-pa-xs">
        <div v-if="period==='daily'">
            <q-toolbar class="text-primary">
                <q-tabs v-model="tab" shrink align="left">
                    <q-tab name="d1" :label="$t('name.d1')" @click="onClickTab('d1')"/>
                    <q-tab name="w1" :label="$t('name.w1')" @click="onClickTab('w1')"/>
                    <q-tab name="m1" :label="$t('name.m1')" @click="onClickTab('m1')"/>
                    <q-tab name="m3" :label="$t('name.m3')" @click="onClickTab('m3')"/>
                    <q-tab name="y1" :label="$t('name.y1')" @click="onClickTab('y1')"/>
                </q-tabs>
                <q-space />
            </q-toolbar>
        </div>

        <div v-if="period==='weekly'">
            <q-toolbar class="text-primary">
                <q-tabs v-model="tab" shrink align="left">
                    <q-tab name="w1" :label="$t('name.w1')" @click="onClickTab('w1')"/>
                    <q-tab name="m1" :label="$t('name.m1')" @click="onClickTab('m1')"/>
                    <q-tab name="m3" :label="$t('name.m3')" @click="onClickTab('m3')"/>
                    <q-tab name="y1" :label="$t('name.y1')" @click="onClickTab('y1')"/>
                </q-tabs>
                <q-space />
            </q-toolbar>
        </div>

        <div v-if="period==='monthly'">
            <q-toolbar class="text-primary">
                <q-tabs v-model="tab" shrink align="left">
                    <q-tab name="m1" :label="$t('name.m1')" @click="onClickTab('m1')"/>
                    <q-tab name="m3" :label="$t('name.m3')" @click="onClickTab('m3')"/>
                    <q-tab name="m6" :label="$t('name.m6')" @click="onClickTab('m6')"/>
                    <q-tab name="y1" :label="$t('name.y1')" @click="onClickTab('y1')"/>                    
                </q-tabs>
                <q-space />
            </q-toolbar>
        </div>

        <div v-if="period==='yearly'">
            <q-toolbar class="text-primary">
                <q-tabs v-model="tab" shrink align="left">
                    <q-tab name="m3" :label="$t('name.m3')" @click="onClickTab('m3')"/>
                    <q-tab name="m6" :label="$t('name.m6')" @click="onClickTab('m6')"/>
                    <q-tab name="y1" :label="$t('name.y1')" @click="onClickTab('y1')"/>                    
                    <q-tab name="y3" :label="$t('name.y3')" @click="onClickTab('y3')"/>                    
                    <q-tab name="y5" :label="$t('name.y5')" @click="onClickTab('y5')"/>
                    <q-tab name="y10" :label="$t('name.y10')" @click="onClickTab('y10')"/>
                </q-tabs>
                <q-space />
            </q-toolbar>
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
    data: function () {
        return {
            tab: this.selected,
        }
    },

    methods: {
        update: function(json_label) {
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

        onClickTab: function(timeframe) {
            console.log("ChartTimeframe=",timeframe);
            let ioffset = this.getOffset(timeframe);
            this.onclick(ioffset,timeframe);
        }
    }
}

</script>



<style scoped>

</style>