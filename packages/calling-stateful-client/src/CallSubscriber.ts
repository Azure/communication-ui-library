// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Features, LocalVideoStream, RemoteParticipant } from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { TeamsCaptions } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallCommon } from './BetaToStableTypes';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
/* @conditional-compile-remove(close-captions) */
import { CaptionsSubscriber } from './CaptionsSubscriber';
import {
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkParticipantToDeclarativeParticipant
} from './Converter';
import { InternalCallContext } from './InternalCallContext';
/* @conditional-compile-remove(video-background-effects) */
import { LocalVideoStreamVideoEffectsSubscriber } from './LocalVideoStreamVideoEffectsSubscriber';
import { ParticipantSubscriber } from './ParticipantSubscriber';
import { RecordingSubscriber } from './RecordingSubscriber';
/* @conditional-compile-remove(ppt-live) */
import { PPTLiveSubscriber } from './PPTLiveSubscriber';
import { disposeView } from './StreamUtils';
import { TranscriptionSubscriber } from './TranscriptionSubscriber';
import { UserFacingDiagnosticsSubscriber } from './UserFacingDiagnosticsSubscriber';
/* @conditional-compile-remove(raise-hand) */
import { RaiseHandSubscriber } from './RaiseHandSubscriber';
/* @conditional-compile-remove(optimal-video-count) */
import { OptimalVideoCountSubscriber } from './OptimalVideoCountSubscriber';
/* @conditional-compile-remove(capabilities) */
import { CapabilitiesSubscriber } from './CapabilitiesSubscriber';
/* @conditional-compile-remove(reaction) */
import { ReactionSubscriber } from './ReactionSubscriber';
/* @conditional-compile-remove(spotlight) */
import { SpotlightSubscriber } from './SpotlightSubscriber';

/**
 * Keeps track of the listeners assigned to a particular call because when we get an event from SDK, it doesn't tell us
 * which call it is for. If we keep track of this then we know which call in the state that needs an update and also
 * which property of that call. Also we can use this when unregistering to a call.
 */
export class CallSubscriber {
  private _call: CallCommon;
  private _callIdRef: CallIdRef;
  private _context: CallContext;
  private _internalContext: InternalCallContext;

  private _diagnosticsSubscriber: UserFacingDiagnosticsSubscriber;
  private _participantSubscribers: Map<string, ParticipantSubscriber>;
  private _recordingSubscriber: RecordingSubscriber;
  private _transcriptionSubscriber: TranscriptionSubscriber;
  /* @conditional-compile-remove(ppt-live) */
  private _pptLiveSubscriber: PPTLiveSubscriber;
  /* @conditional-compile-remove(optimal-video-count) */
  private _optimalVideoCountSubscriber: OptimalVideoCountSubscriber;
  /* @conditional-compile-remove(close-captions) */
  private _captionsSubscriber?: CaptionsSubscriber;
  /* @conditional-compile-remove(raise-hand) */
  private _raiseHandSubscriber?: RaiseHandSubscriber;
  /* @conditional-compile-remove(reaction) */
  private _reactionSubscriber?: ReactionSubscriber;
  /* @conditional-compile-remove(video-background-effects) */
  private _localVideoStreamVideoEffectsSubscribers: Map<string, LocalVideoStreamVideoEffectsSubscriber>;
  /* @conditional-compile-remove(capabilities) */
  private _capabilitiesSubscriber: CapabilitiesSubscriber;
  /* @conditional-compile-remove(spotlight) */
  private _spotlightSubscriber: SpotlightSubscriber;

