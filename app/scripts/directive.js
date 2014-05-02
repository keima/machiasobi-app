angular.module('myApp.directive', [])
  // @see http://stackoverflow.com/questions/20099784/open-links-in-new-window-using-angularjs
  .directive('targetBlank', function () {
    return {
      priority: -9999,
      restrict: 'A',
      link: function (scope, element, attr) {
        if (element.prop("tagName") === 'A') {
          element.attr("target", "_blank");
        } else {
          var elems = element.find('A');
          element.bind('DOMSubtreeModified', function () {
            elems = $(this).find('A');
            elems.attr("target", "_blank");
          });
        }
      }
    };
  });