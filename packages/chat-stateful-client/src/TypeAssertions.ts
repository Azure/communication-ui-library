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
  [K in keyof T]: `${TName}.${ChatMethodName<T, K>}`;
}[keyof T];

/**
 * Helper type to build a string literal type containing methods of an object.
 */
// eslint complains on all uses of `Function`. Using it as a type constraint is legitimate.
// eslint-disable-next-line @typescript-eslint/ban-types
export type ChatMethodName<T, K extends keyof T> = T[K] extends Function ? (K extends string ? K : never) : never;