  constructor(call: CallCommon, context: CallContext, internalContext: InternalCallContext) {
    this._call = call;
    this._callIdRef = { callId: call.id };
    this._context = context;
    this._internalContext = internalContext;

    this._diagnosticsSubscriber = new UserFacingDiagnosticsSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.UserFacingDiagnostics)
    );
    this._participantSubscribers = new Map<string, ParticipantSubscriber>();
    this._recordingSubscriber = new RecordingSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Recording)
    );
    /* @conditional-compile-remove(ppt-live) */
    this._pptLiveSubscriber = new PPTLiveSubscriber(this._callIdRef, this._context, this._call);
    this._transcriptionSubscriber = new TranscriptionSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Transcription)
    );
    /* @conditional-compile-remove(raise-hand) */
    this._raiseHandSubscriber = new RaiseHandSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.RaiseHand)
    );
    /* @conditional-compile-remove(reaction) */
    this._reactionSubscriber = new ReactionSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Reaction)
    );
    /* @conditional-compile-remove(optimal-video-count) */
    this._optimalVideoCountSubscriber = new OptimalVideoCountSubscriber({
      callIdRef: this._callIdRef,
      context: this._context,
      localOptimalVideoCountFeature: this._call.feature(Features.OptimalVideoCount)
    });
    /* @conditional-compile-remove(video-background-effects) */
    this._localVideoStreamVideoEffectsSubscribers = new Map();

    /* @conditional-compile-remove(capabilities) */
    this._capabilitiesSubscriber = new CapabilitiesSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Capabilities)
    );

    /* @conditional-compile-remove(spotlight) */
    this._spotlightSubscriber = new SpotlightSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Spotlight)
    );

    this.subscribe();
  }

  private subscribe = (): void => {
    this._call.on('stateChanged', this.stateChanged);
    /* @conditional-compile-remove(close-captions) */
    this._call.on('stateChanged', this.initCaptionSubscriber);
    this._call.on('idChanged', this.idChanged);
    this._call.on('isScreenSharingOnChanged', this.isScreenSharingOnChanged);
    this._call.on('remoteParticipantsUpdated', this.remoteParticipantsUpdated);
    this._call.on('localVideoStreamsUpdated', this.localVideoStreamsUpdated);
    this._call.on('isMutedChanged', this.isMuteChanged);
    /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(capabilities) */
    this._call.on('roleChanged', this.callRoleChangedHandler);
    this._call.feature(Features.DominantSpeakers).on('dominantSpeakersChanged', this.dominantSpeakersChanged);
    /* @conditional-compile-remove(total-participant-count) */
    this._call.on('totalParticipantCountChanged', this.totalParticipantCountChangedHandler);

    for (const localVideoStream of this._call.localVideoStreams) {
      this._internalContext.setLocalRenderInfo(
        this._callIdRef.callId,
        localVideoStream.mediaStreamType,
        localVideoStream,
        'NotRendered',
        undefined
      );
    }

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
  };

  public unsubscribe = (): void => {
    this._call.off('stateChanged', this.stateChanged);
    /* @conditional-compile-remove(close-captions) */
    this._call.off('stateChanged', this.initCaptionSubscriber);
    this._call.off('idChanged', this.idChanged);
    this._call.off('isScreenSharingOnChanged', this.isScreenSharingOnChanged);
    this._call.off('remoteParticipantsUpdated', this.remoteParticipantsUpdated);
    this._call.off('localVideoStreamsUpdated', this.localVideoStreamsUpdated);
    this._call.off('isMutedChanged', this.isMuteChanged);
    /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(capabilities) */
    this._call.off('roleChanged', this.callRoleChangedHandler);
    /* @conditional-compile-remove(total-participant-count) */
    this._call.off('totalParticipantCountChanged', this.totalParticipantCountChangedHandler);

    this._participantSubscribers.forEach((participantSubscriber: ParticipantSubscriber) => {
      participantSubscriber.unsubscribe();
    });
    this._participantSubscribers.clear();

    // If we are unsubscribing that means we no longer want to display any video for this call (callEnded or callAgent
    // disposed) and we should not be updating it any more. So if video is rendering we stop rendering.
    for (const localVideoStream of this._call.localVideoStreams) {
      const mediaStreamType = localVideoStream.mediaStreamType;
      disposeView(
        this._context,
        this._internalContext,
        this._callIdRef.callId,
        undefined,
        convertSdkLocalStreamToDeclarativeLocalStream(localVideoStream)
      );
      this._internalContext.deleteLocalRenderInfo(this._callIdRef.callId, mediaStreamType);
    }

    this._diagnosticsSubscriber.unsubscribe();
    this._recordingSubscriber.unsubscribe();
    this._transcriptionSubscriber.unsubscribe();
    /* @conditional-compile-remove(optimal-video-count) */
    this._optimalVideoCountSubscriber.unsubscribe();
    /* @conditional-compile-remove(ppt-live) */
    this._pptLiveSubscriber.unsubscribe();
    /* @conditional-compile-remove(close-captions) */
    this._captionsSubscriber?.unsubscribe();
    /* @conditional-compile-remove(raise-hand) */
    this._raiseHandSubscriber?.unsubscribe();
    /* @conditional-compile-remove(capabilities) */
    this._capabilitiesSubscriber.unsubscribe();
    /* @conditional-compile-remove(reaction) */
    this._reactionSubscriber?.unsubscribe();
    /* @conditional-compile-remove(spotlight) */
    this._spotlightSubscriber.unsubscribe();
  };

  private addParticipantListener(participant: RemoteParticipant): void {
    const participantKey = toFlatCommunicationIdentifier(participant.identifier);
    this._participantSubscribers.get(participantKey)?.unsubscribe();
    this._participantSubscribers.set(
      participantKey,
      new ParticipantSubscriber(this._callIdRef, participant, this._context, this._internalContext)
    );
  }

  private removeParticipantListener(participant: RemoteParticipant): void {
    const participantKey = toFlatCommunicationIdentifier(participant.identifier);
    const participantSubscriber = this._participantSubscribers.get(participantKey);
    if (participantSubscriber) {
      participantSubscriber.unsubscribe();
      this._participantSubscribers.delete(participantKey);
    }
  }

  private stateChanged = (): void => {
    this._context.setCallState(this._callIdRef.callId, this._call.state);
  };

  /* @conditional-compile-remove(close-captions) */
  private initCaptionSubscriber = (): void => {
    // subscribe to captions here so that we don't call captions when call is not initialized
    if (this._call.state === 'Connected' && !this._captionsSubscriber) {
      if (this._call.feature(Features.Captions).captions.kind === 'TeamsCaptions') {
        this._captionsSubscriber = new CaptionsSubscriber(
          this._callIdRef,
          this._context,
          this._call.feature(Features.Captions).captions as TeamsCaptions
        );
        this._call.off('stateChanged', this.initCaptionSubscriber);
      }
    }
  };

  private idChanged = (): void => {
    this._internalContext.setCallId(this._call.id, this._callIdRef.callId);
    this._context.setCallId(this._call.id, this._callIdRef.callId);
    this._callIdRef.callId = this._call.id;
  };

  private isScreenSharingOnChanged = (): void => {
    this._context.setCallIsScreenSharingOn(this._callIdRef.callId, this._call.isScreenSharingOn);
  };

  private isMuteChanged = (): void => {
    this._context.setCallIsMicrophoneMuted(this._callIdRef.callId, this._call.isMuted);
  };

  /* @conditional-compile-remove(rooms) */ /* @conditional-compile-remove(capabilities) */
  private callRoleChangedHandler = (): void => {
    this._context.setRole(this._callIdRef.callId, this._call.role);
  };

  /* @conditional-compile-remove(total-participant-count) */
  private totalParticipantCountChangedHandler = (): void => {
    this._context.setTotalParticipantCount(this._callIdRef.callId, this._call.totalParticipantCount);
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
        return toFlatCommunicationIdentifier(participant.identifier);
      })
    );

    // Add added participants to remoteParticipants and remove removed participants from remoteParticipants.
    this._context.setCallRemoteParticipants(
      this._callIdRef.callId,
      event.added.map(convertSdkParticipantToDeclarativeParticipant),
      event.removed.map((participant: RemoteParticipant) => {
        return toFlatCommunicationIdentifier(participant.identifier);
      })
    );
  };

  private localVideoStreamsUpdated = (event: { added: LocalVideoStream[]; removed: LocalVideoStream[] }): void => {
    for (const localVideoStream of event.added) {
      const mediaStreamType = localVideoStream.mediaStreamType;
      // IMPORTANT: The internalContext should be set before context. This is done to ensure that the internal context
      // has the required data when component re-renders due to external state changes.
      this._internalContext.setLocalRenderInfo(
        this._callIdRef.callId,
        mediaStreamType,
        localVideoStream,
        'NotRendered',
        undefined
      );

      // Subscribe to video effect changes
      this._localVideoStreamVideoEffectsSubscribers.get(mediaStreamType)?.unsubscribe();
      this._localVideoStreamVideoEffectsSubscribers.set(
        mediaStreamType,
        new LocalVideoStreamVideoEffectsSubscriber({
          parent: this._callIdRef,
          context: this._context,
          localVideoStream: localVideoStream,
          localVideoStreamEffectsAPI: localVideoStream.feature(Features.VideoEffects)
        })
      );
    }
    for (const localVideoStream of event.removed) {
      const mediaStreamType = localVideoStream.mediaStreamType;
      this._localVideoStreamVideoEffectsSubscribers.get(mediaStreamType)?.unsubscribe();
      disposeView(
        this._context,
        this._internalContext,
        this._callIdRef.callId,
        undefined,
        convertSdkLocalStreamToDeclarativeLocalStream(localVideoStream)
      );

      this._internalContext.deleteLocalRenderInfo(this._callIdRef.callId, mediaStreamType);
    }

    this._context.setCallLocalVideoStream(
      this._callIdRef.callId,
      event.added.map(convertSdkLocalStreamToDeclarativeLocalStream),
      event.removed.map(convertSdkLocalStreamToDeclarativeLocalStream)
    );
  };

  private dominantSpeakersChanged = (): void => {
    const dominantSpeakers = this._call.feature(Features.DominantSpeakers).dominantSpeakers;
    this._context.setCallDominantSpeakers(this._callIdRef.callId, dominantSpeakers);
  };
}
