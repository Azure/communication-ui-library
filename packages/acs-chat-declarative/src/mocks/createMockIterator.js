'use strict';
// © Microsoft Corporation. All rights reserved.
exports.__esModule = true;
exports.createMockIterator = void 0;
var createMockIterator = function (mockItems) {
  var _a;
  var i = 0;
  var end = mockItems.length;
  return (
    (_a = {
      next: function () {
        if (i < end) {
          var iteration = Promise.resolve({ value: mockItems[i], done: false });
          i++;
          return iteration;
        } else {
          return Promise.resolve({ done: true });
        }
      }
    }),
    (_a[Symbol.asyncIterator] = function () {
      return this;
    }),
    (_a.byPage = function () {
      var _a;
      var i = 0;
      var end = mockItems.length;
      // Hardcode page size this since its just for test purposes
      var pageSize = 2;
      return (
        (_a = {
          next: function () {
            if (i < end) {
              var page = [];
              for (var j = 0; j < pageSize; j++) {
                if (i >= end) {
                  break;
                }
                page.push(mockItems[i]);
                i++;
              }
              return Promise.resolve({ value: page, done: false });
            } else {
              return Promise.resolve({ done: true });
            }
          }
        }),
        (_a[Symbol.asyncIterator] = function () {
          return this;
        }),
        _a
      );
    }),
    _a
  );
};
exports.createMockIterator = createMockIterator;
