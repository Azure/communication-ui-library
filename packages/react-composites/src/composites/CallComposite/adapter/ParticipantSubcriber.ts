// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { RemoteParticipant, RemoteVideoStream } from '@azure/communication-calling';
import EventEmitter from 'events';

/**
 * @private
 */
export class ParticipantSubscriber {
  private participant: RemoteParticipant;
  private emitter: EventEmitter;

  constructor(participant: RemoteParticipant, emitter: EventEmitter) {
    this.participant = participant;
    this.emitter = emitter;
    this.subscribeParticipantEvents();
  }

  private isMutedChangedHandler = (): void => {
    this.emitter.emit('isMutedChanged', {
      participantId: this.participant.identifier,
      isMuted: this.participant.isMuted
    });
  };

  private displayNameChangedHandler = (): void => {
    this.emitter.emit('displayNameChanged', {
      participantId: this.participant.identifier,
      displayName: this.participant.displayName
    });
  };

  private isSpeakingChangedHandler = (): void => {
    this.emitter.emit('isSpeakingChanged', {
      participantId: this.participant.identifier,
      isSpeaking: this.participant.isSpeaking
    });
  };

  private videoStreamsUpdatedHandler = (event: { added: RemoteVideoStream[]; removed: RemoteVideoStream[] }): void => {
    this.emitter.emit('videoStreamsUpdated', event);
  };

  private subscribeParticipantEvents(): void {
    this.participant.on('isMutedChanged', this.isMutedChangedHandler);
    this.participant.on('displayNameChanged', this.displayNameChangedHandler);
    this.participant.on('isSpeakingChanged', this.isSpeakingChangedHandler);
    this.participant.on('videoStreamsUpdated', this.videoStreamsUpdatedHandler);
  }

  public unsubscribeAll(): void {
    this.participant.off('isMutedChanged', this.isMutedChangedHandler);
    this.participant.off('displayNameChanged', this.displayNameChangedHandler);
    this.participant.off('isSpeakingChanged', this.isSpeakingChangedHandler);
    this.participant.off('videoStreamsUpdated', this.videoStreamsUpdatedHandler);
  }
}

/**
 * @private
 */
export type ParticipantEvent = 'isMutedChanged' | 'displayNameChanged' | 'isSpeakingChanged' | 'videoStreamsUpdated';
