angular.module('myApp.controller.twitterCtrl', [])
  .controller('TwitterOfficialCtrl',
  function($scope, $timeout) {
    $timeout(function() {
      $.ajax({ url: 'http://platform.twitter.com/widgets.js', dataType: 'script', cache:true});
    }, 250);
  })
  .controller('TwitterHashtagCtrl',
  function($scope, $timeout) {
    $timeout(function() {
      $.ajax({ url: 'http://platform.twitter.com/widgets.js', dataType: 'script', cache:true});
    }, 250);
  });