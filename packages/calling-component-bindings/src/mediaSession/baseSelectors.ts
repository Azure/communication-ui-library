// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DeviceManagerState, MediaClientState } from '@internal/calling-stateful-client';

/**
 * Common props used to reference calling declarative client state.
 *
 * @public
 */
export type MediaSessionBaseSelectorProps = {
  sessionId: string;
};

/**
 * @private
 */
export const getDeviceManager = (state: { deviceManager: DeviceManagerState }): DeviceManagerState =>
  state.deviceManager;

/**
 * @private
 */
export const getSessionExists = (state: MediaClientState, props: MediaSessionBaseSelectorProps): boolean => {
  return !!state.sessions?.[props.sessionId];
};

/** @private */
export const getIsMuted = (state: MediaClientState, props: MediaSessionBaseSelectorProps): boolean | undefined => {
  return state.sessions[props.sessionId]?.isMuted;
};
