// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallState as SDKCallStatus } from '@azure/communication-calling';
import { CallState, DeviceManagerState, LocalVideoStreamState } from '@internal/calling-stateful-client';
import { CallAdapterState, CallCompositePage } from '../adapter/CallAdapter';
import { _isPreviewOn } from '@internal/calling-component-bindings';

/**
 * @private
 */
export const getCallId = (state: CallAdapterState): string | undefined => state.call?.id;

/**
 * @private
 */
export const getEndedCall = (state: CallAdapterState): CallState | undefined => state.endedCall;

/**
 * @private
 */
export const getCallStatus = (state: CallAdapterState): SDKCallStatus => state.call?.state ?? 'None';

/**
 * @private
 */
export const getDeviceManager = (state: CallAdapterState): DeviceManagerState => state.devices;

/**
 * @private
 */
export const getIsScreenShareOn = (state: CallAdapterState): boolean => state.call?.isScreenSharingOn ?? false;

/**
 * @private
 */
export const getIsPreviewCameraOn = (state: CallAdapterState): boolean => _isPreviewOn(state.devices);

/**
 * @private
 */
export const getPage = (state: CallAdapterState): CallCompositePage => state.page;

/**
 * @private
 */
export const getLocalMicrophoneEnabled = (state: CallAdapterState): boolean => state.isLocalPreviewMicrophoneEnabled;

/**
 * @private
 */
export const getLocalVideoStreams = (state: CallAdapterState): LocalVideoStreamState[] | undefined =>
  state.call?.localVideoStreams;

/**
 * @private
 */
export const getIsTranscriptionActive = (state: CallAdapterState): boolean =>
  !!state.call?.transcription.isTranscriptionActive;

/**
 * @private
 */
export const getIsRecordingActive = (state: CallAdapterState): boolean => !!state.call?.recording.isRecordingActive;
