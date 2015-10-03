angular.module('myApp.controller.calendarMenuCtrl', [])
  .controller('CalendarMenuCtrl',
  function($scope, $rootScope, $cookies, $timeout, Calendar, Favorite) {
    $scope.calendars = Calendar.getCalendars();
    $scope.calendarStatuses = Calendar.getMarkedCalendarIds();

    $scope.anythingIsSelected = true;
    function updateAnythingIsSelectedStatus() {
      $scope.calendarStatuses = Calendar.getMarkedCalendarIds();
      return ( $scope.anythingIsSelected = Calendar.anythingIsSelected() );
    }

    $scope.toggleAllDay = function() {
      console.log('toggleAllDay');
      $scope.calendarConfig.allDaySlot = !$scope.calendarConfig.allDaySlot;
      $cookies.showAllDaySlot = $scope.calendarConfig.allDaySlot;
    };

    $scope.toggleLegend = function() {
      $scope.calendarConfig.showLegend = !$scope.calendarConfig.showLegend;
      $cookies.showLegend = $scope.calendarConfig.showLegend;

      $timeout(function() {
        $rootScope.$broadcast('RefreshCalendarHeight');
      }, 100);
    };

    $scope.toggleAllCalendars = function() {
      var status = updateAnythingIsSelectedStatus();
      Calendar.setAllSelectedStatus(!status);
      updateAnythingIsSelectedStatus();
      $rootScope.$broadcast('eventSourceIsChanged');
    };

    $scope.toggleCalendar = function(index) {
      Calendar.setSelectedStatus(index, "inverse");
      updateAnythingIsSelectedStatus();
      $rootScope.$broadcast('eventSourceIsChanged');
    };

    $scope.isOnlyFavorite = false;
    $scope.showOnlyFavorite = function() {
      $scope.isOnlyFavorite = !$scope.isOnlyFavorite;
    };

    $scope.$watch('isOnlyFavorite', function(value) {
      if (value) {
        Favorite.getEvents()
          .then(function(results) {
            $rootScope.favEvents = results;
            $rootScope.$broadcast('eventSourceIsChanged');
          });

        Calendar.setAllSelectedStatus(false);
        updateAnythingIsSelectedStatus();
      } else {
        $rootScope.favEvents = [];
        Calendar.setAllSelectedStatus(true);
        updateAnythingIsSelectedStatus();
        $rootScope.$broadcast('eventSourceIsChanged');
      }
    });
  });