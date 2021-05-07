import Vue from 'vue';
import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import Stock from 'highcharts/modules/stock';
import Treemap from 'highcharts/modules/treemap';
import Indicators from'highcharts/indicators/indicators';
import vueMoment from 'vue-moment';


Stock(Highcharts);
Indicators(Highcharts);
Treemap(Highcharts);

Vue.use(HighchartsVue);
Vue.use(vueMoment);