// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MediaClient } from '@skype/spool-sdk';
import { MediaClientState } from './MediaClientState';
import { CommunicationUserIdentifier, getIdentifierKind } from '@azure/communication-common';
import { _safeJSONStringify } from '@internal/acs-ui-common';
import { MediaContext } from './MediaClientContext';
import { deviceManagerDeclaratify } from '../DeviceManagerDeclarative';
import { DeviceManager } from '@azure/communication-calling';
import { InternalCallContext } from '../InternalCallContext';
import { DeclarativeMediaSessionAgent, mediaSessionAgentDeclaratify } from './DeclarativeMediaAgent';

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
  private _internalContext: InternalCallContext;
  private _sdkDeviceManager: DeviceManager | undefined;
  private _deviceManager: DeviceManager | undefined;
  private _mediaSessionAgent: DeclarativeMediaSessionAgent | undefined;

  constructor(
    context: MediaContext,
    internalContext: InternalCallContext /** TODO [jaburnsi]: create shared internal call context */
  ) {
    this._context = context;
    this._internalContext = internalContext;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get<P extends keyof MediaClient>(target: MediaClient, prop: P): any {
    switch (prop) {
      case 'createSessionAgent': {
        return this._context.withAsyncErrorTeedToState(
          async (...args: Parameters<MediaClient['createSessionAgent']>): Promise<DeclarativeMediaSessionAgent> => {
            const sessionAgent = await target.createSessionAgent(...args);
            this._mediaSessionAgent = mediaSessionAgentDeclaratify(sessionAgent, this._context);
            return this._mediaSessionAgent;
          },
          'MediaClient.createSessionAgent'
        );
      }
      case 'getDeviceManager': {
        return this._context.withAsyncErrorTeedToState(async () => {
          // As of writing, the SDK always returns the same instance of DeviceManager so we keep a reference of
          // DeviceManager and if it does not change we return the cached DeclarativeDeviceManager. If it does not we'll
          // throw an error that indicate we need to fix this issue as our implementation has diverged from the SDK.
          const deviceManager = await target.getDeviceManager();
          if (this._sdkDeviceManager) {
            if (this._sdkDeviceManager === deviceManager) {
              return this._deviceManager;
            } else {
              throw new Error(
                'Multiple DeviceManager not supported. This means a incompatible version of communication-calling is ' +
                  'used OR calling declarative was not properly updated to communication-calling version.'
              );
            }
          } else {
            this._sdkDeviceManager = deviceManager;
          }
          this._deviceManager = deviceManagerDeclaratify(deviceManager, this._context, this._internalContext);
          return this._deviceManager;
        }, 'MediaClient.getDeviceManager');
      }
      // case 'connect': {
      //   return this._context.withAsyncErrorTeedToState(async () => {
      //     // May not be necessary if there is an onStateChange handler
      //     this._context.setSessionConnectedState('<TODO JABURNSI: REPLACE ME>', 'Connecting');
      //     try {
      //       await target.connect();
      //       this._context.setSessionConnectedState('<TODO JABURNSI: REPLACE ME>', 'Connected');
      //     } catch (error) {
      //       this._context.setSessionConnectedState('<TODO JABURNSI: REPLACE ME>', 'Disconnected');
      //       throw error;
      //     }
      //   }, 'CallClient.connect');
      // }
      // case 'disconnect': {
      //   return this._context.withAsyncErrorTeedToState(async () => {
      //     await target.disconnect();
      //     this._context.setSessionConnectedState('<TODO JABURNSI: REPLACE ME>', 'Disconnected');
      //   }, 'CallClient.disconnect');
      // }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/** @public @alpha */
export const createStatefulMediaClient = (args: StatefulMediaClientArgs): StatefulMediaClient => {
  const context = new MediaContext(getIdentifierKind(args.userId));
  const internalContext = new InternalCallContext();
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

  return new Proxy(mediaClient, new ProxyMediaClient(context, internalContext)) as StatefulMediaClient;
};
