angular.module('myApp.controller.calendarViewCtrl', [])
  .controller('CalendarViewCtrl',
  function ($scope, $rootScope, $window, $timeout, Calendar, EventStore) {

    /**
     * Return selected id
     * @param current Moment
     * @param periods Moment
     */
    var defaultSelected = function (current, periods) {
      if (current.isSame(periods[0].date, 'day')) {
        return 0;
      } else if (current.isSame(periods[1].date, 'day')) {
        return 1;
      } else if (current.isSame(periods[2].date, 'day')) {
        return 2;
      } else {
        return 0;
      }
    };

//    // チュートリアル表示
//    if (!$rootScope.lastVersion) {
//      $scope.ons.screen.presentPage('tutorial.html');
//    } else {
//      if ($rootScope.lastVersion.major <= 0 &&
//        $rootScope.lastVersion.minor < 6) {
//        $scope.ons.screen.presentPage('changelog.html');
//      }
//    }

    $rootScope.lastVersion = $rootScope.semver;

    $scope.selectedDateId = defaultSelected(moment(), $rootScope.periods);
    $scope.eventSources = Calendar.buildSources($scope.calendars);
    var originEventSources = _.cloneDeep($scope.eventSources);

    // イベントのクリックリスナ
    $scope.calendarConfig.eventClick = function (event, jsEvent, view) {
      EventStore.save(event);
      $scope.ons.screen.presentPage('event.html');
    };

    // 日付ボタンバーのクリックイベント
    $scope.setSelectedDateId = function (id) {
      $scope.selectedDateId = id;
    };

    // 凡例のクリックイベント
    $scope.showOnlyThisEvent = function (calendarIndex) {
      $scope.calendars.forEach(function (element, index) {
        element.selected = (calendarIndex == index);
      });
      $rootScope.$broadcast('eventSourceIsChanged');
    };

    $scope.$watch('selectedDateId', function (value) {
      $scope.calendarConfig.defaultDate = $scope.periods[value].date;
    });

    $scope.$on('eventSourceIsChanged', function () {
      // 全消し
      $scope.eventSources.splice(0, $scope.eventSources.length);

      // selected:trueのものだけ詰め直し
      $scope.calendars.forEach(function (element, index) {
        if (element.selected) {
          $scope.eventSources.push(originEventSources[index]);
        }
      });

      if (_.isEmpty($scope.eventSources)) {
        $scope.eventSources.push($scope.favEvents);
      }
    });

    // SUPER-DIRTY-HACK!!!!!!!!
    // カレンダーの高さを 画面高 - もろもろのパーツ しつつレンダリングする
    var renderCalendar = function () {
      var _calendar = $('#calendar');
      $scope.calendarConfig.height = $window.innerHeight - $('#calendar-header-area').height() - 44;
      _calendar.fullCalendar('render');
    };
    $timeout(renderCalendar, 200);
    $scope.$on('ReRenderCalendar', renderCalendar);

  });