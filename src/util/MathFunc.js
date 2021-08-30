import CommonFunc from "@/util/CommonFunc";
import {getTimeStamp} from '@/util/DateHelpers';

import Errors from "@/error/Errors";
import logger from "@/error/Logger";
import ehandler from "@/error/EHandler";


export default class MathFunc {

  static scaleBetween(unscaledNum, minAllowed, maxAllowed, min, max) {
    return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
  }

  static scaleData(unscaledNums,a_min,a_max) {
    var maxRange = Math.max.apply(Math, unscaledNums);
    var minRange = Math.min.apply(Math, unscaledNums);
    
    let values = [];
    for (var i = 0; i < unscaledNums.length; i++) {
      var unscaled = unscaledNums[i];
      var scaled = MathFunc.scaleBetween(unscaled, a_min, a_max, minRange, maxRange);
      //console.log(scaled.toFixed(2));
      values.push(scaled.toFixed(2));
    }  
    
    return values;
  }

}
