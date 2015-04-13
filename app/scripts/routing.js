"use strict";

angular.module('myApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      // Root
      .state('app', {
        url: '/',
        templateUrl: 'partials/root/main.html'
      })
      // Calendar
      .state('app.calendar', {
        url: 'calendar',
        template: '<ui-view />',
        controller: function () {
          app.globalNavi.pushPage('partials/calendar/main.html');
        },
        onExit: function () {
          app.globalNavi.popPage();
        }
      })
      .state('app.calendar.detail', {
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

              ons.createDialog('partials/calendar/event.html')
                .then(function (dialog) {
                  dialog.show();
                });
            });
        },
        onExit: function ($timeout) {
          if (!!app.eventDialog && app.eventDialog.isShown()) {
            app.eventDialog.hide({
              callback: function () {
                app.eventDialog.destroy();
              }
            });
          }
        }
      })

      // Traffic
      .state('app.traffic', {
        url: 'traffic',
        template: '',
        controller: function () {
          app.globalNavi.pushPage('partials/traffic/main.html');
        },
        onExit: function () {
          app.globalNavi.popPage();
        }
      })

      // Delay
      .state('app.delay', {
        url: 'delay',
        controller: function () {
          app.globalNavi.pushPage('partials/delay/main.html');
        },
        onExit: function () {
          app.globalNavi.popPage();
        }
      })

      // Event
      // TODO: 使ってないから消す
      .state('event', {
        url: '/event',
        templateUrl: 'partials/event/main.html'
      })

      // News
      .state('app.news', {
        url: 'news',
        template: '<ui-view />',
        controller: function () {
          app.globalNavi.pushPage('partials/news/main.html');
        },
        onExit: function () {
          app.globalNavi.popPage();
        }
      })
      .state('app.news.detail', {
        url: '/:id',
        template: '',
        controller: function () {
          app.globalNavi.pushPage('partials/news/detail.html');
        },
        onExit: function () {
          app.globalNavi.popPage();
        }
      })

      // Map
      .state('app.map', {
        url: 'map',
        template: '<ui-view />',
        controller: function () {
          app.globalNavi.pushPage('partials/map/main.html');
        },
        onExit: function () {
          app.globalNavi.popPage();
        }
      })
      .state('app.map.detail', {
        url: '/:id',
        template: '',
        controller: function () {
          app.globalNavi.pushPage('partials/map/detail.html');
        },
        onExit: function () {
          app.globalNavi.popPage();
        }
      })

      // Twitter
      .state('app.twitter', {
        url: 'twitter',
        template: '',
        controller: function () {
          app.globalNavi.pushPage('partials/twitter/main.html');
        },
        onExit: function () {
          app.globalNavi.popPage();
        }
      })

      // About
      .state('app.about', {
        url: 'about',
        template: '',
        controller: function () {
          app.globalNavi.pushPage('partials/misc/about.html');
        },
        onExit: function () {
          app.globalNavi.popPage();
        }
      })
  })
;