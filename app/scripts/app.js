'use strict';

angular.module('myApp',
  [
    'ngSanitize',
    'ngTouch',
    'restangular',
    'angularLocalStorage',
    'ui.calendar',
    'onsen.directives',
    'btford.markdown',
    'myApp.service',
    'myApp.controller',
    'myApp.filter'
  ])
  .run(
  function ($rootScope, storage, Favorite) {
    var semver = $rootScope.semver = {
      major: 0,
      minor: 6,
      patch: 1
    };
    $rootScope.appName = "マチ★アプリ";
    $rootScope.appVersion = "ver." + semver.major + "." + semver.minor + "." + semver.patch;

    storage.bind($rootScope, 'lastVersion', {defaultValue: null});

    /*
     $rootScope.periods = [
     {
     name: '10月12日(土)',
     date: moment([2013, 10, 12])
     },
     {
     name: '10月13日(日)',
     date: moment([2013, 10, 13])
     },
     {
     name: '10月14日(月)',
     date: moment([2013, 10, 14])
     }
     ];*/

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

    $rootScope.favEvents = [];

    $rootScope.calendars = [
      {
        name: 'お知らせ',
        shortName: 'announce',
        calendarId: 'p-side.net_cbtlph70nn0hdpm7u58v4rjp8g@group.calendar.google.com',
        selected: true,
        sticky: true
      },
      {
        name: '新町橋東公園',
        shortName: 'shinmachi', // css: gcal-shinmachi
        calendarId: 'p-side.net_ctrq60t4vsvfavejbkdmbhv3k4@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: '両国橋南公園',
        shortName: 'ryougoku',
        calendarId: 'p-side.net_timelrcritenrfmn86lco3qt9o@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'ボードウォーク',
        shortName: 'boardwalk',
        calendarId: 'p-side.net_2i5ibois4v1cqi780cgt18ip8k@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'CINEMA #1',
        shortName: 'cinema1',
        calendarId: 'p-side.net_7cg9ke36afhpjvmpvc77eb9oo8@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'CINEMA #2',
        shortName: 'cinema2',
        calendarId: 'p-side.net_bhonp02nnbsbkq44i6o0f1jvc8@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'ポッポ街',
        shortName: 'poppo',
        calendarId: 'p-side.net_0jj3pc9gbvp36qfm9nqltle94g@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'その他会場',
        shortName: 'other',
        calendarId: 'p-side.net_bldk04ogtu79o74hdvdm22pobk@group.calendar.google.com',
        selected: true,
        sticky: false
      }
    ];

    $rootScope.calendarConfig = {
      header: false,
      height: 9999,
      firstHour: 8,
      slotMinutes: 15,
      editable: false,
      defaultView: 'agendaDay',
      allDaySlot: false,
      allDayText: '終日',
      axisFormat: 'HH:mm',
      slotEventOverlap: false, // イベントの重なりを切る

      year: $rootScope.periods[0].date.get('year'),
      month: $rootScope.periods[0].date.get('month') - 1,
      date: $rootScope.periods[0].date.get('date'),

      eventRender: function (event, element) {
        // override href param
        element.removeAttr('href');

        if (Favorite.isFavorite(event.id)) {
//          console.log(event);
          element.addClass('favorited');
        }
      },

//      viewRender: function(view, element) {
//        console.log("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
//        return view;
//      },

      windowResize: function () {
        console.log('windowResize');
      }

    };
  });
