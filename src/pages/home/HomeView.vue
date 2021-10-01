<template>
<div>
    <div class="q-pa-md boxFreeloan">
        <q-parallax>
            <template v-slot:media>
                <img src="~assets/images/wevest_homepage_logo.png">
            </template>

            <template v-slot:content="scope">
                <div class="mainTitle">
                    <div class="blackMedium q-py-lg">
                        Interest <span class="strong2">free</span> loan 
                    </div>
                    <div class="descBlack q-py-md">
                        The first interest free loan in history<br>
                        No interest, No maturity, Leverage available
                    </div>
                    <div>
                        <span class="watchVideo1">Watch video</span> 
                        <q-btn flat icon="keyboard_arrow_right" />
                    </div>
                </div>
            </template>
        </q-parallax>
    </div> 
    <div class="q-pa-md boxCenter boxParadigm">
        <div class="text-center">
            <div class="whiteMedium white q-mb-xl">
                New <span class="strong2">Interest</span> Paradigm<br>
            </div>
            <div class="q-mb-lg descWhite">
                The existing paradigm : interest payment on loan<br>
                The new paradigm : interest free loan<br> 
            </div>
            <div>
                <span class="watchVideo2">Watch video</span>
                <q-btn color="white" flat icon="keyboard_arrow_right"></q-btn> 
            </div> 
        </div>
    </div> 
    
    <div class="q-pa-md boxWin">
        <div class="row items-center">
            <div class="col" style="padding:100px;">
                <div style="background-color: #FF8c00; border-style:solid;border-width:10px;border-top-style:none;">
                    <q-img src="~assets/images/white_woman.png" />
                </div>
            </div>
            <div class="col">
                <div class="blackBig strong1">
                     Win-Win
                </div>
                <div class="blackSmall q-pb-md">
                    for both lender and borrower 
                </div>
                <div class="descBlack">
                    Lender : more yield, transaction fee, LP tokens <br>
                    Borrower : no interest, no maturity, leverage available
                </div>
            </div>
        </div>
    </div> 
     <div class="boxCenter boxFarming">
        <div class="text-center">
            <div class="blackMedium q-pb-lg">
                <span class="strong1">Yield Farming</span> + <span class="strong1">Position Swap</span><br>
                <span class="blackSmall">made it possible</span> 
            </div>
            <div class="descBlack q-py-lg">
                Wevest protocol utilize ‘collateral + loan’ and position swap to setoff interest rate.<br>
                lenders maximize interest income through yield farming, including their own funds<br>
                as well as borrowers' collateral, rather than earning interest income with only their own funds,<br>
                and borrowers can borrow more than the collateral, with no interest and no maturities.
            </div>
            <div>
                <span class="watchVideo1">Watch video</span> 
                <q-btn flat icon="keyboard_arrow_right"></q-btn> 
            </div> 
        </div>
    </div> 
    <div class="q-pa-md boxRisk">
        <div class="row">
            <div class="col q-pl-lg items-center">
                <div class="q-pl-xl">
                    <div class="blackMedium text-left">
                        <span class="strong1">VaR and adaptive</span> <br>
                        risk management 
                    </div>
                    <div class="descBlack q-pt-md">
                        We measure risk via var, based on the var value<br>
                        wevest protocol dynamically adjust collateral ratio to<br>
                        minimize risk exposure
                    </div>
                </div>
            </div>
            <div class="col iconImage">
                <q-img src="~assets/images/wevest_homepage_icon.png" />
            </div>
        </div>
    </div>
    <div class="q-pa-xl boxFooter">
        <div class="text-center" style="color: white;">
            Do you have ideas on how to improve wevest.io?
        </div>
        <div class="text-center">
            <span class="joinUs">Join us</span> 
            <q-btn color="white" flat icon="keyboard_arrow_right" />
        </div>
    </div>  
</div>
</template>


<script>
import { store } from 'src/store/store';
import NavFunc from 'src/util/NavFunc';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'components/CTitle';
import CBigLabel from 'components/CBigLabel';

import AssetCard from 'components/cards/AssetCard';
import BlogList from 'components/lists/BlogList';
import AssetCommunityCard from 'components/cards/AssetCommunityCard';
import PortfolioCard from 'components/cards/PortfolioCard';
import ReviewStatList from 'components/lists/ReviewStatList';
import UserFeedList from 'components/lists/UserFeedList';
import CaptainList from 'components/lists/CaptainList';

import DataService from 'src/services/dataService';

import WBanner from 'components/w/WBanner';
//import CExchangeIndexChart from 'pages/home/CExchangeIndexChart';
//import MarketIndexWidget from 'pages/home/components/MarketIndexWidget';
//import MarketWatchWidget from 'pages/home/components/MarketWatchWidget';


export default {
    name: 'HomePage',
    components: {
        CTitle,
        CBigLabel,
        WBanner,
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
            v_banner_title: "WeVest Alpha Test Starts!!!",         
        }
    },
    created() {
        logger.log.debug("HomeView.created");
    },
    mounted() {
        logger.log.debug("HomeView.mounted");
    },
    updated() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        updatePageHeader(json_data) {
            const dic_columns = CommonFunc.getColumnDic(json_data['upbit']['btc'].columns,[],[]);
            let watch_date = json_data['upbit']['btc'].values[json_data['upbit']['btc'].values.length-1][dic_columns['trade_date']];
            this.v_page.desc = watch_date;
        },

        refresh() {
            const _this = this;
        
            let funcs = [            
                //this.loadCalendarEffectData('1h'),
                //this.loadBlogList(),
                //this.loadCommunityList(),
                //this.loadAssetList(),
                //this.loadPortfolioList(),
                //this.loadFeedList(),
                //this.loadReviewStatList(),
                this.loadMarketIndex(),

                //this.loadCryptoWatch(),                
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

        loadCommunityList() {
            if ( (this.v_me.bookmarks) && (this.v_me.bookmarks.items.length>0) ) {
                this.$refs.communityList.updateByBookmarks();
            } else {
                this.$refs.communityList.updateByCategory('market_capital');
            }
            
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
            logger.log.debug('HomeView.showChart=',asset);        
            //this.items_52w = json_list;
            this.$refs.chartWinner.update('gaia_crypto_trend_upbit',asset,dates);
        },


        onLoad(progress) {
            logger.log.debug('onLoad - ',progress);
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
            NavFunc.navAssetDetail(this,dicParam.symbol,dicParam.id);
        }
    }
};

</script>


<style scoped>

.mainTitle {
    padding: 0px 450px 150px 0px;
}

.boxCenter {
display: flex;
align-items: center; 
justify-content: center;
}

.boxFreeloan {
    background: white;
    height: 600px;

}

.boxParadigm {
    background-color: #000000;
    height: 600px;
}

.boxWin {
    background-color: #009CF2;
    height: 600px;

}

.boxFarming {
    background-color: #ff8500;
    height: 600px;

}

.boxRisk {
    background-color: #00E6AA;
    height: 600px;
}

.boxFooter {
    background-color: #000000;
}

.white {
    color: #FFFFFF;
}

.iconImage {
    margin: 0px 0px 0px 0px;  
} 


</style>