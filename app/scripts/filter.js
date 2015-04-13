angular.module('myApp.filter', [])
/**
 * 改行を br タグに置き換えます。
 * 使い方: $filter('br')($scope.event.description);
 */
  .filter('br', [function () {
    return function (text) {
      return text.replace(/[\n\r]/g, "<br>");
    };
  }])
  .filter("abs", [function () {
    return function (content) {
      return Math.abs(content);
    }
  }])
;