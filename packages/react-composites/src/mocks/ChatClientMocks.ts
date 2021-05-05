// © Microsoft Corporation. All rights reserved.
/* eslint-disable no-undef */

import { ChatThread } from '@azure/communication-chat';

export type BaseClientMock = {
  eventHandlers: { [eventName: string]: ((e: any) => void | Promise<void>) | undefined };
  triggerEvent: (eventName: string, e: any) => Promise<void>;
  resetHandler: () => void;
  on: (event: string, listener: (e: Event) => void) => void;
  off: (event: string, listener: (e: Event) => void) => void;
};

export const createBaseClientMock = (): BaseClientMock => {
  const clientMock: BaseClientMock = {
    eventHandlers: {},

    triggerEvent: async (eventName: string, e: any) => {
      const handler = clientMock.eventHandlers[eventName];
      if (handler !== undefined) {
        await handler(e);
      }
    },

    resetHandler: () => {
      clientMock.eventHandlers = {};
    },

    on: (event: string, listener: (e: Event) => void) => {
      clientMock.eventHandlers[event] = listener;
    },

    off: () => (event: string, listener: (e: Event) => void) => {
      if (clientMock.eventHandlers[event] === listener) {
        clientMock.eventHandlers[event] = undefined;
      }
    }
  };
  return clientMock;
};

export type ChatClientMock = {
  startRealtimeNotifications: () => Promise<void>;
  reset: () => void;
  getChatThread: () => Promise<ChatThread>;
} & BaseClientMock;

export const createChatClient = (): ChatClientMock => {
  const clientMock = createBaseClientMock();
  const chatClientMock = {
    ...clientMock,
    startRealtimeNotifications: jest.fn(),
    reset: () => {
      chatClientMock.resetHandler();
      chatClientMock.startRealtimeNotifications.mockReset();
    },
    getChatThread: async (): Promise<ChatThread> => {
      return { createdBy: { communicationUserId: 'userId' }, id: '', topic: 'Empty', createdOn: new Date() };
    }
  };
  return chatClientMock;
};
