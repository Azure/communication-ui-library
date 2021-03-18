// © Microsoft Corporation. All rights reserved.
import {
  Call,
  CallAgent,
  CallClient,
  CallEndReason,
  IncomingCall,
  RemoteParticipant
} from '@azure/communication-calling';
import { CallClientState } from './CallClientState';
import { CallContext } from './CallContext';
import {
  convertSdkCallToDeclarativeCall,
  convertSdkIncomingCallToDeclarativeIncomingCall,
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkParticipantToDeclarativeParticipant,
  convertSdkRemoteStreamToDeclarativeRemoteStream,
  getRemoteParticipantKey
} from './Converter';

/**
 * Defines the methods that allow CallClient to be used declaratively.
 */
export interface DeclarativeCallClient extends CallClient {
  state: CallClientState;
  onStateChange(handler: (state: CallClientState) => void): void;
}

/**
 * Internal object used to hold callId. This is so when we create the closure that includes this container we can update
 * the container contents without needing to update the closure since the closure is referencing this object otherwise
 * if the closure contains a primitive the updating of the primitive does not get picked up by the closure.
 */
interface CallIdContainer {
  callId: string;
}

/**
 * Keeps track of the listeners assigned to a particular participant because when we get an event from SDK, it doesn't
 * tell us which participant it is for. If we keep track of this then we know which participant in the state that needs
 * an update and also which property of that participant. Also we can use this when unregistering to a participant.
 */
class ParticipantSubscriber {
  private _callIdContainer: CallIdContainer;
  private _participant: RemoteParticipant;
  private _context: CallContext;
  private _participantKey: string;

  constructor(callId: string, participant: RemoteParticipant, context: CallContext) {
    this._callIdContainer = { callId: callId };
    this._participant = participant;
    this._context = context;
    this._participantKey = getRemoteParticipantKey(this._participant.identifier);
    this.subscribe();
  }

  private subscribe = (): void => {
    this._participant.on('stateChanged', this.stateChanged);
    this._participant.on('isMutedChanged', this.isMutedChanged);
    this._participant.on('displayNameChanged', this.displayNameChanged);
    this._participant.on('isSpeakingChanged', this.isSpeakingChanged);
    this._participant.on('videoStreamsUpdated', this.videoStreamsUpdated);
  };

  public unsubscribe = (): void => {
    this._participant.off('stateChanged', this.stateChanged);
    this._participant.off('isMutedChanged', this.isMutedChanged);
    this._participant.off('displayNameChanged', this.displayNameChanged);
    this._participant.off('isSpeakingChanged', this.isSpeakingChanged);
    this._participant.off('videoStreamsUpdated', this.videoStreamsUpdated);
  };

  public setCallId = (callId: string): void => {
    this._callIdContainer.callId = callId;
  };

  private stateChanged = (): void => {
    this._context.setParticipantState(this._callIdContainer.callId, this._participantKey, this._participant.state);
  };

  private isMutedChanged = (): void => {
    this._context.setParticipantIsMuted(this._callIdContainer.callId, this._participantKey, this._participant.isMuted);
  };

  private displayNameChanged = (): void => {
    this._context.setParticipantDisplayName(
      this._callIdContainer.callId,
      this._participantKey,
      this._participant.displayName || ''
    );
  };

  private isSpeakingChanged = (): void => {
    this._context.setParticipantIsSpeaking(
      this._callIdContainer.callId,
      this._participantKey,
      this._participant.isSpeaking
    );
  };

  private videoStreamsUpdated = (): void => {
    // We don't have an easy way to distinguish different remote video streams so a quick way to handle this is to
    // create the remote video streams again from scratch. TODO: do we want to be more selective on adding/removing
    // streams?
    this._context.setParticipantVideoStreams(
      this._callIdContainer.callId,
      this._participantKey,
      this._participant.videoStreams.map(convertSdkRemoteStreamToDeclarativeRemoteStream)
    );
  };
}

/**
 * Keeps track of the listeners assigned to a particular call because when we get an event from SDK, it doesn't tell us
 * which call it is for. If we keep track of this then we know which call in the state that needs an update and also
 * which property of that call. Also we can use this when unregistering to a call.
 */
class CallSubscriber {
  private _call: Call;
  private _callIdContainer: CallIdContainer; // Cache id because it could change so we know old and new id for updating.
  private _context: CallContext;
  private _participantSubscribers: Map<string, ParticipantSubscriber>;

  constructor(call: Call, context: CallContext) {
    this._call = call;
    this._callIdContainer = { callId: call.id };
    this._context = context;
    this._participantSubscribers = new Map<string, ParticipantSubscriber>();

    this.subscribe();
  }

