'use strict';

angular.module('myApp',
  [
    'ngTouch',
    'restangular',
    'ui.calendar',
    'onsen.directives',
    'myApp.service',
    'myApp.controller'
  ])
  .run(
  function ($rootScope) {
    $rootScope.appName = "マチ★アプリ";

    $rootScope.periods = [
      {
        name: '5月3日(土)',
        date: moment([2014, 5, 3])
      },
      {
        name: '5月4日(日)',
        date: moment([2014, 5, 4])
      },
      {
        name: '5月5日(月)',
        date: moment([2014, 5, 5])
      }
    ];

    $rootScope.calendars = [
      {
        name: '新町橋東公園',
        calendarId: 'p-side.net_7cg9ke36afhpjvmpvc77eb9oo8@group.calendar.google.com',
        selected: true
      },
      {
        name: '両国橋南公園',
        calendarId: 'test',
        selected: true
      },
      {
        name: 'ボードウォーク',
        calendarId: 'test',
        selected: true
      },
      {
        name: 'CINEMA #1',
        calendarId: 'test',
        selected: true
      },
      {
        name: 'CINEMA #2',
        calendarId: 'test',
        selected: true
      },
      {
        name: '新町橋東公園',
        calendarId: 'test',
        selected: true
      }
    ];
  });
