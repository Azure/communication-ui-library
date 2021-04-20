// © Microsoft Corporation. All rights reserved.

import { Call, RemoteParticipant } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import {
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkParticipantToDeclarativeParticipant,
  getRemoteParticipantKey
} from './Converter';
import { ParticipantSubscriber } from './ParticipantSubscriber';

/**
 * Internal object used to hold callId. This is so when we create the closure that includes this container we can update
 * the container contents without needing to update the closure since the closure is referencing this object otherwise
 * if the closure contains a primitive the updating of the primitive does not get picked up by the closure.
 */
interface CallIdRef {
  callId: string;
}

/**
 * Keeps track of the listeners assigned to a particular call because when we get an event from SDK, it doesn't tell us
 * which call it is for. If we keep track of this then we know which call in the state that needs an update and also
 * which property of that call. Also we can use this when unregistering to a call.
 */
export class CallSubscriber {
  private _call: Call;
  private _callIdRef: CallIdRef; // Cache id because it could change so we know old and new id for updating.
  private _context: CallContext;
  private _participantSubscribers: Map<string, ParticipantSubscriber>;

  constructor(call: Call, context: CallContext) {
    this._call = call;
    this._callIdRef = { callId: call.id };
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
    this._participantSubscribers.clear();
  };

  private addParticipantListener(participant: RemoteParticipant): void {
    const participantKey = getRemoteParticipantKey(participant.identifier);
    if (!this._participantSubscribers.get(participantKey)) {
      this._participantSubscribers.set(
        participantKey,
        new ParticipantSubscriber(this._callIdRef.callId, participant, this._context)
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
    this._context.setCallState(this._callIdRef.callId, this._call.state);
  };

  private idChanged = (): void => {
    this._participantSubscribers.forEach((participantSubscriber: ParticipantSubscriber) => {
      participantSubscriber.setCallId(this._call.id);
    });
    this._context.setCallId(this._call.id, this._callIdRef.callId);
    this._callIdRef.callId = this._call.id;
  };

  private isScreenSharingOnChanged = (): void => {
    this._context.setCallIsScreenSharingOn(this._callIdRef.callId, this._call.isScreenSharingOn);
  };

  private remoteParticipantsUpdated = (event: { added: RemoteParticipant[]; removed: RemoteParticipant[] }): void => {
    event.added.forEach((participant: RemoteParticipant) => {
      this.addParticipantListener(participant);
    });
    event.removed.forEach((participant: RemoteParticipant) => {
      this.removeParticipantListener(participant);
    });

    // Remove any added participants from remoteParticipantsEnded if they are there and add any removed participants to
    // remoteParticipantsEnded.
    this._context.setCallRemoteParticipantsEnded(
      this._callIdRef.callId,
      event.removed.map(convertSdkParticipantToDeclarativeParticipant),
      event.added.map((participant: RemoteParticipant) => {
        return getRemoteParticipantKey(participant.identifier);
      })
    );

    // Add added participants to remoteParticipants and remove removed participants from remoteParticipants.
    this._context.setCallRemoteParticipants(
      this._callIdRef.callId,
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
      this._callIdRef.callId,
      this._call.localVideoStreams.map(convertSdkLocalStreamToDeclarativeLocalStream)
    );
  };
}
