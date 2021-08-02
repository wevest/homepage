<template>

    <div class="q-ma-md">
        <div>
            <CTitle :title="$t('page.notification.title')" :desc="$t('page.notification.desc')"></CTitle>
        </div>

        <div class="q-mt-xl q-mb-sm">
            <NotificationList ref='notificationList' 
                :title="$t('page.notification.notification_feed.title')" 
                maxLength="25" moreCaption="" user="v_user"></NotificationList>
        </div>

    </div>

</template>


<script>
import {store} from 'src/store/store';
import {MoaConfig} from 'src/data/MoaConfig';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import UserModel from "src/models/UserModel";

import CTitle from 'components/CTitle';
import NotificationList from 'components/lists/NotificationList';


export default {
    name:'NotificationView',
    components: {
        CTitle,
        NotificationList
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data() {
        return {
            v_user:new UserModel(),
        }
    },
    mounted() {
        logger.log.debug("NotificationView.mounted");
        this.refresh();
    },
    methods: {
        refresh() {
            this.loadNotification();
        },

        loadNotification() {
            this.$refs.notificationList.update(this.v_me);
        },

    }
};

</script>

<style scoped>

</style>