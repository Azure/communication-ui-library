// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { ChatAdapterState } from '../adapter/ChatAdapter';
import { ChatMessageWithStatus } from '@internal/chat-stateful-client';

/** @private */
export const getUserId = (state: ChatAdapterState): CommunicationIdentifierKind => state.userId;

/** @private */
export const getThreadId = (state: ChatAdapterState): string => state.thread.threadId;

/** @private */
export const getChatMessages = (state: ChatAdapterState): { [key: string]: ChatMessageWithStatus } =>
  state.thread.chatMessages;
