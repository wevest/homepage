<template>
    <div class="q-pa-md">

        <div class="q-mt-md q-mb-sm">
            <CTitle :title="$t('page.feeds.title')" :desc="$t('page.feeds.desc')"></CTitle>
        </div>

        <div class="q-mt-xl q-mb-sm">
            <UserFeedList ref='feedList' :title="$t('page.feeds.userfeed.title')" :desc="$t('page.feeds.userfeed.desc')"
                maxLength="10" moreCaption="" user="v_me"></UserFeedList>
        </div>

    </div>

</template>

<script>
import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import UserModel from "src/models/UserModel";

import CTitle from 'components/CTitle';
import UserFeedList from 'components/lists/UserFeedList';

export default {
    components: {
        CTitle,
        UserFeedList
    },
    props: {},
    computed: {
        v_me() {
            return store.getters.me;
        },
    },
    data: () => ({
        g_data: null,

        v_user: new UserModel(),
        v_edit: false,

        v_labels: {'submit': 'Upload', 'cancel': 'Cancel'},
    }),
    mounted: function() {
        //console.log("HomeView.mounted - ");
        logger.log.debug("ProfileView.mounted - symbol=",this.$route.query);
        
        //this.setUser(this.$route.query);
        this.refresh();
    },

    methods: {        
        setUser: function(params) {
            const _this = this;

            let username = params.username;
            if (! username) {
                username = this.v_me.username;
            }
            UserModel.loadProfile(username).then( a_user => {
                _this.v_user = a_user;

                _this.v_user.loadPortfolio().then( response => {
                    logger.log.debug("setUser=>",response);
                    _this.updatePortfolioWidget();
                    _this.loadRelation();
                    
                });
            });
        },


        refresh: function() {
            this.loadFeeds();
        },


        loadFeeds() {
            this.$refs.feedList.update(this.v_me,0);
        },

    },

}

</script>


<style scope> 

.txtBigNumber {
  font-size:25px;  
  color:#222222;
  font-weight: bold;
}

.txtDesc {
   font-size:14px;  
   color:#8C8C8C;
}

.boxCard {
    text-align: center;
    margin-top:20px;
}

.btnAvatar {
    text-align:right;
    top: 0; 
    right: 12px; 
    transform: translateY(-50%);
}

.boxNumber {
    padding:16px 2px;
    margin-top:5px;
}

</style>
