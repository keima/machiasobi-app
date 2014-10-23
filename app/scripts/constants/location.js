'use strict';

angular.module('myApp.constant.location', [])
  .constant('LocationConst',
  {
    toilet: {
      name: "トイレ",
      notice: "徳島のコンビニは一部トイレがないことがあるので気をつけて。",
      url: "/objects/map/toilet.json"
    },
    atm: {
      name: "ATM",
      notice: "コンビニもあるので心配無用だけど手数料とかあるからね。。。",
      url: "/objects/map/atm.json"
    },
    arcade: {
      name: "[vol.13]新町商店街催事場所",
      notice: "vol.13での東新町商店街での展示イベント情報でした。",
      url: "/objects/map/arcade.json"
    }
  });