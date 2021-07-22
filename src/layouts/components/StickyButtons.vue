<template>

    <div>

        <q-page-sticky position="bottom-right" :offset="[18, 18]">

			<q-btn-dropdown fab color="pink" dropdown-icon="add">

				<transition
					appear
					enter-active-class="animated slide-up"
					leave-active-class="animated slide-down"
				>

                    <q-list separator   transition-show="jump-down" transition-hide="jump-up">
                        <q-item clickable v-close-popup @click="onClickPortfolio">
                            <q-item-section avatar>
                                <q-avatar icon="work" color="primary" text-color="white" />
                            </q-item-section>						
                            <q-item-section>
                                <q-item-label>{{ $t('button.portfolio') }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="onClickShare">
                            <q-item-section avatar>
                                <q-avatar icon="share" color="primary" text-color="white" />
                            </q-item-section>						
                            <q-item-section>
                                <q-item-label>{{ $t('button.share') }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="onClickFab">
                            <q-item-section avatar>
                                <q-avatar icon="article" color="primary" text-color="white" />
                            </q-item-section>						
                            <q-item-section>
                                <q-item-label>{{ $t('button.blog') }}</q-item-label>
                            </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup @click="onClickFab">
                            <q-item-section avatar>
                                <q-avatar icon="help" color="primary" text-color="white" />
                            </q-item-section>						
                            <q-item-section>
                                <q-item-label>{{ $t('button.question') }}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </transition>
                
			</q-btn-dropdown>

        </q-page-sticky>
    </div>

</template>



<script>
import { store } from "src/store/store";
import { MoaConfig } from "src/data/MoaConfig";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

export default {
    methods: {
		onClickFab: function() {
			logger.log.debug("MainLayout.onClickFab");

            const _this = this;
            CommonFunc.checkButtonPermission(this,1,0).then(ret=>{
                //logger.log.debug("ProfileView.onClickFollow : ret=",ret);
                if (ret==0) return;
            });
            
		},

		onClickPortfolio: function() {
			logger.log.debug("MainLayout.onClickPortfolio");
			
            const _this = this;
            CommonFunc.checkButtonPermission(this,1,0).then(ret=>{
                //logger.log.debug("ProfileView.onClickFollow : ret=",ret);
                if (ret==0) return;

                _this.$emit("onClickPortfolio",{});
            });
		},

		onClickShare: function() {
			const a_url = window.location.href;
			logger.log.debug("MainLayout.onClickShare : url=",a_url);
			CommonFunc.copyToClipboard(this,a_url);
		}
    }
};

</script>
