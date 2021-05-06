'use strict';
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
exports.chatClientDeclaratify = void 0;
var ChatContext_1 = require('./ChatContext');
var EventSubscriber_1 = require('./EventSubscriber');
var ChatThreadClientDeclarative_1 = require('./ChatThreadClientDeclarative');
var createDecoratedListThreads_1 = require('./iterators/createDecoratedListThreads');
var proxyChatClient = {
  get: function (chatClient, prop, receiver) {
    // skip receiver.context call to avoid recursive bugs
    if (prop === 'context') {
      return Reflect.get(chatClient, prop);
    }
    var context = receiver.context;
    switch (prop) {
      case 'createChatThread': {
        return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return __awaiter(this, void 0, void 0, function () {
            var result, thread, request;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  return [4 /*yield*/, chatClient.createChatThread.apply(chatClient, args)];
                case 1:
                  result = _a.sent();
                  thread = result.chatThread;
                  if (thread) {
                    request = args[0];
                    context.createThread(thread.id, { topic: request.topic });
                  }
                  return [2 /*return*/, result];
              }
            });
          });
        };
      }
      case 'deleteChatThread': {
        return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  return [4 /*yield*/, chatClient.deleteChatThread.apply(chatClient, args)];
                case 1:
                  result = _a.sent();
                  context.deleteThread(args[0]);
                  return [2 /*return*/, result];
              }
            });
          });
        };
      }
      case 'listChatThreads': {
        return createDecoratedListThreads_1.createDecoratedListThreads(chatClient, context);
      }
      case 'getChatThreadClient': {
        return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return __awaiter(this, void 0, void 0, function () {
            var chatThreadClient;
            return __generator(this, function (_a) {
              chatThreadClient = chatClient.getChatThreadClient.apply(chatClient, args);
              // TODO(prprabhu): Ensure that thread properties are fetched into the ChatContext at this point.
              // A new thread might be created here, but the properties will never be fetched.
              return [
                2 /*return*/,
                ChatThreadClientDeclarative_1.chatThreadClientDeclaratify(chatThreadClient, context)
              ];
            });
          });
        };
      }
      case 'startRealtimeNotifications': {
        return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  return [4 /*yield*/, chatClient.startRealtimeNotifications.apply(chatClient, args)];
                case 1:
                  ret = _a.sent();
                  if (!receiver.eventSubscriber) {
                    receiver.eventSubscriber = new EventSubscriber_1.EventSubscriber(chatClient, context);
                  }
                  return [2 /*return*/, ret];
              }
            });
          });
        };
      }
      case 'stopRealtimeNotifications': {
        return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return __awaiter(this, void 0, void 0, function () {
            var ret;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  return [4 /*yield*/, chatClient.stopRealtimeNotifications.apply(chatClient, args)];
                case 1:
                  ret = _a.sent();
                  if (receiver.eventSubscriber) {
                    receiver.eventSubscriber.unsubscribe();
                    receiver.eventSubscriber = undefined;
                  }
                  return [2 /*return*/, ret];
              }
            });
          });
        };
      }
      default:
        return Reflect.get(chatClient, prop);
    }
  }
};
var chatClientDeclaratify = function (chatClient, chatConfig) {
  var context = new ChatContext_1.ChatContext();
  var eventSubscriber;
  context.updateChatConfig(chatConfig);
  var proxy = new Proxy(chatClient, proxyChatClient);
  Object.defineProperty(proxy, 'context', {
    configurable: false,
    get: function () {
      return context;
    }
  });
  Object.defineProperty(proxy, 'eventSubscriber', {
    configurable: false,
    get: function () {
      return eventSubscriber;
    },
    set: function (val) {
      eventSubscriber = val;
    }
  });
  Object.defineProperty(proxy, 'state', {
    configurable: false,
    get: function () {
      return context === null || context === void 0 ? void 0 : context.getState();
    }
  });
  Object.defineProperty(proxy, 'onStateChange', {
    configurable: false,
    value: function (handler) {
      return context === null || context === void 0 ? void 0 : context.onStateChange(handler);
    }
  });
  Object.defineProperty(proxy, 'offStateChange', {
    configurable: false,
    value: function (handler) {
      return context === null || context === void 0 ? void 0 : context.offStateChange(handler);
    }
  });
  return proxy;
};
exports.chatClientDeclaratify = chatClientDeclaratify;
