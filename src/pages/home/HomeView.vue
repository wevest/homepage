<template>
<div>
    <section class="boxFreeloan">
        <q-parallax>
            <template v-slot:media>
                <img src="~assets/images/wevest_homepage_logo.png">
            </template>

            <template v-slot:content="scope">
                <div class="full-width">
                    <div class="col"></div>
                    <div class="col">
                        <div class="row">
                            <div class="col-1"></div>
                            <div class="col-11">
                                <div class="gBlackMediumTitle q-py-lg">
                                    Interest <span class="gBoldUpper">free</span> loan 
                                </div>
                                <div class="gDescBlack q-py-md">
                                    The first interest free loan in history<br>
                                    No interest, No maturity, Leverage available
                                </div>
                                <div>
                                    <span class="gWatchLinkBlack">Watch video</span> 
                                    <q-btn flat icon="keyboard_arrow_right" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col"></div>                    
                </div>
            </template>
        </q-parallax>
    </section> 
    <section class="boxParadigm q-pa-md boxCenter">
        <div class="text-center">
            <div class="gWhiteMediumTitle white q-mb-xl">
                New <span class="gBoldUpper">Interest</span> Paradigm<br>
            </div>
            <div class="q-mb-lg gDescWhite">
                The existing paradigm : interest payment on loan<br>
                The new paradigm : interest free loan<br> 
            </div>
            <div>
                <span class="gWatchLinkWhite">Watch video</span>
                <q-btn color="white" flat icon="keyboard_arrow_right"></q-btn> 
            </div> 
        </div>
    </section> 
    <section class="boxWin q-pa-md">
        <div class="row flex items-center justify-center full-height">
            <div class="col">
                <div class="boxImage" style="width:70%;">
                    <q-img src="~assets/images/white_woman.png" />
                </div>
            </div>
            <div class="col text-center">
                <div class="gBlackBigTitle gBoldLower">
                     Win-Win
                </div>
                <div class="gBlackSmallTitle q-pb-md">
                    for both lender and borrower 
                </div>
                <div class="gDescBlack q-pb-md">
                    Lender : more yield, transaction fee, LP tokens <br>
                    Borrower : no interest, no maturity, leverage available
                </div>
            </div>
        </div>
    </section> 
     <section class="boxCenter q-pa-md boxFarming">
        <div class="text-center">
            <div class="gBlackMediumTitle q-py-lg">
                <span class="gBoldLower">Yield Farming</span> + <span class="gBoldLower">Position Swap</span><br>
                <span class="gBlackSmallTitle">made it possible</span> 
            </div>
            <div class="gDescBlack q-px-lg">
                Wevest protocol utilize ‘collateral + loan’ and position swap to setoff interest rate.
                lenders maximize interest income through yield farming, including their own funds
                as well as borrowers' collateral, rather than earning interest income with only their own funds,
                and borrowers can borrow more than the collateral, with no interest and no maturities.
            </div>
            <div class="q-pa-md">
                <span class="gWatchLinkBlack">Watch video</span> 
                <q-btn size="12px" flat icon="keyboard_arrow_right"></q-btn> 
            </div> 
        </div>
    </section> 
    <section class="q-pa-lg boxRisk">
        <div class="flex row items-center justify-center">
            <div class="col item1">
                <div class="q-pl-lg items-center">
                    <div class="gBlackMediumTitle q-pt-xl text-left">
                        <span class="gBoldLower">VaR & adaptive</span> <br>
                        <span class="gBlackSmallTitle">risk management</span> 
                    </div>
                    <div class="gDescBlack q-pt-lg">
                        We measure risk via var, based on the var value
                        wevest protocol dynamically adjust collateral ratio to 
                        minimize risk exposure
                    </div>
                </div>
            </div>
            <div class="col itme2">
                <div class="boxIcon" style="max-width:70%">
                    <q-img src="~assets/images/wevest_homepage_icon.png" />
                </div>
            </div>
        </div>
    </section>
    
    <section class="q-pa-xl boxFooter">
        <div class="text-center gJoinText" style="color: white;">
            Do you have ideas on how to improve wevest.io?
        </div>
        <div class="text-center">
            <span class="gJoinTitle">Join us</span> 
            <q-btn color="white" flat icon="keyboard_arrow_right" />
        </div>
    </section>  
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

    }
};

</script>


<style scoped>

.boxCenter {
    align-items: center; 
    justify-content: center;
}

@media screen and (min-width: 769px) {
   /* 데스크탑에서 사용될 스타일을 여기에 작성합니다. */

    .boxCenter {
        display: flex;
        align-items: center; 
        justify-content: center;
    }

    .boxImage {
        display: block;
        background-color: #FF8c00; 
        border-style:solid;
        border-width:7px;border-top-style:none;
        margin:50px;
    }
    
    .boxIcon {
        display: block;
    }

    .boxFreeloan {
        background: white;
        height: 500px;
    }

    .boxParadigm {
        background-color: #000000;
        height: 600px;
    }
    
    .boxWin {
        background-color: #009CF2;
        height: 600px;
        justify-content: center;
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

}

@media screen and (max-width: 768px) {
    /* 모바일에 사용될 스트일 시트를 여기에 작성합니다. */
    .boxCenter {
        display: flex;
        align-items: center; 
        justify-content: center;
    }

    .boxImage {
        background-color: #FF8c00; 
        border-style:solid;
        border-width:5px;border-top-style:none;
        margin:50px;
        padding: 10px;
    }

    .boxFreeloan {
        background: white;
        height: 500px;
    }

    .boxWin {
        display: flex;
        background-color: #009CF2;
        /* height: 600px; */
    }


    .boxParadigm {
        background-color: #000000;
        height: 600px;
    }

    .boxFarming {
        background-color: #ff8500;
    }

    .boxRisk {
        background-color: #00E6AA;
        /* height: 600px; */
    }

    .boxFooter {
        background-color: #000000;
    }
    .flex {
        display:flex;
        flex-direction: row-reverse;
        flex-flow:wrap;
        justify-content:center;
        width: ;
        height:;
        align-content: center;
        align-items: center;
    }
    .flex div {
        flex-grow: 1;
        flex-shrink: 0;
        flex-basis: 300px;
        justify-content:center;
        align-items: center;

    }
}





@media only screen and (hover: none) and (pointer: coarse){
  
  @media (orientation: landscape) {
    .gBodyLG iframe {
        display: block;       /* iframes are inline by default */
        border: none;         /* Reset default border */
        height: 100vh;        /* Viewport-relative units */
        width: 100vw;
    }
  }

  @media (orientation: portrait) {
    .gBodyLG iframe {
        display: block;       /* iframes are inline by default */
        border: none;         /* Reset default border */
        height: 35vh;        /* Viewport-relative units */
        width: 70vw;
    }
  }

}


.white {
    color: #FFFFFF;
}

</style>