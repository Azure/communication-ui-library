// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as SDKCallStatus } from '@azure/communication-calling';
import { CallState, DeviceManagerState } from 'calling-stateful-client';
import { CallAdapterState, CallCompositePage } from '../adapter/CallAdapter';

export const getCall = (state: CallAdapterState): CallState | undefined => state.call;
export const getCallStatus = (state: CallAdapterState): SDKCallStatus => state.call?.state ?? 'None';
export const getDeviceManager = (state: CallAdapterState): DeviceManagerState => state.devices;
export const getIsScreenShareOn = (state: CallAdapterState): boolean => state.call?.isScreenSharingOn ?? false;
export const getIsPreviewCameraOn = (state: CallAdapterState): boolean => isPreviewOn(state.devices);
export const getPage = (state: CallAdapterState): CallCompositePage => state.page;
export const getLocalMicrophoneEnabled = (state: CallAdapterState): boolean => state.isLocalPreviewMicrophoneEnabled;
export const getDisplayName = (state: CallAdapterState): string | undefined => state.displayName;
export const getIdentifier = (state: CallAdapterState): string => state.userId;

const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  return deviceManager.unparentedViews.values().next().value?.view !== undefined;
};
