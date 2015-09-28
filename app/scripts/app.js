'use strict';

angular.module('myApp',
  [
    'ngSanitize',
    'ngTouch',
    'restangular',
    'angularLocalStorage',
    'ui.router',
    'ui.calendar',
    'onsen',
    'btford.markdown',
    'uiGmapgoogle-maps',
    'angulartics',
    'angulartics.google.tagmanager',

    'myApp.constant',
    'myApp.service',
    'myApp.controller',
    'myApp.directive',
    'myApp.filter'
  ])
  .constant('myAppSemVer', {
    major: 2,
    minor: 0,
    patch: 1
  })
  .config(function (uiGmapGoogleMapApiProvider, myAppGoogleApiKey) {
    uiGmapGoogleMapApiProvider.configure({
      key: myAppGoogleApiKey
    });
  })
  .run(function ($rootScope, $cookies, $window, myAppSemVer, myAppGoogleApiKey, Favorite, Calendar, PeriodConst, MachiRest, User, JoinUs) {
    JoinUs.outputLog();

    $rootScope.appName = "マチ★アプリ";
    $rootScope.volName = "vol.14";
    $rootScope.semver = myAppSemVer;
    $rootScope.appVersion = "ver." + myAppSemVer.major + "." + myAppSemVer.minor + "." + myAppSemVer.patch;

    $rootScope.periods = PeriodConst;

    $rootScope.favEvents = [];

    // rootScopeいじっておいて、どこでもng-clickでリンクを開けるようにする
    $rootScope.openLink = function (url) {
      $window.open(url);
    };

    MachiRest.all('auth').get('check')
      .then(function (result) {
        User.setUser(result);
      }, function (reason) {
        console.log(reason);
        User.setUser({});
      });

  });
