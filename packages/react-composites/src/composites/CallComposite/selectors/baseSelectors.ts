// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as SDKCallStatus } from '@azure/communication-calling';
import { CallState, DeviceManagerState } from 'calling-stateful-client';
import { CallingAdapterState } from '../adapter/CallAdapter';

export const getCall = (state: CallingAdapterState): CallState | undefined => state.call;
export const getCallStatus = (state: CallingAdapterState): SDKCallStatus => state.call?.state ?? 'None';
export const getIsScreenShareOn = (state: CallingAdapterState): boolean => state.call?.isScreenSharingOn ?? false;
export const getIsPreviewCameraOn = (state: CallingAdapterState): boolean => isPreviewOn(state.devices);

const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  return !!deviceManager.unparentedViews && !!deviceManager.unparentedViews[0]?.target;
};
