<template>
    
    <div>
        <q-field :label="label" borderless filled stack-label>            
            <template v-slot:control>
                <textarea class="self-center full-width boxTextarea" 
                    tabindex="0" 
                    :value="v_value" :rows="v_rows" 
                    @input="updateValue($event.target.value)"
                    @focus="onFocus" @focusout="onFocusOut">
                </textarea>
            </template>              
        </q-field>
    </div>

</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

export default{
    name:'WTextArea',
    model: {
        prop: 'modelValue',
        event: 'change'
    },
    props: {
        //value: { type:String},
        modelValue: { default:"" },

        label: {required:false, type:String, default:""},
        rows: {required:false, type:String},
    },
    data() {    
        return {
            v_rows: this.rows,
            v_model: this.model,
            v_value: this.modelValue,
        }
    },
    methods: {

        getValue() {
            return this.v_value;
        },

        setValue(value) {
            this.v_value = value;
        },

        updateValue(value) {
            this.$emit('update:modelValue',value);
            //logger.log.debug("WTextArea.updateValue : value=",value,this.modelValue);            
            this.v_value = value;
        },



        onFocus(event) {
            logger.log.debug("onFocus=",this.v_model);
            //this.model = this.v_model;
            this.$emit('onFocus',event);
        },

        onFocusOut(event) {
            logger.log.debug("onFocusOut=",this.v_model);
            //this.model = this.v_model;
            this.$emit('onFocusOut',event);
        }
    }

}
</script>


<style scoped>

.boxTextarea {
    border: none;
    margin-top:5px;
}

</style>
        