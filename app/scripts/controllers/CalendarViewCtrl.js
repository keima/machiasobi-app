angular.module('myApp.controller.calendarViewCtrl', [])
  .controller('CalendarViewCtrl',
  function($scope,$rootScope, $timeout, Calendar, EventStore) {

    // チュートリアル表示
    if (!$rootScope.lastVersion) {
      $rootScope.lastVersion = $rootScope.semver;
      $scope.ons.screen.presentPage('tutorial.html');
    }

    $scope.eventSources = Calendar.buildSources($scope.calendars);
    var originEventSources = _.cloneDeep($scope.eventSources);

    // set click callback
    $scope.calendarConfig.eventClick = function(event, jsEvent, view){
      console.log(event);
      console.log(jsEvent);
      console.log(view);

      EventStore.save(event);

      $scope.ons.screen.presentPage('event.html');
    };

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
    });

    // SUPER-DIRTY-HACK!!!!!!!!
    $timeout(function(){
      var _calendar = $('#calendar');
      $scope.calendarConfig.height = _calendar.height() - $('#legends').height() - $('#dateSelector').height();
      _calendar.fullCalendar('render');
    }, 200);

    $scope.selected = 0;

  });