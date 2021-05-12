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

        <q-toolbar-title shrink>
          MoA.Finance
        </q-toolbar-title>

        <q-select
            class="fit"
            filled
            v-model="g_asset"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="options"
            @filter="filterFn"
            hint="Minimum 2 characters to trigger filtering"            
        >
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
import logger from 'src/error/Logger';


const stringOptions = [
  '김치', '라면', '삼성', 'Apple', 'Oracle'
]

export default {
  name: 'MainLayout',
  components: { 
    SideBar,
    Spinner
  },
  data() {
    return {
      g_asset:null,
      leftDrawerOpen: false,
      language:"한글",
      langs: [
        'English', '한글'
      ],
      options: stringOptions,
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

    filterFn (val, update, abort) {
        if (val.length < 2) {
            abort()
            return
        }
        update(() => {
            const needle = val.toLowerCase()
            this.options = stringOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
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