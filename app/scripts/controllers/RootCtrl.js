angular.module('myApp.controller')
  .controller('AppListCtrl', function ($scope, $state, AppListConst) {
    $scope.appList = AppListConst;

    $scope.transit = function(stateId) {
      app.globalMenu.closeMenu();
      $state.go(stateId);
    }
  })
;
