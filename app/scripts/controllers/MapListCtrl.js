"use strict";

angular.module('myApp.controller.mapCtrl', [])
  .controller('MapListCtrl', function (MachiRest) {
    var self = this;

    MachiRest.all('maps').getList()
      .then(function (result) {
        self.items = result;
      });

  })
  .controller('MapDetailCtrl', function ($scope, $window, $http, $stateParams, MachiRest, LocationConst) {
    $scope.markers = [];
    $scope.isExist = false;
    $scope.SELECTED_ID = "0"; // DIRTY HACK!

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

    MachiRest.all('maps').get($stateParams.id)
      .then(function (result) {
        $scope.item = result;

        if (_.isUndefined($scope.item.markers)) {
          $scope.isExist = false;
          return;
        }
        $scope.isExist = true;

        $scope.item.markers.forEach(function (value, index) {
            // angular-google-maps対応
            value.visible = false;

            value.onClick = function () {
              $scope.SELECTED_ID = value.id;

              // 押したマーカー以外は閉じたい
              $scope.item.markers.forEach(function (value, index) {
                value.visible = ($scope.SELECTED_ID === value.id);
              });
            };

            value.openCoords = function () {
              $scope.openCoords(value.coords);
            }

          }
        )
      });

    // open geo link
    $scope.openCoords = function (coords) {
      var lat = coords.latitude;
      var log = coords.longitude;

      var url = "http://maps.google.com/?q=" + lat + "," + log;
      $window.open(url);
    };

  });