<template>
    <div class="q-pa-md">

        <div class="row">
            <div class="col">
                <CTitle :title="$t('page.profile.title')" :desc="$t('page.profile.desc')"></CTitle>
            </div>
        </div>

        <q-card>            
            <q-item-section>
                <q-avatar size="20rem" square>
                    <img src="https://cdn.quasar.dev/img/avatar2.jpg">        
                </q-avatar>
                <div>
                    <div></div>
                    <q-space />
                    <q-btn label="change" @click="onClickChangeProfile" />
                    <q-uploader
                        hide-upload-btn
                        multiple
                        style="max-width: 300px"
                    />

                </div>

            </q-item-section>

            <q-card-section>
                <div class="text-h6">{{ v_user.username }}</div>
                <div class="text-subtitle2">by John Doe</div>
            </q-card-section>

            <q-card-section horizontal>
                <div>
                    <div> coin count </div>
                    <div> 13213 </div>
                </div>
                <div>
                    <div> like count </div>
                    <div> 13213 </div>
                </div>
                <div>
                    <div> like count </div>
                    <div> 13213 </div>
                </div>                
            </q-card-section>

            <q-card-section>
                {{ v_user.description }}
            </q-card-section>

        </q-card>


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


        onClickChangeProfile: function() {
            logger.log.debug("onClickChangeProfile");
        }
    },

}


</script>
