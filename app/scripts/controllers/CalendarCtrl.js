"use strict";
angular.module('myApp.controller')
  .controller('CalendarCtrl',
  function($scope, myAppGoogleApiKey, $cookies, Periods, Favorite, Calendar) {

    $scope.calendarConfig = {
      googleCalendarApiKey: myAppGoogleApiKey,

      header: false,
      height: 1000, // dummy value
      defaultDate: Periods[0].date,
      timezone: 'Asia/Tokyo',
      scrollTime: '8:00:00',
      slotDuration: '00:15:00',
      editable: false,
      defaultView: 'agendaDay',
      allDaySlot: (($cookies.showAllDaySlot || 'true') === 'true'),
      allDayText: '終日',
      axisFormat: 'HH',
      slotEventOverlap: false, // イベントの重なりを切る

      eventRender: function(event, element) {
        // override href param
        element.removeAttr('href');

        if (Favorite.isFavorite(Calendar.extractEventId(event.id))) {
          element.addClass('favorited');
        }
      },
      windowResize: function() {
        console.log('windowResize');
      },

      // これはui-calendarのプロパティではない
      showLegend: (($cookies.showLegend || 'true') === 'true'),
      updateTime: moment()
    };

  }
);
