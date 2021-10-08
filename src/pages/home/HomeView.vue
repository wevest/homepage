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
            
            <q-carousel-slide name="landing" class="column flex-center boxLanding">
                <div class="column items-center">
                    <div class="boxBaseImage boxImage1" v-if="v_page.landing"
                        v-motion-roll-bottom :delay="1000">
<!--                        
                        v-motion :initial="v_scale.initial" :enter="v_scale.enter" :delay="1000">
-->
                        <q-img src="~assets/images/people.png" />
                    </div>
                    
                    <div class="text-center">

                        <div class="gBlackMediumTitle q-pb-md">
                            Interest <span class="gBoldUpper">free</span> loan 
                        </div>
                        <div class="gDescBlack q-pb-md">
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

            <q-carousel-slide name="paradigm" class="column flex-center boxParadigm">
                <div class="row items-center justify-center">            
                    <div :class="v_col_text_class">
                        <div class="">
                            <div class="gWhiteMediumTitle white q-mb-md">
                                New <span class="gBoldUpper">Interest</span> Paradigm<br>
                            </div>
                        </div>
                        <div class="q-mb-sm">
                            <div class="gDescWhite">
                                Existing paradigm : interest payment<br>
                                WEVEST paradigm : NO interest<br> 
                            </div>
                        </div>
                        <div class="text-left">
                            <span class="gWatchLinkWhite">Watch video</span>
                            <q-btn text-color="white" flat icon="keyboard_arrow_right"></q-btn> 
                        </div> 
                    </div>
                    <div :class="v_col_img_class">
                        <div class="flex items-center justify-center"
                            v-if="v_page.paradigm" v-motion-roll-left :delay="1000">                        

                            <q-img class="boxBaseImage boxImage2" src="~assets/images/white_man.png"  />
                        </div>
                    </div>
                </div>

            </q-carousel-slide>

            <q-carousel-slide name="win" class="column flex-center boxWin">
                <div class="row items-center justify-center">
                    <div :class="v_col_img_class">
                        <div class="flex items-center justify-center"
                            v-if="v_page.win" v-motion-roll-top :delay="1000">
                            <q-img src="~assets/images/white_woman.png" class="boxBaseImage boxImage3" />
                        </div>
                    </div>
                    <div :class="v_col_text_class">
                        <div class="gBlackMediumTitle gBoldLower text-left">
                            Win-Win game</span>
                        </div>
                        <div class="gBlackSmallTitle text-left q-pb-md">
                            for both lender and borrower 
                        </div>
                        <div class="gDescBlack text-left">
                            Lender: more yield, transaction fee, LP tokens
                            Borrower: no interest, no maturity, leverage available
                        </div>
                    </div>
                </div>
            
            </q-carousel-slide>

            <q-carousel-slide name="yield" class="column flex-center boxYield">
                <div class="row items-center justify-center">
                    <div :class="v_col_text_class">
                        <div class="text-center gBlackMediumTitle q-pb-md text-left">
                           <span class="gBlackSmallTitle">Why? </span> <span class="gBoldLower">Use Right Delegation</span>
<!--    
                            <span class="gBlackSmallTitle">made it possible</span> 
-->                            
                        </div>
                        <div class="gDescBlack text-left">
                            Wevest protocol utilizes ‘collateral + loan’ to earn yield to setoff the interest rate.
                        <div class="gDescBlack text-left q-pb-md">
                        The yield goes to lender as interest, So borrower does not pay interest at all.
                        </div>
<!--                            
                            Lenders maximize interest income through yield farming, including their own funds
                            as well as borrowers' collateral.
                             rather than earning interest income with only their own funds,
                            and borrowers can borrow more than the collateral, with no interest and no maturities.
