<template>
<div>
    <div class="q-pa-md boxFreeloan">
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
                        </div>
                    </div>
                    <div class="col"></div>                    
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
        <div class="row items-center full-height">
            <div class="col">
                <div class="boxImage">
                    <q-img src="~assets/images/white_woman.png" />
                </div>
            </div>
            <div class="col text-center">
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
            <div class="col">
                <div class="q-pl-xl items-center">
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
            <div class="col">
                <div class="boxIcon">
                    <q-img src="~assets/images/wevest_homepage_icon.png" />
                </div>
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

    }
};

</script>


<style scoped>

.boxCenter {
    display: flex;
    align-items: center; 
    justify-content: center;
}


@media screen and (min-width: 769px) {
   /* 데스크탑에서 사용될 스타일을 여기에 작성합니다. */

    .mainTitle {
        padding: 0px 450px 150px 0px;
    }

    .boxImage {
        background-color: #FF8c00; 
        border-style:solid;
        border-width:10px;border-top-style:none;
        margin:50px;
    }

    .boxIcon {
        margin: 0px 0px 0px 0px;  
    } 

    .boxWin {
        background-color: #009CF2;
        height: 600px;
    }

    .boxFreeloan {
        background: white;
        height: 600px;
    }

    .boxParadigm {
        background-color: #000000;
        height: 600px;
    }

    .boxCenter {
        display: flex;
        align-items: center; 
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

    .boxWin {
        background-color: #009CF2;
        height: 600px;
    }

    .boxFreeloan {
        background: white;
        height: 600px;
    }

    .boxParadigm {
        background-color: #000000;
        height: 600px;
    }

    .boxCenter {
        display: flex;
        align-items: center; 
        justify-content: center;
    }

    .boxFarming {
        background-color: #ff8500;
    }

    .boxRisk {
        background-color: #00E6AA;
        height: 600px;
    }

    .boxFooter {
        background-color: #000000;
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