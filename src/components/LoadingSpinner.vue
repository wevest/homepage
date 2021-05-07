<template>
<!--
  <div id="loading" v-if="isLoading">
    <div class="loading-spinner">        
      <Spinner name="folding-cube" color="var(--primary)"/>
    </div>
  </div>
-->
  <div data-app>
    <v-dialog v-model="isLoading" fullscreen full-width>
      <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
        <v-layout justify-center align-center>
          <v-progress-circular
            indeterminate
            color="primary">
          </v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
  </div>
  
</template>


<script>
//import {SemipolarSpinner} from 'epic-spinners';
//import Spinner from 'vue-spinkit';

export default {
  name: 'LoadingSpinner',
  components: {
    //Spinner
  },
  data(){
    return {
        isLoading:false,
        g_lock: 0,
    }
  },

  methods: {
    reset() {
      this.g_lock = 0;
      this.isLoading = false;
    },

    show() {
      console.log('spinner loading');
      
      this.g_lock += 1;

      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
    },
    hide() {
      this.g_lock -= 1;

      console.log('spinner hide : g_lock=',this.g_lock);

      if (this.g_lock<=0) {
        this.isLoading = false;
        this.g_lock = 0;
      }
      
    }
  }
}
</script>

<style>

#loading {
  position: fixed;
  width: 100%;
  height:100%;
  display: flex;
  align-items: center;
  
/*  background: rgba(0, 0, 0, 0.4); */
  top: 0;
}


.loading-spinner {
  display: flex;
  margin: 0 auto;
}

</style>