angular.module('myApp.controller.mapCtrl', [])
  .controller('MapListCtrl', function (LocationConst) {
    var self = this;
    this.items = LocationConst;
  })
  .controller('MapDetailCtrl', function ($scope, $window, $http, $stateParams, LocationConst) {
    $scope.item = LocationConst[$stateParams.id];
    $scope.markers = [];
    $scope.SELECTED_ID = 0; // DIRTY HACK!

    // set height
    var height = $window.innerHeight - 44;
    $(".angular-google-map-container").height(height);

    // map settings
    $scope.map = {
      center: {
        latitude: 34.071109,
        longitude: 134.548455
      },
      zoom: 16
    };

    $http.get($scope.item.url).then(function (result) {
      $scope.markers = result.data;
      $scope.markers.forEach(function (value, index) {
        value.id = index;
        value.visible = false;
        value.onClickMarker = function() {
          $scope.SELECTED_ID = value.id;

          // 押したマーカー以外は閉じたい
          $scope.markers.forEach(function (value, index) {
            value.visible = ($scope.SELECTED_ID === index);
          });
          $scope.markers;
        }
      });
    });

    $scope.openSelectedCoords = function () {
      var coords = $scope.markers[$scope.SELECTED_ID].coords;
      $scope.openCoords(coords);
    };

    // open geo link
    $scope.openCoords = function (coords) {
      var lat = coords.latitude;
      var log = coords.longitude;

      var url = "http://maps.google.com/?q=" + lat + "," + log;
      $window.open(url);
    };

    $scope.hoge = function (object) {
      console.log(object);
    };

  });