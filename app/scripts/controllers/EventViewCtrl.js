angular.module('myApp.controller.eventViewCtrl', [])
  .controller('EventViewCtrl',
  function ($scope, $rootScope, $window, $location, $analytics, EventStore, Favorite, Calendar, User) {
    $scope.event = EventStore.load();
    // 日付表示を整形
    $scope.event.start = moment($scope.event.start);
    $scope.event.end = moment($scope.event.end);

    var eventId = Calendar.extractEventId($scope.event.id);
    var sourceUrl = ('url' in $scope.event.source) ? $scope.event.source.url : $scope.event.sourceUrl;
    var calendarId = Calendar.extractCalendarId(sourceUrl);

    $scope.placeName = Calendar.findByCalendarId(calendarId).name;
    $scope.isFavorite = Favorite.isFavorite(eventId);

    // 閉じるボタン
    $scope.closePage = function () {
      // 本当はもっと知能的にしたいが、制約上難しそう
      $location.path('/calendar');
    };

    // ツイートボタン
    $scope.shareTwitter = function () {
      var url = 'https://twitter.com/intent/tweet';

      // attach url
      url += '?url=' + encodeURIComponent($location.absUrl());

      // attach hashtag
      url += '&hashtags=' + 'machiasobi';

      // attach event name
      var text = $scope.appName + " ≫ " + $scope.event.title;
      url += '&text=' + encodeURI(text);

      $window.open(url);
    };

    // ふぁぼるボタン
    $scope.toggleFavorite = function () {
      // ログインしてなかったらグローバル・サイドバーを展開
      if (!User.isLogin()) {
        $location.path('/calendar');
        app.globalMenu.openMenu();
        return;
      }

      Favorite.toggleFavorite(calendarId, eventId)
        .then(function(){
          $scope.isFavorite = !$scope.isFavorite;
          $rootScope.$broadcast('RefreshCalendarHeight');
          $rootScope.$broadcast('RerenderCalendar');

          $analytics.eventTrack(
            $scope.isFavorite ? 'Favorite' : 'Unfavorite',
            {
              category: 'Calendar--Favorite',
              label: $scope.event.title
            }
          );
        });
    };

  });