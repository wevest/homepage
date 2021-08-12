<template>


    <div>
        <CTitle ttype='subtitle' title="Ratings and Score" desc=""></CTitle>          

        <div class="box_score">
            <div class="box_score_point">
                <span class="score_point"> {{ v_score.avg }} </span>
                <br><span class="price_label">{{ $t('name.cryptovc') }}</span> 
                <br><span class="price_tag">{{ v_score.vc }}</span>
            </div>
            <div>
                <q-markup-table flat dense class="box_score_table">
                    <tbody>
                        <tr>
                            <td class="box_score_table_column"> 
                                <span class="caption_color">{{ $t('name.dev_score') }}</span> 
                            </td>
                            <td style="padding-top:30px;">
                                <q-slider
                                    v-model="v_score.dev" :min="0" :max="5" :step="1"                                            
                                    label :label-value="v_score.dev" readonly dense
                                    label-always color="purple" />
                            </td>
                        </tr>
                        <tr>
                            <td class="box_score_table_column"> 
                                <span class="price_label caption_color">{{ $t('name.price_score') }}</span> 
                            </td>
                            <td>
                                <q-slider
                                    v-model="v_score.price" :min="0" :max="5" :step="1"
                                    label :label-value="v_score.price"   readonly dense
                                    label-always color="purple" />
                            </td>
                        </tr>
                        <tr>
                            <td class="box_score_table_column"> 
                                <span class="price_label caption_color">{{ $t('name.volume_score') }}</span> 
                            </td>
                            <td>
                                <q-slider
                                    v-model="v_score.volume" :min="0" :max="5" :step="1"
                                    label :label-value="v_score.volume"  readonly dense
                                    label-always color="purple" />
                            </td>
                        </tr>
                    </tbody>
                </q-markup-table>
            </div>
        </div>
    </div>
        
</template>

<script>
import CommonFunc from 'src/util/CommonFunc';
import APIService from 'src/services/apiService';
import DataService from 'src/services/dataService';
import logger from "src/error/Logger";


export default {
    name:'ScoreBox',
    data() {
        return {
            v_score: {dev:5, price:5, volume:5, vc:0, avg:5},
        }
    },
    methods: {
        update: function(json_data) { 
            logger.log.debug("updateScoreWidget.data=",json_data);
            const dic_columns = CommonFunc.getColumnDic(json_data.columns,[],[]);
            let a_vc = json_data.values[ json_data.values.length-1 ][dic_columns['cryptovc']];
            
            this.v_score['dev'] = this.getScore(json_data.values[ json_data.values.length-1 ][dic_columns['commit_count_rank']]);
            this.v_score['price'] = this.getScore(json_data.values[ json_data.values.length-1 ][dic_columns['price_ret_rank']]);
            this.v_score['volume'] = this.getScore(json_data.values[ json_data.values.length-1 ][dic_columns['volume_sum_rank']]);
            this.v_score['vc'] = a_vc.split(",").length;
            this.v_score['avg'] = CommonFunc.formatNumber( (this.v_score['dev']+this.v_score['price']+this.v_score['volume'])/3,2);
        },

        getScore: function(value) {
            if (value>0.8) {                
                //return 'A';
                return 5;
            } else if (value>0.6) {
                return 4;
                //return 'B';
            } else if (value>0.4) {
                return 3;
                //return 'C';
            } else if (value>0.2) {
                return 2;
                //return 'D';
            } else if (value==0) { 
                return 0;
            } else {
                return 1;
                //return 'F';
            }
        },

    }
};

</script>
