angular.module('myApp.controller.calendarViewCtrl', [])
  .controller('CalendarViewCtrl',
  function ($scope, Calendar) {



    $scope.selected = 0;

    $scope.setSelected = function(id) {
      $scope.selected = id;
    };

    $scope.items = Calendar.get($scope.calendars[0].calendarId, moment('2013-10-01T23:42:40+09:00'), moment('2013-10-30T23:42:40+09:00'));

//    $scope.calendars = $rootScope.calendars;
  });