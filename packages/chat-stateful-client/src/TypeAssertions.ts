// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatThreadClient } from '@azure/communication-chat';
import { ChatErrorTargets } from './ChatClientState';

/**
 * Internal type-assertion that explicitly listed {@Link ChatErrorTargets} correspond to the underlying base SDK API.
 */
export const ensureChatErrorTargetsContainsOnlyValidValues = (target: ChatErrorTargets): InferredChatErrorTargets =>
  target;

/**
 * Internal type-assertion that explicitly listed {@Link ChatErrorTargets} correspond to the underlying base SDK API.
 */
export const ensureChatErrorTargetsContainsAllValidValues = (target: InferredChatErrorTargets): ChatErrorTargets =>
  target;

/**
 * String literal type for all permissible keys in {@Link ChatErrors}.
 */
type InferredChatErrorTargets =
  | ChatObjectMethodNames<'ChatClient', ChatClient>
  | ChatObjectMethodNames<'ChatThreadClient', ChatThreadClient>;

/**
 * Helper type to build a string literal type containing methods of an object.
 */
export type ChatObjectMethodNames<TName extends string, T> = {
  [K in keyof T & string]: `${TName}.${ChatMethodName<T, K>}`;
}[keyof T & string];

/**
 * Helper type to build a string literal type containing methods of an object.
 */
export type ChatMethodName<T, K extends keyof T & string> = T[K] extends (...args: any[]) => void ? K : never;
