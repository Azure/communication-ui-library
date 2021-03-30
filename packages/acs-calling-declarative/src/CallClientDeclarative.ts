// © Microsoft Corporation. All rights reserved.
import { DeclarativeDeviceManager, deviceManagerDeclaratify } from './DeviceManagerDeclarative';
import { CallAgent, CallClient } from '@azure/communication-calling';
import { CallClientState } from './CallClientState';
import { CallContext } from './CallContext';
import { callAgentDeclaratify } from './CallAgentDeclarative';

/**
 * Defines the methods that allow CallClient to be used declaratively.
 */
export interface DeclarativeCallClient extends CallClient {
  state: CallClientState;
  onStateChange(handler: (state: CallClientState) => void): void;
}

/**
 * ProxyCallClient proxies CallClient and subscribes to all events that affect state. ProxyCallClient keeps its own copy
 * of the call state and when state is updated, ProxyCallClient emits the event 'stateChanged'.
 */
class ProxyCallClient implements ProxyHandler<CallClient> {
  private _context: CallContext;
  private _callAgent: CallAgent | undefined;
  private _deviceManager: DeclarativeDeviceManager | undefined;

  constructor(context: CallContext) {
    this._context = context;
  }

  public get<P extends keyof CallClient>(target: CallClient, prop: P): any {
    switch (prop) {
      case 'createCallAgent': {
        return async (...args: Parameters<CallClient['createCallAgent']>) => {
          // createCallAgent will throw an exception if the previous callAgent was not disposed. If the previous
          // callAgent was disposed then it would have unsubscribed to events so we can just create a new declarative
          // callAgent if the createCallAgent succeeds.
          const callAgent = await target.createCallAgent(...args);
          this._callAgent = callAgentDeclaratify(callAgent, this._context);
          return this._callAgent;
        };
      }
      case 'getDeviceManager': {
        return async () => {
          // We don't want to have duplicate deviceManagers with duplicate subscriptions and we want to allow user to
          // retrieve new deviceManager so we keep a cache, and destruct the old deviceManager to allow the creation of
          // a new one without any duplicate subscriptions happening.
          if (this._deviceManager) {
            this._deviceManager.destructor();
            this._deviceManager = undefined;
          }
          const deviceManager = await target.getDeviceManager();
          this._deviceManager = deviceManagerDeclaratify(deviceManager, this._context);
          return this._deviceManager;
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
}

/**
 * Creates a declarative CallClient by proxying CallClient with ProxyCallClient which then allows access to state in a
 * declarative way.
 *
 * @param callClient - call client to declaratify
 */
export const callClientDeclaratify = (callClient: CallClient): DeclarativeCallClient => {
  const context: CallContext = new CallContext();

  Object.defineProperty(callClient, 'state', {
    configurable: false,
    get: () => context.getState()
  });
  Object.defineProperty(callClient, 'onStateChange', {
    configurable: false,
    value: (handler: (state: CallClientState) => void) => context.onStateChange(handler)
  });

  return new Proxy(callClient, new ProxyCallClient(context)) as DeclarativeCallClient;
};
