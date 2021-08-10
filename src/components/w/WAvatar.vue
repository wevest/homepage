<template>
    <q-avatar class="avatar q-py-sm" :size="size" @click="onClickAvatar">
        <q-img
            v-if="avatar && avatar.length > 0"
            :src="avatar"
        />        
        <q-icon
            v-else
            name="person"
            color="black"
            :size="size"
        />
    </q-avatar>
</template>

<script>
import {store} from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";


export default {
    name: 'WAvatar',
    props: {
        user: { default: null},
        avatar: {required:false, type:String},
        username: {required:false, type:String},
        size: {required:false, type:String, default:'48px'},
    },
    data() {    
        return {

        }
    },
    methods: {
        onClickAvatar: function() {
            logger.log.debug("WAvatar.onClick");            
            NavFunc.navProfile(this,this.username);
        }
    }
}
</script>
<style scope>
.avatar {
    margin-top:-2px;
}
</style>