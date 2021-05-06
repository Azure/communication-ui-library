'use strict';
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
exports.createDecoratedListReadReceipts = void 0;
var createDecoratedIterator_1 = require('./createDecoratedIterator');
var createDecoratedListReadReceipts = function (chatThreadClient, context) {
  var setReadReceipt = function (readReceipt, context) {
    context.addReadReceipt(chatThreadClient.threadId, __assign({}, readReceipt));
  };
  return createDecoratedIterator_1.createDecoratedIterator(
    chatThreadClient.listReadReceipts.bind(chatThreadClient),
    context,
    setReadReceipt
  );
};
exports.createDecoratedListReadReceipts = createDecoratedListReadReceipts;
