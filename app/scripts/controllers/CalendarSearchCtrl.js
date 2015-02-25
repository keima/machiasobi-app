"use strict";

angular.module('myApp.controller.calendar', [])
  .controller('CalendarSearchCtrl', function ($location, $analytics, Calendar, CalendarSearchUtil) {
    var self = this;
    this.result = [];
    this.searchWord = "";
    this.nowLoading = false;
    this.notFound = false;

    this.submit = function () {
      if (_.isEmpty(self.searchWord)) {
        return;
      }

      $analytics.eventTrack('Submit', {
        category: 'Calendar--Search',
        label: self.searchWord
      });

      self.result.splice(0, self.result.length);
      self.nowLoading = true;
      self.notFound = false;
      Calendar.searchAll(self.searchWord).then(
        function (result) {
          console.log(result);
        },
        function (reason) {
          console.log(reason);
        },
        function (notify) {
          if (notify.items.length > 0) {
            CalendarSearchUtil.extractOnlyWhatIUse(notify).forEach(function(item){
              self.result.push(item);
            });
          }
        }
      ).finally(
        function () {
          self.nowLoading = false;
          self.result = _(self.result)
            .flatten().sortBy(function (n) {
              return moment(n.start, moment.ISO_8601).unix();
            }).value();

          if (self.result.length == 0) {
            self.notFound = true;
          }
        }
      );
    };

    this.moveToDetail = function(index) {
      var item = self.result[index];

      $location.path('/calendar/' + item.shortName + '/' + item.eventId);
    };

    this.diff = CalendarSearchUtil.humanizeDiff;
    this.showHeader = CalendarSearchUtil.showHeader;

  })
  .factory('CalendarSearchUtil', function () {
    return {
      extractOnlyWhatIUse: function (result) {
        var list = [];

        result.items.forEach(function (item) {
          var obj = {
            start: item.start,
            end: item.end,
            title: item.title,
            venueName: result.name,
            shortName: result.shortName,
            calendarId: result.calendarId,
            eventId: item.id
          };
          list.push(obj);
        });

        return list;
      },
      humanizeDiff: function(lhs, rhs) {
        var lhsMoment = moment(lhs,  moment.ISO_8601);
        var rhsMoment = moment(rhs,  moment.ISO_8601);
        return Math.abs(lhsMoment.diff(rhsMoment, "minutes"));
      },
      showHeader: function(prev, current) {
        if (_.isUndefined(prev)){
          return true;
        }

        var lhsMoment = moment(prev.start,  moment.ISO_8601);
        var rhsMoment = moment(current.start,  moment.ISO_8601);

        return lhsMoment.date() - rhsMoment.date() != 0;
      }
    }
  })
;

