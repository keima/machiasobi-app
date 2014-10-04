'use strict';

angular.module('myApp',
  [
    'ngSanitize',
    'ngTouch',
    'restangular',
    'angularLocalStorage',
    'ui.router',
    'ui.calendar',
    'onsen.directives',
    'btford.markdown',
    'google-maps',
    'myApp.constant',
    'myApp.service',
    'myApp.controller',
    'myApp.directive',
    'myApp.filter'
  ])
  .constant('myAppSemVer', {
    major: 1,
    minor: 0,
    patch: 0
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('root', {
        url: '/',
        templateUrl: 'partials/root/main.html',
        controller: 'RootCtrl'
      })

      // Calendar
      .state('calendar', {
        url: '/calendar',
        templateUrl: 'partials/calendar/main.html'
      })
      .state('calendar.detail', {
        url: '/:calendarShortName/:eventId',
        template: '', // empty template
        controller: function ($scope, $stateParams, EventStore, Calendar) {
          var shortName = $stateParams.calendarShortName;
          var calendarId = Calendar.findCalendarIdByShortName(shortName);

          var shortEventId = $stateParams.eventId;
          var eventId = Calendar.restoreEventId(shortEventId);

          Calendar.getEvent(calendarId, eventId)
            .then(function (event) {
              EventStore.save(event);
              $scope.ons.screen.presentPage('partials/calendar/event.html');
            });
        },
        onExit: function($rootScope) {
          $rootScope.ons.screen.dismissPage();
        }
      })

      // Traffic
      .state('traffic', {
        url: '/traffic',
        templateUrl: 'partials/traffic/main.html'
      })

      // News
      .state('news', {
        url: '/news',
        templateUrl: 'partials/news/main.html'
      })
      .state('news.detail', {
        url: '/:id',
        template: '',
        controller: function($scope, $timeout) {
          $timeout(function(){
            $scope.ons.navigator.pushPage('partials/news/detail.html');
          }, 200);
        },
        onExit: function($rootScope) {
          $rootScope.ons.navigator.popPage();
        }
      })

      // Map
      .state('map', {
        url: '/map',
        templateUrl: 'partials/map/main.html'
      })
      .state('map.detail', {
        url: '/:id',
        template: '',
        controller: function($scope, $timeout) {
          $timeout(function(){
            $scope.ons.navigator.pushPage('partials/map/detail.html');
          }, 200);
        },
        onExit: function($rootScope) {
          $rootScope.ons.navigator.popPage();
        }
      })

      // Twitter
      .state('twitter', {
        url: '/twitter',
        templateUrl: 'partials/twitter/main.html'
      })

      // About
      .state('about', {
        url: '/about',
        templateUrl: 'partials/misc/about.html'
      })
  })
  .run(function ($rootScope, $window, myAppSemVer, storage, Favorite, CalendarConst) {
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
