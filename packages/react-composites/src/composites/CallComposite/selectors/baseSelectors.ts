// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as CallStatus } from '@azure/communication-calling';
import { Call, DeviceManagerState } from 'calling-stateful-client';
import { CallStatus } from '../adapter/CallAdapter';

export const getCall = (state: CallStatus): Call | undefined => state.call;
export const getCallStatus = (state: CallStatus): CallStatus => state.call?.state ?? 'None';
export const getIsScreenShareOn = (state: CallStatus): boolean => state.call?.isScreenSharingOn ?? false;
export const getIsPreviewCameraOn = (state: CallStatus): boolean => isPreviewOn(state.devices);

const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  return !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
};
