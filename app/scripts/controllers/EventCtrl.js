angular.module('myApp.controller.eventCtrl', [])
  .service('EventStore', function () {
    var store = {};
    return {
      load: function () {
        return store
      },
      save: function (data) {
        store = data
      }
    }
  })
  .controller('EventCtrl', function ($scope, $rootScope, $analytics, MachiRest, Periods, EventStore) {
    $scope.periods = Periods;
    $scope.items = [];
    $scope.now = new Date();

    $scope.selected = 0;

    $scope.periodSelected = function (index) {
      $scope.selected = index;
      $scope.reload();
    };

    $scope.itemSelected = function (index) {
      EventStore.save($scope.items[index]);
      $rootScope.ons.navigator.pushPage('partials/event/detail.html');
    };

    $scope.reload = function () {
      var startAt = Periods[$scope.selected].date;
      var endAt = startAt.clone().endOf('days');

      $analytics.eventTrack('View', {
        category: 'Event',
        label: startAt.format('YYYY/MM/DD')
      });

      MachiRest.all('events').getList({
        first: 0,
        size: 100,
        startAt: startAt.toJSON(),
        endAt: endAt.toJSON()
      }).then(function (results) {
        $scope.now = new Date();
        $scope.items = results;
      }, function (reason) {
        $scope.items = null;
        console.log(reason);
      });
    };
    $scope.reload();

  })
  .controller('EventDetailCtrl', function (MachiRest, EventStore) {
    var self = this;
    this.item = EventStore.load();

    this.reload = function () {
      MachiRest.all("events").get(self.item.Id)
        .then(function (result) {
          self.item = result;
        });
    }
  });