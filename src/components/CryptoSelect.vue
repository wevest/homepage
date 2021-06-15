<template>
    
    <div>

        <q-select                
            class="full-width"
            ref="assetSearch"          
            v-model="g_asset" use-input fill-input hide-selected borderless
            input-debounce="0"
            :options="v_options"
            @filter="filterFn"
            @input="onSearchInput"
            @input-value="onSearchChange"
            @new-value="onSearch"
            @keyup.enter.native="onSearchEnter"
            behavior="menu"
        >

            <template v-slot:prepend>
                <q-icon name="search" @click.stop />
            </template>

            <template v-slot:option="scope">
                <q-item
                    v-bind="scope.itemProps"
                    v-on="scope.itemEvents">
                    
    <!--              
                <q-item-section avatar>
                    <q-icon :name="scope.opt.icon" />
                </q-item-section>
    -->              
                    <q-item-section>
                        <q-item-label v-html="scope.opt.label" />
                        <q-item-label caption>{{ scope.opt.value }}</q-item-label>
                    </q-item-section>
                </q-item>
            </template>

            <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                    No results
                    </q-item-section>
                </q-item>
            </template>

        </q-select>

    </div>

</template>
  


<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import LocalStorageService from 'src/services/localStorage';


export default {
    name: 'CryptoSelect',
    components: { 

    },
    data() {
        return {
            g_asset:null,
            g_input: null,

            g_options: [],
            v_options: [],
        };
    },

    updated: function() {},
    created: function() {},
    mounted: function () {
        this.loadCoinCodes();
    },

    methods: {

        loadCoinCodes: function() {
            let codes = LocalStorageService.getCoinCode();
            logger.log.debug('coincodes=',codes);
                    
            let a_options = [];
            for (let index=0;index<codes.length;index++) {
                a_options.push( {label:codes[index][1], value:codes[index][0]} );
            }
            this.g_options = a_options;
        },

        filterFn (val, update, abort) {
            /*
            if (val.length < 1) {
                abort()
                return
            }
            */
            update(() => {
                const needle = val.toLowerCase();
                this.v_options = this.g_options.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
            })            
        },


        isValidInput: function(value) {
            if (value.length>2) {
                if (CommonFunc.isUpperCase(value)) {
                return true;
                }
            }
            return false;
        },

        emitEvent: function(param) {
            logger.log.debug('emitEvent.param=',param);
            this.$emit("onSelectAsset",param);
        },


        onSearch: function(value) {
        //logger.log.debug('onSearch=',value);
        },

        onSearchInput: function(value) {
            logger.log.debug('onSearchInput=',value);
            if (this.isValidInput(value.label)) {
                this.emitEvent({value:value.label});
            }
        },

        onSearchEnter: function(event,value) {
            logger.log.debug('onSearchEnter');
            //this.$refs.assetSearch.refresh(-1);
            event.target.blur();
            if (this.isValidInput(this.g_input)) {
                this.emitEvent({value:this.g_input});
            }
        },

        onSearchChange: function(value) {      
            logger.log.debug('onSearchChange=',value);
            this.g_input = value;
            if (this.isValidInput(this.g_input)) {
                //this.movePage(this.g_input);
            }      
        },

    },

};
</script>


<style scoped>
</style>

