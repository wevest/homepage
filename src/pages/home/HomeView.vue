<template>
    
  <div class="q-pa-md">
        <div class="col">
            <CTitle ttype='title' :title="v_page.title" :desc="v_page.desc"></CTitle>
        </div>

        <div class="col">
            <MarketWatchWidget ref="watchWidget" title="Market Risk Alram" moreButton="More" />
        </div>

        <div class="col">
            <BlogList ref='blogList' :title="$t('page.home.bloglist.title')" maxLength="10" moreCaption="More" 
                category="news_market" symbol="" objectId="-1"></BlogList>
        </div>

        <div>
            <PortfolioList ref="pfVC" :title="$t('page.home.portfoliolist.vc.title')" maxLength="10" moreCaption=""></PortfolioList>
        </div>

        <div>
            <PortfolioList ref="pfROI" :title="$t('page.home.portfoliolist.roi.title')" maxLength="10" showDescription="0" moreCaption=""></PortfolioList>
        </div>

        <div>
            <PortfolioList ref="pfRated" :title="$t('page.home.portfoliolist.highvoted.title')" maxLength="10" showDescription="0" moreCaption=""></PortfolioList>
        </div>

<!--
        <div class="col">
            <AssetList ref='assetList' title="Asset List" maxLength="10" moreCaption="More" ></AssetList>
        </div>

        <div class="col">
            <ReviewStatList ref='reviewList' title="Review List" category="" maxLength="10" moreCaption="More"></ReviewStatList>
        </div>
-->
        <div>
            <UserFeedList ref='feedList' :title="$t('page.home.userfeedlist.userfeed.title')" 
                maxLength="10" moreCaption="More" user="v_me"></UserFeedList>
        </div>                                               
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

//import CTopTable from 'pages/home/CTopTable';
//import CIndexChart from 'pages/home/CIndexChart';
//import CExchangeIndexChart from 'pages/home/CExchangeIndexChart';
import MarketWatchWidget from 'pages/home/components/MarketWatchWidget';


export default {
    name: 'PageIndex',
    components: {
        CTitle,
        CBigLabel,
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

    data: function () {
        return {
            v_tab:'upbit',     
            v_tab_toplist:'ret' ,
            v_toplist_visible:false,  
            v_page: {title:'page.home.title', desc:''},
            v_subpage: { 
                cwatch: { title:'page.home.cwatch.title', desc:''} 
            },
                
            v_eureka:[
                {
                    title:'Crypto VC 그들의 투자성적은?', 
                    subtitle:'전문적인 식견을 가진 그들의 성과는?', desc:'그들로부터 배울것이 있는가?', 
                    color: 'background:#FFDC46;', link:'cryptovc'
                },
                {
                    title:'Crypto VC이 사랑한 프로젝트들?', subtitle:'전문적인 식견을 가진 그들의 성과는?', desc:'그들로부터 배울것이 있는가?', 
                    color:'background:#D7F1FA;', link:'vcportfolio'
                },
            ],
        }
    },
    created: function () {
        //console.log("HomeView.created");
    },
    mounted: function() {
        //console.log("HomeView.mounted - ");
        this.refresh();
    },
    updated: function() {
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
                //this.loadAssetList(),
                this.loadPortfolioList(),
                this.loadFeedList(),
                //this.loadReviewStatList(),
                this.loadCryptoWatch(),
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

        loadBlogList: function() {
            this.$refs.blogList.updateByCategory(this.$refs.blogList.category);
        },

        loadAssetList: function() {
            this.$refs.assetList.update();
        },

        loadFeedList: function() {
            this.$refs.feedList.update(this.v_me,0);
        },

        loadPortfolioList: function() {
            this.$refs.pfVC.updateByType('vc');
            this.$refs.pfROI.updateByType('roi');
            this.$refs.pfRated.updateByType('voting');
        },

        loadReviewStatList: function() {
            this.$refs.reviewList.update();
        },

        showChart: function(asset,dates,a_date) {
            console.log('HomeView.showChart=',asset);        
            //this.items_52w = json_list;
            this.$refs.chartWinner.update('gaia_crypto_trend_upbit',asset,dates);
        },


        onLoad: function(progress) {
            console.log('onLoad - ',progress);
        },

        onClickCategory: function(sector) {
            logger.log.debug('onClickCategory - ',sector);
            
            let dic_param = { name:'sector', path:'sector', params:{exchange:this.v_tab, sector:sector} };
            this.$router.push(dic_param);
        },

        onClickTrend: function() {
            logger.log.debug('onClickTrend - ');

            let dic_param = { name:'trend', path:'trend', params:{} };
            this.$router.push(dic_param);            
        },

        onClickToplist:function() {
            logger.log.debug('onClickToplist - ');
            this.v_toplist_visible = true;

            this.updateTopTable(this.g_data_top,this.v_tab,this.v_tab_toplist); 
            //_this.updateTopTable(_this.g_data_top,_this.v_tab,'ret');
        },

        onClickEureka: function(link) {
            logger.log.debug('onClickEureka - ',link);

            let dic_param = { name:link, path:link, params:{} };
            this.$router.push(dic_param);            
        },

        onClickTabCategory: function(exchange) {
            logger.log.debug('onClickTabCategory - ',exchange);
            this.updateExchangeWidget(this.g_data,exchange);
        },

        onClickKnob: function() {
            logger.log.debug('onClickKnob');
            let dic_param = { name:'cwatch', path:'cwatch', params:{} };
            this.$router.push(dic_param);            
        },
        
    }
};

</script>


<style scoped>
.box_label {
    margin-top:1px;
    margin-bottom:1px;
}

.box_eureka {

    display: grid;
    grid-template-columns: minmax(55px, 55px) 1fr;

    border: 1px solid #BBBBBB;
    /*background:#D7F1FA; blue*/
    /*background:#FFDC46; yellow*/ 
    /*background:#B4B4FF; purple */
    background:#FFE150;
    border-radius:8px; 
    padding: 15px; 
    /* margin:10px 8px 22px; */
    margin: 20px 0px 20px 0px;    
}

.box_eureka_icon {
    /*width:80px;
    */
    font-size:40px;
    color:#EB5A5A;
    margin:-8px 0px 0px 0px;
    /*padding-left:10px;*/
}
.box_eureka_text {    
    font-size: 13px;
}

.btc-eth {
    color: #111111;
    font-size: 18px;
    font-weight: 700;
}

.box_knob {
    font-size:25px; 
}

.box_hotlist {
    border: 1px solid #BBBBBB; 
    border-radius:8px; 
    height:130px;
    width:200px;
    margin:10px 20px 10px 0px;
}

.hotlist-icon {    
    color:gold;
    font-size:40px;
    padding:20px;
    /* position:relative; top:30px; */
}

.hotlist-name {
    color:#111111;
    font-size:20px;
    font-weight:800;
    padding:20px;
    /* position:relative; top:10px; */
}
</style>