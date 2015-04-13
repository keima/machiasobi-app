'use strict';

angular.module('myApp.service')
  .service('Tutorial', function(storage) {
    function show(naviObj, partial) {
      return function() {
        if (!storage.get(partial)) {
          naviObj.pushPage(partial);
          storage.set(partial, true);
        }
      }
    }

    return {
      showAtCalendar: show(app.calendarNavi, 'partials/calendar/tutorial.html')
    }
  })
;