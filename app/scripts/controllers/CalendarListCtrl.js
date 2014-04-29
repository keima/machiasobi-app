angular.module('myApp.controller.calendarListCtrl', [])
  .controller('CalendarListCtrl',
  function ($scope, $rootScope, Calendar, Favorite, FavoriteStore) {

    $scope.isOnlyFavorite = false;

    $scope.checkInverse = function (index) {
      $scope.calendars[index].selected = !$scope.calendars[index].selected;
      $rootScope.$broadcast('eventSourceIsChanged');
    };

    $scope.toggleAllDay = function() {
      $rootScope.calendarConfig.allDaySlot = !$rootScope.calendarConfig.allDaySlot;
    };

    $scope.showOnlyFavorite = function () {
      $scope.isOnlyFavorite = !$scope.isOnlyFavorite;
    };

    $scope.$watch('isOnlyFavorite', function (value) {
      if (value) {
        Favorite.getEvents()
          .then(function(results){
            $rootScope.favEvents = results;
            $rootScope.$broadcast('eventSourceIsChanged');
          });

        $scope.calendars.forEach(function(e){
          e.selected = false;
        });

      } else {
        $rootScope.favEvents = [];

        $scope.calendars.forEach(function(e){
          e.selected = true;
        });

        $rootScope.$broadcast('eventSourceIsChanged');
      }
    });
  });