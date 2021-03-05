// © Microsoft Corporation. All rights reserved.
import { Call, CallAgent, CallClient, RemoteParticipant } from '@azure/communication-calling';
import { produce } from 'immer';
import { CallClientState } from './CallClientState';
import { CallContext } from './CallContext';

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
  private _callAgent: CallAgent | undefined;

  constructor(context: CallContext) {
    this._context = context;
  }

  private refreshState(e?: any): void {
    if (!this._callAgent) {
      return;
    }
    const calls: Call[] = this._callAgent.calls;
    this._context.setState(produce(this._context.getState(), (draft: CallClientState) => {
      draft.calls = calls;
    }));
  }

  private subscribeToParticipant(participant: RemoteParticipant) {
    participant.on('participantStateChanged', this.refreshState.bind(this));
    participant.on('isMutedChanged', this.refreshState.bind(this));
    participant.on('displayNameChanged', this.refreshState.bind(this));
    participant.on('isSpeakingChanged', this.refreshState.bind(this));
    participant.on('videoStreamsUpdated', this.refreshState.bind(this));
  }

  private unsubscribeToParticipant(participant: RemoteParticipant) {
    participant.off('participantStateChanged', this.refreshState.bind(this));
    participant.off('isMutedChanged', this.refreshState.bind(this));
    participant.off('displayNameChanged', this.refreshState.bind(this));
    participant.off('isSpeakingChanged', this.refreshState.bind(this));
    participant.off('videoStreamsUpdated', this.refreshState.bind(this));
  }

  private onParticipantsUpdated(event: { added: RemoteParticipant[], removed: RemoteParticipant[] }): void {
    for (const participant of event.added) {
      this.subscribeToParticipant(participant);
    }
    for (const participant of event.removed) {
      this.unsubscribeToParticipant(participant);
    }
  }

  private subscribeToCall(call: Call): void {
    call.on('callStateChanged', this.refreshState.bind(this));
    call.on('callIdChanged', this.refreshState.bind(this));
    call.on('isScreenSharingOnChanged', this.refreshState.bind(this));
    call.on('remoteParticipantsUpdated', this.onParticipantsUpdated.bind(this));
    call.on('localVideoStreamsUpdated', this.refreshState.bind(this));
    call.on('isRecordingActiveChanged', this.refreshState.bind(this));
  }

  private unsubscribeToCall(call: Call): void {
    call.off('callStateChanged', this.refreshState.bind(this));
    call.off('callIdChanged', this.refreshState.bind(this));
    call.off('isScreenSharingOnChanged', this.refreshState.bind(this));
    call.off('remoteParticipantsUpdated', this.onParticipantsUpdated.bind(this));
    call.off('localVideoStreamsUpdated', this.refreshState.bind(this));
    call.off('isRecordingActiveChanged', this.refreshState.bind(this));

    for (const participant of call.remoteParticipants) {
      this.unsubscribeToParticipant(participant);
    }
  }

  private onCallsUpdated(event: { added: Call[], removed: Call[] }): void {
    for (const call of event.added) {
      this.subscribeToCall(call);
    }
    for (const call of event.removed) {
      this.unsubscribeToCall(call);
    }
  }

  public get<P extends keyof CallClient>(target: CallClient, prop: P) {
    switch (prop) {
      case 'createCallAgent': {
        return async (...args: Parameters<CallClient['createCallAgent']>) => {
          this._callAgent = await target.createCallAgent(...args);
          this._callAgent.on('callsUpdated', this.onCallsUpdated.bind(this));
          return this._callAgent;
        };
      }
      default:
        return Reflect.get(target, prop);
    }
  }
};

/**
 * Creates a declarative CallClient by proxying CallClient with ProxyCallClient which then allows access to state in a
 * declarative way.
 *
 * @param callClient 
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
