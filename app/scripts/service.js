angular.module('myApp.service',
  [
//    'myApp.service...'
  ])
  .config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('https://www.googleapis.com/calendar/v3');
    RestangularProvider.setDefaultRequestParams({key: "AIzaSyBmnikoDvMTokwjPLjvLfPHNWry85ab_mA"});
  })
  .service('Calendar', function(Restangular) {

//    $scope.items = Calendar.get($scope.calendars[0].calendarId, moment('2013-10-01T23:42:40+09:00'), moment('2013-10-30T23:42:40+09:00'));

    var getCalendarObject = function(calendarId, start, end) {
      return Restangular.all('calendars').all(calendarId).get('events', {
        orderBy: 'startTime',
        singleEvents: true,
        timeZone: 'Asia/Tokyo',
        timeMax: end.format(),
        timeMin: start.format()
      });
    };

    var getUrl = function(calId, shortName) {
      return {
        url: 'http://www.google.com/calendar/feeds/' + calId + '/public/basic',
        className: 'gcal-' + shortName
      };
    };

    var buildSources = function(calendars) {
      var array = [];

      calendars.forEach(function(element) {
        if (element.selected) {
          array.push(getUrl(element.calendarId, element.shortName));
        }
      });

      return array;
    };

    return {
      get: getCalendarObject,
      buildSources: buildSources
    };

  }
)
;