"use strict";
angular.module('myApp.controller')
  .controller('CalendarCtrl',
  function ($scope, Tutorial) {
    Tutorial.showAtCalendar();
  }
);
