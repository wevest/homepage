<template>
    <div>
        <q-carousel
            @transition="onPageChange"
            v-model="v_slide"
            animated swipeable vertical padding arrows
            control-color="primary"
            transition-prev="slide-down"
            transition-next="slide-up"            
            class="boxCarousel rounded-borders">
            
            <q-carousel-slide name="landing" class="column boxLanding">
                <div class="column items-center">
                    <div class="boxImage1" v-if="v_page.landing"
                        v-motion-roll-bottom :delay="1000">
<!--                        
                        v-motion :initial="v_scale.initial" :enter="v_scale.enter" :delay="1000">
-->
                        <q-img src="~assets/images/people.png"/>
                    </div>
                    
                    <div class="text-center">

                        <div class="gBlackMediumTitle q-py-md">
                            Interest <span class="gBoldUpper">free</span> loan 
                        </div>
                        <div class="gDescBlack">
                            The first interest free loan in history<br>
                            No interest, No maturity, Leverage available
                        </div>
                        <div>
                            <span class="gWatchLinkBlack">Watch video</span> 
                            <q-btn flat icon="keyboard_arrow_right" />
                        </div>

                    </div>
                </div>
            </q-carousel-slide>

            <q-carousel-slide name="paradigm" class="column no-wrap flex-center boxParadigm">
                <div class="row items-center justify-center">            
                    <div class="col text-center" style="min-width:250px">
                        <div class="">
                            <div class="gWhiteMediumTitle white q-mb-xl">
                                New <span class="gBoldUpper">Interest</span> Paradigm<br>
                            </div>
                        </div>
                        <div class="q-mb-lg">
                            <div class="gDescWhite">
                                Existing paradigm : interest payment<br>
                                WEVEST paradigm : NO interest<br> 
                            </div>
                        </div>
                        <div class="text-center">
                            <span class="gWatchLinkWhite">Watch video</span>
                            <q-btn text-color="white" flat icon="keyboard_arrow_right"></q-btn> 
                        </div> 
                    </div>
                    <div class="col" style="min-width:250px">
                        <div class="boxImage2"  v-if="v_page.paradigm" 
                            v-motion-roll-left :delay="1000">
<!--                            
                            v-motion :initial="v_slidedown.initial" :enter="v_slidedown.enter" :delay="200">
-->

                            <q-img src="~assets/images/white_man.png" />
                        </div>
                    </div>
                </div>

            </q-carousel-slide>

            <q-carousel-slide name="win" class="boxWin">
                <div class="row items-center justify-center">
                    <div class="col text-center"> 
                        <div class="boxImage3"  v-if="v_page.win"
                            v-motion-roll-top :delay="1000">
<!--                            
                            v-motion :initial="v_slideleft.initial" :enter="v_slideleft.enter" :delay="200">
-->                            
                            <q-img src="~assets/images/white_woman.png" />
                        </div>
                    </div>
                    <div class="col text-center" style="min-width:630px">
                        <div class="gBlackBigTitle gBoldLower">
                            Win-Win
                        </div>
                        <div class="gBlackSmallTitle">
                            for both lender and borrower 
                        </div>
                        <div class="gDescBlack text-center">
                            Lender : more yield, transaction fee, LP tokens <br>
                            Borrower : no interest, no maturity, leverage available
                        </div>
                    </div>
                </div>
            
            </q-carousel-slide>

            <q-carousel-slide name="yield" class="boxYield">
                <div class="row items-center justify-center">
                    <div class="col" style="min-width:250px">
                        <div class="text-center gBlackMediumTitle q-py-lg">
                            <span class="gBoldLower">Yield Farming</span> + <span class="gBoldLower">Position Swap</span><br>
                            <span class="gBlackSmallTitle">made it possible</span> 
                        </div>
                        <div class="gDescBlack">
                            Wevest protocol utilize ‘collateral + loan’ and position swap to setoff interest rate.
                            lenders maximize interest income through yield farming, including their own funds
                            as well as borrowers' collateral, rather than earning interest income with only their own funds,
                            and borrowers can borrow more than the collateral, with no interest and no maturities.
                        </div>
                        <div>
                            <span class="gWatchLinkBlack">Watch video</span> 
                            <q-btn size="12px" flat icon="keyboard_arrow_right"></q-btn> 
                        </div> 
                    </div>
                    <div class="col" style="min-width:250px">
                        <div class="boxImage4"  v-if="v_page.yield"
                            v-motion-roll-bottom :delay="1000">
                            <q-img src="~assets/images/asian_woman.png" />
                        </div>
                    </div>
                </div>            
            </q-carousel-slide>

            <q-carousel-slide name="risk" class="column no-wrap flex-center boxRisk">
                <div class="row" >
                    <div class="col" style="min-width:250px"
                        v-motion-slide-bottom :delay="1000"
                    >
                        <div class="boxIcon boxImage5" v-if="v_page.risk">
                            <q-img src="~assets/images/asian_man.png" />
                        </div>
                    </div>
                    <div class="col" style="min-width:250px">
                        <div class="items-center">
                            <div class="gBlackMediumTitle q-pt-xl text-left">
                                <span class="gBoldLower">VaR & Forward-looking</span> <br>
                                <span class="gBlackSmallTitle">Risk Management</span> 
                            </div>
                            <div class="gDescBlack q-pt-md">
                                We measure risk via var, based on the var value
                                wevest protocol dynamically adjust collateral ratio to 
                                minimize risk exposure
                            </div>
                        </div>
                    </div>
                </div>            
            </q-carousel-slide>


        </q-carousel> 
        
        <div class="boxFooter q-pa-lg">
            <div class="text-center gJoinText" style="color: white;">
                Do you have ideas on how to improve wevest.io?
            </div>
            <div class="text-center">
                <span class="gJoinTitle">Join us</span> 
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


