angular.module('myApp.controller.calendarViewCtrl', [])
  .controller('CalendarViewCtrl',
  function ($scope, $rootScope, $timeout, Calendar, EventStore) {

    /**
     * Return selected id
     * @param current
     * @param periods
     */
    var defaultSelected = function (current, periods) {
      console.log(current.startOf('day').toISOString());
      console.log(periods[0].date.startOf('day').toISOString());
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
      $scope.calendarConfig.year = $scope.periods[value].date.year();
      $scope.calendarConfig.month = $scope.periods[value].date.months();
      $scope.calendarConfig.date = $scope.periods[value].date.date();
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

      console.log('eventSourceIsChanged', $scope.eventSources);
    });

    // SUPER-DIRTY-HACK!!!!!!!!
    // カレンダーの高さを 画面高 - もろもろのパーツ しつつレンダリングする
    var renderCalendar = function () {
      var _calendar = $('#calendar');
      $scope.calendarConfig.height = _calendar.height() - $('#legends').height() - $('#dateSelector').height();
      _calendar.fullCalendar('render');
    };
    $timeout(renderCalendar, 200);
    $scope.$on('ReRenderCalendar', renderCalendar);

  });