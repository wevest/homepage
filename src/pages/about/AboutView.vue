<template>

    <div class="q-ma-md">
        <div class="col">
            <CTitle ttype='title' title="About" desc=""></CTitle>          
        </div>

        <div>
            Slogan
        </div>

        <div>
            What is WeVest?
        </div>

        <div>
            Why do you need to use WeVest?
        </div>

        <div>
            Why do you need to use WeVest?
        </div>

    </div>


</template>



<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';


export default {
    name:'aboutView',
    components: {
        CTitle,
    }
};
</script>

<style scoped>

</style>