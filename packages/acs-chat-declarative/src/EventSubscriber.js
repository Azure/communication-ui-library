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
exports.EventSubscriber = void 0;
var convertChatMessage_1 = require('./convertChatMessage');
var EventSubscriber = /** @class */ (function () {
  function EventSubscriber(chatClient, chatContext) {
    var _this = this;
    this.convertEventToChatMessage = function (event) {
      return convertChatMessage_1.convertChatMessage({
        id: event.id,
        version: event.version,
        content: { message: event.message },
        type: event.type,
        sender: event.sender,
        senderDisplayName: event.senderDisplayName,
        sequenceId: '',
        createdOn: new Date(event.createdOn)
      });
    };
    this.onChatMessageReceived = function (event) {
      var _a;
      var newMessage = _this.convertEventToChatMessage(event);
      // Because of bug in chatMessageReceived event, if we already have that particular message in context, we want to
      // make sure to not overwrite the sequenceId when calling setChatMessage.
      var existingMessage =
        (_a = _this.chatContext.getState().threads.get(event.threadId)) === null || _a === void 0
          ? void 0
          : _a.chatMessages.get(event.id);
      if (existingMessage) {
        newMessage.sequenceId = existingMessage.sequenceId;
      }
      _this.chatContext.batch(function () {
        _this.chatContext.createThreadIfNotExist(event.threadId);
        _this.chatContext.setChatMessage(event.threadId, newMessage);
      });
    };
    this.onChatMessageDeleted = function (event) {
      _this.chatContext.deleteMessage(event.threadId, event.id);
    };
    this.onChatMessageEdited = function (event) {
      var editedMessage = _this.convertEventToChatMessage(event);
      _this.chatContext.setChatMessage(event.threadId, convertChatMessage_1.convertChatMessage(editedMessage));
    };
    this.onParticipantsAdded = function (event) {
      var participantsToAdd = event.participantsAdded.map(function (participant) {
        return __assign(__assign({}, participant), {
          shareHistoryTime: participant.shareHistoryTime ? new Date(participant.shareHistoryTime) : undefined
        });
      });
      _this.chatContext.batch(function () {
        _this.chatContext.createThreadIfNotExist(event.threadId);
        _this.chatContext.setParticipants(event.threadId, participantsToAdd);
      });
    };
    this.onParticipantsRemoved = function (event) {
      var participantIds = event.participantsRemoved.map(function (participant) {
        return participant.id;
      });
      _this.chatContext.deleteParticipants(event.threadId, participantIds);
    };
    this.onReadReceiptReceived = function (event) {
      var readReceipt = __assign(__assign({}, event), { sender: event.sender, readOn: new Date(event.readOn) });
      _this.chatContext.batch(function () {
        _this.chatContext.createThreadIfNotExist(event.threadId);
        _this.chatContext.addReadReceipt(event.threadId, readReceipt);
      });
    };
    this.onTypingIndicatorReceived = function (event) {
      var typingIndicator = __assign(__assign({}, event), { receivedOn: new Date(event.receivedOn) });
      _this.chatContext.batch(function () {
        _this.chatContext.createThreadIfNotExist(event.threadId);
        _this.chatContext.addTypingIndicator(event.threadId, typingIndicator);
      });
    };
    this.onChatThreadCreated = function (event) {
      var properties = {
        topic: event.properties.topic
      };
      if (!_this.chatContext.createThreadIfNotExist(event.threadId, properties)) {
        _this.chatContext.updateThread(event.threadId, properties);
      }
    };
    this.onChatThreadDeleted = function (event) {
      _this.chatContext.deleteThread(event.threadId);
    };
    this.onChatThreadPropertiesUpdated = function (event) {
      _this.chatContext.updateThread(event.threadId, { topic: event.properties.topic });
    };
    this.subscribe = function () {
      _this.chatClient.on('chatMessageReceived', _this.onChatMessageReceived);
      _this.chatClient.on('chatMessageDeleted', _this.onChatMessageDeleted);
      _this.chatClient.on('chatMessageEdited', _this.onChatMessageEdited);
      _this.chatClient.on('participantsAdded', _this.onParticipantsAdded);
      _this.chatClient.on('participantsRemoved', _this.onParticipantsRemoved);
      _this.chatClient.on('readReceiptReceived', _this.onReadReceiptReceived);
      _this.chatClient.on('typingIndicatorReceived', _this.onTypingIndicatorReceived);
      _this.chatClient.on('chatThreadCreated', _this.onChatThreadCreated);
      _this.chatClient.on('chatThreadDeleted', _this.onChatThreadDeleted);
      _this.chatClient.on('chatThreadPropertiesUpdated', _this.onChatThreadPropertiesUpdated);
    };
    this.unsubscribe = function () {
      _this.chatClient.off('chatMessageReceived', _this.onChatMessageReceived);
      _this.chatClient.off('chatMessageDeleted', _this.onChatMessageDeleted);
      _this.chatClient.off('chatMessageEdited', _this.onChatMessageEdited);
      _this.chatClient.off('participantsAdded', _this.onParticipantsAdded);
      _this.chatClient.off('participantsRemoved', _this.onParticipantsRemoved);
      _this.chatClient.off('readReceiptReceived', _this.onReadReceiptReceived);
      _this.chatClient.off('typingIndicatorReceived', _this.onTypingIndicatorReceived);
      _this.chatClient.off('chatThreadCreated', _this.onChatThreadCreated);
      _this.chatClient.off('chatThreadDeleted', _this.onChatThreadDeleted);
      _this.chatClient.off('chatThreadPropertiesUpdated', _this.onChatThreadPropertiesUpdated);
    };
    this.chatClient = chatClient;
    this.chatContext = chatContext;
    this.subscribe();
  }
  return EventSubscriber;
})();
exports.EventSubscriber = EventSubscriber;
