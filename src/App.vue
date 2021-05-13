<template>
  <div id="q-app">
    <router-view />
  </div>
</template>


<script>
import LocalStorageService from 'src/services/localStorage';

export default {
  name: 'App',

  created: function () {
      console.log("App.created");
      
      LocalStorageService.loadKCodes();
      LocalStorageService.loadCoinCodes(false);
  },
  

};
</script>
