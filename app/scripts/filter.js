angular.module('myApp.filter', [])
  .filter('br', [function(){
    return function(text){
      return text.replace(/[\n\r]/g, "<br>");
    };
  }]);