angular.module('myApp.controller.delayCtrl', [])
  .controller('DelayCtrl', function (MachiRest) {
    var self = this;

    this.places = [
      {
        id: 'bizan',
        name: '眉山林間ステージ'
      },
      {
        id: 'shinmachi',
        name: '新町橋東公園'
      }
    ];

    this.abs = function(value) {
      return Math.abs(value);
    };

    this.reload = function() {
      self.places.forEach(function(place){
        MachiRest.all('delay').get(place.id)
          .then(function(result){
            place.item = result;
          }, function(){
            place.item = null;
          });
      });
    };
    this.reload();

  });