// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MediaSessionAgent } from '@skype/spool-sdk';
import { MediaContext } from './MediaClientContext';
import {
  DeclarativeMediaStreamSession,
  convertSdkSessionToDeclarativeSession,
  mediaStreamSessionDeclaratify
} from './DeclarativeSession';

/**
 * @public
 */
export type DeclarativeMediaSessionAgent = MediaSessionAgent;

/**
 * ProxyCallAgent proxies CallAgent and saves any returned state in the given context. It will subscribe to all state
 * updates in the CallAgent and in the contained Calls and RemoteParticipants. When dispose is called it will
 * unsubscribe from all state updates.
 *
 * @private
 */
class ProxyMediaSessionAgent implements ProxyHandler<DeclarativeMediaSessionAgent> {
  private _context: MediaContext;

  constructor(context: MediaContext) {
    this._context = context;
  }

  public get<P extends keyof MediaSessionAgent>(target: MediaSessionAgent, prop: P): any {
    switch (prop) {
      case 'joinSession':
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<MediaSessionAgent['joinSession']>): Promise<DeclarativeMediaStreamSession> => {
            const session = await target.joinSession(...args);
            const statefulSession = mediaStreamSessionDeclaratify(session, this._context);

            // TODO [jaburnsi] add session to context properly on(sessionAdded) API when available
            this._context.setSession(convertSdkSessionToDeclarativeSession(statefulSession));

            return statefulSession;
          },
          'MediaSessionAgent.joinSession'
        );
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative CallAgent by proxying CallAgent with ProxyCallAgent which will track state updates by updating
 * the given context.
 *
 * @alpha
 */
export const mediaSessionAgentDeclaratify = (
  mediaSessionAgent: MediaSessionAgent,
  context: MediaContext
): DeclarativeMediaSessionAgent => {
  // TODO [jaburnsi] clearCallRelatedState(context, internalContext);
  return new Proxy(mediaSessionAgent, new ProxyMediaSessionAgent(context)) as DeclarativeMediaSessionAgent;
};
