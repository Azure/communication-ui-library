'use strict';
exports.__esModule = true;
exports.createDecoratedListParticipants = void 0;
var createDecoratedIterator_1 = require('./createDecoratedIterator');
var createDecoratedListParticipants = function (chatThreadClient, context) {
  var setParticipant = function (participant, context) {
    context.setParticipant(chatThreadClient.threadId, participant);
  };
  return createDecoratedIterator_1.createDecoratedIterator(
    chatThreadClient.listParticipants.bind(chatThreadClient),
    context,
    setParticipant
  );
};
exports.createDecoratedListParticipants = createDecoratedListParticipants;
