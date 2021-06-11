import Vue from 'vue';
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import Stock from 'highcharts/modules/stock';
import Treemap from 'highcharts/modules/treemap';
import Indicators from'highcharts/indicators/indicators';
import vueMoment from 'vue-moment';
import AvatarCropper from "vue-avatar-cropper";


Stock(Highcharts);
Indicators(Highcharts);
Treemap(Highcharts);

Vue.use(HighchartsVue);
Vue.use(vueMoment);
//Vue.use(AvatarCropper);