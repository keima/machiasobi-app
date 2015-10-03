'use strict';

angular.module('myApp.service.calendar', [])
  .factory('CalendarRest', function(Restangular, myAppGoogleApiKey) {
    return Restangular.withConfig(function(config) {
      config.setBaseUrl('https://www.googleapis.com/calendar/v3');
      config.setDefaultRequestParams({
        key: myAppGoogleApiKey
      });
    });
  })
  .service('Calendar', function(CalendarRest, Calendars, Periods, $q) {
    /**
     * カレンダー一覧を返す
     * @returns {array}
     */
    var getCalendars = function() {
      return Calendars;
    };

    /**
     * FullCalendarで使用可能な形式に変換されたCalendarsを、
     * selectedのステータス状況を反映して返す
     * @returns {Array}
     */
    var getFullCalendarObjects = function() {
      setAllSelectedStatus(true);

      var array = [];
      Calendars.forEach(function(calendar, index) {
        if (getSelectedStatus(index)) {
          array.push(_getFullCalendarObject(calendar.calendarId, calendar.id));
        }
      });
      return array;
    };

    var selected = [];
    var setAllSelectedStatus = function(status) {
      Calendars.forEach(function(calendar, index) {
        selected[index] = status;
      });
    };

    /**
     * @param index
     * @param status {boolean|"inverse"}
     */
    var setSelectedStatus = function(index, status) {
      if (_.isUndefined(Calendars[index])) {
        return;
      }
      if (typeof status == "boolean") {
        selected[index] = status;
      } else if (status === "inverse") {
        selected[index] = !selected[index];
      }
    };
    var getSelectedStatus = function(index) {
      if (_.isUndefined(Calendars[index])) {
        return;
      }
      return !!(selected[index]);
    };
    var getMarkedCalendarIds = function() {
      return _.clone(selected);
    };
    var anythingIsSelected = function() {
      return selected.some(function(val) {
        return val == true
      });
    };

    /**
     * calendarId から CalendarConstのオブジェクトを取得します
     * @param _calendarId
     * @returns {*}
     */
    var findByCalendarId = function(_calendarId) {
      return _.find(Calendars, {calendarId: _calendarId});
    };

    /**
     * calendarId から className(gcal-shinmachi) を取得します
     * @param _calendarId
     * @returns {string}
     */
    var findShortNameByCalendarId = function(_calendarId) {
      var calendar = _.find(Calendars, {calendarId: _calendarId});
      return calendar.id;
    };

    /**
     * shortName(shinmachi) から calendarIdを取得します
     * @param _shortName
     * @returns calendarId
     */
    function findCalendarIdByShortName(_shortName) {
      var calendar = _.find(Calendars, {id: _shortName});
      return calendar.calendarId;
    }

    // メールアドレスっぽいIDから先頭だけを抽出します
    function extractEventId(eventId) {
      return eventId.split('@')[0];
    }

    // ドメイン名を含まないIDにドメインを付与します
    function restoreEventId(shortEventId) {
      return shortEventId + '@google.com';
    }

    /**
     * Google Calendarから該当するcalendarIdの特定範囲のイベント一覧を取得します
     * @param calendarId
     * @param start
     * @param end
     * @returns Promise
     */
    var getCalendarObject = function(calendarId, start, end) {
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
    var getEventObject = function(calendarId, eventId) {
      return CalendarRest.all('calendars').all(calendarId).all('events').get(eventId)
        .then(function(result) {
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
    function convertGcalToFullCalendarObject(calendarId, eventId, gcalObj) {
      if (gcalObj.status === "cancelled") {
        return null;
      }

      var event = {
        id: restoreEventId(eventId),
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
    var extractCalendarId = function(calendarUrl) {
      var pattern = /http:\/\/www.google.com\/calendar\/feeds\/(.*@group.calendar.google.com)\/public\/basic/;

      var calendarId = calendarUrl.match(pattern);

      if (_.isNull(calendarId)) {
        return calendarUrl;
      } else {
        return calendarId[1]; // 1 is result of regexp.
      }

    };

    /**
     * calendarIdとshortName(shinmachiなど)を与えて url および className を取得します
     * @param calendarId
     * @param shortName
     * @returns {{url: string, className: string}}
     */
    var _getFullCalendarObject = function(calendarId, shortName) {
      return {
        googleCalendarId: calendarId,
        className: 'gcal-' + shortName
      };
    };

    var searchAll = function(searchWord) {
      var deferred = $q.defer();
      var count = 0;

      Calendars.forEach(function(calendar) {
        var timeMin = moment(_.first(Periods).date),
          timeMax = moment(_.last(Periods).date);

        CalendarRest.all("calendars").all(calendar.calendarId).get("events",
          {
            orderBy: 'startTime',
            singleEvents: true,
            timeZone: 'Asia/Tokyo',
            timeMin: timeMin.startOf('day').format(),
            timeMax: timeMax.endOf('day').format(),

            q: searchWord
          }
        ).then(function(result) {
            var list = [];

            result.items.forEach(function(item) {
              var calItem = convertGcalToFullCalendarObject(calendar.calendarId, extractEventId(item.id), item);
              if (!_.isNull(calItem)) {
                list.push(calItem);
              }
            });

            var cal = _.cloneDeep(calendar);
            cal.items = list;

            deferred.notify(cal);
            if (++count == Calendars.length) {
              deferred.resolve(count);
            }
          }, function(reason) {
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

      getCalendars: getCalendars,
      getEvents: getCalendarObject,
      getEvent: getEventObject,

      setAllSelectedStatus: setAllSelectedStatus,
      setSelectedStatus: setSelectedStatus,
      getSelectedStatus: getSelectedStatus,
      getMarkedCalendarIds: getMarkedCalendarIds,
      anythingIsSelected: anythingIsSelected,

      extractCalendarId: extractCalendarId,
      getFullCalendarObjects: getFullCalendarObjects,
      searchAll: searchAll
    };

  });