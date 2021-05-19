// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as SDKCallStatus } from '@azure/communication-calling';
import { CallState, DeviceManagerState } from 'calling-stateful-client';
import { CallAdapterState } from '../adapter/CallAdapter';

export const getCall = (state: CallAdapterState): CallState | undefined => state.call;
export const getCallStatus = (state: CallAdapterState): SDKCallStatus => state.call?.state ?? 'None';
export const getIsScreenShareOn = (state: CallAdapterState): boolean => state.call?.isScreenSharingOn ?? false;
export const getIsPreviewCameraOn = (state: CallAdapterState): boolean => isPreviewOn(state.devices);

const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  return !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
};
