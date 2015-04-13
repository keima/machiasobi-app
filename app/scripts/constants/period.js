'use strict';

angular.module('myApp.constant')
  .constant('PeriodConst', [
    {
      name: '5月3日(日)',
      shortName: '1日目',
      date: moment('2015-05-03T00:00:00+09:00')
//      date: moment('2014-10-12T00:00:00+09:00') /* デバッグ用 */
    },
    {
      name: '5月4日(月)',
      shortName: '2日目',
      date: moment('2015-05-04T00:00:00+09:00')
    },
    {
      name: '5月5日(火)',
      shortName: '3日目',
      date: moment('2015-05-05T00:00:00+09:00')
    }
  ])
;