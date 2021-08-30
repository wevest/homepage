<template>
    
    <q-dialog v-model="v_show"
        position="top"
        persistent
        transition-show="slide-down"
        transition-hide="slide-up"

    >
        <q-card class="MessageCard">
            <q-card-section>
                <WDialogCloseButton @onClick="onClickClose" />
                {{title}}
            </q-card-section>

            <HolderList ref="holderList"  />

        </q-card>
    </q-dialog>
    
</template>


<script>
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import HolderList from "src/components/lists/HolderList";
import WDialogCloseButton from "src/components/WDialogCloseButton";


export default {
    name: 'HolderDialog',
    components: {
        WDialogCloseButton,
        HolderList
    },
    props: {
        data: {
            required: true,
            default: null,
        },
		title: {
			type:String,
			default: "Holder List"
		},
    },
    computed: {},
    data() {
        return {

            v_asset: this.data,
            v_show: false,
            v_loading: false,
        }
    },

    created: function() {},
    mounted: function() {
        //this.loadHolders();
    },
    updated: function() {},
    
    methods: {      
        
        clear() {
            this.v_loading = false;
        },

        setAsset(asset) {
            this.v_asset = asset;
        },

        loadHolders() {
            logger.log.debug("HolderDialog.loadHolders : asset=",this.v_asset);
            this.$refs.holderList.update(this.v_asset);
        },

        show(asset) {
            logger.log.debug("HolderDialog.show : asset=",asset);
            
            this.setAsset(asset);
            
            this.v_show = true;
        },

        hide() {
            this.v_show = false;
        },

        onClickClose() {
            logger.log.debug("HolderDialog.onClickClose");
            this.hide();
        }
    }

};
</script>


<style scoped>

.MessageCard {
    height:550px;
    width:300px;
}
.MessageAvatarBox {
    text-align:center;
    padding:20px 0px 0px 0px;
}

.boxUser {
    padding-top:25px;
    text-align:center;
}
.MessageUsername {
    font-size:25px;
    color:#000000;
}

.ProfileMessage { 
    padding-top:10px;
    color:#8c8c8c;
}

</style>