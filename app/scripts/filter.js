angular.module('myApp.filter', [])
  .filter('br', [function(){
    // $filter('br')($scope.event.description);
    return function(text){
      return text.replace(/[\n\r]/g, "<br>");
    };
  }]);