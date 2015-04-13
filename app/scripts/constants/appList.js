"use strict";

angular.module('myApp.constant')
  .constant("AppListConst",
  [
    {
      name: 'カレンダー',
      icon: 'ion-calendar',
      state: 'app.calendar',
      description: "マチ★アソビのイベントをカレンダー形式で表示します"
    },
    /* */
    {
      name: 'イベント遅延',
      icon: 'ion-ios-stopwatch',
      state: 'app.delay',
      description: "ステージイベントの遅延情報(遅れ・進み)を確認できます"
    },
    {
      name: '待ち時間',
      icon: 'ion-clock',
      state: 'app.traffic',
      description: "乗り場(ロープウェイ・シャトルバス・橋の下美術館)の待ち時間情報を表示します"
    },
    /* */
    /* この機能はvol.13で役目を終えました。
    {
      name: '整理券',
      icon: 'fa-ticket',
      state: 'event',
      description: "整理券の配布状況を表示します"
    },
    */
    {
      name: 'Twitter',
      icon: 'ion-social-twitter',
      state: 'app.twitter',
      description: "マチ★アソビに関するTwitter情報を見ることが出来ます"
    },
    {
      name: 'マップ',
      icon: 'ion-map',
      state: 'app.map',
      description: "マチ★アソビの主要な場所を示す地図を閲覧できます"
    },
    {
      name: 'ニュース',
      icon: 'ion-document-text',
      state: 'app.news',
      description: "マチ★アプリに関する情報を見ることが出来ます"
    },
    {
      name: 'このアプリについて',
      icon: 'ion-information-circled',
      state: 'app.about',
      description: "マチ★アプリについて表示します"
    }
  ]
);