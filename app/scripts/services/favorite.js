'use strict';

angular.module('myApp.service.favorite', [])
  .service('Favorite', function (FavoriteStore, Calendar, $rootScope, $q) {
    var isFavorite = function (eventId) {
      var favs = FavoriteStore.get();
      return !_.isEmpty(_.find(favs, {eventId: eventId}));
    };

    var getEvents = function () {
      var promises = [];
      var favs = FavoriteStore.get();

      favs.forEach(function (value) {
        promises.push(Calendar.getEvent(value.calendarId, value.eventId));
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
  .service('FavoriteStore', function (storage) {
    /* Data Structure
     * favs = [
     *   {
     *     eventId: EVENT_ID,
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