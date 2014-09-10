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
    'myApp.directive',
    'myApp.filter'
  ])
  .run(
  function ($rootScope, $window, storage, Favorite) {
    var semVer;
    $rootScope.semver = semVer = {
      major: 0,
      minor: 8,
      patch: 1
    };
    $rootScope.appName = "マチ★アプリ";
    $rootScope.volName = "vol.13";
    $rootScope.appVersion = "ver." + semVer.major + "." + semVer.minor + "." + semVer.patch;

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

    $rootScope.calendars = [
      {
        name: 'お知らせ',
        shortName: 'announce',
        layout: '100%', // col-100
        calendarId: 'p-side.net_cbtlph70nn0hdpm7u58v4rjp8g@group.calendar.google.com',
        selected: true,
        sticky: true
      },
      {
        name: '眉山林間ステージ',
        shortName: 'bizan', // css: gcal-shinmachi
        layout: '33%',
        calendarId: 'p-side.net_m9s9a5ut02n6ap1s6prdj92ss4@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'パゴダ広場',
        shortName: 'pagoda',
        layout: '34%',
        calendarId: 'p-side.net_jdav9j70k7orjdq0djiudpv9cg@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: '新町橋東公園',
        shortName: 'shinmachi',
        layout: '33%',
        calendarId: 'p-side.net_ctrq60t4vsvfavejbkdmbhv3k4@group.calendar.google.com',
        selected: true,
        sticky: false
      },
//      {
//        name: '両国橋南公園',
//        shortName: 'ryougoku',
//        layout: 'col-33',
//        calendarId: 'p-side.net_timelrcritenrfmn86lco3qt9o@group.calendar.google.com',
//        selected: true,
//        sticky: false
//      },
      {
        name: '商店街アーケード',
        shortName: 'arcade',
        layout: '33%',
        calendarId: 'p-side.net_oclfdoi9f11vifccu3t081e260@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'ボードウォーク',
        shortName: 'boardwalk',
        layout: '34%',
        calendarId: 'p-side.net_2i5ibois4v1cqi780cgt18ip8k@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'ポッポ街',
        shortName: 'poppo',
        layout: '33%',
        calendarId: 'p-side.net_0jj3pc9gbvp36qfm9nqltle94g@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'CINEMA #1',
        shortName: 'cinema1',
        layout: '33%',
        calendarId: 'p-side.net_7cg9ke36afhpjvmpvc77eb9oo8@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'CINEMA #2',
        shortName: 'cinema2',
        layout: '34%',
        calendarId: 'p-side.net_bhonp02nnbsbkq44i6o0f1jvc8@group.calendar.google.com',
        selected: true,
        sticky: false
      },
      {
        name: 'その他会場',
        shortName: 'other',
        layout: '33%',
        calendarId: 'p-side.net_bldk04ogtu79o74hdvdm22pobk@group.calendar.google.com',
        selected: true,
        sticky: false
      }
    ];

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
    $rootScope.openLink = function(url) {
      $window.open(url);
    }
  });
