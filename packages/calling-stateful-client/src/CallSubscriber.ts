// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Features, LocalVideoStream, RemoteParticipant } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { CallCommon } from './BetaToStableTypes';
import { CallContext } from './CallContext';
import { CallIdRef } from './CallIdRef';
import { CaptionsFeatureSubscriber } from './CaptionsSubscriber';
import {
  convertSdkLocalStreamToDeclarativeLocalStream,
  convertSdkParticipantToDeclarativeParticipant
} from './Converter';
import { InternalCallContext } from './InternalCallContext';

import { LocalVideoStreamVideoEffectsSubscriber } from './LocalVideoStreamVideoEffectsSubscriber';
import { ParticipantSubscriber } from './ParticipantSubscriber';
import { RecordingSubscriber } from './RecordingSubscriber';
import { PPTLiveSubscriber } from './PPTLiveSubscriber';
import { disposeView } from './StreamUtils';
import { TranscriptionSubscriber } from './TranscriptionSubscriber';
import { UserFacingDiagnosticsSubscriber } from './UserFacingDiagnosticsSubscriber';
import { RaiseHandSubscriber } from './RaiseHandSubscriber';
import { OptimalVideoCountSubscriber } from './OptimalVideoCountSubscriber';

import { CapabilitiesSubscriber } from './CapabilitiesSubscriber';
import { ReactionSubscriber } from './ReactionSubscriber';
import { SpotlightSubscriber } from './SpotlightSubscriber';
/* @conditional-compile-remove(local-recording-notification) */
import { LocalRecordingSubscriber } from './LocalRecordingSubscriber';
/* @conditional-compile-remove(breakout-rooms) */
import { BreakoutRoomsSubscriber } from './BreakoutRoomsSubscriber';
/* @conditional-compile-remove(together-mode) */
import { TogetherModeSubscriber } from './TogetherModeSubscriber';
/* @conditional-compile-remove(media-access) */
import { MediaAccessSubscriber } from './MediaAccessSubscriber';
import { _isTeamsMeeting } from './TypeGuards';

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
  /* @conditional-compile-remove(local-recording-notification) */
  private _localRecordingSubscriber?: LocalRecordingSubscriber;
  private _pptLiveSubscriber: PPTLiveSubscriber;
  private _optimalVideoCountSubscriber: OptimalVideoCountSubscriber;
  private _CaptionsFeatureSubscriber?: CaptionsFeatureSubscriber;
  private _raiseHandSubscriber?: RaiseHandSubscriber;
  private _reactionSubscriber?: ReactionSubscriber;

  private _localVideoStreamVideoEffectsSubscribers: Map<string, LocalVideoStreamVideoEffectsSubscriber>;

  private _capabilitiesSubscriber: CapabilitiesSubscriber;
  private _spotlightSubscriber: SpotlightSubscriber;
  /* @conditional-compile-remove(breakout-rooms) */
  private _breakoutRoomsSubscriber: BreakoutRoomsSubscriber;
  /* @conditional-compile-remove(together-mode) */
  private _togetherModeSubscriber: TogetherModeSubscriber;
  /* @conditional-compile-remove(media-access) */
  private _mediaAccessSubscriber: MediaAccessSubscriber;

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
    this._pptLiveSubscriber = new PPTLiveSubscriber(this._callIdRef, this._context, this._call);
    this._transcriptionSubscriber = new TranscriptionSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Transcription)
    );
    this._raiseHandSubscriber = new RaiseHandSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.RaiseHand)
    );
    this._reactionSubscriber = new ReactionSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Reaction)
    );
    this._optimalVideoCountSubscriber = new OptimalVideoCountSubscriber({
      callIdRef: this._callIdRef,
      context: this._context,
      localOptimalVideoCountFeature: this._call.feature(Features.OptimalVideoCount)
    });

    this._localVideoStreamVideoEffectsSubscribers = new Map();

    this._capabilitiesSubscriber = new CapabilitiesSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Capabilities)
    );

    this._spotlightSubscriber = new SpotlightSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.Spotlight)
    );
    /* @conditional-compile-remove(breakout-rooms) */
    this._breakoutRoomsSubscriber = new BreakoutRoomsSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.BreakoutRooms)
    );
    /* @conditional-compile-remove(together-mode) */
    this._togetherModeSubscriber = new TogetherModeSubscriber(
      this._callIdRef,
      this._context,
      this._internalContext,
      this._call.feature(Features.TogetherMode)
    );

    /* @conditional-compile-remove(media-access) */
    this._mediaAccessSubscriber = new MediaAccessSubscriber(
      this._callIdRef,
      this._context,
      this._call.feature(Features.MediaAccess)
    );

    this.subscribe();
  }

  private _safeSubscribeInitCaptionSubscriber = (): void => {
    this._safeSubscribe(this.initCaptionSubscriber);
  };

  private _safeSubscribeInitTeamsMeetingConference = (): void => {
    this._safeSubscribe(this.initTeamsMeetingConference);
  };

  /* @conditional-compile-remove(local-recording-notification) */
  private _safeSubscribeInitLocalRecordingNotificationSubscriber = (): void => {
    this._safeSubscribe(this.initLocalRecordingNotificationSubscriber);
  };

  private subscribe = (): void => {
    this._call.on('stateChanged', this.stateChanged);
    this._call.on('stateChanged', this._safeSubscribeInitCaptionSubscriber);
    this._call.on('stateChanged', this._safeSubscribeInitTeamsMeetingConference);
    /* @conditional-compile-remove(local-recording-notification) */
    this._call.on('stateChanged', this._safeSubscribeInitLocalRecordingNotificationSubscriber);
    this._call.on('idChanged', this.idChanged);
    this._call.on('isScreenSharingOnChanged', this.isScreenSharingOnChanged);
    this._call.on('remoteParticipantsUpdated', this.remoteParticipantsUpdated);
    this._call.on('localVideoStreamsUpdated', this.localVideoStreamsUpdated);
    this._call.on('isMutedChanged', this.isMuteChanged);
    this._call.on('roleChanged', this.callRoleChangedHandler);
    this._call.feature(Features.DominantSpeakers).on('dominantSpeakersChanged', this.dominantSpeakersChanged);
    /* @conditional-compile-remove(total-participant-count) */
    this._call.on('totalParticipantCountChanged', this.totalParticipantCountChangedHandler);
    this._call.on('mutedByOthers', this.mutedByOthersHandler);

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
    this._call.off('stateChanged', this._safeSubscribeInitCaptionSubscriber);
    this._call.off('stateChanged', this._safeSubscribeInitTeamsMeetingConference);
    /* @conditional-compile-remove(local-recording-notification) */
    this._call.off('stateChanged', this._safeSubscribeInitLocalRecordingNotificationSubscriber);
    this._call.off('idChanged', this.idChanged);
    this._call.off('isScreenSharingOnChanged', this.isScreenSharingOnChanged);
    this._call.off('remoteParticipantsUpdated', this.remoteParticipantsUpdated);
    this._call.off('localVideoStreamsUpdated', this.localVideoStreamsUpdated);
    this._call.off('isMutedChanged', this.isMuteChanged);
    this._call.off('roleChanged', this.callRoleChangedHandler);
    /* @conditional-compile-remove(total-participant-count) */
    this._call.off('totalParticipantCountChanged', this.totalParticipantCountChangedHandler);
    this._call.off('mutedByOthers', this.mutedByOthersHandler);

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
    /* @conditional-compile-remove(local-recording-notification) */
    this._localRecordingSubscriber?.unsubscribe();
    this._optimalVideoCountSubscriber.unsubscribe();
    this._pptLiveSubscriber.unsubscribe();
    this._CaptionsFeatureSubscriber?.unsubscribe();
    this._raiseHandSubscriber?.unsubscribe();

    this._capabilitiesSubscriber.unsubscribe();
    this._reactionSubscriber?.unsubscribe();
    this._spotlightSubscriber.unsubscribe();
    /* @conditional-compile-remove(breakout-rooms) */
    this._breakoutRoomsSubscriber.unsubscribe();
    /* @conditional-compile-remove(together-mode) */
    this._togetherModeSubscriber.unsubscribe();
    /* @conditional-compile-remove(media-access) */
    this._mediaAccessSubscriber.unsubscribe();
  };

  // This is a helper function to safely call subscriber functions. This is needed in order to prevent events
  // with the same event type from failing to fire due to a subscriber throwing an error upon subscription.
  // Wrap your listeners with this helper function if your listener can fail due to initialization or fail
  // during a function call. This will prevent other events using the same event type from failing to fire.
  private _safeSubscribe(subscriber: () => void): void {
    try {
      subscriber();
    } catch (e) {
      this._context.teeErrorToState(e as Error, 'Call.on');
    }
  }

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

  private initCaptionSubscriber = (): void => {
    // subscribe to captions here so that we don't call captions when call is not initialized
    if (this._call.state === 'Connected' && !this._CaptionsFeatureSubscriber) {
      this._CaptionsFeatureSubscriber = new CaptionsFeatureSubscriber(
        this._callIdRef,
        this._context,
        this._call.feature(Features.Captions)
      );
      this._call.off('stateChanged', this._safeSubscribeInitCaptionSubscriber);
    }
  };

  private initTeamsMeetingConference = (): void => {
    if (this._call.state === 'Connected' && _isTeamsMeeting(this._call)) {
      this._call
        .feature(Features.TeamsMeetingAudioConferencing)
        .getTeamsMeetingAudioConferencingDetails()
        .then((teamsMeetingConferenceDetails) => {
          this._context.setTeamsMeetingConference(this._callIdRef.callId, teamsMeetingConferenceDetails);
        });
      this._call.off('stateChanged', this._safeSubscribeInitTeamsMeetingConference);
    }
  };

  /* @conditional-compile-remove(local-recording-notification) */
  private initLocalRecordingNotificationSubscriber = (): void => {
    // Subscribe to LocalRecordingFeature as it is only available in interop scenarios
    // Will throw an error if not in interop scenarios
    if (this._call.state === 'Connected' && this._call.kind === 'TeamsCall' && !this._localRecordingSubscriber) {
      this._localRecordingSubscriber = new LocalRecordingSubscriber(
        this._callIdRef,
        this._context,
        this._call.feature(Features.LocalRecording)
      );
      this._call.off('stateChanged', this._safeSubscribeInitLocalRecordingNotificationSubscriber);
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

  private callRoleChangedHandler = (): void => {
    this._context.setRole(this._callIdRef.callId, this._call.role);
  };

  /* @conditional-compile-remove(total-participant-count) */
  private totalParticipantCountChangedHandler = (): void => {
    this._context.setTotalParticipantCount(this._callIdRef.callId, this._call.totalParticipantCount);
  };

  // TODO: Tee to notification state once available
  private mutedByOthersHandler = (): void => {
    this._context.teeErrorToState(
      { name: 'mutedByOthers', message: 'Muted by another participant' },
      'Call.mutedByOthers'
    );
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
