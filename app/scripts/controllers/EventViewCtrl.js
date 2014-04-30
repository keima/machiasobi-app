angular.module('myApp.controller.eventViewCtrl', [])
  .controller('EventViewCtrl',
  function($scope, $rootScope, EventStore, Favorite, Calendar) {
    $scope.event = EventStore.load();

    var eventId = $scope.event.id;
    var sourceUrl = ('url' in $scope.event.source) ? $scope.event.source.url : $scope.event.sourceUrl;

    $scope.isFavorite = Favorite.isFavorite(eventId);

    var calendarId = Calendar.extractCalendarId(sourceUrl);

    $scope.toggleFavorite = function() {
      Favorite.toggleFavorite(calendarId, eventId);
      $scope.isFavorite = !$scope.isFavorite;
      $rootScope.$broadcast('ReRenderCalendar');

      if ($scope.isFavorite) {
        var trackerName = ga.getAll()[0].get('name');
        ga(trackerName + '.send', 'event', 'Favorite', $scope.event.title);
      }
    };

  });