// © Microsoft Corporation. All rights reserved.
import { CallClient } from '@azure/communication-calling';
import { CallClientState } from './CallClientState';
import { CallContext } from './CallContext';
import { DeclarativeDeviceManager, deviceManagerDeclaratify } from './DeviceManagerDeclarative';

/**
 * Defines the methods that allow CallClient to be used declaratively.
 */
export interface DeclarativeCallClient extends CallClient {
  state: CallClientState;
  onStateChange(handler: (state: CallClientState) => void): void;
}

/**
 * ProxyCallClient proxies CallClient and subscribes to all events that affect state. When state is updated,
 * ProxyCallClient emits the event 'stateChanged'. Since CallClient contains its own state, when state is updated,
 * ProxyCallClient only queries the CallClient state and this same state is surfaced in getState.
 */
class ProxyCallClient implements ProxyHandler<CallClient> {
  private _context: CallContext;
  // private _callAgent: CallAgent | undefined; Commented out while waiting for another PR
  private _deviceManager: DeclarativeDeviceManager | undefined;

  constructor(context: CallContext) {
    this._context = context;
  }

  /* Commented out while waiting for another PR
  private refreshState = (): void => {
    if (!this._callAgent) {
      return;
    }
    const calls: Call[] = this._callAgent.calls;
    this._context.setState(
      produce(this._context.getState(), (draft: CallClientState) => {
        draft.calls = calls;
      })
    );
  };

  private subscribeToParticipant = (participant: RemoteParticipant): void => {
    participant.on('participantStateChanged', this.refreshState);
    participant.on('isMutedChanged', this.refreshState);
    participant.on('displayNameChanged', this.refreshState);
    participant.on('isSpeakingChanged', this.refreshState);
    participant.on('videoStreamsUpdated', this.refreshState);
  };

  private unsubscribeFromParticipant = (participant: RemoteParticipant): void => {
    participant.off('participantStateChanged', this.refreshState);
    participant.off('isMutedChanged', this.refreshState);
    participant.off('displayNameChanged', this.refreshState);
    participant.off('isSpeakingChanged', this.refreshState);
    participant.off('videoStreamsUpdated', this.refreshState);
  };

  private onParticipantsUpdated = (event: { added: RemoteParticipant[]; removed: RemoteParticipant[] }): void => {
    for (const participant of event.added) {
      this.subscribeToParticipant(participant);
    }
    for (const participant of event.removed) {
      this.unsubscribeFromParticipant(participant);
    }
    this.refreshState();
  };

  private subscribeToCall = (call: Call): void => {
    call.on('callStateChanged', this.refreshState);
    call.on('callIdChanged', this.refreshState);
    call.on('isScreenSharingOnChanged', this.refreshState);
    call.on('remoteParticipantsUpdated', this.onParticipantsUpdated);
    call.on('localVideoStreamsUpdated', this.refreshState);
    call.on('isRecordingActiveChanged', this.refreshState);
  };

  private unsubscribeFromCall = (call: Call): void => {
    call.off('callStateChanged', this.refreshState);
    call.off('callIdChanged', this.refreshState);
    call.off('isScreenSharingOnChanged', this.refreshState);
    call.off('remoteParticipantsUpdated', this.onParticipantsUpdated);
    call.off('localVideoStreamsUpdated', this.refreshState);
    call.off('isRecordingActiveChanged', this.refreshState);

    for (const participant of call.remoteParticipants) {
      this.unsubscribeFromParticipant(participant);
    }
  };

  private onCallsUpdated = (event: { added: Call[]; removed: Call[] }): void => {
    for (const call of event.added) {
      this.subscribeToCall(call);
    }
    for (const call of event.removed) {
      this.unsubscribeFromCall(call);
    }
    this.refreshState();
  };
  */

  public get<P extends keyof CallClient>(target: CallClient, prop: P): any {
    switch (prop) {
      /* Commented out while waiting for another PR
      case 'createCallAgent': {
        return async (...args: Parameters<CallClient['createCallAgent']>) => {
          this._callAgent = await target.createCallAgent(...args);
          this._callAgent.on('callsUpdated', this.onCallsUpdated);
          return this._callAgent;
        };
      }
      */
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
