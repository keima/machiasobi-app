angular.module('myApp.controller.mapCtrl', [])
  .controller('MapListCtrl', function (LocationConst) {
    var self = this;
    this.items = LocationConst;
  })
  .controller('MapDetailCtrl', function ($scope, $window, $http, $stateParams, LocationConst) {
    $scope.item = LocationConst[$stateParams.id];

    // set height
    var height = $window.innerHeight - 44;
    $(".angular-google-map-container").height(height);

    // map settings
    $scope.map = {
      center: {
        latitude: 34.071109,
        longitude: 134.548455
      },
      zoom: 16,
      options: {
        title: "hoge"
      }
    };

    $http.get($scope.item.url)
      .then(function (result) {
        $scope.markers = result.data;
      });

    // open geo link
    $scope.openCoords = function(coords) {
      var lat = coords.latitude;
      var log = coords.longitude;

      var url = "http://maps.google.com/?q=" + lat + "," + log;
      $window.open(url);
    }

  });