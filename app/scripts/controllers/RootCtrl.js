angular.module('myApp.controller.rootCtrl', [])
  .controller('RootCtrl', function ($scope) {
    // @formatter:off
    $scope.appList = [
      {name:'カレンダー', icon: 'ion-calendar',       state: 'calendar'},
      {name:'待ち時間',   icon: 'ion-clock',          state: 'traffic'},
      {name:'ニュース',   icon: 'ion-document-text',  state: 'news'},
      {name:'Twitter',   icon: 'ion-social-twitter', state: 'twitter'}
    ];
    // @formatter:on
  });
