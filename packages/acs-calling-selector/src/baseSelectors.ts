// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallClientState, DeviceManager, IncomingCall } from 'calling-stateful-client';

/**
 * Common props used to reference calling declarative client state.
 */
export type CallingBaseSelectorProps = {
  callId: string;
};

export const getCalls = (state: CallClientState): Map<string, Call> => state.calls;

export const getCallsEnded = (state: CallClientState): Call[] => state.callsEnded;

export const getIncomingCalls = (state: CallClientState): Map<string, IncomingCall> => state.incomingCalls;

export const getIncomingCallsEnded = (state: CallClientState): IncomingCall[] => state.incomingCallsEnded;

export const getDeviceManager = (state: CallClientState): DeviceManager => state.deviceManager;

export const getCall = (state: CallClientState, props: CallingBaseSelectorProps): Call | undefined =>
  state.calls.get(props.callId);

export const getDisplayName = (state: CallClientState): string | undefined => state.callAgent?.displayName;

export const getIdentifier = (state: CallClientState): string | undefined => state.userId;
