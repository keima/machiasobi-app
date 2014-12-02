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
    'onsen.directives',
    'btford.markdown',
    'uiGmapgoogle-maps',
    'myApp.constant',
    'myApp.service',
    'myApp.controller',
    'myApp.directive',
    'myApp.filter'
  ])
  .constant('myAppSemVer', {
    major: 1,
    minor: 2,
    patch: 1
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
        controller: function ($scope, $stateParams, $timeout, $location, EventStore, Calendar) {
          var shortName = $stateParams.calendarShortName;
          var calendarId = Calendar.findCalendarIdByShortName(shortName);

          var shortEventId = $stateParams.eventId;
          var eventId = Calendar.restoreEventId(shortEventId);

          Calendar.getEvent(calendarId, eventId)
            .then(function (event) {
              EventStore.save(event);

              $scope.ons.createDialog('partials/calendar/event.html').then(function (dialog) {
                dialog.on("prehide", function (e) {

                  $timeout(function () {
                    $location.path('/calendar');
                  }, 10);

                });
                dialog.show();
              });

              //$scope.ons.screen.presentPage('partials/calendar/event.html');
            });
        },
        onExit: function ($rootScope) {
          if ($rootScope.ons.dialog.isShown()) {
            $rootScope.ons.dialog.hide(); // DOMが残り続ける問題がある
          }
        }
      })

      // Traffic
      .state('traffic', {
        url: '/traffic',
        templateUrl: 'partials/traffic/main.html'
      })

      // Delay
      .state('delay', {
        url: '/delay',
        templateUrl: 'partials/delay/main.html'
      })

      // Event
      .state('event', {
        url: '/event',
        templateUrl: 'partials/event/main.html'
      })

      // News
      .state('news', {
        url: '/news',
        templateUrl: 'partials/news/main.html'
      })
      .state('news.detail', {
        url: '/:id',
        template: '',
        controller: function ($scope, $timeout) {
          $timeout(function () {
            $scope.ons.navigator.pushPage('partials/news/detail.html');
          }, 200);
        },
        onExit: function ($rootScope) {
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
        controller: function ($scope, $timeout) {
          $timeout(function () {
            $scope.ons.navigator.pushPage('partials/map/detail.html');
          }, 200);
        },
        onExit: function ($rootScope) {
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

    // Analytics収集用
    $rootScope.$on('$stateChangeStart', function () {
      var path = $location.path(),
        absUrl = $location.absUrl(),
        virtualUrl = absUrl.substring(absUrl.indexOf(path));

      $window.dataLayer.push({event: 'virtualPageView', virtualUrl: virtualUrl});
    })
  });
