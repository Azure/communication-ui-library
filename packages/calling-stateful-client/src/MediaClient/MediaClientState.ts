// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { DeviceManagerState, LocalVideoStreamState } from '../CallClientState';
import { StatefulError } from '../Error';

/** @public @alpha */
export type MediaErrorTarget =
  | 'MediaClient.createSessionAgent'
  | 'MediaClient.getDeviceManager'
  | 'MediaSessionAgent.joinSession'
  | 'MediaStreamSession.unmute'
  | 'MediaStreamSession.mute';

/**
 * Error thrown from failed stateful API methods.
 *
 * @public
 * @alpha
 */
export class MediaError extends StatefulError<MediaErrorTarget> {
  constructor(target: MediaErrorTarget, innerError: Error, timestamp?: Date) {
    super(target, innerError, 'MediaError', timestamp);
  }
}

/** @public @alpha */
export type MediaErrors = {
  [target in MediaErrorTarget]: MediaError;
};

/** @public @alpha */
export type SessionStatus = 'Connected' | 'Disconnected' | 'Connecting' | 'Idle';

/** @public @alpha */
export interface MediaClientState {
  sessions: {
    [sessionId: string]: MediaSessionState;
  };
  latestErrors: MediaErrors;
  deviceManager: DeviceManagerState;
  userId: CommunicationIdentifierKind;
}

/** @public @alpha */
export interface MediaSessionState {
  id: string;
  deepNoiseSuppression: {
    isEnabled: boolean;
  };
  isMuted: boolean;
  isIncomingAudioMuted: boolean;
  localVideoStreams: LocalVideoStreamState[];
  localAudioStreams: LocalAudioStreamState[];
  remoteAudioStreams: RemoteAudioStreamState[];
  state: SessionStatus;
}

/** @public @alpha @todo */
export interface LocalAudioStreamState {}

/** @public @alpha @todo */
export interface RemoteAudioStreamState {}
