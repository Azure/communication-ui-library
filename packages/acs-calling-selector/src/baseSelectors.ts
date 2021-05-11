// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallClientState, DeviceManager, IncomingCall } from '@azure/acs-calling-declarative';

/**
 * Common props used to reference declarative client state.
 */
export type BaseSelectorProps = {
  callId: string;
  displayName?: string;
  identifier?: string;
};

export const getCalls = (state: CallClientState): Map<string, Call> => state.calls;

export const getCallsEnded = (state: CallClientState): Call[] => state.callsEnded;

export const getIncomingCalls = (state: CallClientState): Map<string, IncomingCall> => state.incomingCalls;

export const getIncomingCallsEnded = (state: CallClientState): IncomingCall[] => state.incomingCallsEnded;

export const getDeviceManager = (state: CallClientState): DeviceManager => state.deviceManager;

export const getCall = (state: CallClientState, props: BaseSelectorProps): Call | undefined => {
  return state.calls.get(props.callId);
};

export const getDisplayName = (state: CallClientState, props: BaseSelectorProps): string | undefined =>
  props.displayName;

export const getIdentifier = (_state: CallClientState, props: BaseSelectorProps): string | undefined =>
  props.identifier;

export const getUserId = (state: CallClientState): string => state.userId;
