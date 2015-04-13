angular.module('myApp.controller.calendarViewCtrl', [])
  .controller('CalendarViewCtrl',
  function ($scope, $rootScope, $window, $timeout, $state, $location, $analytics, Calendar, EventStore, Tutorial) {

    Tutorial.showAtCalendar();

    /**
     * Return selected id
     * @param current Moment
     * @param periods Moment
     */
    function estimeteSelectedDateId(current, periods) {
      var last = periods.length - 1;
      if (current.isBefore(periods[0].date, 'day')) {
        return 0;
      } else if (current.isAfter(periods[last].date, 'day')) {
        return last;
      }

      periods.forEach(function (period, index) {
        if (current.isSame(period.date, 'day')) {
          return index;
        }
      });
      return 0; // fail safe...
    }

    $scope.eventSources = Calendar.buildSources($scope.calendars);
    var originEventSources = _.cloneDeep($scope.eventSources);

    // イベントのクリックリスナ
    $scope.calendarConfig.eventClick = function (event, jsEvent, view) {
      EventStore.save(event);
      var calendarId = Calendar.extractCalendarId(event.source.url);
      var shortName = Calendar.findShortNameByCalendarId(calendarId);
      var eventId = Calendar.extractEventId(event.id);

      $analytics.eventTrack('Click', {
        category: 'Calendar--View',
        label: event.title
      });

      $state.go('app.calendar.detail', {calendarShortName: shortName, eventId: eventId})
    };

    // 日付ボタンバーのクリックイベント
    $scope.selectedDateId = estimeteSelectedDateId(moment(), $rootScope.periods);
    $scope.setSelectedDateId = function (id) {
      $scope.selectedDateId = id;
    };
    $scope.$watch('selectedDateId', function (value) {
      $scope.calendarConfig.defaultDate = $scope.periods[value].date;
    });

    // 凡例のクリックイベント
    $scope.showOnlyThisEvent = function (calendarIndex) {
      $scope.calendars.forEach(function (element, index) {
        element.selected = (calendarIndex == index);
      });
      $rootScope.$broadcast('eventSourceIsChanged');
    };

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

      // calendarConfigを更新して強制的にアイテムのリロードをかける
      $scope.calendarConfig.updateTime = moment();
    });

    // SUPER-DIRTY-HACK!!!!!!!!
    // カレンダーの高さを 画面高 - もろもろのパーツ しつつレンダリングする
    var renderCalendar = function () {
      var _calendar = $('#calendar');
      $scope.calendarConfig.height = $window.innerHeight - $('#calendar-header-area').height() - 44;
      _calendar.fullCalendar('render');

      console.log("CalendarHeight: " + $scope.calendarConfig.height);
    };
    $timeout(renderCalendar, 200);
    $scope.$on('RefreshCalendarHeight', renderCalendar);

  });