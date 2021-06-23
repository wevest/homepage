<template>

    <q-dialog v-model="v_confirm" persistent ref="confirmDialog">
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
                <span class="q-ml-sm">{{v_title}}</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" color="primary" v-close-popup />
                <q-btn flat label="Confirm" color="primary" @click="onClickConfirm" />
            </q-card-actions>
        </q-card>
    </q-dialog>

</template>


<script>
export default {
    name:'WConfirmDialog',
    props: {
        title: {required:false, type:String},
    },
    setup() {
        
    },  
    computed: {
        v_me() {
            return store.getters.me;
        },
    },    
    data: function () {
        return {
            v_confirm: false,
            v_title: this.title,
        }
    },

    methods: {
        show() {
            this.v_confirm = true;
        },

        hide() {
            this.v_confirm = false;
        },

        onClickConfirm: function() {
            this.hide();
            this.$emit("onClickConfirm",{});
        }
    }

};

</script>
