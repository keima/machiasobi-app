angular.module('myApp.controller.eventViewCtrl', [])
  .controller('EventViewCtrl',
  function ($scope, $rootScope, $window, $location, EventStore, Favorite, Calendar) {
    $scope.event = EventStore.load();
    // 日付表示を整形
    $scope.event.start = moment($scope.event.start);
    $scope.event.end = moment($scope.event.end);

    var eventId = $scope.event.id;
    var sourceUrl = ('url' in $scope.event.source) ? $scope.event.source.url : $scope.event.sourceUrl;

    $scope.isFavorite = Favorite.isFavorite(eventId);


    var calendarId = Calendar.extractCalendarId(sourceUrl);

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
      url += '&hashtags=' + 'マチアソビ';

      // attach event name
      var text = $scope.appName + " ≫ " + $scope.event.title;
      url += '&text=' + encodeURI(text);

      $window.open(url);
    };

    // ふぁぼるボタン
    $scope.toggleFavorite = function () {
      Favorite.toggleFavorite(calendarId, eventId);
      $scope.isFavorite = !$scope.isFavorite;
      $rootScope.$broadcast('RefreshCalendarHeight');

      if ($scope.isFavorite) {
        var trackerName = ga.getAll()[0].get('name');
        ga(trackerName + '.send', 'event', 'Favorite', $scope.event.title);
      }
    };

  });