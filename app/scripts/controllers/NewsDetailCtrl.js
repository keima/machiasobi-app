angular.module('myApp.controller.newsDetailCtrl', [])
  .controller('NewsDetailCtrl', function ($state, $stateParams, MachiRest) {
    var self = this;

    MachiRest.all('news').get($stateParams.id)
      .then(function (result) {
        self.item = result;
      });
  });
