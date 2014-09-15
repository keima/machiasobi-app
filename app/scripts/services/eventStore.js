'use strict';

angular.module('myApp.service.eventStore', [])
  .service('EventStore', function () {
    var event = {};

    /**
     * 領域にイベントデータを格納します
     * @param data
     */
    function saveEvent(data) {
      event = _.cloneDeep(data);
    }

    /**
     * 領域からイベントデータを取得します
     * @returns {{}}
     */
    function loadEvent() {
      return event;
    }

    return {
      save: saveEvent,
      load: loadEvent
    };

  });