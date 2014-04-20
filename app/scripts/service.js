angular.module('myApp.service',
  [
//    'myApp.service...'
  ])
  .service('Calendar', function (Restangular) {

    // uri = "https://www.googleapis.com/calendar/v3/calendars/#{CGI.escape(calendarId)}/events?orderBy=startTime&singleEvents=true&timeZone=Asia%2FTokyo&timeMax=#{CGI.escape(maxTime)}&timeMin=#{CGI.escape(minTime)}&key=#{apikey}"

    Restangular.setBaseUrl('https://www.googleapis.com/calendar/v3');
    Restangular.setDefaultRequestParams({key: "AIzaSyBmnikoDvMTokwjPLjvLfPHNWry85ab_mA"});

    return {
      get: function (calendarId, start, end) {
        return Restangular.all('calendars').all(calendarId).get('events', {
          orderBy: 'startTime',
          singleEvents: true,
          timeZone: 'Asia/Tokyo',
          timeMax: end.format(),
          timeMin: start.format()
        });
      }
    };

  });