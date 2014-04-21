angular.module('myApp.controller.calendarListCtrl', [])
  .controller('CalendarListCtrl',
  function ($scope, $rootScope) {

    $scope.checkInverse = function(index) {
      console.log(index);
      $scope.calendars[index].selected = !$scope.calendars[index].selected;
      $rootScope.$broadcast('eventSourceIsChanged');
    }

  });