"use strict";

angular.module('myApp.service.machitools', [])
  .factory('MachiRest', function (Restangular) {
    return Restangular.withConfig(function (config) {
      config.setBaseUrl('http://machiasobi-tools.appspot.com/api/v1');
        //config.setBaseUrl('http://localhost:8080/api/v1');
    });
  })
;