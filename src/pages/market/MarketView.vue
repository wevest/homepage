<template>
    
    <div class="q-ma-md">
        
        <div>
		    <CTitle ttype='title' title="title" desc="" loadMoreCaption="" />
        </div>

    </div>

</template>

<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from "components/CTitle";

export default {
	name: "MarketView",
	components: {
		CTitle,
	},
	computed: {
		v_me() {
			return store.getters.me;
		},
	},

	data() {
		return {

        }
    }, 
    methods: {

    }
};

</script>

<style scoped>

</style>