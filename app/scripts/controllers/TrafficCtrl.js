angular.module('myApp.controller.trafficCtrl', [])
  .controller('TrafficCtrl', function (MachiRest) {
    var self = this;

    this.transits = [
      {
        name: "橋の下美術館",
        id: "museum",
        places: [
          {
            name: '船着き場',
            direction: 'inbound'
          }
        ]
      },
      {
        name: 'ロープウェイ乗り場',
        id: 'ropeway',
        places: [
          {
            name: '山麓駅:上り方向',
            direction: 'inbound'
          },
          {
            name: '山頂駅:下り方向',
            direction: 'outbound'
          }
        ]
      },
      {
        name: 'シャトルバス乗り場',
        id: 'bus',
        places: [
          {
            name: '山麓駅(阿波踊り会館 前):上り方向',
            direction: 'inbound'
          },
          {
            name: '山頂駅(かんぽの宿 前):下り方向',
            direction: 'outbound'
          }
        ]
      }
    ];

    this.reload = function () {
      self.transits.forEach(function (transit) {
        transit.places.forEach(function (place) {
          // if item is exist, remove it.
          if (!_.isUndefined(place.item)) {
            place.item = {};
          }

          MachiRest.all('traffic').all(transit.id).get(place.direction)
            .then(function (result) {
              place.item = result;
            }, function () {
              place.item = {
                Waiting: '---',
                Message: '取得エラーです...'
              };
            })
        })
      });
    };
    this.reload();

  });