angular.module('myApp.service',
  [
//    'myApp.service...'
  ])
  .config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('https://www.googleapis.com/calendar/v3');
    RestangularProvider.setDefaultRequestParams({key: "AIzaSyBmnikoDvMTokwjPLjvLfPHNWry85ab_mA"});
  })
  .service('Calendar', function (Restangular) {

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

    var extractCalendarId = function(calendarUrl){
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
  function (FavoriteStore) {

    var isFavorite = function (eventId) {
      var favs = FavoriteStore.get();
      return !_.isEmpty(_.find(favs, {eventId: eventId}));
    };

    return {
      isFavorite: isFavorite,
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