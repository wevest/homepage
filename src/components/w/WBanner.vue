<template>
    <div>

        <q-banner dense class="bg-primary text-white">
            <template v-slot:avatar v-if="imgSrc.length>0">
                <img :src="imgSrc" style="width: 100px; height: 64px">
            </template>                

            <div v-html="title" :class="myClass">
                
            </div>

            <template v-slot:action v-if="button.length>0">
                <q-btn flat color="white" :label="button" @click="onClick" />
            </template>

        </q-banner>

    </div>

</template>


<script>
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";


export default {
    name:"WBanner",
    components: {

    },
	props: {
        title: {
            default:'Title',
        },
        imgSrc: {
            default:''
        },
        button: {
            default:''
        },
        buttonLink: {
            default:''
        },
        myClass: {
            default:''
        }
    },
    methods: {
        onClick() {
            logger.log.debug("WBanner.onClick");
        }
    }
};
</script>

<style scoped>

</style>
