'use strict';

angular.module('myApp.constant.period', [])
  .constant('PeriodConst', [
    {
      name: '10月11日(土)',
      shortName: '1日目',
      date: moment('2014-10-11T00:00:00+09:00')
    },
    {
      name: '10月12日(日)',
      shortName: '2日目',
      date: moment('2014-10-12T00:00:00+09:00')
    },
    {
      name: '10月13日(月)',
      shortName: '3日目',
      date: moment('2014-10-13T00:00:00+09:00')
    }
  ]);