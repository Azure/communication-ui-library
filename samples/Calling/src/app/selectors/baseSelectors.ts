// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Call, CallClientState, DeviceManagerState, IncomingCallState } from 'calling-stateful-client';
import { CallingBaseSelectorProps } from '@azure/acs-calling-selector';

export const getCalls = (state: CallClientState): Map<string, Call> => state.calls;

export const getCallsEnded = (state: CallClientState): Call[] => state.callsEnded;

export const getIncomingCalls = (state: CallClientState): Map<string, IncomingCallState> => state.incomingCalls;

export const getIncomingCallsEnded = (state: CallClientState): IncomingCallState[] => state.incomingCallsEnded;

export const getDeviceManager = (state: CallClientState): DeviceManagerState => state.deviceManager;

export const getCall = (state: CallClientState, props: CallingBaseSelectorProps): Call | undefined =>
  state.calls.get(props.callId);

export const getDisplayName = (state: CallClientState): string | undefined => state.callAgent?.displayName;

export const getIdentifier = (state: CallClientState): string => state.userId;

export const getIsPreviewCameraOn = (state: CallClientState): boolean => isPreviewOn(state.deviceManager);

const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  return !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
};