  private subscribe = (): void => {
    this._call.on('stateChanged', this.stateChanged);
    this._call.on('idChanged', this.idChanged);
    this._call.on('isScreenSharingOnChanged', this.isScreenSharingOnChanged);
    this._call.on('remoteParticipantsUpdated', this.remoteParticipantsUpdated);
    this._call.on('localVideoStreamsUpdated', this.localVideoStreamsUpdated);
    this._call.remoteParticipants.forEach((participant: RemoteParticipant) => {
      this.addParticipantListener(participant);
    });
  };

  public unsubscribe = (): void => {
    this._call.off('stateChanged', this.stateChanged);
    this._call.off('idChanged', this.idChanged);
    this._call.off('isScreenSharingOnChanged', this.isScreenSharingOnChanged);
    this._call.off('remoteParticipantsUpdated', this.remoteParticipantsUpdated);
    this._call.off('localVideoStreamsUpdated', this.localVideoStreamsUpdated);

    this._participantSubscribers.forEach((participantSubscriber: ParticipantSubscriber) => {
      participantSubscriber.unsubscribe();
    });
    this._participantSubscribers = new Map<string, ParticipantSubscriber>();
  };

  private addParticipantListener(participant: RemoteParticipant): void {
    const participantKey = getRemoteParticipantKey(participant.identifier);
    if (!this._participantSubscribers.get(participantKey)) {
      this._participantSubscribers.set(
        participantKey,
        new ParticipantSubscriber(this._callIdContainer.callId, participant, this._context)
      );
    }
  }

  private removeParticipantListener(participant: RemoteParticipant): void {
    const participantKey = getRemoteParticipantKey(participant.identifier);
    const participantSubscriber = this._participantSubscribers.get(participantKey);
    if (participantSubscriber) {
      participantSubscriber.unsubscribe();
      this._participantSubscribers.delete(participantKey);
    }
  }

  private stateChanged = (): void => {
    this._context.setCallState(this._callIdContainer.callId, this._call.state);
  };

  private idChanged = (): void => {
    this._participantSubscribers.forEach((participantSubscriber: ParticipantSubscriber) => {
      participantSubscriber.setCallId(this._call.id);
    });
    this._context.setCallId(this._call.id, this._callIdContainer.callId);
    this._callIdContainer.callId = this._call.id;
  };

  private isScreenSharingOnChanged = (): void => {
    this._context.setCallIsScreenSharingOn(this._callIdContainer.callId, this._call.isScreenSharingOn);
  };

  private remoteParticipantsUpdated = (event: { added: RemoteParticipant[]; removed: RemoteParticipant[] }): void => {
    event.added.forEach((participant: RemoteParticipant) => {
      this.addParticipantListener(participant);
    });
    event.removed.forEach((participant: RemoteParticipant) => {
      this.removeParticipantListener(participant);
    });
    this._context.setCallRemoteParticipants(
      this._callIdContainer.callId,
      event.added.map(convertSdkParticipantToDeclarativeParticipant),
      event.removed.map((participant: RemoteParticipant) => {
        return getRemoteParticipantKey(participant.identifier);
      })
    );
  };

  private localVideoStreamsUpdated = (): void => {
    // We don't have an easy way to distinguish different local video streams so a quick way to handle this is to create
    // the local video streams again from scratch. TODO: do we want to be more selective on adding/removing streams?
    this._context.setCallLocalVideoStreams(
      this._callIdContainer.callId,
      this._call.localVideoStreams.map(convertSdkLocalStreamToDeclarativeLocalStream)
    );
  };
}

/**
 * Keeps track of the listeners assigned to a particular incoming call because when we get an event from SDK, it doesn't
 * tell us which incoming call it is for. If we keep track of this then we know which incoming call in the state that
 * needs an update and also which property of that incoming call. Also we can use this when unregistering to a incoming
 * call.
 */
class IncomingCallSubscriber {
  private _incomingCall: IncomingCall;
  private _context: CallContext;

  constructor(incomingCall: IncomingCall, context: CallContext) {
    this._incomingCall = incomingCall;
    this._context = context;
    this.subscribe();
  }

  private subscribe = (): void => {
    this._incomingCall.on('callEnded', this.callEnded);
  };

  private unsubscribe = (): void => {
    this._incomingCall.off('callEnded', this.callEnded);
  };

  private callEnded = (event: { callEndReason: CallEndReason }): void => {
    this._context.setIncomingCallEnded(this._incomingCall.id, event.callEndReason);
    this.unsubscribe();
  };
}

/**
 * ProxyCallClient proxies CallClient and subscribes to all events that affect state. ProxyCallClient keeps its own copy
 * of the call state and when state is updated, ProxyCallClient emits the event 'stateChanged'.
 */
class ProxyCallClient implements ProxyHandler<CallClient> {
  private _context: CallContext;
  private _callAgent: CallAgent | undefined;
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
