'use strict';

angular.module('myApp.service.favorite', [])
  .service('Favorite', function (FavoriteStore, Calendar, MachiRest, $q) {

    function isFavorite(eventId) {
      var favs = FavoriteStore.get();
      return !_.isEmpty(_.find(favs, {eventId: eventId}));
    }

    function getEvents() {
      var promises = [];
      var favs = FavoriteStore.get();

      favs.forEach(function (value) {
        promises.push(Calendar.getEvent(value.calendarId, value.eventId));
      });

      return $q.all(promises);
    }

    function toggleFavorite(calendarId, eventId) {
      var fav = {eventId: eventId, calendarId: calendarId};

      if (isFavorite(eventId)) {
        return MachiRest.all('calendar').one(encodeURIComponent(calendarId), eventId).remove()
          .then(function(){
            FavoriteStore.remove(fav)
          });
      } else {
        return MachiRest.all('calendar').one(encodeURIComponent(calendarId), eventId).post()
          .then(function(){
            FavoriteStore.add(fav);
          });
      }
    }

    function retrieve() {
      return MachiRest.all('calendar').getList()
        .then(function(result){
          result.forEach(function(item){
            FavoriteStore.add(item);
          });
        })
    }

    return {
      isFavorite: isFavorite,
      getEvents: getEvents,
      toggleFavorite: toggleFavorite,
      retrieve: retrieve
    }
  })
  .service('FavoriteStore', function () {
    /* Data Structure
     * favs = [
     *   {
     *     eventId: EVENT_ID,
     *     calendarId: calendar_ID
     *   },
     *   ...
     * ]
     */

    var favs = [];

    function getList() {
      if (_.isNull(favs)) {
        favs = [];
      }
      return favs;
    }

    function addFav(fav) {
      favs.push(fav);
    }

    function removeFav(fav) {
      favs = _.reject(favs, fav);
    }

    return {
      add: addFav,
      remove: removeFav,
      get: getList
    };
  });