// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatThreadClient,
  CreateChatThreadRequest,
  CreateChatThreadOptions,
  CreateChatThreadResult,
  DeleteChatThreadOptions,
  ListChatThreadsOptions,
  SendChatMessageResult,
  SendMessageOptions,
  SendMessageRequest,
  UpdateMessageOptions,
  UpdateTopicOptions,
  ChatThreadProperties,
  GetPropertiesOptions,
  ChatMessage,
  GetMessageOptions,
  ListMessagesOptions,
  DeleteMessageOptions,
  AddParticipantsRequest,
  AddParticipantsOptions,
  AddChatParticipantsResult,
  ListParticipantsOptions,
  RemoveParticipantOptions,
  SendTypingNotificationOptions,
  SendReadReceiptRequest,
  SendReadReceiptOptions,
  ListReadReceiptsOptions
} from '@azure/communication-chat';
import { CommunicationIdentifier } from '@azure/communication-common';
import { ChatClientState, StatefulChatClient } from 'chat-stateful-client';

export type ChatThreadClientOverrides = Partial<ChatThreadClient>;

export function createMockChatThreadClient(threadOverrides?: ChatThreadClientOverrides): ChatThreadClient {
  return {
    threadId: threadOverrides?.threadId || '',
    getProperties: (options?: GetPropertiesOptions): Promise<ChatThreadProperties> => {
      if (threadOverrides?.getProperties) {
        return threadOverrides.getProperties(options);
      }
      return Promise.resolve({} as ChatThreadProperties);
    },
    updateTopic: (topic: string, options?: UpdateTopicOptions): Promise<void> => {
      if (threadOverrides?.updateTopic) {
        return threadOverrides.updateTopic(topic, options);
      }
      return Promise.resolve();
    },
    sendMessage: (request: SendMessageRequest, options?: SendMessageOptions): Promise<SendChatMessageResult> => {
      if (threadOverrides?.sendMessage) {
        return threadOverrides.sendMessage(request, options);
      }
      return Promise.resolve({} as SendChatMessageResult);
    },
    getMessage: (messageId: string, options?: GetMessageOptions): Promise<ChatMessage> => {
      if (threadOverrides?.getMessage) {
        return threadOverrides.getMessage(messageId, options);
      }
      return Promise.resolve({} as ChatMessage);
    },
    listMessages: (options?: ListMessagesOptions): any => {
      if (threadOverrides?.listMessages) {
        return threadOverrides.listMessages(options);
      }
      return Promise.resolve({});
    },
    deleteMessage: (messageId: string, options?: DeleteMessageOptions): Promise<void> => {
      if (threadOverrides?.deleteMessage) {
        return threadOverrides.deleteMessage(messageId, options);
      }
      return Promise.resolve();
    },
    updateMessage: (messageId: string, options?: UpdateMessageOptions): Promise<void> => {
      if (threadOverrides?.updateMessage) {
        return threadOverrides.updateMessage(messageId, options);
      }
      return Promise.resolve();
    },
    addParticipants: (
      request: AddParticipantsRequest,
      options?: AddParticipantsOptions
    ): Promise<AddChatParticipantsResult> => {
      if (threadOverrides?.addParticipants) {
        return threadOverrides.addParticipants(request, options);
      }
      return Promise.resolve({});
    },
    listParticipants: (options?: ListParticipantsOptions): any => {
      if (threadOverrides?.listParticipants) {
        return threadOverrides.listParticipants(options);
      }
      return Promise.resolve({});
    },
    removeParticipant: (participant: CommunicationIdentifier, options?: RemoveParticipantOptions): Promise<void> => {
      if (threadOverrides?.removeParticipant) {
        return threadOverrides.removeParticipant(participant, options);
      }
      return Promise.resolve();
    },
    sendTypingNotification: (options?: SendTypingNotificationOptions): Promise<boolean> => {
      if (threadOverrides?.sendTypingNotification) {
        return threadOverrides?.sendTypingNotification(options);
      }
      return Promise.resolve(true);
    },
    sendReadReceipt: (request: SendReadReceiptRequest, options?: SendReadReceiptOptions): Promise<void> => {
      if (threadOverrides?.sendReadReceipt) {
        return threadOverrides.sendReadReceipt(request, options);
      }
      return Promise.resolve();
    },
    listReadReceipts: (options?: ListReadReceiptsOptions): any => {
      if (threadOverrides?.listReadReceipts) {
        return threadOverrides.listReadReceipts(options);
      }
    }
  } as ChatThreadClient;
}

export type StatefulChatClientOverrides = Partial<StatefulChatClient>;

export function createMockStatefulChatClient(
  statefulOverrides?: StatefulChatClientOverrides,
  threadOverrides?: ChatThreadClientOverrides
): StatefulChatClient {
  return {
    getState: (): ChatClientState => {
      if (statefulOverrides?.getState) {
        return statefulOverrides.getState();
      }
      return {} as ChatClientState;
    },
    onStateChange: (handler: (state: ChatClientState) => void): void => {
      if (statefulOverrides?.onStateChange) {
        statefulOverrides.onStateChange(handler);
      }
    },
    offStateChange: (handler: (state: ChatClientState) => void): void => {
      if (statefulOverrides?.offStateChange) {
        statefulOverrides.offStateChange(handler);
      }
    },
    getChatThreadClient: (threadId: string): ChatThreadClient => {
      if (statefulOverrides?.getChatThreadClient) {
        statefulOverrides.getChatThreadClient(threadId);
      }
      return createMockChatThreadClient(threadOverrides);
    },
    createChatThread: (
      request: CreateChatThreadRequest,
      options?: CreateChatThreadOptions
    ): Promise<CreateChatThreadResult> => {
      if (statefulOverrides?.createChatThread) {
        return Promise.resolve(statefulOverrides.createChatThread(request, options));
      }
      return Promise.resolve({});
    },
    listChatThreads: (options?: ListChatThreadsOptions): any => {
      if (statefulOverrides?.listChatThreads) {
        return statefulOverrides?.listChatThreads(options);
      }
      return {};
    },
    deleteChatThread: (threadId: string, options?: DeleteChatThreadOptions): Promise<void> => {
      if (statefulOverrides?.deleteChatThread) {
        return statefulOverrides.deleteChatThread(threadId, options);
      }
      return Promise.resolve();
    },
    startRealtimeNotifications: (): Promise<void> => {
      if (statefulOverrides?.startRealtimeNotifications) {
        return statefulOverrides.startRealtimeNotifications();
      }
      return Promise.resolve();
    },
    stopRealtimeNotifications: (): Promise<void> => {
      if (statefulOverrides?.stopRealtimeNotifications) {
        return statefulOverrides.stopRealtimeNotifications();
      }
      return Promise.resolve();
    },
    on: (event: any, listener: any): void => {
      if (statefulOverrides?.on) {
        statefulOverrides.on(event, listener);
      }
    },
    off: (event: any, listener: any): void => {
      if (statefulOverrides?.off) {
        statefulOverrides.off(event, listener);
      }
    }
  } as StatefulChatClient;
}
