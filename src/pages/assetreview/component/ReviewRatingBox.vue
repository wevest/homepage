<template>
    <div>
        <CTitle ttype='subtitle' :title="title" desc=""></CTitle>          
        <div class="row q-my-md">
            <div class="col-6 q-px-sm q-pr-md text-center">
                <div class="reviewRatingTitle q-pb-md" review>
                    Review Rating
                </div>
                <q-rating
                    class="q-pt-lg" 
                    name="quality"
                    v-model="reviews.stat.average_rating"
                    max="5" readonly
                    size="1.8em"
                    color="red-5"
                    icon="star_outline"
                    icon-selected="star"
                    no-dimming
                    v-if="reviews.stat.average_rating"
                />   
                <div class="q-pt-md">
                    <span class="reviewRating">{{v_format(reviews.stat.average_rating)}}</span>
                    <span class="five"> / 5</span>
                </div>              
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
            default: "Investor Review Rating"
        }
    },
	computed: {
        v_me() {
            return store.getters.me;
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
        }
	},
	data() {
		return {
            v_loop: [5,4,3,2,1],
            v_reviews: this.reviews,
        }
    },
    methods: {

    }
    
};
</script>

<style scoped>

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