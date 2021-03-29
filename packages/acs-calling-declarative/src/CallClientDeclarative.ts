// © Microsoft Corporation. All rights reserved.
import { DeclarativeDeviceManager, deviceManagerDeclaratify } from './DeviceManagerDeclarative';
import { Call, CallAgent, CallClient, IncomingCall } from '@azure/communication-calling';
import { CallClientState } from './CallClientState';
import { CallContext } from './CallContext';
import { CallSubscriber } from './CallSubscriber';
import { convertSdkCallToDeclarativeCall, convertSdkIncomingCallToDeclarativeIncomingCall } from './Converter';
import { IncomingCallSubscriber } from './IncomingCallSubscriber';

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
  private _callSubscribers: Map<Call, CallSubscriber>;
  private _incomingCallSubscribers: Map<string, IncomingCallSubscriber>;

  constructor(context: CallContext) {
    this._context = context;
    this._callSubscribers = new Map<Call, CallSubscriber>();
    this._incomingCallSubscribers = new Map<string, IncomingCallSubscriber>();
  }

  private callsUpdated = (event: { added: Call[]; removed: Call[] }): void => {
    for (const call of event.added) {
      this._callSubscribers.set(call, new CallSubscriber(call, this._context));
      this._context.setCall(convertSdkCallToDeclarativeCall(call));
    }
    for (const call of event.removed) {
      const callSubscriber = this._callSubscribers.get(call);
      if (callSubscriber) {
        callSubscriber.unsubscribe();
        this._callSubscribers.delete(call);
      }
      this._context.removeCall(call.id);
    }
  };

  private incomingCall = (event: { incomingCall: IncomingCall }): void => {
    this._context.setIncomingCall(convertSdkIncomingCallToDeclarativeIncomingCall(event.incomingCall));
    this._incomingCallSubscribers.set(
      event.incomingCall.id,
      new IncomingCallSubscriber(event.incomingCall, this._context)
    );
  };

  public get<P extends keyof CallClient>(target: CallClient, prop: P): any {
    switch (prop) {
      case 'createCallAgent': {
        return async (...args: Parameters<CallClient['createCallAgent']>) => {
          this._callAgent = await target.createCallAgent(...args);
          this._callAgent.on('callsUpdated', this.callsUpdated);
          this._callAgent.on('incomingCall', this.incomingCall);
          // TODO: We need to proxy callAgent so when it is disposed we can unsubscribe from the events
          return this._callAgent;
        };
      }
      case 'getDeviceManager': {
        return async () => {
          if (this._deviceManager) {
            this._deviceManager.destructor();
            this._deviceManager = undefined;
          }
          const deviceManager = await target.getDeviceManager();
          this._context.setDeviceManagerIsSpeakerSelectionAvailable(deviceManager.isSpeakerSelectionAvailable);
          this._context.setDeviceManagerSelectedMicrophone(deviceManager.selectedMicrophone);
          this._context.setDeviceManagerSelectedSpeaker(deviceManager.selectedSpeaker);
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