// transition presets from vue-motion
// https://motion.vueuse.org/presets.html
//

export default {
    name: 'HomePage',
    components: {},
/*    
    directives: {
        motion: motion(),
    },    
*/    
    computed: {
        v_me() {
            return store.getters.me;
        },
    },

    data() {
        return {
            v_slide:'landing',     
            v_page: {
                landing: true,
                win: false,
                yield: false,
                risk: false,
                paradigm: false
            },

            v_slideup: {
                initial: {
                    opacity: 0,
                    y:800,
                },
                enter: {
                    opacity: 1, 
                    y: 10,
                    transition: {
                        repeat: Infinity,repeatType: 'mirror',repeatDelay: 3000,
                    }

                }
            },

            v_slidedown: {
                initial: {
                    opacity: 0,
                    y:-800,
                },
                enter: {
                    opacity: 1, 
                    y: 10,
                    transition: {
                        repeat: Infinity,repeatType: 'mirror',repeatDelay: 1000,
                    }
                }
            },

            v_slideleft: {
                initial: {
                    opacity: 0,
                    x:-800,
                },
                enter: {
                    opacity: 1, 
                    x: 10,
                    transition: {
                        repeat: Infinity,repeatType: 'mirror',repeatDelay: 1000,
                    }
                }
            },

            v_slideright: {
                initial: {
                    opacity: 0,x:4800,
                },
                enter: {
                    opacity: 1, 
                    x: 10,
                    transition: {
                        repeat: Infinity,repeatType: 'mirror',repeatDelay: 1000,
                    }
                }
            },

            v_fade: {
                initial: {
                    opacity: 0,
                },
                enter: {
                    opacity: 1, 
                }
            },

            v_scale: {
                initial: {
                    scale: 0,
                },
                enter: {
                    scale: 1, 
                }
            },

        }
    },
    created() {
        logger.log.debug("HomeView.created",this.$isMobile());
        this.setParameters();
    },
    mounted() {
        logger.log.debug("HomeView.mounted");
    },
    updated() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        setParameters() {
            logger.log.debug("HomeView.setParameters");    

        },
        
        clearPageVar() {

        },

        onPageChange(newVal,oldVal) {
            logger.log.debug("HomeView.onPageChange : ",newVal,oldVal);
            
            this.v_page[oldVal] = false;
            this.v_page[newVal] = true;
        }
    }
};

</script>


<style scoped>

.boxCarousel {
    height: 85vh;
}

.boxFooter {
    height: 15vh;
    background-color: #000000;
}

.boxCenter {
    display: flex;
    align-items: center; 
    justify-content: center;
}

.container1 {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;

}


@media screen and (min-width: 769px) {
   /* 데스크탑에서 사용될 스타일을 여기에 작성합니다. */

     .boxImage1 {
        background-color:#FF8c00; 
        border-style:solid;
        border-width:6px;border-top-style:none;
        margin:50px;
        height: 360px;
        width: 800px;
    }
     .boxImage2 {
        background-color: #bdbdbd; 
        border-style: solid;
        border-width:5px;border-top-style:none;
        border-color: #FFFFFF;
        margin:50px;
        width: 450px;
    }
     .boxImage3 {
        background-color: #ec407a; 
        border-style:solid;
        border-width:5px;border-top-style:none;
        margin:50px;
        width:450px;
    }
    .boxImage4 {
        display: block;
        background-color: #64ffda; 
        border-style:solid;
        border-width:5px;
        border-top-style:none;
        margin:50px;
        min-width: 450px;
    }
    .boxImage5 {
        display: block;
        background-color: #e1bee7; 
        border-style:solid;
        border-width:5px;
        border-top-style:none;
        margin:50px;
        width: 450px;
    }
    
    .boxIcon {
        display: block;
    }
    
    .boxLanding {
        background: white;
    }

    .boxParadigm {
        background-color: #000000;
    }

    .boxWin {
        background-color: #009CF2;
    }

    .boxYield {
        background-color: #ff8500;
    }

    .boxRisk {
        background-color: #00E6AA;
    }

}

@media screen and (max-width: 768px) {
    /* 모바일에 사용될 스트일 시트를 여기에 작성합니다. */

    .boxImage1 {
        background-color: #FF8c00; 
        border-style:solid;
        border-width:5px;border-top-style:none;
        margin:50px;
        height: 110px;
        width: 250px;
  
    }
    .boxImage2 {
        background-color: #bdbdbd; 
        border-style: solid;
        border-width:5px;border-top-style:none;
        border-color: #FFFFFF;
        margin:50px;
        width: 250px;
    }
     .boxImage3 {
        background-color: #ffea00; 
        border-style:solid;
        border-width:5px;border-top-style:none;
        margin:50px;
        width:250px;
    }
    .boxImage4 {
        display: block;
        background-color: #64ffda; 
        border-style:solid;
        border-width:5px;
        border-top-style:none;
        margin:50px;
        height: 150px;
        width: 250px;
    
    }
    .boxImage5 {
        display: block;
        background-color: #e1bee7; 
        border-style:solid;
        border-width:5px;
        border-top-style:none;
        margin:50px;
        height: 160px;
        width: 250px;    
    }

    .boxLanding {
        background: white;
    }

    .boxParadigm {
        background-color: #000000;
    }

.boxWin {
        background-color: #009CF2;
    }

    .boxYield {
        background-color: #ff8500;
    }

    .boxRisk {
        background-color: #00E6AA;
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