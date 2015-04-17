'use strict';

angular.module('myApp.service.calendar', [])
  .factory('CalendarRest', function (Restangular, myAppGoogleApiKey) {
    return Restangular.withConfig(function (config) {
      config.setBaseUrl('https://www.googleapis.com/calendar/v3');
      config.setDefaultRequestParams({
        key: myAppGoogleApiKey
      });
    });
  })
  .service('Calendar', function (CalendarRest, CalendarConst, PeriodConst, $q) {
    /**
     * calendarId から CalendarConstのオブジェクトを取得します
     * @param _calendarId
     * @returns {*}
     */
    var findByCalendarId = function(_calendarId) {
      return _.find(CalendarConst, {calendarId: _calendarId});
    };

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

    // メールアドレスっぽいIDから先頭だけを抽出します
    function extractEventId (eventId) {
      return eventId.split('@')[0];
    }

    // ドメイン名を含まないIDにドメインを付与します
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
      var eid = extractEventId(eventId);
      return CalendarRest.all('calendars').all(calendarId).all('events').get(eid)
        .then(function (result) {
          return convertGcalToFullCalendarObject(calendarId, eventId, result);
        });
    };

    /**
     * Google Calendar APIからのデータをFullCalendarで使用できる形式に変換します
     * @param calendarId
     * @param eventId
     * @param gcalObj
     * @returns {{id: *, title: string, description: (*|$scope.appList.description), start: string, end: string, className: string, url: string, source: {dataType: string, url: string}}}
     */
    function convertGcalToFullCalendarObject (calendarId, eventId, gcalObj) {
      if (gcalObj.status === "cancelled") {
        return null;
      }

      var event = {
        id: eventId,
        title: gcalObj.summary,
        description: gcalObj.description,
        start: gcalObj.start.dateTime,
        end: gcalObj.end.dateTime,
        className: 'gcal-' + findShortNameByCalendarId(calendarId),
        url: "http://www.google.com/calendar/feeds/" + calendarId + "/public/basic",
        source: {
          dataType: 'gcal',
          url: "http://www.google.com/calendar/feeds/" + calendarId + "/public/basic"
        }
      };

      if ('dateTime' in gcalObj.start) {
        event.start = gcalObj.start.dateTime;
        event.end = gcalObj.end.dateTime;
        event.allDay = false;
      } else if ('date' in gcalObj.start) {
        event.start = moment(gcalObj.start.date).toDate();
        event.end = moment(gcalObj.end.date).add(-1, 'days').endOf('day').toDate();
        event.allDay = true;
      }

      return event;
    }

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

    var searchAll = function (searchWord) {
      var deferred = $q.defer();
      var count = 0;

      CalendarConst.forEach(function (calendar) {
        CalendarRest.all("calendars").all(calendar.calendarId).get("events",
          {
            orderBy: 'startTime',
            singleEvents: true,
            timeZone: 'Asia/Tokyo',
            timeMin: _.first(PeriodConst).date.startOf('day').format(),
            timeMax: _.last(PeriodConst).date.endOf('day').format(),

            q: searchWord
          }
        ).then(function (result) {
            var list = [];

            result.items.forEach(function (item) {
              var calItem = convertGcalToFullCalendarObject(calendar.calendarId, restoreEventId(item.id), item);
              if (!_.isNull(calItem)) {
                list.push(calItem);
              }
            });

            var cal = _.cloneDeep(calendar);
            cal.items = list;

            deferred.notify(cal);
            if (++count == CalendarConst.length) {
              deferred.resolve(count);
            }
          }, function (reason) {
            deferred.reject(reason);
          });
      });

      return deferred.promise;
    };

    return {
      findByCalendarId: findByCalendarId,
      findShortNameByCalendarId: findShortNameByCalendarId,
      findCalendarIdByShortName: findCalendarIdByShortName,

      extractEventId: extractEventId,
      restoreEventId: restoreEventId,

      getEvents: getCalendarObject,
      getEvent: getEventObject,
      extractCalendarId: extractCalendarId,
      buildSources: buildSources,
      searchAll: searchAll
    };

  });