angular.module('myApp.controller.calendarListCtrl', [])
  .controller('CalendarListCtrl',
  function ($scope, $rootScope) {

    $scope.checkInverse = function(index) {
      $scope.calendars[index].selected = !$scope.calendars[index].selected;
      $rootScope.$broadcast('eventSourceIsChanged');
    };

    $scope.toggleAllDay = function() {
      $rootScope.calendarConfig.allDaySlot = !$rootScope.calendarConfig.allDaySlot;
    };

  });