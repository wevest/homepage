<template>

    <div class="TextareaBox">
        <textarea 
            ref="txtMemo"
            class="self-center full-width"             
            tabindex="0"
            :class="customClass"
            :style="v_style"
            :disabled="v_disabled"
            :placeholder="v_hint"
            :maxlength="maxlength"
            :value="v_value" :rows="v_rows" 
            @input="updateValue($event.target.value)"
            @focus="onFocus" @focusout="onFocusOut">
        </textarea>

        <div class="gErrorMsg" v-if="v_error.msg">
            {{v_error.msg}}
        </div>

        <div v-if="showLength=='1'">
            <span class="gCaption">{{v_length}}</span>
        </div>
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

        maxlength: {required:false, type:Number, default:300},
        hint: {
            required:false, 
            type:String, 
            default:""
        },
        label: {
            required:false, 
            type:String, 
            default:""
        },
        rows: {required:false, type:String},
        showLength: {
            type:String,
            default:"0",
        },
        customStyle: {
            type:String,
            default:"border:none;"
        },
        customClass: {
            type:String,
            default:""
        }
    },
    data() {    
        return {
            v_hint: this.hint,
            v_length: '0 of 300',
            
            v_style: this.customStyle,

            v_rows: this.rows,
            v_model: this.model,
            v_value: this.modelValue,
            v_disabled:false,

            v_error: {
                msg:null
            }
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
            logger.log.debug("WTextArea.setRows : txtMemo=",this.$refs.txtMemo);
            this.v_rows = value;            
        },
        setErrorMessage(msg) {
            this.v_error.msg = msg;
        },
        setStyle(value) {
            this.v_style=value;
        },

        showBorder() {
            this.setStyle("border:1px solid #e1e1e1;");
        },
        hideBorder() {
            this.setStyle("border:none;");
        },
        

        setFocus() {
            this.$refs.txtMemo.focus();
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
            logger.log.debug("WTextArea.onFocus:event=",event);
            //this.model = this.v_model;
            this.$emit('onFocus',event);
        },

        onFocusOut(event) {
            logger.log.debug("WTextArea.onFocusOut:event=",event);
            //this.model = this.v_model;
            //this.$emit('onFocusOut',event);
        }
    }

}
</script>


<style scoped>

.TextareaBox {
/*    border: 1px solid #d6d6d8;  */
    margin-top:5px;
}

</style>
        