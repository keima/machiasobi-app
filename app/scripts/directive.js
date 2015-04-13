angular.module('myApp.directive', [
  'angulartics'
])
/**
 * aタグのリンクを新しいタブで開くようにします。ついでにangularticsで計測も行います。
 * @see http://stackoverflow.com/questions/20099784/open-links-in-new-window-using-angularjs
 */
  .directive('targetBlank', function ($analytics) {

    function bindTo(element) {
      element.attr("target", "_blank");

      element.bind("click", function () {
        $analytics.eventTrack('Click', {
          category: 'A Tag Link',
          label: element.attr("href"),
          noninteraction: true
        });
      });
    }

    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        if (element.prop("tagName") === 'A') {
          bindTo(element);
        } else {
          var elems = element.find('A');
          element.bind('DOMSubtreeModified', function () {
            elems = angular.element(this).find('A');
            bindTo(elems);
          });
        }
      }
    };
  });