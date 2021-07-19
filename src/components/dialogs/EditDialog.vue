<template>
    
    <div :width="width">
        
        <q-dialog v-model="v_show" full-width>
            <q-card>
                <q-card-section >
                    <div class="text-h6">{{ title }}</div>
                </q-card-section>

                <q-card-section>
                    <q-input v-model="v_value" :type="v_type" counter :maxlength="v_maxlength" />
                </q-card-section>

                <q-card-actions align="around">
                    <q-btn flat v-close-popup>Cancel</q-btn>
                    <q-btn flat @click="onClickSave">Save</q-btn>
                </q-card-actions>
            </q-card>

        </q-dialog>

    </div>

</template>



<script>
import { MoaConfig } from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';


export default {
    props: {
        title: { required:false, type:String, default: ''},
        width: {
            type: String,
            default: "400px"
        }
    },
    computed: {
        v_style() {
            return "width:"+this.width+";";
        }
    },
    data() {
        return {
            v_show: false,
            
            v_maxlength: 100,
            v_value: '',
            v_tag: '',
            v_type:'text'
        }
    },
    methods: {

        show: function(tag,etype,value) {
            logger.log.debug("EditDialog.show : value=",value);
            
            this.v_tag = tag;
            this.v_value = value;
            this.v_type = etype;

            if (this.v_type=="text") {
                this.v_maxlength=100;
            } else if (this.v_type=="textarea") {
                this.v_maxlength=3000;
            }

            this.v_show = true;
        },

        hide: function() {
            this.v_show = false;
        },        

        onClickSave() {
            this.$emit("onSave",{tag:this.v_tag,value:this.v_value});
            this.hide();
        }
    }
};

</script>


<style scoped>

</style>