angular.module('myApp.controller.eventViewCtrl', [])
  .controller('EventViewCtrl',
  function($scope, $filter, EventStore, Favorite, Calendar) {
    $scope.event = EventStore.load();

    var eventId = $scope.event.id;
    var sourceUrl = ('url' in $scope.event.source) ? $scope.event.source.url : $scope.event.sourceUrl;

    $scope.isFavorite = Favorite.isFavorite(eventId);

    var calendarId = Calendar.extractCalendarId(sourceUrl);

    $scope.toggleFavorite = function() {
      Favorite.toggleFavorite(calendarId, eventId);
      $scope.isFavorite = !$scope.isFavorite;
    };

  });