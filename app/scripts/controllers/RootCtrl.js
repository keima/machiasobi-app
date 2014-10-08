angular.module('myApp.controller.rootCtrl', [])
  .controller('RootCtrl', function ($scope) {
    $scope.appList = [
      {name: 'カレンダー', icon: 'ion-calendar', state: 'calendar',
        description: "マチ★アソビのイベントをカレンダー形式で表示します"},
      {name: 'イベント遅延', icon: 'ion-ios7-stopwatch', state: 'delay',
        description: "イベントの遅延情報(遅れ・進み)を確認します"},
      {name: '待ち時間', icon: 'ion-clock', state: 'traffic',
        description: "ロープウェイ・シャトルバスの乗り場の待ち時間情報を表示します"},
      {name: '整理券', icon: 'fa-ticket', state: 'event',
        description: "整理券の配布状況を表示します"},
      {name: 'Twitter', icon: 'ion-social-twitter', state: 'twitter',
        description: "マチ★アソビに関するTwitter情報を見ることが出来ます"},
      {name: 'マップ', icon: 'ion-map', state: 'map',
        description: "マチ★アソビの主要な場所を示す地図を閲覧できます"},
      {name: 'ニュース', icon: 'ion-document-text', state: 'news',
        description: "マチ★アプリに関する情報を見ることが出来ます"},
      {name: 'このアプリについて', icon: 'ion-information-circled', state: 'about',
        description: "マチ★アプリについて表示します"}
    ];
  });