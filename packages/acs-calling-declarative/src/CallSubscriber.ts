// © Microsoft Corporation. All rights reserved.

import { Call, LocalVideoStream, RemoteParticipant } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
import {
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkParticipantToDeclarativeParticipant,
  getRemoteParticipantKey
} from './Converter';
import { InternalCallContext } from './InternalCallContext';
import { ParticipantSubscriber } from './ParticipantSubscriber';
import { stopRenderVideo } from './StreamUtils';

/**
 * Keeps track of the listeners assigned to a particular call because when we get an event from SDK, it doesn't tell us
 * which call it is for. If we keep track of this then we know which call in the state that needs an update and also
 * which property of that call. Also we can use this when unregistering to a call.
 */
export class CallSubscriber {
  private _call: Call;
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _internalContext: InternalCallContext;
  private _participantSubscribers: Map<string, ParticipantSubscriber>;

  constructor(call: Call, context: CallContext, internalContext: InternalCallContext) {
    this._call = call;
    this._callIdRef = { callId: call.id };
    this._context = context;
    this._internalContext = internalContext;
    this._participantSubscribers = new Map<string, ParticipantSubscriber>();

    this.subscribe();
  }

  private subscribe = (): void => {
    this._call.on('stateChanged', this.stateChanged);
    this._call.on('idChanged', this.idChanged);
    this._call.on('isScreenSharingOnChanged', this.isScreenSharingOnChanged);
    this._call.on('remoteParticipantsUpdated', this.remoteParticipantsUpdated);
    this._call.on('localVideoStreamsUpdated', this.localVideoStreamsUpdated);

    if (this._call.remoteParticipants.length > 0) {
      this._call.remoteParticipants.forEach((participant: RemoteParticipant) => {
        this.addParticipantListener(participant);
      });

      this._context.setCallRemoteParticipants(
        this._callIdRef.callId,
        this._call.remoteParticipants.map(convertSdkParticipantToDeclarativeParticipant),
        []
      );
    }
    // At time of writing only one LocalVideoStream is supported by SDK.
    if (this._call.localVideoStreams.length > 0) {
      this._internalContext.setLocalVideoStream(this._callIdRef.callId, this._call.localVideoStreams[0]);
    }
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

    // If we are unsubscribing that means we no longer want to display any video for this call (callEnded or callAgent
    // disposed) and we should not be updating it any more. So if video is rendering we stop rendering.
    const localVideoStreams = this._context.getState().calls.get(this._callIdRef.callId)?.localVideoStreams;
    if (localVideoStreams && localVideoStreams.length === 1) {
      stopRenderVideo(this._context, this._internalContext, this._callIdRef.callId, localVideoStreams[0]);
    }
  };

  private addParticipantListener(participant: RemoteParticipant): void {
    const participantKey = getRemoteParticipantKey(participant.identifier);
    this._participantSubscribers.get(participantKey)?.unsubscribe();
    this._participantSubscribers.set(
      participantKey,
      new ParticipantSubscriber(this._callIdRef, participant, this._context, this._internalContext)
    );
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
    this._context.setCallId(this._call.id, this._callIdRef.callId);
    this._internalContext.setCallId(this._call.id, this._callIdRef.callId);
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

  private localVideoStreamsUpdated = (event: { added: LocalVideoStream[]; removed: LocalVideoStream[] }): void => {
    // At time of writing only one LocalVideoStream is supported by SDK.
    if (event.added.length > 0) {
      const localVideoStreams = [convertSdkLocalStreamToDeclarativeLocalStream(this._call.localVideoStreams[0])];
      this._context.setCallLocalVideoStream(this._callIdRef.callId, localVideoStreams);
      this._internalContext.setLocalVideoStream(this._callIdRef.callId, this._call.localVideoStreams[0]);
    }
    if (event.removed.length > 0) {
      const localVideoStreams = this._context.getState().calls.get(this._callIdRef.callId)?.localVideoStreams;
      if (localVideoStreams && localVideoStreams.length === 1) {
        stopRenderVideo(this._context, this._internalContext, this._callIdRef.callId, localVideoStreams[0]);
      }
      this._context.setCallLocalVideoStream(this._callIdRef.callId, []);
      this._internalContext.removeLocalVideoStream(this._callIdRef.callId);
    }
  };
}
