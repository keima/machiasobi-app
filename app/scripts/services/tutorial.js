'use strict';

angular.module('myApp.service.tutorial', [])
  .service('Tutorial', function ($scope, storage) {

    function showTutorialViewIfNeeded(lastVer, currentVer) {
      if (!lastVer) {
        $scope.ons.screen.presentPage('tutorial.html');
      } else {
        if (lastVer.major <= 0 && lastVer.minor < 6) {
          $scope.ons.screen.presentPage('changelog.html');
        }
      }

      storage.set('lastVersion', currentVer);
    }

    return {
      showTutorialViewIfNeeded: showTutorialViewIfNeeded
    };
  });