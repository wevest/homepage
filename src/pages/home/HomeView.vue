<template>
    
  <div class="q-ma-md">
        <div>
            <CTitle ttype='title' :title="$t ('page.home.title')" :desc="$t('page.home.desc')"></CTitle>
        </div>


        <div>
            <MarketIndexWidget ref="indexWidget" @onClick="onClickIndex"/>
            <MarketWatchWidget ref="watchWidget" :title="$t('page.home.marketwatching.title')" :desc="$t('page.home.marketwatching.desc')"
                :moreButton="$t('button.more')" />
        </div>

        <div>
            <PortfolioList ref="pfVC" :title="$t('page.home.portfolio_list.title')" :desc="$t('page.home.portfolio_list.desc')"
                maxLength="10" :moreCaption="$t('button.more')"></PortfolioList>
        </div>

        <div class="col">
            <AssetList ref='assetList' :title="$t('page.home.new_asset_list.title')" :desc="$t('page.home.new_asset_list.desc')"
            maxLength="10" :moreCaption="$t('button.more')" ></AssetList>
        </div>

        <div>
            <UserFeedList ref='feedList' :title="$t('page.home.userfeed_list.title')" 
                maxLength="10" :moreCaption="$t('button.more')" user="v_me"></UserFeedList>
        </div>                                               

        <div>
            <BlogList ref='blogList' :title="$t('page.home.blog_list.title')" maxLength="10" 
                :moreCaption="$t('button.more')" 
                category="" symbol="" objectId="-1"></BlogList>
        </div>


<!--

        <div class="col">
            <ReviewStatList ref='reviewList' title="Review List" category="" maxLength="10" moreCaption="More"></ReviewStatList>
        </div>
-->
  </div> 

</template>


<script>
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'components/CTitle';
import CBigLabel from 'components/CBigLabel';

import BlogList from 'components/lists/BlogList';
import AssetList from 'components/lists/AssetList';
import PortfolioList from 'components/lists/PortfolioList';
import ReviewStatList from 'components/lists/ReviewStatList';
import UserFeedList from 'components/lists/UserFeedList';

import DataService from 'src/services/dataService';


//import CIndexChart from 'pages/home/CIndexChart';
//import CExchangeIndexChart from 'pages/home/CExchangeIndexChart';
import MarketIndexWidget from 'pages/home/components/MarketIndexWidget';
import MarketWatchWidget from 'pages/home/components/MarketWatchWidget';


export default {
    name: 'PageIndex',
    components: {
        CTitle,
        CBigLabel,
        MarketIndexWidget,
        MarketWatchWidget,
        BlogList,
        PortfolioList,
        AssetList,
        UserFeedList,
        ReviewStatList
    },
    computed: {
        v_me() {
            return store.getters.me;
        },
    },

    data() {
        return {
            v_tab:'upbit',     
            v_tab_toplist:'ret' ,
            v_toplist_visible:false,  
            v_page: {title:'page.home.title', desc:''},
            v_subpage: { 
                cwatch: { title:'page.home.cwatch.title', desc:''} 
            },                
        }
    },
    created() {
        logger.log.debug("HomeView.created");
    },
    mounted() {
        logger.log.debug("HomeView.mounted");
        this.refresh();
    },
    updated() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        updatePageHeader: function(json_data) {
            const dic_columns = CommonFunc.getColumnDic(json_data['upbit']['btc'].columns,[],[]);
            let watch_date = json_data['upbit']['btc'].values[json_data['upbit']['btc'].values.length-1][dic_columns['trade_date']];
            this.v_page.desc = watch_date;
        },

        refresh: function() {
            const _this = this;
        
            let funcs = [            
                //this.loadCalendarEffectData('1h'),
                this.loadBlogList(),
                this.loadAssetList(),
                this.loadPortfolioList(),
                this.loadFeedList(),
                //this.loadReviewStatList(),
                this.loadCryptoWatch(),
                this.loadMarketIndex(),
                /*
                this.loadIndexData(),
                this.loadCryptoTopAssetData('1h'),
                */
            ];
            Promise.all(funcs).then(function() {

            });
        },

        loadCryptoWatch() {
            const _this=this;
            DataService.loadCryptoWatchData(30).then(function(data) {
                _this.$refs.watchWidget.update(data);
            });
        },

        loadMarketIndex() {
            this.$refs.indexWidget.update();
        },

        loadBlogList() {
            this.$refs.blogList.updateByCategory(this.$refs.blogList.category);
        },

        loadAssetList() {
            this.$refs.assetList.updateByCategory('market_capital');
        },

        loadFeedList() {
            this.$refs.feedList.update(this.v_me,0);
        },

        loadPortfolioList() {
            this.$refs.pfVC.updateByType('vc');
            //this.$refs.pfROI.updateByType('roi');
            //this.$refs.pfRated.updateByType('voting');
        },

        loadReviewStatList: function() {
            this.$refs.reviewList.update();
        },

        showChart(asset,dates,a_date) {
            console.log('HomeView.showChart=',asset);        
            //this.items_52w = json_list;
            this.$refs.chartWinner.update('gaia_crypto_trend_upbit',asset,dates);
        },


        onLoad(progress) {
            console.log('onLoad - ',progress);
        },

        onClickCategory(sector) {
            logger.log.debug('onClickCategory - ',sector);
            
            let dic_param = { name:'sector', path:'sector', params:{exchange:this.v_tab, sector:sector} };
            this.$router.push(dic_param);
        },

        onClickTrend() {
            logger.log.debug('onClickTrend - ');

            let dic_param = { name:'trend', path:'trend', params:{} };
            this.$router.push(dic_param);            
        },

        onClickToplist() {
            logger.log.debug('onClickToplist - ');
            this.v_toplist_visible = true;

            this.updateTopTable(this.g_data_top,this.v_tab,this.v_tab_toplist); 
            //_this.updateTopTable(_this.g_data_top,_this.v_tab,'ret');
        },

        onClickEureka(link) {
            logger.log.debug('onClickEureka - ',link);

            let dic_param = { name:link, path:link, params:{} };
            this.$router.push(dic_param);            
        },

        onClickTabCategory(exchange) {
            logger.log.debug('onClickTabCategory - ',exchange);
            this.updateExchangeWidget(this.g_data,exchange);
        },

        onClickKnob() {
            logger.log.debug('onClickKnob');
            let dic_param = { name:'cwatch', path:'cwatch', params:{} };
            this.$router.push(dic_param);            
        },
        onClickIndex(dicParam) {
            logger.log.debug('Home.onClickIndex : ',dicParam);
            CommonFunc.navAssetDetail(this,dicParam.symbol,dicParam.id);
        }
    }
};

</script>


<style scoped>

.box_knob {
    font-size:25px; 
}
</style>