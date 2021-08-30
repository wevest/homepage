<template>

    <div class="q-py-md">
        <div class="gBodyLG gViewer" v-html="v_html"></div>
    </div>

</template>

<script>
import { store } from 'src/store/store';
import { CONST } from 'src/data/const';
import { Config } from 'src/data/Config';
import CommonFunc from 'src/util/CommonFunc';

export default {
    props: {
        contents: {
			type:String,
			default: '',
		}
    },
    computed: {
        v_html() {
            return this.contents;
        }
    }
};

</script>


<style lang="scss">
/* 
@import 'src/assets/sass/main.scss'; 
*/
</style>