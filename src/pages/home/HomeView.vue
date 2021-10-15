<template>
    <div class="col">
        <div class="row q-ma-sm boxHeader">
            <q-img src="~assets/images/wevest_logo_black.png" class="boxLogo" />
            <q-space />
            <div>
                <q-btn class="fab fa-github icon"  size="20px" flat  /> 
                <q-btn class="fab fa-twitter icon"  size="20px" flat />                              
                <q-btn class="fab fa-discord icon" size="20px" flat />
                <q-btn class="fab fa-blogger icon" size="20px" flat />                             
                <q-btn class="far fa-file-alt icon" size="20px" flat /> 
            </div>
        </div>

        <div class="fit">

            <q-carousel
                @transition="onPageChange"
                v-model="v_slide"
                animated swipeable vertical arrows 
                control-type="flat"
                control-color="primary"
                transition-prev="slide-down"
                transition-next="slide-up"            
                class="rounded-borders full-height">
                
                <q-carousel-slide name="landing" class="column boxLanding">
                    <div class="items-center2">

                        <div class="q-ma-lg flex items-center justify-center">
                            <div v-show="false">
                                <div class="vertical-bottom symbolText"> We invest future </div>
                            </div>
                        </div>

                        <div class="text-center">
                            <div class="gBlackMediumTitle q-pb-md">
                                Interest <span class="gBoldUpper">free</span> loan 
                            </div>

                            <div class="flex items-center justify-center"
                                v-if="v_page.landing" v-motion-roll-bottom :delay="v_delay">
                                <q-img src="~assets/images/people.png" class="boxBaseImageExt boxImage1" />
                            </div>
                        </div>
                        
                        <div class="text-center">

                            <div class="gDescBlack q-py-md">
                                The first interest free loan in history<br>
                                No interest, No maturity, Leverage available
                            </div>
                            <div class="q-pt-sm">
                                <q-btn dense padding="0px" size="12px" label="Read Doc" flat icon-right="keyboard_arrow_right" align="left" />
                            </div> 
                        </div>
                    </div>
                </q-carousel-slide>

                <q-carousel-slide name="paradigm" class="column flex-center boxParadigm">
                    <div class="row full-height items-center justify-center">            
                        <div :class="v_col_text_class">
                            <div class="q-pl-lg">
                                <div class="gWhiteMediumTitle white q-mb-md">
                                    New <span class="gBoldUpper">Interest</span> Paradigm<br>
                                </div>

                                <div class="q-mb-sm">
                                    <div class="gDescWhite">
                                        Existing paradigm : Interest payment<br>
                                        WEVEST paradigm : NO interest<br> 
                                    </div>
                                </div>
                                <div class="q-pt-sm">
                                    <q-btn dense padding="0px" text-color="white" size="12px" label="Read Doc" flat icon-right="keyboard_arrow_right" align="left" />
                                </div> 
                            </div>
                        </div>
                        <div :class="v_col_img_class">
                            <div class="flex items-center justify-center"
                                v-if="v_page.paradigm" v-motion-slide-right :delay="v_delay">                        

                                <q-img class="boxBaseImage boxImage2" src="~assets/images/white_man.png"  />
                            </div>
                        </div>
                    </div>

                </q-carousel-slide>

                <q-carousel-slide name="win" class="column flex-center boxWin">
                    <div class="row full-height items-center justify-center">
                        <div :class="v_col_img_class">
                            <div class="flex items-center justify-center"
                                v-if="v_page.win" v-motion-slide-left :delay="v_delay">
                                <q-img src="~assets/images/white_woman.png" class="boxBaseImage boxImage3" />
                            </div>
                        </div>
                        <div :class="v_col_text_class">
                            <div class="boxWinText q-pl-md">
                                <div class="gBlackMediumTitle gBoldLower text-left">
                                    <span>Win-Win game</span>
                                </div>
                                <div class="gBlackSmallTitle text-left q-pb-md">
                                    for both lender and borrower 
                                </div>
                                <div class="gDescBlack text-left">
                                    Lender: more yield, transaction fee, LP tokens
                                    Borrower: no interest, no maturity, leverage available
                                </div>
                                <div class="q-pt-sm">
                                    <q-btn dense padding="0px" size="12px" label="Read Doc" flat icon-right="keyboard_arrow_right" align="left" />
                                </div> 
                            </div>
                        </div>
                    </div>
                
                </q-carousel-slide>

                <q-carousel-slide name="yield" class="column flex-center boxYield">
                    <div class="row full-height items-center justify-center">
                        <div :class="v_col_text_class">
                            <div class="q-pl-lg">
                                <div class="text-center gBlackMediumTitle q-pb-md text-left">
                                <span class="gBlackSmallTitle"></span> <span class="gBoldLower">Use Right Delegation</span>
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
                                <div class="q-pt-sm">
                                    <q-btn dense padding="0px" size="12px" label="Read Doc" flat icon-right="keyboard_arrow_right" align="left" />
                                </div> 
                            </div>
                        </div>

                        <div :class="v_col_img_class">
                            <div class="flex items-center justify-center"
                                v-if="v_page.yield" v-motion-slide-top :delay="v_delay">
                                <q-img src="~assets/images/asian_woman.png" class="boxBaseImage boxImage4" />
                            </div>
                        </div>
                    </div>            
                </q-carousel-slide>

                <q-carousel-slide name="risk" class="column no-wrap flex-center boxRisk">
                    <div class="row full-height items-center justify-center" >
                        <div :class="v_col_img_class">
                            <div class="flex items-center justify-center"    
                                v-if="v_page.risk" v-motion-slide-bottom :delay="v_delay">
                                <q-img src="~assets/images/asian_man.png" class="boxBaseImage boxImage5" />
                            </div>
                        </div>
                        <div :class="v_col_text_class">
                            <div class="boxVarText">
                                <div class="gBlackMediumTitle text-left">
                                    <span class="gBoldLower">VaR & Forward-looking</span> <br>
                                    <span class="gBlackSmallTitle">Risk Management</span> 
                                </div>
                                <div class="gDescBlack q-pt-md">
                                    We measure risk via var, based on the var value
                                    wevest protocol dynamically adjust collateral ratio to 
                                    minimize risk exposure
                                </div>
                                <div class="q-pt-sm">
                                    <q-btn dense padding="0px" size="12px" label="Read Risk Management Doc" flat icon-right="keyboard_arrow_right" align="left" /> <br>
                                    <q-btn dense padding="0px" size="12px" label="Read VARiM Doc" flat icon-right="keyboard_arrow_right" align="left" />
                                </div> 
                            </div>
                        </div>
                    </div>
                </q-carousel-slide>

                <q-carousel-slide name="footer" class="column no-wrap flex-center boxFooter">
                    <div class="flex items-center" v-if="v_page.footer">
                        <div class="row full-width q-px-md">
                            <div class="col-4">
                                <div class="column">
                                    <div class="footerTitle q-pb-sm"> Learn </div>
                                    <q-btn class="learnBtn" flat dense align="left" text-color="grey-5" label="wevest protocol" /> 
                                    <q-btn class="learnBtn" flat dense align="left" text-color="grey-5" label="risk management" /> 
                                    <q-btn class="learnBtn" flat dense align="left" text-color="grey-5" label="free-loan" /> 
                                    <q-btn class="learnBtn" flat dense align="left" text-color="grey-5" label="benefit" /> 
                                </div>
                            </div>
                            
                            <div class="col-4">
                                <div class="column">
                                    <div class="footerTitle q-pb-sm"> Product </div>
                                    <q-btn class="learnBtn" flat dense align="left" text-color="grey-5" label="Lending" /> 
                                </div>
                            </div>

                            <div class="col-4">
                                <div class="text-right">
                                    <q-btn class="fab fa-github-square icon2" size="25px" flat /> 
                                    <q-btn class="fab fa-twitter-square icon2" size="25px" flat/>    
                                    <q-btn class="fab fa-discord icon2 discord" size="25px" flat />  
                                    <q-btn class="fab fa-blogger icon2" size="25px" flat /> 
                                    <q-btn class="far fa-file-alt icon2" size="25px" flat /> 
                                </div>
                                <div class="q-py-md q-pr-sm text-right" style="color: white;">
                                    wevest.io
                                </div>
                            </div>
                        </div>
                    </div>  
                </q-carousel-slide>
            </q-carousel> 
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
            v_delay: 400,

            v_page: {
                landing: true,
                win: false,
                yield: false,
                risk: false,
                paradigm: false,
                footer: false
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
                //this.v_col_img_class = 'col-xs-12 col-sm-6 col-md-6 boxImageCol';
                //this.v_col_text_class = 'col-xs-12 col-sm-6 col-md-6 boxTextCol flex items-center';
                this.v_col_img_class = 'col-xs-12 col-sm-6 col-md-6 boxImageCol';
                this.v_col_text_class = 'col-xs-12 col-sm-6 col-md-6 boxTextCol flex items-center';
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
    height: 95vh; 
}

