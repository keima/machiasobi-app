angular.module('myApp.controller.newsListCtrl', [])
  .controller('NewsListCtrl', function (MachiRest) {
    var self = this;
    this.items = [];

    MachiRest.all('news').getList({first:0,size:20})
      .then(function(result){
        self.items = result;
      });

  });
