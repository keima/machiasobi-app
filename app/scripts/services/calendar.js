'use strict';

angular.module('myApp.service.calendar', [
  'myApp.constant.apikey'
])
  .factory('CalendarRest', function (Restangular, myAppGoogleApiKey) {
    return Restangular.withConfig(function (config) {
      config.setBaseUrl('https://www.googleapis.com/calendar/v3');
      config.setDefaultRequestParams({
        key: myAppGoogleApiKey
      });
    });
  })
  .service('Calendar', function (CalendarRest, CalendarConst, myAppGoogleApiKey) {
    /**
     * calendarId から className(gcal-shinmachi) を取得します
     * @param _calendarId
     * @returns {string}
     */
    var findShortNameByCalendarId = function (_calendarId) {
      var calendar = _.find(CalendarConst, {calendarId: _calendarId});
      return calendar.shortName;
    };

    /**
     * shortName(shinmachi) から calendarIdを取得します
     * @param _shortName
     * @returns calendarId
     */
    function findCalendarIdByShortName (_shortName) {
      var calendar = _.find(CalendarConst, {shortName: _shortName});
      return calendar.calendarId;
    }

    function extractEventId (eventId) {
      return eventId.split('@')[0];
    }

    function restoreEventId (shortEventId) {
      return shortEventId + '@google.com';
    }


    /**
     * Google Calendarから該当するcalendarIdの特定範囲のイベント一覧を取得します
     * @param calendarId
     * @param start
     * @param end
     * @returns Promise
     */
    var getCalendarObject = function (calendarId, start, end) {
      return CalendarRest.all('calendars').all(calendarId).get('events', {
        orderBy: 'startTime',
        singleEvents: true,
        timeZone: 'Asia/Tokyo',
        timeMax: end.format(),
        timeMin: start.format()
      });
    };

    /**
     * Google Calendarから該当するcalendarId/eventIdのデータを取得し、FullCalendarで使用できる形に変換した上で返します
     * @param calendarId
     * @param eventId
     * @returns Promise
     */
    var getEventObject = function (calendarId, eventId) {
      var eid = eventId.split('@')[0];
      return CalendarRest.all('calendars').all(calendarId).all('events').get(eid)
        .then(function (result) {
          // Convert UI-Calendar Object
          var event = {
            id: eventId,
            title: result.summary,
            description: result.description,
            start: result.start.dateTime,
            end: result.end.dateTime,
            className: 'gcal-' + findShortNameByCalendarId(calendarId),
            url: "http://www.google.com/calendar/feeds/" + calendarId + "/public/basic",
            source: {
              dataType: 'gcal',
              url: "http://www.google.com/calendar/feeds/" + calendarId + "/public/basic"
            }
          };

          if ('dateTime' in result.start) {
            event.start = result.start.dateTime;
            event.end = result.end.dateTime;
            event.allDay = false;
          } else if ('date' in result.start) {
            event.start = moment(result.start.date).toDate();
            event.end = moment(result.end.date).add(-1, 'days').endOf('day').toDate();
            event.allDay = true;
          }

          return event;
        });
    };

    /**
     * calnedarUrlからcalendarIdを取得します
     * @param calendarUrl
     * @returns {*}
     */
    var extractCalendarId = function (calendarUrl) {
      var pattern = /http:\/\/www.google.com\/calendar\/feeds\/(.*@group.calendar.google.com)\/public\/basic/;

      var calendarId = calendarUrl.match(pattern);

      if (_.isNull(calendarId)) {
        return calendarUrl;
      } else {
        return calendarId[1]; // 1 is result of regexp.
      }

    };

    /**
     * FullCalendarで使用可能な形式に変換する
     * @param calendars
     * @returns {Array}
     */
    var buildSources = function (calendars) {
      var array = [];

      calendars.forEach(function (element) {
        if (element.selected) {
          array.push(getUrl(element.calendarId, element.shortName));
        }
      });

      return array;
    };

    /**
     * calendarIdとshortName(shinmachiなど)を与えて url および className を取得します
     * @param calendarId
     * @param shortName
     * @returns {{url: string, className: string}}
     */
    var getUrl = function (calendarId, shortName) {
      return {
        // url: 'http://www.google.com/calendar/feeds/' + calendarId + '/public/basic',
        googleCalendarId: calendarId,
        className: 'gcal-' + shortName
      };
    };

    return {
      findShortNameByCalendarId: findShortNameByCalendarId,
      findCalendarIdByShortName: findCalendarIdByShortName,

      extractEventId: extractEventId,
      restoreEventId: restoreEventId,

      getEvents: getCalendarObject,
      getEvent: getEventObject,
      extractCalendarId: extractCalendarId,
      buildSources: buildSources
    };

  });