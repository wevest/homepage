<template>
	
	<div class="q-ma-md">
        <div>
            <CTitle ttype='title' :title="v_title" desc="" 
                loadMoreCaption=""></CTitle>         
		</div>		
		
		
		<div>
			<HolderList ref="holderList" title="Holder List" :data="v_asset" />

		</div>

	</div>

</template>


<script>
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import {AssetModel} from 'src/models/AssetModel';

import CTitle from 'components/CTitle';
import HolderList from 'components/lists/HolderList';


export default {
	name:'HolderView',
    components: {
      CTitle,
      HolderList
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
		v_title() {
			return this.v_asset.symbol + " Holders";
		}
	},
    data () {
      return {
        g_description: null,
        g_symbol: null,

        v_asset: new AssetModel(),
      }
    },
	created() {
		this.validateQuery();
	},
	mounted() {
		this.setAsset(this.$route.query);
		this.refresh();
	},
    methods: {
        validateQuery() {
            
            if (! CommonFunc.isEmptyObject(this.$route.query.id)) {
                return;
            }                
            NavFunc.navError404(this);
        },

        setAsset(query) {
			this.v_asset.id = query.id;
			this.v_asset.symbol = query.symbol;
        },

		refresh() {
			this.$refs.holderList.update();
		}
    }
}
</script>
