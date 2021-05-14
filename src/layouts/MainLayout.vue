<template>
  <q-layout view="lHh Lpr lFf">
    
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          ref="mainMenuButton"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title shrink>
          MoA.Finance
        </q-toolbar-title>

        <q-select
            class="fit"
            ref="assetSearch"
            filled
            v-model="g_asset"
            use-input
            fill-input
            hide-selected
            input-debounce="0"
            :options="v_options"
            @filter="filterFn"
            @input="onSearchInput"
            @input-value="onSearchChange"
            @new-value="onSearch"
            @keyup.enter.native="onSearchEnter"
            behavior="menu"
        >
          <template v-slot:option="scope">
            <q-item
              v-bind="scope.itemProps"
              v-on="scope.itemEvents"
            >
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

          <template v-slot:append>
            <q-icon name="search" @click.stop />
          </template>

          <template v-slot:no-option>
            <q-item>
                <q-item-section class="text-grey">
                No results
                </q-item-section>
            </q-item>
          </template>

        </q-select>

        <q-space />

        <q-select v-model="language" :options="langs" 
          class="box_language" label="Language" 
          behavior="menu" transition-show="flip-up" transition-hide="flip-down" 
          @input="onChangeLang"/>


      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
    
      <SideBar ref='sidebar'></SideBar>

    </q-drawer>      

    <q-page-container>
      
      <router-view> 
      </router-view>

      <Spinner ref='loading' />  

    </q-page-container>

  </q-layout>

</template>



<script>
import SideBar from './SideBar';
import Spinner from 'src/components/Spinner';
//import LoadingSpinner from 'src/components/LoadingSpinner';

import CommonFunc from 'src/util/CommonFunc';
import LocalStorageService from 'src/services/localStorage';
import logger from 'src/error/Logger';


export default {
  name: 'MainLayout',
  components: { 
    SideBar,
    Spinner
  },
  data() {
    return {
      g_asset:null,
      g_input: null,

      leftDrawerOpen: false,
      language:"한글",
      langs: [
        'English', '한글'
      ],
      g_options: [],
      v_options: [],
      //lang: this.$i18n.locale,
    };
  },

  mounted: function () {
    CommonFunc.setAppData('spinner',this.$refs.loading);
    this.loadCoinCodes();
  },

  methods: {
    setLocale: function(locale) {
      // set the Vue-i18n locale 
      this.$i18n.locale = locale;
      // load the Quasar language pack dynamically
      import(`src/i18n/${locale}`).then(({ default: messages }) => {
        this.$q.lang.set(messages)
      })
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

    loadCoinCodes: function() {
      let codes = LocalStorageService.getCoinCode();
      logger.log.debug('coincodes=',codes);
            
      let a_options = [];
      for (let index=0;index<codes.length;index++) {
        a_options.push( {label:codes[index][1], value:codes[index][0]} );
      }
      this.g_options = a_options;
    },
    
    movePage: function(symbol) {
      logger.log.debug('movePage=',symbol);
      console.log("child=",this.$children);
      
      //this.$refs.mainMenuButton.focus();
      this.$refs.assetSearch.refresh(-1);

      if (this.$router.currentRoute.name=="asset") {        
        const a_func = CommonFunc.getAppData('onSearchEvent');
        a_func(symbol);
        return;
      }
      
      let dic_param = { name:'asset', path:'asset', params:{ symbol:symbol } };
      this.$router.push(dic_param);
    },

    onChangeLang: function() {
      logger.log.debug('onChangeLang=',this.language);
      if (this.language=="English") {
        this.setLocale('en-us');
      } else {
        this.setLocale('kr');
      }      
    },

    onSearch: function(value) {
      //logger.log.debug('onSearch=',value);
    },

    onSearchInput: function(value) {
      logger.log.debug('onSearchInput=',value);
      if (this.isValidInput(value.label)) {
        this.movePage(value.label);
      }
    },

    onSearchEnter: function(event,value) {
      logger.log.debug('onSearchEnter');
      //this.$refs.assetSearch.refresh(-1);
      event.target.blur();
      if (this.isValidInput(this.g_input)) {
        this.movePage(this.g_input);
      }
    },

    onSearchChange: function(value) {      
      logger.log.debug('onSearchChange=',value);
      this.g_input = value;
      if (this.isValidInput(this.g_input)) {
        //this.movePage(this.g_input);
      }
      
    }


  }

};
</script>

<style scoped>

.box_language {
    width: 150px;
    padding: 0.9rem;   
    /* 
    border-bottom: 1px solid #ccc;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    */
}

</style>