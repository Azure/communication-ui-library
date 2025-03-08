// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import { DeviceManagerState, LocalVideoStreamState } from '../CallClientState';
import { StatefulError } from '../Error';

/** @alpha */
export type MediaErrorTarget =
  | 'MediaClient.createSessionAgent'
  | 'MediaClient.getDeviceManager'
  | 'MediaSessionAgent.joinSession'
  | 'MediaStreamSession.unmute'
  | 'MediaStreamSession.mute';

/**
 * Error thrown from failed stateful API methods.
 *
 * @alpha
 */
export class MediaError extends StatefulError<MediaErrorTarget> {
  constructor(target: MediaErrorTarget, innerError: Error, timestamp?: Date) {
    super(target, innerError, 'MediaError', timestamp);
  }
}

/** @alpha */
export type MediaErrors = {
  [target in MediaErrorTarget]: MediaError;
};

/** @alpha */
export type SessionStatus = 'Connected' | 'Disconnected' | 'Connecting' | 'Idle';

/** @alpha */
export interface MediaClientState {
  sessions: {
    [sessionId: string]: MediaSessionState;
  };
  latestErrors: MediaErrors;
  deviceManager: DeviceManagerState;
  userId: CommunicationIdentifierKind;
}

/** @alpha */
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

/** @alpha @todo */
export interface LocalAudioStreamState {}

/** @alpha @todo */
export interface RemoteAudioStreamState {}
