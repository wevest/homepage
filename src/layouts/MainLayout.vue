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
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          MoA.Finance
        </q-toolbar-title>

        <div class="q-pa-md">
          <q-select v-model="language" :options="langs" label="Language" style="width: 100px"
             behavior="menu" transition-show="flip-up" transition-hide="flip-down" @input="onChangeLang"/>

        </div>

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
import logger from 'src/error/Logger';



export default {
  name: 'MainLayout',
  components: { 
    SideBar,
    Spinner
  },
  data() {
    return {
      leftDrawerOpen: false,
      language:"한글",
      langs: [
        'English', '한글'
      ],
      //lang: this.$i18n.locale,
    };
  },

  mounted: function () {
    CommonFunc.setAppData('spinner',this.$refs.loading);
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

    onChangeLang: function() {
      console.log('onChangeLang=',this.language);
      if (this.language=="English") {
        this.setLocale('en-us');
      } else {
        this.setLocale('kr');
      }
      
    }
  }

};
</script>
