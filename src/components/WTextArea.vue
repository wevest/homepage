<template>

    <div>
        <textarea class="self-center full-width boxTextarea" 
            tabindex="0" rounded
            :disabled="v_disabled"
            :placeholder="v_hint"
            :maxlength="maxlength"
            :value="v_value" :rows="v_rows" 
            @input="updateValue($event.target.value)"
            @focus="onFocus" @focusout="onFocusOut">
        </textarea>
    </div>

<!--
    <div>
        <q-field label="" borderless filled stack-label>            
            <template v-slot:control>
                <textarea class="self-center full-width boxTextarea" 
                    tabindex="0" 
                    :disabled="v_disabled"
                    :placeholder="v_hint"
                    :maxlength="maxlength"
                    :value="v_value" :rows="v_rows" 
                    @input="updateValue($event.target.value)"
                    @focus="onFocus" @focusout="onFocusOut">
                </textarea>
            </template>              
        </q-field>
    </div>
-->

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

        maxlength: {required:false, type:Number, default:300},
        hint: {required:false, type:String, default:""},
        label: {required:false, type:String, default:""},
        rows: {required:false, type:String},
    },
    data() {    
        return {
            v_hint: this.hint,
            v_length: '0 of 300',
            v_rows: this.rows,
            v_model: this.model,
            v_value: this.modelValue,
            v_disabled:false,
        }
    },
    methods: {
        clear() {
            this.v_value = "";
        },
        getValue() {
            return this.v_value;
        },

        setValue(value) {
            this.v_value = value;
        },

        setHint(value) {
            this.v_hint = value;
        },
        setEnabled(value) {
            this.v_disabled = ! value;
        },
        setRows(value) {
            this.v_rows = value;
        },

        updateValue(value) {
            //this.$emit('update:modelValue',value);
            //logger.log.debug("WTextArea.updateValue : value=",value,this.modelValue);            
            
            if (value.length>=this.maxlength) {
                const msg = "You can write less than "+this.maxlength.toString()+" chars";
                CommonFunc.showErrorMessage(this,msg);            
            }
            
            this.v_value = value;
            this.v_length = value.length + ' / ' + this.maxlength.toString();
            this.$emit("onTextChange",this.v_value);
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
    border: 1px solid #d6d6d8; 
    margin-top:5px;
}

</style>
        