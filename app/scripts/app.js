'use strict';

angular.module('myApp',
  [
    'ngSanitize',
    'ngTouch',
    'restangular',
    'angularLocalStorage',
    'ui.router',
    'ui.calendar',
    'onsen',
    'btford.markdown',
    'uiGmapgoogle-maps',
    'angulartics',
    'angulartics.google.tagmanager',

    'myApp.constant',
    'myApp.service',
    'myApp.controller',
    'myApp.directive',
    'myApp.filter'
  ])
  .constant('myAppSemVer', {
    major: 1,
    minor: 4,
    patch: 0
  })
  .config(function (uiGmapGoogleMapApiProvider, myAppGoogleApiKey) {
    uiGmapGoogleMapApiProvider.configure({
      key: myAppGoogleApiKey
    });
  })
  .run(function ($rootScope, $cookies, $window, $location, myAppSemVer, myAppGoogleApiKey, storage, Favorite, CalendarConst, PeriodConst) {
    $rootScope.semver = myAppSemVer;
    $rootScope.appName = "マチ★アプリ";
    $rootScope.volName = "vol.13";
    $rootScope.appVersion = "ver." + myAppSemVer.major + "." + myAppSemVer.minor + "." + myAppSemVer.patch;

    storage.bind($rootScope, 'lastVersion', {defaultValue: null});

    $rootScope.periods = PeriodConst;

    $rootScope.favEvents = [];

    $rootScope.calendars = CalendarConst;

    $rootScope.calendarConfig = {
      googleCalendarApiKey: myAppGoogleApiKey,

      header: false,
      height: 1000, // dummy value
      defaultDate: $rootScope.periods[0].date,
      timezone: 'Asia/Tokyo',

      scrollTime: '8:00:00',
      slotDuration: '00:15:00',

      editable: false,

      defaultView: 'agendaDay',

      allDaySlot: (($cookies.showAllDaySlot || 'true') === 'true'),
      allDayText: '終日',

      axisFormat: 'HH',

      slotEventOverlap: false, // イベントの重なりを切る

      eventRender: function (event, element) {
        // override href param
        element.removeAttr('href');

        if (Favorite.isFavorite(event.id)) {
          element.addClass('favorited');
        }
      },
      windowResize: function () {
        console.log('windowResize');
      },

      // これはui-calendarのプロパティではない
      showLegend: (($cookies.showLegend || 'true') === 'true'),
      updateTime: moment()
    };

    // rootScopeいじっておいて、どこでもng-clickでリンクを開けるようにする
    $rootScope.openLink = function (url) {
      $window.open(url);
    };

  });
