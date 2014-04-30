angular.module('myApp.controller.calendarViewCtrl', [])
  .controller('CalendarViewCtrl',
  function($scope,$rootScope, $timeout, Calendar, EventStore) {

    // チュートリアル表示
    if (!$rootScope.lastVersion) {
      $scope.ons.screen.presentPage('tutorial.html');
    } else {
      if ($rootScope.lastVersion.major <= 0 &&
        $rootScope.lastVersion.minor < 6) {
        $scope.ons.screen.presentPage('changelog.html');
      }
    }
    $rootScope.lastVersion = $rootScope.semver;


    $scope.selected = 0;
    $scope.eventSources = Calendar.buildSources($scope.calendars);
    var originEventSources = _.cloneDeep($scope.eventSources);

    // イベントのクリックリスナ
    $scope.calendarConfig.eventClick = function(event, jsEvent, view){
      EventStore.save(event);
      $scope.ons.screen.presentPage('event.html');
    };

    // 日付ボタンバーのクリックイベント TODO:名前。。。
    $scope.setSelected = function(id) {
      $scope.selected = id;
    };

    $scope.$watch('selected', function(value) {
      $scope.calendarConfig.year = $scope.periods[value].date.year();
      $scope.calendarConfig.month = $scope.periods[value].date.months() - 1;
      $scope.calendarConfig.date = $scope.periods[value].date.date();
    });

    $scope.$on('eventSourceIsChanged', function() {
      // 全消し
      $scope.eventSources.splice(0, $scope.eventSources.length);

      // selected:trueのものだけ詰め直し
      $scope.calendars.forEach(function(element, index) {
        if (element.selected) {
          $scope.eventSources.push(originEventSources[index]);
        }
      });

      if (_.isEmpty($scope.eventSources)) {
        $scope.eventSources.push($scope.favEvents);
      }

      console.log('eventSourceIsChanged', $scope.eventSources);
    });

    // SUPER-DIRTY-HACK!!!!!!!!
    // カレンダーの高さを 画面高 - もろもろのパーツ しつつレンダリングする
    var renderCalendar = function(){
      var _calendar = $('#calendar');
      $scope.calendarConfig.height = _calendar.height() - $('#legends').height() - $('#dateSelector').height();
      _calendar.fullCalendar('render');
    };
    $timeout(renderCalendar, 200);
    $scope.$on('ReRenderCalendar', renderCalendar);

  });