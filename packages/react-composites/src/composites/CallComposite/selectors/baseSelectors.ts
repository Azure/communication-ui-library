// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as SDKCallStatus } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallState, DeviceManagerState, LocalVideoStreamState } from '@internal/calling-stateful-client';
import { CallAdapterState, CallCompositePage } from '../adapter/CallAdapter';

export const getCallId = (state: CallAdapterState): string | undefined => state.call?.id;
export const getEndedCall = (state: CallAdapterState): CallState | undefined => state.endedCall;
export const getCallStatus = (state: CallAdapterState): SDKCallStatus => state.call?.state ?? 'None';
export const getDeviceManager = (state: CallAdapterState): DeviceManagerState => state.devices;
export const getIsScreenShareOn = (state: CallAdapterState): boolean => state.call?.isScreenSharingOn ?? false;
export const getIsPreviewCameraOn = (state: CallAdapterState): boolean => isPreviewOn(state.devices);
export const getPage = (state: CallAdapterState): CallCompositePage => state.page;
export const getLocalMicrophoneEnabled = (state: CallAdapterState): boolean => state.isLocalPreviewMicrophoneEnabled;
export const getDisplayName = (state: CallAdapterState): string | undefined => state.displayName;
export const getIdentifier = (state: CallAdapterState): string => toFlatCommunicationIdentifier(state.userId);
export const getLocalVideoStreams = (state: CallAdapterState): LocalVideoStreamState[] | undefined =>
  state.call?.localVideoStreams;
export const getIsTranscriptionActive = (state: CallAdapterState): boolean =>
  !!state.call?.transcription.isTranscriptionActive;
export const getIsRecordingActive = (state: CallAdapterState): boolean => !!state.call?.recording.isRecordingActive;

const isPreviewOn = (deviceManager: DeviceManagerState): boolean => {
  // TODO: we should take in a LocalVideoStream that developer wants to use as their 'Preview' view. We should also
  // handle cases where 'Preview' view is in progress and not necessary completed.
  return deviceManager.unparentedViews.length > 0 && deviceManager.unparentedViews[0].view !== undefined;
};
