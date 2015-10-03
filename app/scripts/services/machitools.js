"use strict";

angular.module('myApp.service.machitools', ["restangular"])
  .constant("MachiBaseUrl", function(){
    if (window.location.hostname == "localhost") {
      return 'http://localhost:8080';
    }
    return 'https://machiasobi-tools.appspot.com'
  }())

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