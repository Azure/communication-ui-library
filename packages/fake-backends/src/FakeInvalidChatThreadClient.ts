// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  AddChatParticipantsResult,
  AddParticipantsRequest,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadProperties,
  ListMessagesOptions,
  ListParticipantsOptions,
  ListReadReceiptsOptions,
  SendChatMessageResult,
  SendMessageOptions,
  SendMessageRequest,
  SendReadReceiptRequest,
  SendTypingNotificationOptions,
  UpdateMessageOptions
} from '@azure/communication-chat';
/* @conditional-compile-remove(chat-beta-sdk) */
import type { UpdateChatThreadPropertiesOptions, UploadChatImageResult } from '@azure/communication-chat';

import { IChatThreadClient } from './types';
import { CommunicationIdentifier } from '@azure/communication-common';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { RestError } from '@azure/core-rest-pipeline';

export const INVALID_THREAD_ID = 'INVALID_THREAD';

/**
 * Emulate a chat thread client that intentionally throws error on any method call.
 * The error is thrown to simulate a scenario where the chat thread client is not available.
 *
 * @private
 */
export class FakeInvalidChatThreadClient implements IChatThreadClient {
  public threadId: string;

  constructor(threadId: string = INVALID_THREAD_ID) {
    this.threadId = threadId;
  }

  getProperties(): Promise<ChatThreadProperties> {
    throw new RestError('FakeInvalidChatThreadClient::getProperties not implemented.', { statusCode: 403 });
  }

  updateTopic(topic: string): Promise<void> {
    throw new RestError('FakeInvalidChatThreadClient::updateTopic not implemented.', { statusCode: 403 });
  }

  sendMessage(request: SendMessageRequest, options?: SendMessageOptions): Promise<SendChatMessageResult> {
    throw new RestError('FakeInvalidChatThreadClient::updateProperties not implemented.', { statusCode: 403 });
  }

  getMessage(messageId: string): Promise<ChatMessage> {
    throw new RestError('FakeInvalidChatThreadClient::getMessage not implemented.', { statusCode: 403 });
  }

  listMessages(options?: ListMessagesOptions): PagedAsyncIterableIterator<ChatMessage> {
    throw new RestError('FakeInvalidChatThreadClient::listMessages not implemented.', { statusCode: 403 });
  }

  deleteMessage(messageId: string): Promise<void> {
    throw new RestError('FakeInvalidChatThreadClient::deleteMessage not implemented.', { statusCode: 403 });
  }

  updateMessage(messageId: string, options?: UpdateMessageOptions): Promise<void> {
    throw new RestError('FakeInvalidChatThreadClient::updateMessage not implemented.', { statusCode: 403 });
  }

  addParticipants(request: AddParticipantsRequest): Promise<AddChatParticipantsResult> {
    throw new RestError('FakeInvalidChatThreadClient::addParticipants not implemented.', { statusCode: 403 });
  }

  listParticipants(options?: ListParticipantsOptions): PagedAsyncIterableIterator<ChatParticipant> {
    throw new RestError('FakeInvalidChatThreadClient::listParticipants not implemented.', { statusCode: 403 });
  }

  removeParticipant(participant: CommunicationIdentifier): Promise<void> {
    throw new RestError('FakeInvalidChatThreadClient::removeParticipant not implemented.', { statusCode: 403 });
  }

  sendTypingNotification(options?: SendTypingNotificationOptions): Promise<boolean> {
    throw new RestError('FakeInvalidChatThreadClient::sendTypingNotification not implemented.', { statusCode: 403 });
  }

  sendReadReceipt(request: SendReadReceiptRequest): Promise<void> {
    throw new RestError('FakeInvalidChatThreadClient::sendReadReceipt not implemented.', { statusCode: 403 });
  }

  /* @conditional-compile-remove(chat-beta-sdk) */
  updateProperties(request: UpdateChatThreadPropertiesOptions): Promise<void> {
    throw new RestError('FakeInvalidChatThreadClient::updateProperties not implemented.', { statusCode: 403 });
  }

  listReadReceipts(options?: ListReadReceiptsOptions): PagedAsyncIterableIterator<ChatMessageReadReceipt> {
    throw new RestError('FakeInvalidChatThreadClient::listReadReceipts not implemented.', { statusCode: 403 });
  }

  /* @conditional-compile-remove(chat-beta-sdk) */
  uploadImage(): Promise<UploadChatImageResult> {
    throw new RestError('FakeInvalidChatThreadClient::UploadChatImageResult not implemented.', { statusCode: 403 });
  }

  /* @conditional-compile-remove(chat-beta-sdk) */
  deleteImage(): Promise<void> {
    throw new RestError('FakeInvalidChatThreadClient::deleteImage not implemented.', { statusCode: 403 });
  }
}
