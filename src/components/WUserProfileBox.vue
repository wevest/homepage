<template>

    <div class="blockquote">
        <div class="row">
            <div class="gPageAvatar">
                <WAvatar :avatar="avatar" :username="username" />
            </div>
            <div style="padding-left:15px; padding-top:10px;">
                <span class="username"> {{username}}</span>&nbsp;
                <q-btn class="followBtn" icon="add_circle" size="13px" dense flat 
                    :label="v_follow_button"
                    @click="onClickFollow(1)" v-if="! isOwner" />
            </div>
        </div>                    
        <div>
            <p class="biography"> {{v_shorten(biography)}}</p>
        </div>
    </div>
    
</template>

<script>
import { MoaConfig } from 'src/data/MoaConfig';
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';


import CTitle from 'components/CTitle';
import WAvatar from "components/WAvatar.vue";
import WCommandBar from "components/WCommandBar.vue";
import WRatingButton from 'components/WRatingButton';
import WSubinfo from 'components/WSubinfo';



export default {
    name: 'WUserProfileBox',
    components: {
        WAvatar,
        WRatingButton,
        WSubinfo,
        WCommandBar
    },
	props: {
        data: {
            default: null,
        },
        avatar: {
            type:String,
            default: '',
        },
        userid: {
            required: true,
            default: -1,
        },
        username: {
            required: true,
            default: '',
        },
        biography: {
            type:String,
            default: '',
        },
        isOwner: {
            required: true,
            type:Boolean,
            default: false,
        },
        shortenBiography: {
            default:"1"
        }
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
        v_shorten() {
            return (value) => {
                if (this.shortenBiography=="1") {
                    return CommonFunc.shortenString(value,MoaConfig.setting.maxBiographyLength);
                }
                return value;
            };
        },
    },
    data: function () {
        return {
            v_follow_button:'Follow',
            v_userid: this.userid,
            v_username: this.username,
            v_avatar: this.avatar,
            v_biography: this.biography,

        }
    },
    methods: {

        onClickFollow: function(value) {
            logger.log.debug("WUserProfileBox.onClickFollow=");
            
            const _this=this;

            CommonFunc.checkButtonPermission(this,1,0).then(ret=>{
                logger.log.debug("WUserProfileBox.onClickFollow : ret=",ret);
                if (ret==0) return;

                _this.v_me.follow(_this.userid,value).then( response => {
                    logger.log.debug("onClickFollow - response=",response);
                    _this.v_follow_button = 'Followed';
                    CommonFunc.showOkMessage(_this,'Followed');                
                }).catch(err=>{
                    CommonFunc.showErrorMessage(_this,err.data.msg);
                });
            });
        }

    }

};

</script>

<style scoped>
.blockquote {  
    border: 1px solid #D8D8D8;
    border-radius: 3px;  
    border-left: 7px solid #DDDDDD;  
    padding: 12px 12px 0px 12px;  
    margin: 0px 15px 0px 15px;
} 

.username {
    font-size:17px;
    color:#222222;
    font-weight:bold;
    margin-right:2px;
}

.biography {
   font-size:14px;
   color:#222222;
   padding-top:10px;
}

.copyright {
    font-size:13px;
    color:#222222;
}

.followBtn {
    color:#4978F4;;
}
</style>