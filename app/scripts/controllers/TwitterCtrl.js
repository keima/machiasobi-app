angular.module('myApp.controller.twitterCtrl', [])
  .controller('AbstractTwitterCtrl', function($timeout) {
    // js読まれたときにaタグを解釈するので必須
    $timeout(function() {
      $.ajax({ url: 'http://platform.twitter.com/widgets.js', dataType: 'script', cache:true});
    }, 100);
  })
  .controller('TwitterOfficialCtrl',
  function($scope, $window, $controller, $timeout) {
    $controller('AbstractTwitterCtrl', {'$timeout': $timeout});

    this.contentHeight = $window.innerHeight - 44 - 49;

  })
  .controller('TwitterHashtagCtrl',
  function($scope, $window, $controller, $timeout) {
    $controller('AbstractTwitterCtrl', {'$timeout': $timeout});

    this.contentHeight = $window.innerHeight - 44 - 49;

  });