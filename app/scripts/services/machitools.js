"use strict";

angular.module('myApp.service.machitools', [])
  .constant('MachiBaseUrl', 'https://machiasobi-tools.appspot.com')
  //.constant('MachiBaseUrl', 'http://localhost:8080')
  .factory('MachiRest', function (Restangular, MachiBaseUrl) {
    return Restangular.withConfig(function (config) {
      config.setBaseUrl(MachiBaseUrl + '/api/v1');
      config.setDefaultHttpFields({withCredentials: true});
      config.setRequestInterceptor(function(elem, operation) {
        if (operation === "remove") {
          return null;
        }
        return elem;
      });
    });
  })
;