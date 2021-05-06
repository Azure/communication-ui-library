'use strict';
exports.__esModule = true;
exports.createDecoratedListMessages = void 0;
var convertChatMessage_1 = require('../convertChatMessage');
var createDecoratedIterator_1 = require('./createDecoratedIterator');
var createDecoratedListMessages = function (chatThreadClient, context) {
  var setMessage = function (message, context) {
    context.setChatMessage(chatThreadClient.threadId, convertChatMessage_1.convertChatMessage(message));
  };
  return createDecoratedIterator_1.createDecoratedIterator(
    chatThreadClient.listMessages.bind(chatThreadClient),
    context,
    setMessage
  );
};
exports.createDecoratedListMessages = createDecoratedListMessages;
