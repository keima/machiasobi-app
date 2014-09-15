'use strict';

angular.module('myApp',
  [
    'ngSanitize',
    'ngTouch',
    'ngRoute',
    'restangular',
    'angularLocalStorage',
    'ui.calendar',
    'onsen.directives',
    'btford.markdown',
    'myApp.constant',
    'myApp.service',
    'myApp.controller',
    'myApp.directive',
    'myApp.filter'
  ])
  .constant('myAppSemVer', {
    major: 0,
    minor: 9,
    patch: 0
  })
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');

    $routeProvider
      .when('/calendar', {
        template: '',
        controller: function ($scope) {
          console.log($scope.ons.screen.isEmpty());
          if (!$scope.ons.screen.isEmpty()) {
            $scope.ons.screen.dismissPage();
          }
        }
      })
      .when('/calendar/:calendarShortName', {
        template: '',
        controller: function () {
          // このIDのカレンダーだけ表示とか？
          // あとマッチしなかったら / にリダイレクトとか？
        }
      })
      .when('/calendar/:calendarShortName/:eventId', {
        template: '',
        controller: function ($scope, $routeParams, EventStore, Calendar) {
          var shortName = $routeParams.calendarShortName;
          var calendarId = Calendar.findCalendarIdByShortName(shortName);

          var shortEventId = $routeParams.eventId;
          var eventId = Calendar.restoreEventId(shortEventId);

          Calendar.getEvent(calendarId, eventId)
            .then(function (event) {
              EventStore.save(event);
              $scope.ons.screen.presentPage('event.html');
            });
        }
      })
      .otherwise({
        redirectTo: '/calendar'
      });
  })
  .run(
  function ($rootScope, $window, myAppSemVer, storage, Favorite, CalendarConst) {
    $rootScope.semver = myAppSemVer;
    $rootScope.appName = "マチ★アプリ";
    $rootScope.volName = "vol.13";
    $rootScope.appVersion = "ver." + myAppSemVer.major + "." + myAppSemVer.minor + "." + myAppSemVer.patch;

    storage.bind($rootScope, 'lastVersion', {defaultValue: null});

    $rootScope.periods = [
      {
        name: '10月11日(土)',
        date: moment('2014-10-11T00:00:00+09:00')
      },
      {
        name: '10月12日(日)',
        date: moment('2014-10-12T00:00:00+09:00')
      },
      {
        name: '10月13日(月)',
        date: moment('2014-10-13T00:00:00+09:00')
      }
    ];

    $rootScope.favEvents = [];

    $rootScope.calendars = CalendarConst;

    $rootScope.calendarConfig = {
      header: false,
      height: 1000, // dummy value
      defaultDate: $rootScope.periods[0].date,
      timezone: 'Asia/Tokyo',//false,//s'UTC',//'local',//'Asia/Tokyo',

      scrollTime: '8:00:00',
      slotDuration: '00:15:00',

      editable: false,

      defaultView: 'agendaDay',

      allDaySlot: true,
      allDayText: '終日',

      axisFormat: 'HH:mm',
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
      }
    };

    // rootScopeいじっておいて、どこでもng-clickでリンクを開けるようにする
    $rootScope.openLink = function (url) {
      $window.open(url);
    }
  });
