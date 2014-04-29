angular.module('myApp.controller.calendarListCtrl', [])
  .controller('CalendarListCtrl',
  function ($scope, $rootScope, Calendar, FavoriteStore) {

    $scope.isOnlyFavorite = false;

    $scope.checkInverse = function (index) {
      $scope.calendars[index].selected = !$scope.calendars[index].selected;
      $rootScope.$broadcast('eventSourceIsChanged');
    };

    $scope.showOnlyFavorite = function () {
      var favs = FavoriteStore.get();
      var events = [];

      favs.forEach(function (element) {

        Calendar.getEvent(element.calendarId, element.eventId)
          .then(function(result){
            console.log(result);

            // Convert UI-Calendar Object
            var event = {
              id: element.eventId,
              title: result.summary,
              description: result.description,
              start: result.start.dateTime,
              end: result.end.dateTime,
              sourceUrl: "http://www.google.com/calendar/feeds/" + element.calendarId + "/public/basic",
              source: {
                url: "http://www.google.com/calendar/feeds/" + element.calendarId + "/public/basic"
              }
            };

            if ('dateTime' in result.start) {
              event.start = result.start.dateTime;
              event.end = result.end.dateTime;
              event.allDay = false;
            } else if ('date' in result.start) {
              event.start = moment(result.start.date).toDate();
              event.end = moment(result.end.date).add('days', -1).endOf('day').toDate();
              event.allDay = true;
            }

            events.push(event);

            // TODO: $qとか使わないと一件ずつしか描画できない
            $rootScope.favEvents = events;
            $rootScope.$broadcast('eventSourceIsChanged');

          });

      });

      $scope.calendars.forEach(function(e){
        e.selected = false;
      });

    };

  });