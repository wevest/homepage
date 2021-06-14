<template>
  <q-layout view="lHh Lpr lFf">
    
    <q-header elevated>

      <div class="row flex">
        <q-toolbar class="col-9 bg-white text-black">
          <q-btn flat dense round color="black" align="centered" icon="menu" aria-label="Menu" ref="mainMenuButton"
            @click="leftDrawerOpen = !leftDrawerOpen"/>

          <div class="toolbar_title" @click="onClickLogo">
            WeVest
          </div> 
          
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

              <template v-slot:no-option>
                <q-item>
                    <q-item-section class="text-grey">
                    No results
                    </q-item-section>
                </q-item>
              </template>

            </q-select>
          </q-toolbar>
          
          <q-toolbar class="col-3 bg-white text-black">            
            <q-space />
            
            
            <div v-if="v_login==true">
              <a href='#' @click="onClickSignOut">Logout</a>
              <q-btn round color="amber" icon="person" @click="onClickUser" />
              <q-btn round color="yellow" icon="mail" @click="onClickMessage" />

            </div>
            <div v-else>
              <a href='#' @click="onClickSignIn">Login</a>
            </div>

            <div class="toolbar_language full-width">
              <q-select                             
                v-model="language" :options="langs" borderless dense
                label="" behavior="menu" 
                @input="onChangeLang"/>
            </div>


          </q-toolbar>
<!--
          <q-toolbar class="col-2 bg-white text-black">          
-->            
        </div>
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

import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import AuthService from 'src/services/authService';
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
      v_login: false, 
    };
  },

  updated: function() {
    this.setSigninMenu();
  },
  created: function() {
    AuthService.loadFromCookie();
  },
  mounted: function () {
    //CommonFunc.setAppData('spinner',this.$refs.loading);
    //this.loadCoinCodes();
    this.setSigninMenu();
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

    setSigninMenu: function() {
      if (CommonFunc.isEmptyObject(MoaConfig.auth)) {
        this.v_login = false;
      } else {
        if (CommonFunc.isEmptyObject(MoaConfig.auth.token)) {
          this.v_login = false;
          return;
        }

        this.v_login = MoaConfig.auth.loggedIn;
      }
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
      
      CommonFunc.navAsset(this,symbol);
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
    },

    onClickUser: function() {
      logger.log.debug('MainToolbar.onClickUser');
      let dic_param = { name:'profile', params:{} };
      this.$router.push(dic_param);
    },

    onClickMessage: function() {
      logger.log.debug('MainToolbar.onClickMessage');
      let dic_param = { name:'message', params:{} };
      this.$router.push(dic_param);
    },

    onClickSignIn: function() {
      logger.log.debug('onClickSignIn');
      let dic_param = { name:'signin', params:{} };
      this.$router.push(dic_param);
    },

    onClickLogo: function() {
      logger.log.debug('onClickLogo');
      let dic_param = { name:'home', params:{} };
      this.$router.push(dic_param);
    },

    onClickSignOut: function() {
      logger.log.debug('onClickSignOut');
      
      const _this = this;
      let dic_param = {token:MoaConfig.auth.token};
      AuthService.signOut(dic_param,function(response) {
          logger.log.debug("signOut.response=",response);
          
          AuthService.processLogout();
          _this.setSigninMenu();
          
          _this.$q.notify({
              color: 'green-4', textColor: 'white', icon: 'cloud_done',
              message: 'logout'
          })
      }, function(response) {
          logger.log.debug("onClickSignOut.Error - response=",response);
          if (response.status==400) {

          }
      });

    },

  }

};
</script>

<style scoped>


.toolbar_language {
    width: 60px !important;
    box-sizing:unset;
    
    /* 
    margin-right: 1.5rem;   
    width: 100px !important;    
    left: 0px;
    padding-left: 0.5rem;   
    border-bottom: 1px solid #ccc;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    */
}

.toolbar_title {
  font-size: 1.5em;
  font-weight: bolder;
  /* 
  text-overflow: none !important;
  width:100%; */
}

</style>