.boxHeader {
    height:5vh;
}

.boxFooter {
    background-color: #000000;
    color: white;
}

.boxCenter {
    display: flex;
    align-items: center; 
    justify-content: center;
}

.boxBaseCol {
    min-width:250px;
}

.boxImageCol {
    /* margin-top:8vh; */
    height: 40vh;
}

.boxTextCol {
    /* margin-top:5vh; */
    height: 50vh;
}

@media screen and (min-width: 769px) {
   /* 데스크탑에서 사용될 스타일을 여기에 작성합니다. */


    .learnBtn {
        font-size:14px; 
        width: 150px;
    }   
    .icon {
        width:30px;
        height:30px;
    }

    .icon2 {
        size: 30px;
        width:40px;
        height:40px;
    }

    .discord {
        padding-top:2px;
    }
    .boxBaseImage {
        margin:50px;
        border-style: solid;
        border-width:5px;
        border-top-style:none;
    }

    .boxBaseImageExt {
        margin:10px 50px 30px 50px;
        border-style: solid;
        border-width:5px;
        border-top-style:none;
    }

    .boxLogo {
        width: 180px;
        height: 45px;
    }

    .boxImage1 {
        /*
        background-color:#FF8c00; 
        */
        background-color: #03a9f4; 
        border-color: #000000;
        height: 250px;
        width: 800px;
    }
    
    .boxImage2 {
        background-color: #ffccbc;         
        border-color: #FFFFFF;
        width: 360px;

    }
     .boxImage3 {
        background-color: #ffea00; 
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
    
    .boxLanding {
        background: white;
        align-items: center;
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

    .learnBtn {
        font-size:10px;  
        width: 120px;
    }      
        
    .icon2 {
        size: 35px;
        width:40px;
        height:40px;
    }
    .boxLogo {
        height: 20%;
        width: 20%;
    }

    .boxBaseImage {
        margin:20px;
        border-style: solid;
        border-width:4px;
        border-top-style:none;
    }

    .boxImage1 {
        background-color: #03a9f4; 
        border-color: #000000;
        height: 125px;
        width: 280px;
  
    }
    .boxImage2 {
        background-color: #bdbdbd; 
        border-color: #FFFFFF;
        margin: -5vh 15vw 15vh 15vw;
    }

    .boxWinText {
        margin: -15vh 0vw 0vh 0vw;
    }

    .boxImage3 {
        background-color: #ffea00; 
        border-color: #000000;
        margin: 10vh 10vw 10vh 10vw;
    }
    .boxImage4 {
        background-color: #64ffda; 
        border-color: #000000;
        margin: -4vh 18vw 0vh 18vw;
    }
    .boxImage5 {
        background-color: #e1bee7; 
        border-color: #000000;
        margin: 10vh 10vw 10vh 10vw;    
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