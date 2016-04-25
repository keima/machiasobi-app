(function() {
  "use strict";

  var myAppModule = angular.module("myApp");
  var $loading = document.getElementById("initializerLoading");
  var $error = document.getElementById("initializerFatalError");

  fetchData().then(
    bootstrapApp, function(error) {
      $loading.setAttribute("style", "display:none");
      $error.removeAttribute("style");
    }
  );

  function fetchData() {
    var initInjector = angular.injector(["ng", "myApp.service.machitools"]);
    var $q = initInjector.get("$q");
    var Restangular = initInjector.get("MachiRest");

    return $q.all([
      Restangular.all("periods").getList().then(function(result) {
        myAppModule.constant("Periods", result.plain());
      }),
      Restangular.all("calendars").getList().then(function(result) {
        myAppModule.constant("Calendars", result.plain());
      }),
      Restangular.all("menu").getList().then(function(result){
        myAppModule.constant("AppListConst", result.plain())
      })
    ]);
  }

  function bootstrapApp() {
    $loading.setAttribute("style", "display:none");
    angular.element(document).ready(function() {
      angular.bootstrap(document, ["myApp"]);
    });
  }

}());
