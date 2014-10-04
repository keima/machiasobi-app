angular.module('myApp.service.machitools', [])
  .factory('MachiRest', function (Restangular) {
    return Restangular.withConfig(function (config) {
      config.setBaseUrl('http://machiasobi-tools.appspot.com/api/v1');
    });
  });