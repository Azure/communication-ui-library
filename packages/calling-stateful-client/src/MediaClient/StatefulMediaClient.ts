// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MediaClient } from '@skype/spool-sdk';
import { MediaClientState } from './MediaClientState';
import { CommunicationUserIdentifier, getIdentifierKind } from '@azure/communication-common';
import { _safeJSONStringify } from '@internal/acs-ui-common';
import { MediaContext } from './MediaClientContext';

/**
 * Arguments to construct the StatefulMediaClient.
 *
 * @public
 * @alpha
 */
export type StatefulMediaClientArgs = {
  /**
   * UserId from SDK. This is provided for developer convenience to easily access the userId from the
   * state.
   */
  userId: CommunicationUserIdentifier;
};

/** @public @alpha */
export interface StatefulMediaClient extends MediaClient {
  getState(): MediaClientState;
  onStateChange(handler: (state: MediaClientState) => void): void;
  offStateChange(handler: (state: MediaClientState) => void): void;
}

class ProxyMediaClient implements ProxyHandler<MediaClient> {
  private _context: MediaContext;

  constructor(context: MediaContext) {
    this._context = context;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get<P extends keyof MediaClient>(target: MediaClient, prop: P): any {
    switch (prop) {
      case 'connect': {
        return this._context.withAsyncErrorTeedToState(async () => {
          // May not be necessary if there is an onStateChange handler
          this._context.setSessionConnectedState('<TODO JABURNSI: REPLACE ME>', 'Connecting');
          try {
            await target.connect();
            this._context.setSessionConnectedState('<TODO JABURNSI: REPLACE ME>', 'Connected');
          } catch (error) {
            this._context.setSessionConnectedState('<TODO JABURNSI: REPLACE ME>', 'Disconnected');
            throw error;
          }
        }, 'CallClient.connect');
      }
      case 'disconnect': {
        return this._context.withAsyncErrorTeedToState(async () => {
          await target.disconnect();
          this._context.setSessionConnectedState('<TODO JABURNSI: REPLACE ME>', 'Disconnected');
        }, 'CallClient.disconnect');
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/** @public @alpha */
export const createStatefulMediaClient = (args: StatefulMediaClientArgs): StatefulMediaClient => {
  const context = new MediaContext(getIdentifierKind(args.userId));
  const mediaClient = new MediaClient();

  Object.defineProperty(mediaClient, 'getState', {
    configurable: false,
    value: () => context.getState()
  });
  Object.defineProperty(mediaClient, 'onStateChange', {
    configurable: false,
    value: (handler: (state: MediaClientState) => void) => context.onStateChange(handler)
  });
  Object.defineProperty(mediaClient, 'offStateChange', {
    configurable: false,
    value: (handler: (state: MediaClientState) => void) => context.offStateChange(handler)
  });

  return new Proxy(mediaClient, new ProxyMediaClient(context)) as StatefulMediaClient;
};