-->                            
                        </div>
                        <div>
                            <span class="gWatchLinkBlack">Watch video</span> 
                            <q-btn size="12px" flat icon="keyboard_arrow_right"></q-btn> 
                        </div> 
                    </div>
                    <div :class="v_col_img_class">
                        <div class="flex items-center justify-center"
                            v-if="v_page.yield" v-motion-roll-bottom :delay="1000">
                            <q-img src="~assets/images/asian_woman.png" class="boxBaseImage boxImage4" />
                        </div>
                    </div>
                </div>            
            </q-carousel-slide>

            <q-carousel-slide name="risk" class="column no-wrap flex-center boxRisk">
                <div class="row items-center justify-center" >
                    <div :class="v_col_img_class">
                        <div class="flex items-center justify-center"    
                            v-if="v_page.risk" v-motion-slide-bottom :delay="1000">
                            <q-img src="~assets/images/asian_man.png" class="boxBaseImage boxImage5" />
                        </div>
                    </div>
                    <div :class="v_col_text_class">
                        <div class="items-center">
                            <div class="gBlackMediumTitle text-left">
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
        <div class="column boxFooter flex items-center justify-center">
            <div class="text-center gFooterText" style="color: white;">
                Do you have ideas on how to improve wevest.io?
            </div>
            <div class="text-center">
                <span class="gFooterLink">Join us</span> 
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
        v_width() {
            return window.innerWidth;
        },
        v_height() {
            return window.innerHeight;
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
            v_col_img_class:'col-xs-12 col-sm-6 col-md-6',
            v_col_text_class:'col-xs-12 col-sm-6 col-md-6',

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
        logger.log.debug("HomeView.created",this.v_height,this.v_width);
        this.setParameters();
    },
    mounted() {
        logger.log.debug("HomeView.mounted");
    },
    updated() {
        //console.log("HomeView.updated");
    },
    
    methods: {
        isMobile() {
            if (this.v_width>768) {
                return false;
            }
            return true;
        },

        setParameters() {
            logger.log.debug("HomeView.setParameters");    

            if (this.isMobile()) {
                this.v_col_img_class = 'col-xs-8 col-sm-6 col-md-6';
                this.v_col_text_class = 'col-xs-12 col-sm-6 col-md-6';
            } else {
                this.v_col_img_class = 'col boxBaseCol';
                this.v_col_text_class = 'col boxBaseCol';
            }
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

.boxBaseCol {
    min-width:250px;
}

@media screen and (min-width: 769px) {
   /* 데스크탑에서 사용될 스타일을 여기에 작성합니다. */

    .boxBaseImage {
        margin:50px;
        border-style: solid;
        border-width:5px;
        border-top-style:none;
    }

    .boxImage1 {
        background-color:#FF8c00; 
        border-color: #000000;
        height: 360px;
        width: 800px;
    }
    
    .boxImage2 {
        background-color: #bdbdbd;         
        border-color: #FFFFFF;
        width: 360px;

    }
     .boxImage3 {
        background-color: #ec407a; 
        width: 360px;
    }
    .boxImage4 {
        background-color: #64ffda; 
        width: 360px;
    }
    .boxImage5 {
        background-color: #e1bee7; 
        width: 360px;
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

.boxSmallImg {
    height:30vh;
}

@media screen and (max-width: 768px) {
    /* 모바일에 사용될 스트일 시트를 여기에 작성합니다. */

    .boxBaseImage {
        margin:20px;
        border-style: solid;
        border-width:4px;
        border-top-style:none;
    }

    .boxImage1 {
        background-color: #FF8c00; 
        border-color: #000000;
        height: 135px;
        width: 300px;
  
    }
    .boxImage2 {
        background-color: #bdbdbd; 
        border-color: #FFFFFF;
        height:110px;
        width: 150px;
    }
     .boxImage3 {
        background-color: #ffea00; 
        border-color: #000000;
        height:110px;
        width: 150px;
    }
    .boxImage4 {
        background-color: #64ffda; 
        border-color: #000000;
        height:120px; 
        width: 140px;
    }
    .boxImage5 {
        background-color: #e1bee7; 
        border-color: #000000;
        height:110px; 
        width: 140px;

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

</style>