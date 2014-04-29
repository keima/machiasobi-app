angular.module('myApp.service',
  [
//    'myApp.service...'
  ])
  .config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('https://www.googleapis.com/calendar/v3');
    RestangularProvider.setDefaultRequestParams({key: "AIzaSyBmnikoDvMTokwjPLjvLfPHNWry85ab_mA"});
  })
  .service('Calendar',
  function (Restangular) {

//    $scope.items = Calendar.get($scope.calendars[0].calendarId, moment('2013-10-01T23:42:40+09:00'), moment('2013-10-30T23:42:40+09:00'));

    var getCalendarObject = function (calendarId, start, end) {
      return Restangular.all('calendars').all(calendarId).get('events', {
        orderBy: 'startTime',
        singleEvents: true,
        timeZone: 'Asia/Tokyo',
        timeMax: end.format(),
        timeMin: start.format()
      });
    };

    var getEventObject = function (calendarId, eventId) {

      var eid = eventId.split('@')[0];

      return Restangular.all('calendars').all(calendarId).all('events').get(eid);
    };

    var getUrl = function (calId, shortName) {
      return {
        url: 'http://www.google.com/calendar/feeds/' + calId + '/public/basic',
        className: 'gcal-' + shortName
      };
    };

    var extractCalendarId = function (calendarUrl) {
      var pattern = /http:\/\/www.google.com\/calendar\/feeds\/(.*@group.calendar.google.com)\/public\/basic/;

      var calendarId = calendarUrl.match(pattern);

      return calendarId[1]; // 1 is result of regexp.
    };

    var buildSources = function (calendars) {
      var array = [];

      calendars.forEach(function (element) {
        if (element.selected) {
          array.push(getUrl(element.calendarId, element.shortName));
        }
      });

      return array;
    };

    return {
      getEvents: getCalendarObject,
      getEvent: getEventObject,
      extractCalendarId: extractCalendarId,
      buildSources: buildSources
    };

  })
  .service('EventStore', function () {

    var event = {};

    return {
      save: function (data) {
        event = _.cloneDeep(data);
      },
      load: function () {
        return event;
      }
    };

  })
  .service('Favorite',
  function (FavoriteStore, Calendar, $rootScope, $q) {

    var getClassName = function(calendarId){
      var calendar = _.find($rootScope.calendars, {calendarId: calendarId});

      if (_.isEmpty(calendar)) {
        return '';
      }

      return 'gcal-' + calendar.shortName;
    };

    var isFavorite = function (eventId) {
      var favs = FavoriteStore.get();
      return !_.isEmpty(_.find(favs, {eventId: eventId}));
    };

    var getEvents = function () {
      var promises = [];
      var favs = FavoriteStore.get();

      favs.forEach(function (value) {

        var promise = Calendar.getEvent(value.calendarId, value.eventId)
          .then(function (result) {
            // Convert UI-Calendar Object
            var event = {
              id: value.eventId,
              title: result.summary,
              description: result.description,
              start: result.start.dateTime,
              end: result.end.dateTime,
              className: getClassName(value.calendarId),
              sourceUrl: "http://www.google.com/calendar/feeds/" + value.calendarId + "/public/basic",
              source: {
                url: "http://www.google.com/calendar/feeds/" + value.calendarId + "/public/basic"
              }
            };

            if ('dateTime' in result.start) {
              event.start = result.start.dateTime;
              event.end = result.end.dateTime;
              event.allDay = false;
            } else if ('date' in result.start) {
              event.start = moment(result.start.date).toDate();
              event.end = moment(result.end.date).add('days', -1).endOf('day').toDate();
              event.allDay = true;
            }

            return event;
          });

        promises.push(promise);
      });

      return $q.all(promises);
    };

    return {
      isFavorite: isFavorite,
      getEvents: getEvents,
      toggleFavorite: function (calendarId, eventId) {

        var fav = {eventId: eventId, calendarId: calendarId};

        if (isFavorite(eventId)) {
          FavoriteStore.remove(fav)
        } else {
          FavoriteStore.add(fav);
        }
      }
    };
  })
  .service('FavoriteStore',
  function (storage) {
    /* Data Structure
     * favs = [
     *   {
     *     evantId: EVENT_ID,
     *     calendarId: calendar_ID
     *   },
     *   ...
     * ]
     */

    var STORE_NAME = 'favoriteList';

    var favs = [];

    var getList = function () {
      if (_.isEmpty(favs)) {
        favs = storage.get(STORE_NAME);
      }

      if (_.isNull(favs)) {
        favs = [];
      }

      return favs;
    };

    return {
      add: function (fav) {
        favs = getList();

        favs.push(fav);

        storage.set(STORE_NAME, favs);
      },
      remove: function (fav) {
        favs = getList();

        favs = _.reject(favs, fav);

        storage.set(STORE_NAME, favs);
      },
      get: getList

    };
  });