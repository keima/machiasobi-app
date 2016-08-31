angular.module('myApp.controller')
  .controller('AppListCtrl', function ($scope, $state, User, AppListConst, MachiBaseUrl) {
    $scope.baseUrl = MachiBaseUrl;
    $scope.loggedIn = User.isLogin();

    $scope.appList = AppListConst;

    $scope.transit = function(stateId) {
      app.globalMenu.closeMenu();
      $state.go(stateId);
    };

    $scope.$on(User.BROADCAST_NAME_CHANGED, function(){
      $scope.loggedIn = User.isLogin();
    });

    // go to sunset page (news)
    $state.go("app.news.detail", {id: "the_sunset_of_machiappli"});
  })
;
