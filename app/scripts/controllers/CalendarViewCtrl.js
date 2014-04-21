angular.module('myApp.controller.calendarViewCtrl', [])
  .controller('CalendarViewCtrl',
  function($scope, $timeout, Calendar) {

    $scope.eventSources = Calendar.buildSources($scope.calendars);
    var originEventSources = _.cloneDeep($scope.eventSources);

    $scope.setSelected = function(id) {
      $scope.selected = id;
    };

    $scope.$watch('selected', function(value) {
      $scope.calendarConfig.year = $scope.periods[value].date.year();
      $scope.calendarConfig.month = $scope.periods[value].date.months() - 1;
      $scope.calendarConfig.date = $scope.periods[value].date.date();
    });

    $scope.$on('eventSourceIsChanged', function() {
      console.log('eventSourceIsChanged');

      // 全消し
      $scope.eventSources.splice(0, $scope.eventSources.length);

      // selected:trueのものだけ詰め直し
      $scope.calendars.forEach(function(element, index) {
        if (element.selected) {
          $scope.eventSources.push(originEventSources[index]);
        }
      });

      _.compact($scope.eventSources);
      console.log($scope.eventSources);

    });

    // SUPER-DIRTY-HACK!!!!!!!!
    $timeout(function(){
      var _calendar = $('#calendar');
      $scope.calendarConfig.height = _calendar.height() - $('#legends').height() - $('#dateSelector').height();
      console.log($scope.calendarConfig.height);
      _calendar.fullCalendar('render');
    }, 200);

    $scope.selected = 0;

  });