"use strict";

angular.module('myApp.directive')
  .directive('onsStateBackButton', function($onsen, $compile, GenericView, ComponentCleaner, $state) {
    return {
      restrict: 'E',
      replace: false,

      template: '' +
      '<span \n' +
      '  class="toolbar-button--quiet {{modifierTemplater(\'toolbar-button--*\')}}" \n' +
      '  ng-click="goToRoot()" \n' +
      '  ng-show="showBackButton"\n' +
      '  style="height: 44px; line-height: 0; padding: 0 10px 0 0; position: relative;">\n' +
      '  \n' +
      '  <i \n' +
      '    class="ion-ios-arrow-back ons-back-button__icon" \n' +
      '    style="vertical-align: top; background-color: transparent; height: 44px; line-height: 44px; font-size: 36px; margin-left: 8px; margin-right: 2px; width: 16px; display: inline-block; padding-top: 1px;"></i>\n' +
      '\n' +
      '  <span \n' +
      '    style="vertical-align: top; display: inline-block; line-height: 44px; height: 44px;" \n' +
      '    class="back-button__label"></span>\n' +
      '</span>\n' +
      '',

      // NOTE: This element must coexists with ng-controller.
      // Do not use isolated scope and template's ng-transclude.
      transclude: true,
      scope: true,

      link: {
        pre: function(scope, element, attrs, controller, transclude) {
          var backButton = new GenericView(scope, element, attrs);

          $onsen.declareVarAttribute(attrs, backButton);

          element.data('ons-back-button', backButton);

          scope.$on('$destroy', function() {
            backButton._events = undefined;
            $onsen.removeModifierMethods(backButton);
            element.data('ons-back-button', undefined);
            element = null;
          });

          scope.goToRoot = function() {
            $state.go('^');
          };

          scope.modifierTemplater = $onsen.generateModifierTemplater(attrs);

          var navigator = ons.findParentComponentUntil('ons-navigator', element);
          scope.$watch(function() { return navigator.pages.length; }, function(nbrOfPages) {
            scope.showBackButton = nbrOfPages > 1;
          });

          $onsen.addModifierMethods(backButton, 'toolbar-button--*', element.children());

          transclude(scope, function(clonedElement) {
            if (clonedElement[0]) {
              element[0].querySelector('.back-button__label').appendChild(clonedElement[0]);
            }
          });

          ComponentCleaner.onDestroy(scope, function() {
            ComponentCleaner.destroyScope(scope);
            ComponentCleaner.destroyAttributes(attrs);
            element = scope = attrs = null;
          });
        },
        post: function(scope, element) {
          $onsen.fireComponentEvent(element[0], 'init');
        }
      }
    };
  })
;