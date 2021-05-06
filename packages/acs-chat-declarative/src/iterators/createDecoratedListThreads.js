'use strict';
exports.__esModule = true;
exports.createDecoratedListThreads = void 0;
var createDecoratedIterator_1 = require('./createDecoratedIterator');
var createDecoratedListThreads = function (chatClient, context) {
  var setThreadProperties = function (chatThreadItem, context) {
    var properties = {
      topic: chatThreadItem.topic
    };
    if (!context.createThreadIfNotExist(chatThreadItem.id, properties)) {
      context.updateThread(chatThreadItem.id, properties);
    }
  };
  return createDecoratedIterator_1.createDecoratedIterator(
    chatClient.listChatThreads.bind(chatClient),
    context,
    setThreadProperties
  );
};
exports.createDecoratedListThreads = createDecoratedListThreads;
