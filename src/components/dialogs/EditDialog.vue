<template>
    
    <div :width="width">
        
        <q-dialog v-model="v_show" full-width>
            <q-card>
                <q-card-section >
                    <div class="text-h6">{{ title }}</div>
                    <div class="gBodyMD"> {{desc}} </div>
                </q-card-section>

                <q-card-section>
                    <q-input ref="txtInput" v-model="v_value" 
                        :type="v_type" counter :maxlength="v_maxlength" 
                        :error="v_error" :error-message="v_error_msg" />
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
        desc: { required:false, type:String, default: ''},
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
            v_type:'text',

            v_error: false,
            v_error_msg: '',
        }
    },
    methods: {

        checkEmail(value) {
            // eslint-disable-next-line
            let reg =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
            let valid = reg.test(value)
            if (valid) {
                this.v_error = false;
                this.v_error_msg = '';
            } else {
                this.v_error = true;
                this.v_error_msg = 'eMail format is wrong';
            }

            return valid;
        },

        show: function(tag,etype,value) {
            logger.log.debug("EditDialog.show : value=",value);
            
            this.v_tag = tag;
            this.v_value = value;
            this.v_type = etype;
            
            this.v_show = true;
        },

        hide: function() {
            this.v_show = false;
        },        
        setMaxlength(value) {
            this.v_maxlength = value;
        },

        onClickSave() {
            if (this.v_tag=="email") {
                if (! this.checkEmail(this.v_value)) {
                    return;
                }
            }
            this.$emit("onSave",{tag:this.v_tag,value:this.v_value});
            this.hide();
        }
    }
};

</script>


<style scoped>

</style>