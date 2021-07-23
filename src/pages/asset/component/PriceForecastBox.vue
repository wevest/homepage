<template>
    <div v-if="reviews.stat">

        <div class="row">
            <div class="gSubTitleMD gNoMargin">
                <span> {{v_title}} </span>
            </div>
            <div class="q-pl-md q-pt-xs">
                <q-rating
                    v-model="reviews.stat.average_rating"                    
                    name="quality"
                    max="5" readonly
                    size="1.2em"
                    color="red-5"
                    icon="star_outline"
                    icon-selected="star"
                    icon-half="star_half"
                    no-dimming
                    v-if="reviews.stat.average_rating"
                />   
            </div>
            <div>
                <q-btn flat :icon="v_icon" @click="onClick" />
            </div>
        </div>

<!--        
        <CTitle ttype='subtitle' :title="v_title" desc=""></CTitle>          
-->
        <q-slide-transition>
            <div class="row q-my-md" v-show="v_expanded">
                <div class="col-6 q-px-sm q-pr-md text-center">
<!--                    
                    <div class="reviewRatingTitle q-pb-md">
                        Review Rating
                    </div>
-->
                    <div class="q-pt-xl">
                        <span class="reviewRating">{{v_format(reviews.stat.average_rating)}}</span>
                        <span class="five"> / 5</span>
                    </div>              
                    <q-rating
                        class="q-pt-md" 
                        v-model="reviews.stat.average_rating"                    
                        name="quality"
                        max="5" readonly
                        size="1.8em"
                        color="red-5"
                        icon="star_outline"
                        icon-selected="star"
                        icon-half="star_half"
                        no-dimming
                        v-if="reviews.stat.average_rating"
                    />   

                </div>
                <div class="col-6 q-px-sm text-center">
                    <div class="reviewRatingTitle">
                        Rating Ratio
                    </div>
                    
                    <div>
                        <div class="boxRating" v-for="index in v_loop">
                            <div class="boxLabel">
                                <span>{{index}}</span>
                            </div>
                            <div class="boxProgress">
                                <q-linear-progress stripe rounded size="15px" :value="v_value(index)" color="red-5" class="q-mt-sm" >
                                    <div class="flex flex-center">
                                        <q-badge color="white" text-color="accent" :label="v_label(index)" />
                                    </div>
                                </q-linear-progress>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </q-slide-transition>
<!--        
        <div>
            {{reviews.stat.total_count}} ratings
        </div>
-->
    </div>

</template>


<script>
import { CONST } from 'src/data/const';
import {store} from "src/store/store";
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";

import CTitle from 'components/CTitle';

export default {
    name:'RatingReviewBox',
    components: {
        CTitle,
    },
	props: {
        reviews: {
            required: true,
            default: null
        },
        title: {
            default: "Review"
        }
    },
	computed: {
        v_me() {
            return store.getters.me;
        },
        v_title() {
            if ((! this.reviews.stat) || (! this.reviews.stat.total_count)) {
                return this.title;
            }
            
            return this.title+" ("+this.reviews.stat.total_count.toString()+")";
        },
        v_label() {
            return (index) => {   
                if (CommonFunc.isEmptyObject(this.reviews.stat['rating_'+index])) {
                    return "";
                }

                return CommonFunc.formatNumber(this.reviews.stat['rating_'+index],0) + " %";
            }
        },
        v_value() {
            return (index) => {   
                const value = this.reviews.stat['rating_'+index]/100;
                //logger.log.debug("v_value=",index,value);
                return value;
            }
        },
        v_format() {
            return (value) => {   
                if (! value) return 0;

                return CommonFunc.formatNumber(value,1);
            }
        },
        v_icon() {
            if (! this.v_expanded) return "expand_more";
            return "expand_less";
        }
	},
	data() {
		return {
            v_loop: [5,4,3,2,1],
            v_reviews: this.reviews,
            v_expanded:false,
        }
    },
    methods: {
        onClick() {
            logger.log.debug("PriceForecastBox.onClick");
            this.v_expanded = ! this.v_expanded;
        }
    }
    
};
</script>

<style scoped>

.boxTitle {
    font-size:17px;
    font-weight:500;
}

.reviewRatingTitle {
    font-size:17px;
    font-weight:500;
}

.reviewRating {
    font-size:35px;
    font-weight:bold;
}

.five {
    font-size:35px;
    color:#e0e3e5;
    font-weight:bold;
}

.boxRating {    
    display:flex;
}

.boxLabel {
    padding-top:5px;
    width:20px;
}

.boxProgress {    
    flex-grow:1;
}

</style>