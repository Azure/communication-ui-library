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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.createMockChatThreadClient = exports.mockReadReceipts = exports.mockParticipants = exports.participantTemplate = exports.mockMessages = exports.messageTemplate = void 0;
var communication_chat_1 = require('@azure/communication-chat');
var createMockIterator_1 = require('./createMockIterator');
var MockCommunicationUserCredential_1 = require('./MockCommunicationUserCredential');
var seedArray = [0, 1, 2, 3, 4];
exports.messageTemplate = {
  id: 'MessageId',
  content: { message: 'MessageContent' },
  clientMessageId: undefined,
  createdOn: new Date(),
  sender: {
    kind: 'communicationUser',
    communicationUserId: 'UserId'
  },
  senderDisplayName: 'User',
  type: 'text',
  sequenceId: '',
  version: '',
  status: 'delivered'
};
exports.mockMessages = seedArray.map(function (seed) {
  return __assign(__assign({}, exports.messageTemplate), {
    id: 'MessageId' + seed,
    content: { message: 'MessageContent' + seed },
    sender: { kind: 'communicationUser', communicationUserId: 'User' + seed }
  });
});
exports.participantTemplate = {
  id: { communicationUserId: 'id1' },
  displayName: 'user1',
  shareHistoryTime: new Date(0)
};
exports.mockParticipants = seedArray.map(function (seed) {
  return __assign(__assign({}, exports.participantTemplate), {
    user: { communicationUserId: 'id' + seed },
    displayName: 'user' + seed
  });
});
exports.mockReadReceipts = seedArray.map(function (seed) {
  return {
    chatMessageId: 'id' + seed,
    readOn: new Date(seed * 10000),
    sender: { kind: 'communicationUser', communicationUserId: 'senderid' + seed }
  };
});
var mockListMessages = function () {
  return createMockIterator_1.createMockIterator(exports.mockMessages);
};
var mockListParticipants = function () {
  return createMockIterator_1.createMockIterator(exports.mockParticipants);
};
var mockListReadReceipt = function () {
  return createMockIterator_1.createMockIterator(exports.mockReadReceipts);
};
jest.mock('@azure/communication-chat');
var emptyAsyncFunctionWithResponse = function () {
  return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2 /*return*/, { _response: {} }];
    });
  });
};
var createMockChatThreadClient = function (threadId) {
  var mockChatThreadClient = new communication_chat_1.ChatThreadClient(
    threadId,
    '',
    new MockCommunicationUserCredential_1.MockCommunicationUserCredential()
  );
  mockChatThreadClient.listMessages = mockListMessages;
  mockChatThreadClient.listParticipants = mockListParticipants;
  mockChatThreadClient.listReadReceipts = mockListReadReceipt;
  mockChatThreadClient.getMessage = function (messageId) {
    return __awaiter(void 0, void 0, void 0, function () {
      var message;
      return __generator(this, function (_a) {
        message = exports.mockMessages.find(function (message) {
          return message.id === messageId;
        });
        if (!message) {
          throw 'cannot find message';
        }
        return [2 /*return*/, __assign(__assign({}, message), { _response: {} })];
      });
    });
  };
  mockChatThreadClient.removeParticipant = emptyAsyncFunctionWithResponse;
  mockChatThreadClient.addParticipants = emptyAsyncFunctionWithResponse;
  mockChatThreadClient.sendMessage = function (_a) {
    var content = _a.content;
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_b) {
        if (content === 'fail') {
          throw 'receive fail content';
        }
        return [2 /*return*/, { id: 'messageId1', _response: {} }];
      });
    });
  };
  mockChatThreadClient.updateMessage = emptyAsyncFunctionWithResponse;
  mockChatThreadClient.updateTopic = emptyAsyncFunctionWithResponse;
  mockChatThreadClient.deleteMessage = emptyAsyncFunctionWithResponse;
  Object.defineProperty(mockChatThreadClient, 'threadId', { value: threadId });
  return mockChatThreadClient;
};
exports.createMockChatThreadClient = createMockChatThreadClient;
