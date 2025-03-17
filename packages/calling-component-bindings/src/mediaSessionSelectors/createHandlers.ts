// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AudioDeviceInfo } from '@azure/communication-calling';
import memoizeOne from 'memoize-one';
import {
  DeclarativeMediaStreamSession,
  StatefulDeviceManager,
  StatefulMediaClient,
  _SESSION_PLACEHOLDER_ID
} from '@internal/calling-stateful-client';

/**
 * Object containing all the handlers required for Calling components to connect to the MediaClient.
 *
 * Media related components from this package are able to pick out relevant handlers from this object.
 * See {@link useHandlers} and {@link usePropsFor}.
 *
 * @public
 */
export interface MediaCallingHandlers {
  onSelectMicrophone: (device: AudioDeviceInfo) => Promise<void>;
  onToggleMicrophone: () => Promise<void>;
}

/**
 * @private
 */
export const createMediaHandlers = memoizeOne(
  (
    mediaClient: StatefulMediaClient | undefined,
    deviceManager: StatefulDeviceManager | undefined,
    mediaStreamSession: DeclarativeMediaStreamSession | undefined
  ): MediaCallingHandlers => {
    const onSelectMicrophone = async (device: AudioDeviceInfo): Promise<void> => {
      if (!deviceManager) {
        return;
      }
      return deviceManager.selectMicrophone(device);
    };

    const onToggleMicrophone = async (): Promise<void> => {
      if (!mediaClient || !mediaStreamSession) {
        console.warn('MediaClient or MediaStreamSession is not available to perform mute/unmute');
        return;
      }

      return mediaClient.getState().sessions?.[_SESSION_PLACEHOLDER_ID]?.isMuted
        ? mediaStreamSession.unmute()
        : mediaStreamSession.mute();
    };

    return {
      onSelectMicrophone,
      onToggleMicrophone
    };
  }
);
