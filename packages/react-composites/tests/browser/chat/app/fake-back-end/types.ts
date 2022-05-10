// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatClient,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadClient,
  ChatThreadProperties
} from '@azure/communication-chat';

export type PublicInterface<T> = { [K in keyof T]: T[K] };

export type IChatClient = PublicInterface<ChatClient>;

export type IChatThreadClient = PublicInterface<ChatThreadClient>;

export interface Thread extends ChatThreadProperties {
  version: number;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  readReceipts: ChatMessageReadReceipt[];
}

export interface NetworkEventModel {
  /**
   * Whether events should be delivered asynchronously.
   *
   * Other options below only apply when this is set to `true`.
   */
  asyncDelivery: boolean;
  /**
   * Maximum delay in delivering events
   *
   * This only delays notifications via events.
   * Messages are always immediately written to the service
   * so a client initiated fetch will get the latest messages instantaneously.
   *
   * Events are delayed randomly up to this ceiling.
   * Default value of 0 implies immediate (but async delivery).
   */
  maxDelayMilliseconds?: number;
}
