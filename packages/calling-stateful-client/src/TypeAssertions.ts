// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Call, CallAgent, CallClient, DeviceManager } from '@azure/communication-calling';

import { VideoEffectsFeature } from '@azure/communication-calling';
import { CallErrorTarget } from './CallClientState';
import { IncomingCall } from '@azure/communication-calling';

/**
 * Internal type-assertion that explicitly listed {@link CallErrorTarget} correspond to the underlying base SDK API.
 */
export const ensureCallErrorTargetsContainsOnlyValidValues = (target: CallErrorTarget): InferredCallErrorTargets =>
  target;

/**
 * Internal type-assertion that explicitly listed {@link CallErrorTarget} correspond to the underlying base SDK API.
 */
export const ensureCallErrorTargetsContainsAllValidValues = (target: InferredCallErrorTargets): CallErrorTarget =>
  target;

/**
 * String literal type for all permissible keys in {@Link CallErrors}.
 */
type InferredCallErrorTargets =
  | CallObjectMethodNames<'CallClient', CallClient>
  | CallObjectMethodNames<'CallAgent', CallAgent>
  | CallObjectMethodNames<'DeviceManager', DeviceManager>
  | CallObjectMethodNames<'Call', Call>
  | CallObjectMethodNames<'IncomingCall', Pick<IncomingCall, 'accept' | 'reject'>>
  | CallObjectMethodNames<'VideoEffectsFeature', Pick<VideoEffectsFeature, 'startEffects'>>
  /* Need to explicitly add these because we incorrectly added them to exported type before it was
   * stabilized in @azure/commmunication-calling.
   * TODO: Remove this hack once 'CallAgent.feature' becomes part of stable @azure/communication-calling.
   */
  | 'CallAgent.feature'
  | 'CallClient.getEnvironmentInfo'
  | 'TeamsCall.addParticipant'
  | 'CallClient.feature'
  | 'CallAgent.handlePushNotification'
  | /* @conditional-compile-remove(calling-beta-sdk) */ 'Call.admit'
  | /* @conditional-compile-remove(calling-beta-sdk) */ 'Call.rejectParticipant'
  | /* @conditional-compile-remove(calling-beta-sdk) */ 'Call.admitAll'
  | 'Call.mutedByOthers'
  | 'DeviceManager.stopPreheatDevices'
  | 'DeviceManager.startPreheatDevices';

type CallObjectMethodNames<TName extends string, T> = {
  [K in keyof T & string]: `${TName}.${CallMethodName<T, K>}`;
}[keyof T & string];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CallMethodName<T, K extends keyof T & string> = T[K] extends (...args: any[]) => void ? K : never;
