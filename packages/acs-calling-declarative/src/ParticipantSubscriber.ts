// © Microsoft Corporation. All rights reserved.

import { RemoteParticipant } from '@azure/communication-calling';
import { CallContext } from './CallContext';
import { convertSdkRemoteStreamToDeclarativeRemoteStream, getRemoteParticipantKey } from './Converter';
import { RemoteVideoStreamSubscriber } from './RemoteVideoStreamSubscriber';

/**
 * Internal object used to hold callId. This is so when we create the closure that includes this container we can update
 * the container contents without needing to update the closure since the closure is referencing this object otherwise
 * if the closure contains a primitive the updating of the primitive does not get picked up by the closure.
 */
interface CallIdRef {
  callId: string;
}

/**
 * Keeps track of the listeners assigned to a particular participant because when we get an event from SDK, it doesn't
 * tell us which participant it is for. If we keep track of this then we know which participant in the state that needs
 * an update and also which property of that participant. Also we can use this when unregistering to a participant.
 */
export class ParticipantSubscriber {
  private _callIdRef: CallIdRef;
  private _participant: RemoteParticipant;
  private _context: CallContext;
  private _participantKey: string;
  private _remoteVideoStreamSubscribers: RemoteVideoStreamSubscriber[];

  constructor(callId: string, participant: RemoteParticipant, context: CallContext) {
    this._callIdRef = { callId: callId };
    this._participant = participant;
    this._context = context;
    this._participantKey = getRemoteParticipantKey(this._participant.identifier);
    this._remoteVideoStreamSubscribers = [];
    this.subscribe();
  }

  private subscribe = (): void => {
    this._participant.on('stateChanged', this.stateChanged);
    this._participant.on('isMutedChanged', this.isMutedChanged);
    this._participant.on('displayNameChanged', this.displayNameChanged);
    this._participant.on('isSpeakingChanged', this.isSpeakingChanged);
    this._participant.on('videoStreamsUpdated', this.videoStreamsUpdated);

    for (const videoStream of this._participant.videoStreams) {
      this._remoteVideoStreamSubscribers.push(new RemoteVideoStreamSubscriber(videoStream, this.videoStreamsUpdated));
    }
  };

  public unsubscribe = (): void => {
    this._participant.off('stateChanged', this.stateChanged);
    this._participant.off('isMutedChanged', this.isMutedChanged);
    this._participant.off('displayNameChanged', this.displayNameChanged);
    this._participant.off('isSpeakingChanged', this.isSpeakingChanged);
    this._participant.off('videoStreamsUpdated', this.videoStreamsUpdated);
  };

  public setCallId = (callId: string): void => {
    this._callIdRef.callId = callId;
  };

  private stateChanged = (): void => {
    this._context.setParticipantState(this._callIdRef.callId, this._participantKey, this._participant.state);
  };

  private isMutedChanged = (): void => {
    this._context.setParticipantIsMuted(this._callIdRef.callId, this._participantKey, this._participant.isMuted);
  };

  private displayNameChanged = (): void => {
    this._context.setParticipantDisplayName(
      this._callIdRef.callId,
      this._participantKey,
      this._participant.displayName || ''
    );
  };

  private isSpeakingChanged = (): void => {
    this._context.setParticipantIsSpeaking(this._callIdRef.callId, this._participantKey, this._participant.isSpeaking);
  };

  private videoStreamsUpdated = (): void => {
    // We don't have an easy way to distinguish different remote video streams so a quick way to handle this is to
    // create the remote video streams again from scratch. TODO: do we want to be more selective on adding/removing
    // streams?
    for (const remoteVideoStreamSubscriber of this._remoteVideoStreamSubscribers) {
      remoteVideoStreamSubscriber.unsubscribe();
    }
    this._remoteVideoStreamSubscribers = [];
    for (const videoStream of this._participant.videoStreams) {
      this._remoteVideoStreamSubscribers.push(new RemoteVideoStreamSubscriber(videoStream, this.videoStreamsUpdated));
    }
    this._context.setParticipantVideoStreams(
      this._callIdRef.callId,
      this._participantKey,
      this._participant.videoStreams.map(convertSdkRemoteStreamToDeclarativeRemoteStream)
    );
  };
}
