angular.module('myApp.controller.tutorialViewCtrl', [])
  .controller('TutorialViewCtrl',
  function($scope) {
    $scope.dismiss = function() {
      if (confirm('出来れば内容を全部読んで欲しいのですが。。。\nこのページを閉じますか？')) {
        $scope.ons.screen.dismissPage();
      }
    }
  });