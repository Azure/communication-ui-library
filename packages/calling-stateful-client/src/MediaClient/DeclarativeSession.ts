// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { LocalAudioStream, MediaStreamSession } from '@skype/spool-sdk';
import { MediaContext } from './MediaClientContext';
import { LocalAudioStreamState, MediaSessionState } from './MediaClientState';

/**
 * TODO [jaburnsi] remove this when session ids are exposed in the SDK
 * @internal
 */
export const _SESSION_PLACEHOLDER_ID = 'placeholder-session-id';

/**
 * @alpha
 */
export interface DeclarativeMediaStreamSession extends MediaStreamSession {}

class ProxyMediaStreamSession implements ProxyHandler<MediaStreamSession> {
  private _context: MediaContext;

  constructor(context: MediaContext) {
    this._context = context;
  }

  public get<P extends keyof MediaStreamSession>(target: MediaStreamSession, prop: P): any {
    switch (prop) {
      case 'mute': {
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<MediaStreamSession['mute']>) => {
          await target.mute(...args);
          // TODO: [jaburnsi] replace with session.on('muteChanged') when available
          this._context.setSessionMuted(_SESSION_PLACEHOLDER_ID, true);
        }, 'MediaStreamSession.mute');
      }
      case 'unmute': {
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<MediaStreamSession['unmute']>) => {
          await target.unmute(...args);
          // TODO: [jaburnsi] replace with session.on('muteChanged') when available
          this._context.setSessionLocalAudioStream(
            _SESSION_PLACEHOLDER_ID,
            convertSdkLocalAudioStreamToDeclarativeLocalAudioStream(target.localAudioStreams[0])
          );
          this._context.setSessionMuted(_SESSION_PLACEHOLDER_ID, false);
        }, 'MediaStreamSession.unmute');
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * @private
 */
export const mediaStreamSessionDeclaratify = (
  mediaStreamSession: MediaStreamSession,
  context: MediaContext
): DeclarativeMediaStreamSession => {
  const proxyMediaStreamSession = new ProxyMediaStreamSession(context);
  return new Proxy(mediaStreamSession, proxyMediaStreamSession) as DeclarativeMediaStreamSession;
};

/**
 * @private
 *
 * Note at the time of writing only one LocalVideoStream is supported by the SDK.
 */
export function convertSdkSessionToDeclarativeSession(session: MediaStreamSession): MediaSessionState {
  const localAudioStreams = session.localAudioStreams
    .map((stream) => convertSdkLocalAudioStreamToDeclarativeLocalAudioStream(stream))
    .filter((stream) => stream !== undefined) as LocalAudioStreamState[];

  return {
    id: _SESSION_PLACEHOLDER_ID,
    state: session.state,
    localAudioStreams: localAudioStreams,

    // TODO [jaburnsi] Properly set session values:
    deepNoiseSuppression: {
      isEnabled: false
    },
    isMuted: true,
    isIncomingAudioMuted: false,
    localVideoStreams: [],
    remoteAudioStreams: []
  };
}

/** @private */
export function convertSdkLocalAudioStreamToDeclarativeLocalAudioStream(
  stream: LocalAudioStream | undefined
): LocalAudioStreamState | undefined {
  if (!stream) {
    return undefined;
  }
  return {
    source: stream.source,
    mediaStreamType: stream.mediaStreamType
  };
}
