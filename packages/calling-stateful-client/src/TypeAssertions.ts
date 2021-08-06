// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallAgent, CallClient, DeviceManager } from '@azure/communication-calling';
import { CallErrorTargets } from './CallClientState';

/**
 * Internal type-assertion that explicitly listed {@Link CallErrorTargets} correspond to the underlying base SDK API.
 */
export const ensureChatErrorTargetsContainsOnlyValidValues = (target: CallErrorTargets): InferredCallErrorTargets =>
  target;

/**
 * Internal type-assertion that explicitly listed {@Link CallErrorTargets} correspond to the underlying base SDK API.
 */
export const ensureChatErrorTargetsContainsAllValidValues = (target: InferredCallErrorTargets): CallErrorTargets =>
  target;

/**
 * String literal type for all permissible keys in {@Link CallErrors}.
 */
type InferredCallErrorTargets =
  | CallObjectMethodNames<'CallClient', CallClient>
  | CallObjectMethodNames<'CallAgent', CallAgent>
  | CallObjectMethodNames<'DeviceManager', DeviceManager>;

type CallObjectMethodNames<TName extends string, T> = {
  [K in keyof T & string]: `${TName}.${CallMethodName<T, K>}`;
}[keyof T & string];

type CallMethodName<T, K extends keyof T & string> = T[K] extends (...args: any[]) => void ? K : never;
