// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DisplayNameChangedReason, RemoteParticipant, RemoteVideoStream } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
import { convertSdkRemoteStreamToDeclarativeRemoteStream } from './Converter';
import { InternalCallContext } from './InternalCallContext';
import { RemoteVideoStreamSubscriber } from './RemoteVideoStreamSubscriber';
import { disposeView } from './StreamUtils';

/**
 * Keeps track of the listeners assigned to a particular participant because when we get an event from SDK, it doesn't
 * tell us which participant it is for. If we keep track of this then we know which participant in the state that needs
 * an update and also which property of that participant. Also we can use this when unregistering to a participant.
 */
export class ParticipantSubscriber {
  private _callIdRef: CallIdRef;
  private _participant: RemoteParticipant;
  private _context: CallContext;
  private _internalContext: InternalCallContext;
  private _participantKey: string;
  private _remoteVideoStreamSubscribers: Map<number, RemoteVideoStreamSubscriber>;

  constructor(
    callIdRef: CallIdRef,
    participant: RemoteParticipant,
    context: CallContext,
    internalContext: InternalCallContext
  ) {
    this._callIdRef = callIdRef;
    this._participant = participant;
    this._context = context;
    this._internalContext = internalContext;
    this._participantKey = toFlatCommunicationIdentifier(this._participant.identifier);
    this._remoteVideoStreamSubscribers = new Map<number, RemoteVideoStreamSubscriber>();
    this.subscribe();
  }

  private subscribe = (): void => {
    this._participant.on('stateChanged', this.stateChanged);
    this._participant.on('isMutedChanged', this.isMutedChanged);
    this._participant.on('displayNameChanged', this.displayNameChanged);
    this._participant.on('isSpeakingChanged', this.isSpeakingChanged);
    this._participant.on('videoStreamsUpdated', this.videoStreamsUpdated);
    this._participant.on('roleChanged', this.roleChanged);

    if (this._participant.videoStreams.length > 0) {
      for (const stream of this._participant.videoStreams) {
        this._internalContext.setRemoteRenderInfo(
          this._callIdRef.callId,
          this._participantKey,
          stream.id,
          stream,
          'NotRendered',
          undefined
        );
        this.addRemoteVideoStreamSubscriber(stream);
      }
      this._context.setRemoteVideoStreams(
        this._callIdRef.callId,
        this._participantKey,
        this._participant.videoStreams.map(convertSdkRemoteStreamToDeclarativeRemoteStream),
        []
      );
    }
  };

  public unsubscribe = (): void => {
    this._participant.off('stateChanged', this.stateChanged);
    this._participant.off('isMutedChanged', this.isMutedChanged);
    this._participant.off('displayNameChanged', this.displayNameChanged);
    this._participant.off('isSpeakingChanged', this.isSpeakingChanged);
    this._participant.off('videoStreamsUpdated', this.videoStreamsUpdated);
    this._participant.off('roleChanged', this.roleChanged);

    // If unsubscribing it means the participant left the call. If they have any rendering streams we should stop them
    // as it doesn't make sense to render for an ended participant.
    if (this._participant.videoStreams.length > 0) {
      for (const stream of this._participant.videoStreams) {
        disposeView(
          this._context,
          this._internalContext,
          this._callIdRef.callId,
          this._participantKey,
          convertSdkRemoteStreamToDeclarativeRemoteStream(stream)
        );
        this._internalContext.deleteRemoteRenderInfo(this._callIdRef.callId, this._participantKey, stream.id);
      }
    }
  };

  private addRemoteVideoStreamSubscriber = (remoteVideoStream: RemoteVideoStream): void => {
    this._remoteVideoStreamSubscribers.get(remoteVideoStream.id)?.unsubscribe();
    this._remoteVideoStreamSubscribers.set(
      remoteVideoStream.id,
      new RemoteVideoStreamSubscriber(this._callIdRef, this._participantKey, remoteVideoStream, this._context)
    );
  };

  private stateChanged = (): void => {
    this._context.setParticipantState(this._callIdRef.callId, this._participantKey, this._participant.state);
  };

  private isMutedChanged = (): void => {
    this._context.setParticipantIsMuted(this._callIdRef.callId, this._participantKey, this._participant.isMuted);
  };

  private roleChanged = (): void => {
    this._context.setParticipantRole(this._callIdRef.callId, this._participantKey, this._participant.role);
  };

  private displayNameChanged = (args: {
    newValue?: string;
    oldValue?: string;
    reason?: DisplayNameChangedReason;
  }): void => {
    console.log(`display name changed from ${args.oldValue} to ${args.newValue} due to ${args.reason}`);
    this._context.setParticipantDisplayName(
      this._callIdRef.callId,
      this._participantKey,
      this._participant.displayName || ''
    );
  };

  private isSpeakingChanged = (): void => {
    this._context.setParticipantIsSpeaking(this._callIdRef.callId, this._participantKey, this._participant.isSpeaking);
  };

  private videoStreamsUpdated = (event: { added: RemoteVideoStream[]; removed: RemoteVideoStream[] }): void => {
    for (const stream of event.removed) {
      this._remoteVideoStreamSubscribers.get(stream.id)?.unsubscribe();
      disposeView(
        this._context,
        this._internalContext,
        this._callIdRef.callId,
        this._participantKey,
        convertSdkRemoteStreamToDeclarativeRemoteStream(stream)
      );
      this._internalContext.deleteRemoteRenderInfo(this._callIdRef.callId, this._participantKey, stream.id);
    }

    for (const stream of event.added) {
      this._internalContext.setRemoteRenderInfo(
        this._callIdRef.callId,
        this._participantKey,
        stream.id,
        stream,
        'NotRendered',
        undefined
      );
      this.addRemoteVideoStreamSubscriber(stream);
    }

    this._context.setRemoteVideoStreams(
      this._callIdRef.callId,
      this._participantKey,
      event.added.map(convertSdkRemoteStreamToDeclarativeRemoteStream),
      event.removed.map((stream: RemoteVideoStream) => stream.id)
    );
  };
}
