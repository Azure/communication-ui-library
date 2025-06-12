// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  ChatClient,
  ChatMessage,
  ChatMessageReadReceipt,
  ChatParticipant,
  ChatThreadClient,
  ChatThreadProperties
} from '@azure/communication-chat';

/**
 * Utility type to create a public interface of a class or object type.
 */
export type PublicInterface<T> = { [K in keyof T]: T[K] };

/**
 * Interface for the ChatClient, which is a public interface of the Azure Communication Chat Client.
 */
export type IChatClient = PublicInterface<ChatClient>;

/**
 * Interface for the ChatThreadClient, which is a public interface of the Azure Communication Chat Thread Client.
 */
export type IChatThreadClient = PublicInterface<ChatThreadClient>;

/**
 * Interface for the ChatThread, which defines the structure of a chat thread
 * including its properties, participants, messages, and read receipts.
 */
export interface Thread extends ChatThreadProperties {
  version: number;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  readReceipts: ChatMessageReadReceipt[];
}

/**
 * Interface for NetworkEventModel, which defines the structure for network event configurations.
 */
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
