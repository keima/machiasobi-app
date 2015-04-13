angular.module('myApp.controller.delayCtrl', [])
  .controller('DelayCtrl', function (MachiRest) {
    var self = this;
    this.now = new Date();

    this.places = [
      {
        id: 'shinmachi',
        name: '新町橋東公園'
      },
      {
        id: 'ryogoku',
        name: "両国橋西公園"
      }
      //{
      //  id: 'bizan',
      //  name: '眉山林間ステージ'
      //}
    ];

    this.reload = function () {
      self.places.forEach(function (place) {
        MachiRest.all('delay').get(place.id)
          .then(function (result) {
            self.now = new Date();
            place.item = result;
          }, function () {
            place.item = null;
          });
      });
    };
    this.reload();

  });