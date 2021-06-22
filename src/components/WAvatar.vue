<template>
    <q-avatar @click="onClickAvatar">
        <q-img
            v-if="avatar.length > 0"
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
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

export default {
    name: 'WAvatar',
    props: {
        avatar: {required:true, type:String},
        username: {required:true, type:String},
    },
    data() {    
        return {

        }
    },
    methods: {
        onClickAvatar: function() {
            logger.log.debug("WAvatar.onClick");
            CommonFunc.navProfile(this,this.username);
        }
    }
}
</script>
