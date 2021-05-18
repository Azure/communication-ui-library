// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as CallStatus } from '@azure/communication-calling';
import { Call, DeviceManager } from 'calling-stateful-client';
import { CallState } from '../adapter/CallAdapter';

export const getCall = (state: CallState): Call | undefined => state.call;
export const getCallStatus = (state: CallState): CallStatus => state.call?.state ?? 'None';
export const getIsScreenShareOn = (state: CallState): boolean => state.call?.isScreenSharingOn ?? false;
export const getIsPreviewCameraOn = (state: CallState): boolean => isPreviewOn(state.devices);

const isPreviewOn = (deviceManager: DeviceManager): boolean => {
  return !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
};
