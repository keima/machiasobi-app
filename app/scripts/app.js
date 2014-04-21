'use strict';

angular.module('myApp',
  [
    'ngTouch',
    'restangular',
    'ui.calendar',
    'ui.bootstrap',
    'onsen.directives',
    'myApp.service',
    'myApp.controller'
  ])
  .run(
  function ($rootScope) {
    $rootScope.appName = "マチ★アプリ";

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
    ];
/*
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
    */


    $rootScope.calendars = [
      {
        name: '新町橋東公園',
        shortName: 'shinmachi', // css: gcal-shinmachi
        calendarId: 'p-side.net_ctrq60t4vsvfavejbkdmbhv3k4@group.calendar.google.com',
        selected: true
      },
      {
        name: '両国橋南公園',
        shortName: 'ryougoku',
        calendarId: 'p-side.net_timelrcritenrfmn86lco3qt9o@group.calendar.google.com',
        selected: true
      },
      {
        name: 'ボードウォーク',
        shortName: 'boardwalk',
        calendarId: 'p-side.net_2i5ibois4v1cqi780cgt18ip8k@group.calendar.google.com',
        selected: true
      },
      {
        name: 'CINEMA #1',
        shortName: 'cinema1',
        calendarId: 'p-side.net_7cg9ke36afhpjvmpvc77eb9oo8@group.calendar.google.com',
        selected: true
      },
      {
        name: 'CINEMA #2',
        shortName: 'cinema2',
        calendarId: 'p-side.net_bhonp02nnbsbkq44i6o0f1jvc8@group.calendar.google.com',
        selected: true
      },
      {
        name: 'ポッポ街',
        shortName: 'poppo',
        calendarId: 'p-side.net_0jj3pc9gbvp36qfm9nqltle94g@group.calendar.google.com',
        selected: true
      }
    ];

    $rootScope.calendarConfig = {
      header: false,
      height: 9999,
      firstHour: 8,
      slotMinutes: 15,
      editable: false,
      defaultView: 'agendaDay',
      allDayText: '終日',
      axisFormat: 'HH:mm',
      slotEventOverlap: false, // イベントの重なりを切る

      year: $rootScope.periods[0].date.get('year'),
      month: $rootScope.periods[0].date.get('month') - 1,
      date: $rootScope.periods[0].date.get('date'),

      eventClick: null,
      eventDrop: null,
      eventResize: null,

      eventRender:function(event,element){
//        console.log(event,element);

        // override href param
        element.removeAttr('href');
      },

//      viewRender: function(view, element) {
//        console.log("View Changed: ", view.visStart, view.visEnd, view.start, view.end);
//        return view;
//      },

      viewDisplay: function() {
        console.log('viewDisplay');
      },

      windowResize: function() {
        console.log('windowResize');
      }

    };
  });
