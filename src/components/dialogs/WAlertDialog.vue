<template>

    <div>

        <q-dialog v-model="v_show">
            <q-card>
                <q-card-section>
                    <div class="gListTitle q-mb-sm"> {{v_title}} </div>
                    <q-separator />
                </q-card-section>        
                
                <q-card-section>
                    <div class="gBodyMD">
                        {{v_desc}}
                    </div>
                </q-card-section>        

                <q-card-actions align="right">
                    <q-btn flat label="OK" color="primary" v-close-popup />
                </q-card-actions>                

            </q-card>

        </q-dialog>

    </div>

</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';



export default {
    name: 'WAlertDialog',
    components: {},
    computed: {},
    data: function () {
        return {
            v_show: false,

            v_title: 'Alert',
            v_desc: ''
        }
    },

    created: function () {},
    mounted: function() {},
    updated: function() {},
    
    methods: {      
        show: function(title,desc) {
            this.v_title = title;
            this.v_desc = desc;
            this.v_show = true;
        },

        hide: function() {
            this.v_show = false;
        },
    }

};
</script>


<style scoped>

</style>