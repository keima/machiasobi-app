angular.module('myApp.controller.eventViewCtrl', [])
  .controller('EventViewCtrl',
  function($scope, $filter, EventStore) {
    $scope.event = EventStore.load();
    $scope.event.description = $filter('br')($scope.event.description);

  });