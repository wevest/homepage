<template>
    <div>
        <CTitle ttype='subtitle' :title="title" desc=""></CTitle>          
        <div>
            <q-rating
                name="quality"
                v-model="reviews.stat.average_rating"
                max="5"
                size="3.5em"
                color="yellow"
                icon="star_border"
                icon-selected="star"
                no-dimming
                v-if="reviews.stat.average_rating"
            /> 
            <span>{{reviews.stat.average_rating}}</span>
        </div>
        <div>
            {{reviews.stat.total_count}} ratings
        </div>

        <div>
            <div v-for="index in v_loop" class="boxRating">
                <div class="boxLabel">
                    <span>{{index}} Star</span>
                </div>
                <div class="boxProgress">
                    <q-linear-progress stripe rounded size="15px" :value="v_value(index)" color="secondary" class="q-mt-sm" >

                        <div class="flex flex-center">
                            <q-badge color="white" text-color="accent" :label="v_label(index)" />
                        </div>
                    </q-linear-progress>
                </div>
            </div>
        </div>
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

                return this.reviews.stat['rating_'+index].toLocaleString() + " %";
            }
        },
        v_value() {
            return (index) => {   
                return this.reviews.stat['rating_'+index]/100;
            }
        },
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

.boxRating {    
    display:flex;
}

.boxLabel {
    width:70px;
}

.boxProgress {    
    flex-grow:1;
}

</style>