'use strict';
// © Microsoft Corporation. All rights reserved.
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
exports.__esModule = true;
exports.convertChatMessage = void 0;
var convertChatMessage = function (message, status, clientMessageId) {
  if (status === void 0) {
    status = 'delivered';
  }
  return __assign(__assign({}, message), { clientMessageId: clientMessageId, status: status });
};
exports.convertChatMessage = convertChatMessage;
