<template>
	<div>

		<CTitle ttype='subtitle' :title="v_title" desc=""
			:loadMoreCaption="v_more_caption" @onClickTitleMore="onClickMoreFriend"></CTitle>

		<q-skeleton v-if="!v_list_loaded" height="150px" square animation="pulse-x" />
		<div v-show="v_list_loaded">

            <div class="row justify-center q-gutter-md">            

                <q-card v-for="(a_user,index) in v_users.items" :key="index">
                    
                    <q-card-section @click="onClickUser(a_user)" class="text-center">
                        
						<WAvatar :avatar="a_user.avatar_thumb" 
							:username="a_user.username" size="64px" />
<!--
						<q-img :src="a_user.avatar_thumb" width="64px" height="64px" ></q-img>
-->						
                        <div>
                            <div class="gListTitle q-pt-sm">{{a_user.username}}</div>
                            <div class="gCaption">{{a_user.display_name}}</div>
                        </div>
<!--                        
                        <div class="text-subtitle2">by John Doe</div>
-->                        
                    </q-card-section>

                </q-card>

            </div>
			
			<LoadMore ref="loadMore" @onClickLoadMore="onClickLoadMore" />
		</div>
	</div>

</template>


<script>
import { store } from 'src/store/store';
import { Config } from 'src/data/Config';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';
import WAvatar from "src/components/w/WAvatar";
import WSubinfo from 'components/WSubinfo';
import LoadMore from "src/components/LoadMore";
import {UserListModel} from "src/models/UserModel";

export default {
	name:'HolderList',
	components: {
		CTitle,
		WAvatar,
		WSubinfo,
		LoadMore
	},
    props: {
		data: {
			required: false,
			default: null
		},
        maxLength: {
            default: 20,
        },
        limit: {
            default: 20,
        },
		title: {
			type:String,
			default: "Holder List"
		},
		moreCaption: {
			type:String,
			default: ""
		},
		noDataTitle: {
			type:String,
			default:"No Data"
		},
		noDataDescription: {
			type:String,
			default:"No holders"
		},
    },
    computed: {
		v_me() {			
			return store.getters.me;
		},
        v_format() {
            return (value) => {   
                if (! value) return 0;

                return CommonFunc.formatNumber(value,1);
            }
        },
        v_shorten() {
            return (value) => {
                return CommonFunc.shortenString(value,Config.setting.maxTitleLength);
            };
        },		
        v_roi() {
            return (user) => {				
				if (! this.v_price) {
					this.v_price = store.state.prices.getPrice(user.asset.symbol);
				}
				if (! this.v_price) {
					return '';
				}

				logger.log.debug('HolderList.v_roi : user,price=',user,this.v_price);				
				const a_ret = CommonFunc.calcRet(user.price,this.v_price.last)*100;
				return CommonFunc.formatNumber(a_ret,2)+"%";
			}
        },

    },

	data() {
		return {
			v_list_loaded: false,

			v_users: new UserListModel(),
			
			v_title: this.title,
			v_maxLength: this.maxLength,
			v_more_caption: this.moreCaption,								
		
            v_pagination: {
                offset: 0,
                limit: this.limit,
            },

			v_price: null,
			//v_label_follow:'Follow',

			v_label_add_friend:'Follow',
			v_loading_add_friend:false,

			v_follow_loading:false,		
		};
	},
	mounted() {
		logger.log.debug("CaptainList.mounted",this.data);
		this.refresh();
	},
	methods: {
		refresh() {
            this.loadCaptains();
		},

        loadCaptains(limit=null,offset=null) {
            const _this=this;
			
			let dicParam = {type:"follower",limit:limit,offset:offset};

            this.v_users.load(dicParam).then( response => {
                logger.log.debug("CaptainList.loadCaptains - response=",_this.v_users.items);
				_this.$refs.loadMore.setPageParameter(response);
				_this.v_list_loaded = true;
            }).catch(err=>{
				logger.log.error("CaptainList.loadCaptains - err=",err);
				_this.v_list_loaded = true;
            });

        },

		onClickUser(user) {
			logger.log.debug("onClickUser : user = ", user);
			NavFunc.navProfile(this,user.username);
			//this.$emit("onClickBlog",{page_id:page_id});
		},

		onClickLoadMore() {
			logger.log.debug("onClickLoadMore : next_url = ", this.v_next_url);

			this.v_maxLength = 999999;
			//this.v_query.limit = this.$refs.loadMore.v_next.limit;
			//this.v_query.offset = this.$refs.loadMore.v_next.offset;
			this.loadHolders(this.$refs.loadMore.v_next.limit,this.$refs.loadMore.v_next.offset);

		},

		onClickMoreFriend() {
			logger.log.debug("FriendList.onClickMoreFriend : 1");
			
			//store.getters.nav.add(this.$route);
            //NavFunc.navProfile(this,this.v_user.username);
		},
	},
};
</script>


<style scope>
.avatar {
	margin-top:-4px;
}
.news-title {
	font-size: 18px;
	color: #000000;
}

.news-date {
	font-size: 10px;
	color: #888888;
}


</style>