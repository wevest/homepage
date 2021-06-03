<template>
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.profile.title')" :desc="$t('page.profile.desc')"></CTitle>
            </div>
        </div>

        <div class="row q-gutter-sm">
            <div class="col">
                 <q-avatar>
                    <img src="https://cdn.quasar.dev/img/avatar.png">
                </q-avatar>
                <div>
                    {{ v_user.username }}
                </div>
                <div>
                    {{ v_user.email }}
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-3">
                like Count
            </div>
            <div class="col-3">
                subscriber Count
            </div>
            <div class="col-3">
                blog Count
            </div>
            <div class="col-3">
                comments Count
            </div>
        </div>

        <div class="row q-gutter-sm">
            <div class="col">
                <CTitle :title="$t('page.profile.blog')" :desc="$t('page.profile.blog')"></CTitle>
            </div>
        </div>

    </div>

</template>

<script>
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import MoaBackendAPI from 'src/services/apiService';
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';

export default {
    components: {
        CTitle,
    },
    props: {},

    data: () => ({
        g_data: null,
        v_user: MoaConfig.auth,
    }),

    mounted: function() {
        //console.log("HomeView.mounted - ");
        //this.refresh();
    },
    methods: {        
        refresh: function() {
            const _this = this;
        
            
            let funcs = [
            ];
            Promise.all(funcs).then(function() {

            });
        },

    },

}


</script>
