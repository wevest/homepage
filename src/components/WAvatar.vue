<template>
    <q-avatar @click="onClickAvatar">
        <q-img
            v-if="avatar && avatar.length > 0"
            class="gBlogAvatar"
            :src="avatar"
        />        
        <q-icon
            v-else
            name="person"
            color="black"
            size="34px"
        />
    </q-avatar>
</template>


<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";



export default {
    name: 'WAvatar',
    props: {
        avatar: {required:false, type:String},
        username: {required:false, type:String},
    },
    data() {    
        return {

        }
    },
    methods: {
        onClickAvatar: function() {
            logger.log.debug("WAvatar.onClick");
            
            store.getters.nav.add(this.$route); 
            CommonFunc.navProfile(this,this.username);
        }
    }
}
</script>
