// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MediaStreamSession } from '@skype/spool-sdk';
import { MediaContext } from './MediaClientContext';

/**
 * TODO [jaburnsi] remove this when session ids are exposed in the SDK
 * @private
 */
export const SESSION_PLACEHOLDER_ID = 'placeholder-session-id';

/**
 * @private
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
          // TODO: replace with session.on('muteChanged') when available
          this._context.setSessionMuted(SESSION_PLACEHOLDER_ID, true);
        }, 'MediaStreamSession.mute');
      }
      case 'unmute': {
        return this._context.withAsyncErrorTeedToState(async (...args: Parameters<MediaStreamSession['unmute']>) => {
          await target.unmute(...args);
          // TODO: replace with session.on('muteChanged') when available
          this._context.setSessionMuted(SESSION_PLACEHOLDER_ID, false);
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
