// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as SDKCallStatus } from '@azure/communication-calling';
import { CallState, DeviceManagerState } from 'calling-stateful-client';
import { CallStatus } from '../adapter/CallAdapter';

export const getCall = (state: CallStatus): CallState | undefined => state.call;
export const getCallStatus = (state: CallStatus): SDKCallStatus => state.call?.state ?? 'None';
export const getIsScreenShareOn = (state: CallStatus): boolean => state.call?.isScreenSharingOn ?? false;
export const getIsPreviewCameraOn = (state: CallStatus): boolean => isPreviewOn(state.devices);

const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  return !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
};
