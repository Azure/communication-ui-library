'use strict';
exports.__esModule = true;
exports.ChatContext = void 0;
// © Microsoft Corporation. All rights reserved.
var events_1 = require('events');
var immer_1 = require('immer');
var immer_2 = require('immer');
var communication_common_1 = require('@azure/communication-common');
var Constants_1 = require('./Constants');
immer_2.enableMapSet();
// have separated ClientState and ChatThreadState?
var ChatContext = /** @class */ (function () {
  function ChatContext() {
    this._state = {
      userId: { id: '' },
      displayName: '',
      threads: new Map()
    };
    this._batchMode = false;
    this._emitter = new events_1['default']();
  }
  ChatContext.prototype.setState = function (state) {
    this._state = state;
    if (!this._batchMode) {
      this._emitter.emit('stateChanged', this._state);
    }
  };
  ChatContext.prototype.getState = function () {
    return this._state;
  };
  ChatContext.prototype.setThread = function (threadId, threadState) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        draft.threads.set(threadId, threadState);
      })
    );
  };
  ChatContext.prototype.createThread = function (threadId, properties) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        draft.threads.set(threadId, {
          failedMessageIds: [],
          chatMessages: new Map(),
          threadId: threadId,
          properties: properties,
          participants: new Map(),
          readReceipts: [],
          typingIndicators: [],
          latestReadTime: new Date(0)
        });
      })
    );
  };
  ChatContext.prototype.updateChatConfig = function (config) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        draft.displayName = config.displayName;
        draft.userId = config.userId;
      })
    );
  };
  ChatContext.prototype.createThreadIfNotExist = function (threadId, properties) {
    var exists = this.getState().threads.has(threadId);
    if (!exists) {
      this.createThread(threadId, properties);
      return true;
    }
    return false;
  };
  ChatContext.prototype.updateThread = function (threadId, properties) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var thread = draft.threads.get(threadId);
        if (thread) {
          thread.properties = properties;
        }
      })
    );
  };
  ChatContext.prototype.updateThreadTopic = function (threadId, topic) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        if (topic === undefined) {
          return;
        }
        var thread = draft.threads.get(threadId);
        if (thread && !thread.properties) {
          thread.properties = { topic: topic };
        } else if (thread && thread.properties) {
          thread.properties.topic = topic;
        }
      })
    );
  };
  ChatContext.prototype.deleteThread = function (threadId) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var thread = draft.threads.get(threadId);
        if (thread) {
          draft.threads['delete'](threadId);
        }
      })
    );
  };
  ChatContext.prototype.setChatMessages = function (threadId, messages) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var threadState = draft.threads.get(threadId);
        if (threadState) {
          threadState.chatMessages = messages;
        }
      })
    );
  };
  ChatContext.prototype.updateChatMessageContent = function (threadId, messagesId, content) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var _a;
        var chatMessage =
          (_a = draft.threads.get(threadId)) === null || _a === void 0 ? void 0 : _a.chatMessages.get(messagesId);
        if (chatMessage) {
          if (!chatMessage.content) {
            chatMessage.content = {};
          }
          chatMessage.content.message = content;
        }
      })
    );
  };
  ChatContext.prototype.deleteLocalMessage = function (threadId, localId) {
    var localMessageDeleted = false;
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var _a;
        var chatMessages = (_a = draft.threads.get(threadId)) === null || _a === void 0 ? void 0 : _a.chatMessages;
        var message = chatMessages ? chatMessages.get(localId) : undefined;
        if (chatMessages && message && message.clientMessageId) {
          chatMessages['delete'](message.clientMessageId);
          localMessageDeleted = true;
        }
      })
    );
    return localMessageDeleted;
  };
  ChatContext.prototype.deleteMessage = function (threadId, id) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var _a;
        var chatMessages = (_a = draft.threads.get(threadId)) === null || _a === void 0 ? void 0 : _a.chatMessages;
        chatMessages === null || chatMessages === void 0 ? void 0 : chatMessages['delete'](id);
      })
    );
  };
  ChatContext.prototype.setParticipant = function (threadId, participant) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var _a;
        var participants = (_a = draft.threads.get(threadId)) === null || _a === void 0 ? void 0 : _a.participants;
        if (participants) {
          participants.set(communication_common_1.getIdentifierKind(participant.id), participant);
        }
      })
    );
  };
  ChatContext.prototype.setParticipants = function (threadId, participants) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var _a;
        var participantsMap = (_a = draft.threads.get(threadId)) === null || _a === void 0 ? void 0 : _a.participants;
        if (participantsMap) {
          for (var _i = 0, participants_1 = participants; _i < participants_1.length; _i++) {
            var participant = participants_1[_i];
            participantsMap.set(communication_common_1.getIdentifierKind(participant.id), participant);
          }
        }
      })
    );
  };
  ChatContext.prototype.deleteParticipants = function (threadId, participantIds) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var _a;
        var participants = (_a = draft.threads.get(threadId)) === null || _a === void 0 ? void 0 : _a.participants;
        if (participants) {
          participantIds.forEach(function (id) {
            participants['delete'](id);
          });
        }
      })
    );
  };
  ChatContext.prototype.deleteParticipant = function (threadId, participantId) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var _a;
        var participants = (_a = draft.threads.get(threadId)) === null || _a === void 0 ? void 0 : _a.participants;
        participants === null || participants === void 0 ? void 0 : participants['delete'](participantId);
      })
    );
  };
  ChatContext.prototype.addReadReceipt = function (threadId, readReceipt) {
    var _this = this;
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var thread = draft.threads.get(threadId);
        var readReceipts = thread === null || thread === void 0 ? void 0 : thread.readReceipts;
        if (thread && readReceipts) {
          // TODO(prprabhu): Replace `this.getState()` with `draft`?
          if (readReceipt.sender !== _this.getState().userId && thread.latestReadTime < readReceipt.readOn) {
            thread.latestReadTime = readReceipt.readOn;
          }
          readReceipts.push(readReceipt);
        }
      })
    );
  };
  ChatContext.prototype.addTypingIndicator = function (threadId, typingIndicator) {
    this.setState(
      immer_1['default'](this._state, function (draft) {
        var thread = draft.threads.get(threadId);
        if (thread) {
          var typingIndicators = thread.typingIndicators;
          typingIndicators.push(typingIndicator);
          // Make sure we only maintain a period of typing indicator for perf purposes
          thread.typingIndicators = typingIndicators.filter(function (typingIndicator) {
            var timeGap = Date.now() - typingIndicator.receivedOn.getTime();
            return timeGap < Constants_1.Constants.TYPING_INDICATOR_MAINTAIN_TIME;
          });
        }
      })
    );
  };
  ChatContext.prototype.setChatMessage = function (threadId, message) {
    var messageId = message.id,
      clientMessageId = message.clientMessageId;
    if (messageId || clientMessageId) {
      this.setState(
        immer_1['default'](this._state, function (draft) {
          var _a;
          var threadMessages = (_a = draft.threads.get(threadId)) === null || _a === void 0 ? void 0 : _a.chatMessages;
          var isLocalIdInMap = threadMessages && clientMessageId && threadMessages.get(clientMessageId);
          var messageKey = !messageId || isLocalIdInMap ? clientMessageId : messageId;
          if (threadMessages && messageKey) {
            threadMessages.set(messageKey, message);
          }
        })
      );
    }
  };
  // Batch mode for multiple updates in one action(to trigger just on event), similar to redux batch() function
  ChatContext.prototype.startBatch = function () {
    this._batchMode = true;
  };
  ChatContext.prototype.endBatch = function () {
    this._batchMode = false;
    this._emitter.emit('stateChanged', this._state);
  };
  // All operations finished in this batch should be sync call(only context related)
  ChatContext.prototype.batch = function (batchFunc) {
    this.startBatch();
    var backupState = this._state;
    try {
      batchFunc();
    } catch (e) {
      this._state = backupState;
    } finally {
      this.endBatch();
    }
  };
  ChatContext.prototype.onStateChange = function (handler) {
    this._emitter.on('stateChanged', handler);
  };
  ChatContext.prototype.offStateChange = function (handler) {
    this._emitter.off('stateChanged', handler);
  };
  return ChatContext;
})();
exports.ChatContext = ChatContext;
