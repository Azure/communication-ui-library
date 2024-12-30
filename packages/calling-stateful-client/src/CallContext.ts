// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import {
  AudioDeviceInfo,
  DeviceAccess,
  DominantSpeakersInfo,
  ParticipantRole,
  ScalingMode,
  VideoDeviceInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(media-access) */
import { MediaAccess, MeetingMediaAccess } from '@azure/communication-calling';
import { RaisedHand } from '@azure/communication-calling';
/* @conditional-compile-remove(breakout-rooms) */
import { BreakoutRoom, BreakoutRoomsSettings } from '@azure/communication-calling';

import { TeamsMeetingAudioConferencingDetails } from '@azure/communication-calling';
import { convertConferencePhoneInfo } from './Converter';

import { CapabilitiesChangeInfo, ParticipantCapabilities } from '@azure/communication-calling';
import { TeamsCaptionsInfo } from '@azure/communication-calling';

import { CaptionsKind, CaptionsInfo as AcsCaptionsInfo } from '@azure/communication-calling';
import { EnvironmentInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(together-mode) */
import { TogetherModeVideoStream, TogetherModeSeatingMap } from '@azure/communication-calling';
import { AzureLogger, createClientLogger, getLogLevel } from '@azure/logger';
import { EventEmitter } from 'events';
import { enableMapSet, enablePatches, Patch, produce } from 'immer';
import {
  CallEndReason,
  CallState as CallStatus,
  RemoteParticipantState as RemoteParticipantStatus
} from '@azure/communication-calling';
import { _safeJSONStringify, toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import {
  CallState,
  CallClientState,
  LocalVideoStreamState,
  RemoteParticipantState,
  RemoteVideoStreamState,
  IncomingCallState,
  VideoStreamRendererViewState,
  CallAgentState,
  CallErrors,
  CallErrorTarget,
  CallError
} from './CallClientState';
/* @conditional-compile-remove(breakout-rooms) */
import { NotificationTarget, CallNotification, CallNotifications } from './CallClientState';
import { TeamsIncomingCallState } from './CallClientState';
import { CaptionsInfo } from './CallClientState';
import { ReactionState } from './CallClientState';
import { AcceptedTransfer } from './CallClientState';
import { callingStatefulLogger } from './Logger';
import { CallIdHistory } from './CallIdHistory';
import { LocalVideoStreamVideoEffectsState } from './CallClientState';
import { convertFromTeamsSDKToCaptionInfoState } from './Converter';

import { convertFromSDKToCaptionInfoState } from './Converter';
import { convertFromSDKToRaisedHandState } from './Converter';
import { ReactionMessage } from '@azure/communication-calling';
import { SpotlightedParticipant } from '@azure/communication-calling';
/* @conditional-compile-remove(local-recording-notification) */
import { LocalRecordingInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(local-recording-notification) */
import { RecordingInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(together-mode) */
import { CallFeatureStreamState, TogetherModeSeatingPositionState } from './CallClientState';

enableMapSet();
// Needed to generate state diff for verbose logging.
enablePatches();

// TODO: How can we make this configurable?
/**
 * @private
 */
export const MAX_CALL_HISTORY_LENGTH = 10;
/**
 * @private
 */
export const REACTION_ANIMATION_TIME_MS = 4133;

/**
 * @private
 */
export class CallContext {
  private _logger: AzureLogger;
  private _state: CallClientState;
  private _emitter: EventEmitter;
  private _atomicId: number;
  private _callIdHistory: CallIdHistory = new CallIdHistory();
  private _timeOutId: { [key: string]: ReturnType<typeof setTimeout> } = {};
  /* @conditional-compile-remove(breakout-rooms) */
  private _latestCallIdsThatPushedNotifications: Partial<Record<NotificationTarget, string>> = {};

  constructor(userId: CommunicationIdentifierKind, maxListeners = 50) {
    this._logger = createClientLogger('communication-react:calling-context');
    this._state = {
      calls: {},
      callsEnded: {},
      incomingCalls: {},
      incomingCallsEnded: {},
      deviceManager: {
        isSpeakerSelectionAvailable: false,
        cameras: [],
        microphones: [],
        speakers: [],
        unparentedViews: []
      },
      callAgent: undefined,
      userId: userId,
      environmentInfo: undefined,
      latestErrors: {} as CallErrors,
      /* @conditional-compile-remove(breakout-rooms) */ latestNotifications: {} as CallNotifications
    };
    this._emitter = new EventEmitter();
    this._emitter.setMaxListeners(maxListeners);
    this._atomicId = 0;
  }

  public getState(): CallClientState {
    return this._state;
  }

  public modifyState(modifier: (draft: CallClientState) => void): void {
    const priorState = this._state;
    this._state = produce(this._state, modifier, (patches: Patch[]) => {
      if (getLogLevel() === 'verbose') {
        // Log to `info` because AzureLogger.verbose() doesn't show up in console.
        this._logger.info(`State change: ${_safeJSONStringify(patches)}`);
      }
    });
    if (this._state !== priorState) {
      this._emitter.emit('stateChanged', this._state);
    }
  }

  public onStateChange(handler: (state: CallClientState) => void): void {
    this._emitter.on('stateChanged', handler);
  }

  public offStateChange(handler: (state: CallClientState) => void): void {
    this._emitter.off('stateChanged', handler);
  }

  // Disposing of the CallAgentDeclarative will not clear the state. If we create a new CallAgentDeclarative, we should
  // make sure the state is clean because any left over state (if previous CallAgentDeclarative was disposed) may be
  // invalid.
  public clearCallRelatedState(): void {
    this.modifyState((draft: CallClientState) => {
      draft.calls = {};
      draft.incomingCalls = {};
      draft.callsEnded = {};
      draft.incomingCallsEnded = {};
    });
  }

  public setCallAgent(callAgent: CallAgentState): void {
    this.modifyState((draft: CallClientState) => {
      draft.callAgent = callAgent;
    });
  }

  public setCall(call: CallState): void {
    this.modifyState((draft: CallClientState) => {
      const latestCallId = this._callIdHistory.latestCallId(call.id);
      const existingCall = draft.calls[latestCallId];
      if (existingCall) {
        existingCall.callerInfo = call.callerInfo;
        existingCall.state = call.state;
        existingCall.callEndReason = call.callEndReason;
        existingCall.direction = call.direction;
        existingCall.isMuted = call.isMuted;
        existingCall.isScreenSharingOn = call.isScreenSharingOn;
        existingCall.localVideoStreams = call.localVideoStreams;
        existingCall.remoteParticipants = call.remoteParticipants;
        existingCall.transcription.isTranscriptionActive = call.transcription.isTranscriptionActive;
        existingCall.optimalVideoCount.maxRemoteVideoStreams = call.optimalVideoCount.maxRemoteVideoStreams;
        existingCall.recording.isRecordingActive = call.recording.isRecordingActive;
        existingCall.raiseHand.raisedHands = call.raiseHand.raisedHands;
        existingCall.pptLive.isActive = call.pptLive.isActive;
        existingCall.raiseHand.localParticipantRaisedHand = call.raiseHand.localParticipantRaisedHand;
        existingCall.role = call.role;
        /* @conditional-compile-remove(total-participant-count) */
        existingCall.totalParticipantCount = call.totalParticipantCount;
        // We don't update the startTime and endTime if we are updating an existing active call
        existingCall.captionsFeature.currentSpokenLanguage = call.captionsFeature.currentSpokenLanguage;
        existingCall.captionsFeature.currentCaptionLanguage = call.captionsFeature.currentCaptionLanguage;
        existingCall.info = call.info;

        existingCall.meetingConference = call.meetingConference;
      } else {
        draft.calls[latestCallId] = call;
      }
    });
    /**
     * Remove the incoming call that matches the call if there is one
     */
    if (this._state.incomingCalls[call.id]) {
      this.removeIncomingCall(call.id);
    }
  }

  public removeCall(callId: string): void {
    this.modifyState((draft: CallClientState) => {
      delete draft.calls[this._callIdHistory.latestCallId(callId)];
    });
  }

  public setCallEnded(callId: string, callEndReason: CallEndReason | undefined): void {
    const latestCallId = this._callIdHistory.latestCallId(callId);
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[latestCallId];
      if (call) {
        call.endTime = new Date();
        call.callEndReason = callEndReason;
        delete draft.calls[latestCallId];
        // Performance note: This loop should run only once because the number of entries
        // is never allowed to exceed MAX_CALL_HISTORY_LENGTH. A loop is used for correctness.
        while (Object.keys(draft.callsEnded).length >= MAX_CALL_HISTORY_LENGTH) {
          const oldestCall = findOldestCallEnded(draft.callsEnded);
          if (oldestCall) {
            delete draft.callsEnded[oldestCall];
          }
        }
        draft.callsEnded[latestCallId] = call;
      }
    });
  }

  public setCallState(callId: string, state: CallStatus): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.state = state;
      }
    });
  }

  public setCallId(newCallId: string, oldCallId: string): void {
    this._callIdHistory.updateCallIdHistory(newCallId, oldCallId);
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[oldCallId];
      if (call) {
        call.id = newCallId;
        delete draft.calls[oldCallId];
        draft.calls[newCallId] = call;
      }
      /* @conditional-compile-remove(breakout-rooms) */
      // Update the old origin call id of breakout room calls to the new call id
      Object.values(draft.calls).forEach((call) => {
        if (call.breakoutRooms?.breakoutRoomOriginCallId === oldCallId) {
          call.breakoutRooms?.breakoutRoomOriginCallId === newCallId;
        }
      });
    });
  }

  public setEnvironmentInfo(envInfo: EnvironmentInfo): void {
    this.modifyState((draft: CallClientState) => {
      draft.environmentInfo = envInfo;
    });
  }

  public setCallIsScreenSharingOn(callId: string, isScreenSharingOn: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.isScreenSharingOn = isScreenSharingOn;
      }
    });
  }

  public setCallRemoteParticipants(
    callId: string,
    addRemoteParticipant: RemoteParticipantState[],
    removeRemoteParticipant: string[]
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        removeRemoteParticipant.forEach((id: string) => {
          delete call.remoteParticipants[id];
        });
        addRemoteParticipant.forEach((participant: RemoteParticipantState) => {
          call.remoteParticipants[toFlatCommunicationIdentifier(participant.identifier)] = participant;
        });
      }
    });
  }

  public setCallRemoteParticipantsEnded(
    callId: string,
    addRemoteParticipant: RemoteParticipantState[],
    removeRemoteParticipant: string[]
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        removeRemoteParticipant.forEach((id: string) => {
          delete call.remoteParticipantsEnded[id];
        });
        addRemoteParticipant.forEach((participant: RemoteParticipantState) => {
          call.remoteParticipantsEnded[toFlatCommunicationIdentifier(participant.identifier)] = participant;
        });
      }
    });
  }

  public setCallLocalVideoStream(
    callId: string,
    streamsAdded: LocalVideoStreamState[],
    streamsRemoved: LocalVideoStreamState[]
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        for (const removedStream of streamsRemoved) {
          const index = call.localVideoStreams.findIndex((i) => i.mediaStreamType === removedStream.mediaStreamType);
          if (index > -1) {
            call.localVideoStreams.splice(index, 1);
          }
        }

        for (const addedStream of streamsAdded) {
          const index = call.localVideoStreams.findIndex((i) => i.mediaStreamType === addedStream.mediaStreamType);
          if (index > -1) {
            call.localVideoStreams[index] = addedStream;
          } else {
            call.localVideoStreams.push(addedStream);
          }
        }
      }
    });
  }

  public setCallLocalVideoStreamVideoEffects(callId: string, videoEffects: LocalVideoStreamVideoEffectsState): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const stream = call.localVideoStreams?.find((i) => i.mediaStreamType === 'Video');
        if (stream) {
          stream.videoEffects = videoEffects;
        }
      }
    });
  }

  public setCallIsMicrophoneMuted(callId: string, isMicrophoneMuted: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.isMuted = isMicrophoneMuted;
      }
    });
  }

  public setRole(callId: string, role: ParticipantRole): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.role = role;
      }
    });
  }

  /* @conditional-compile-remove(total-participant-count) */
  public setTotalParticipantCount(callId: string, totalParticipantCount: number): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.totalParticipantCount = totalParticipantCount;
      }
    });
  }

  public setCallDominantSpeakers(callId: string, dominantSpeakers: DominantSpeakersInfo): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.dominantSpeakers = dominantSpeakers;
      }
    });
  }

  public setCallRecordingActive(callId: string, isRecordingActive: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.recording.isRecordingActive = isRecordingActive;
      }
    });
  }

  /* @conditional-compile-remove(local-recording-notification) */
  public setCallRecordingInfos(
    callId: string,
    recordingInfosAdded: RecordingInfo[],
    lastStoppedRecording: RecordingInfo[]
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.recording.activeRecordings = recordingInfosAdded;
        call.recording.lastStoppedRecording = lastStoppedRecording;
      }
    });
  }

  /* @conditional-compile-remove(local-recording-notification) */
  public setCallLocalRecordingActive(callId: string, isRecordingActive: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.localRecording.isLocalRecordingActive = isRecordingActive;
      }
    });
  }

  /* @conditional-compile-remove(local-recording-notification) */
  public setCallLocalRecordingInfos(
    callId: string,
    localRecordingInfosAdded: LocalRecordingInfo[],
    lastStoppedRecording: LocalRecordingInfo[]
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.localRecording.activeLocalRecordings = localRecordingInfosAdded;
        call.localRecording.lastStoppedLocalRecording = lastStoppedRecording;
      }
    });
  }

  public setCallPPTLiveActive(callId: string, isActive: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.pptLive.isActive = isActive;
      }
    });
  }

  public setCallParticipantPPTLive(callId: string, participantKey: string, target: HTMLElement | undefined): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call && participantKey) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          participant.contentSharingStream = target;
          call.contentSharingRemoteParticipant = participantKey;
        }
      }
    });
  }

  /* @conditional-compile-remove(together-mode) */
  public setTogetherModeVideoStreams(
    callId: string,
    addedStreams: CallFeatureStreamState[],
    removedStreams: CallFeatureStreamState[]
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        for (const stream of removedStreams) {
          if (stream.mediaStreamType === 'Video') {
            call.togetherMode.streams.mainVideoStream = undefined;
            call.togetherMode.isActive = false;
            call.togetherMode.seatingPositions = {};
          }
        }

        for (const newStream of addedStreams) {
          // This should only be called by the subscriber and some properties are add by other components so if the
          // stream already exists, only update the values that subscriber knows about.
          const mainVideoStream = call.togetherMode.streams.mainVideoStream;
          if (mainVideoStream && mainVideoStream.id === newStream.id) {
            mainVideoStream.mediaStreamType = newStream.mediaStreamType;
            mainVideoStream.isAvailable = newStream.isAvailable;
            mainVideoStream.isReceiving = newStream.isReceiving;
          } else {
            call.togetherMode.streams.mainVideoStream = newStream;
          }
          call.togetherMode.isActive = true;
        }
      }
    });
  }

  /* @conditional-compile-remove(together-mode) */
  public setTogetherModeVideoStreamIsAvailable(callId: string, streamId: number, isAvailable: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const stream = call.togetherMode.streams.mainVideoStream;
        if (stream && stream?.id === streamId) {
          stream.isAvailable = isAvailable;
        }
      }
    });
  }

  /* @conditional-compile-remove(together-mode) */
  public setTogetherModeVideoStreamIsReceiving(callId: string, streamId: number, isReceiving: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const stream = call.togetherMode.streams.mainVideoStream;
        if (stream && stream?.id === streamId) {
          stream.isReceiving = isReceiving;
        }
      }
    });
  }

  /* @conditional-compile-remove(together-mode) */
  public setTogetherModeVideoStreamSize(
    callId: string,
    streamId: number,
    size: { width: number; height: number }
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const stream = call.togetherMode.streams.mainVideoStream;
        if (stream && stream?.id === streamId) {
          stream.streamSize = size;
        }
      }
    });
  }

  /* @conditional-compile-remove(together-mode) */
  public removeTogetherModeVideoStream(callId: string, removedStream: TogetherModeVideoStream[]): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        for (const stream of removedStream) {
          if (stream.mediaStreamType === 'Video') {
            call.togetherMode.streams.mainVideoStream = undefined;
            call.togetherMode.isActive = false;
          }
        }
      }
    });
  }

  /* @conditional-compile-remove(together-mode) */
  public setTogetherModeSeatingCoordinates(callId: string, seatingMap: TogetherModeSeatingMap): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const seatingPositions: Record<string, TogetherModeSeatingPositionState> = {};
        for (const [userId, seatingPosition] of seatingMap.entries()) {
          seatingPositions[userId] = seatingPosition;
        }
        if (Object.keys(seatingPositions).length > 0) {
          call.togetherMode.seatingPositions = seatingPositions;
        }
      }
    });
  }

  public setCallRaisedHands(callId: string, raisedHands: RaisedHand[]): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.raiseHand.raisedHands = raisedHands.map((raisedHand) => {
          return convertFromSDKToRaisedHandState(raisedHand);
        });
        const raisedHand = raisedHands.find(
          (raisedHand) =>
            toFlatCommunicationIdentifier(raisedHand.identifier) === toFlatCommunicationIdentifier(this._state.userId)
        );
        if (raisedHand) {
          call.raiseHand.localParticipantRaisedHand = convertFromSDKToRaisedHandState(raisedHand);
        } else {
          call.raiseHand.localParticipantRaisedHand = undefined;
        }
      }
    });
  }

  public setParticipantIsRaisedHand(callId: string, participantKey: string, raisedHand: RaisedHand | undefined): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          participant.raisedHand = raisedHand ? convertFromSDKToRaisedHandState(raisedHand) : raisedHand;
        }
      }
    });
  }

  public setReceivedReactionFromParticipant(
    callId: string,
    participantKey: string,
    reactionMessage: ReactionMessage | null
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];

      if (!call) {
        return;
      }

      clearTimeout(this._timeOutId[participantKey]);

      const participant = call.remoteParticipants[participantKey];
      const newReactionState: ReactionState | undefined = reactionMessage
        ? { reactionMessage: reactionMessage, receivedOn: new Date() }
        : undefined;

      if (participantKey === toFlatCommunicationIdentifier(this._state.userId)) {
        call.localParticipantReaction = newReactionState;
      } else if (!participant) {
        // Warn if we can't find the participant in the call but we are trying to set their reaction state to a new reaction.
        if (reactionMessage !== null) {
          console.warn(`Participant ${participantKey} not found in call ${callId}. Cannot set reaction state.`);
        }
      } else {
        participant.reactionState = newReactionState;
      }

      if (reactionMessage) {
        this._timeOutId[participantKey] = setTimeout(() => {
          clearParticipantReactionState(this, callId, participantKey);
        }, REACTION_ANIMATION_TIME_MS);
      }
    });
  }

  public setCallTranscriptionActive(callId: string, isTranscriptionActive: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.transcription.isTranscriptionActive = isTranscriptionActive;
      }
    });
  }

  public setCapabilities(
    callId: string,
    capabilities: ParticipantCapabilities,
    capabilitiesChangeInfo: CapabilitiesChangeInfo
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.capabilitiesFeature = { capabilities, latestCapabilitiesChangeInfo: capabilitiesChangeInfo };
      }
    });
  }

  public setHideAttendeeNames(callId: string, capabilitiesChangeInfo: CapabilitiesChangeInfo): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (capabilitiesChangeInfo.oldValue.viewAttendeeNames !== capabilitiesChangeInfo.newValue.viewAttendeeNames) {
        const viewAttendeeNames = capabilitiesChangeInfo.newValue.viewAttendeeNames;
        if (
          call &&
          viewAttendeeNames &&
          !viewAttendeeNames.isPresent &&
          viewAttendeeNames.reason === 'MeetingRestricted'
        ) {
          call.hideAttendeeNames = true;
        } else if (call) {
          call.hideAttendeeNames = false;
        }
      }
    });
  }

  public setSpotlight(
    callId: string,
    spotlightedParticipants: SpotlightedParticipant[],
    maxParticipantsToSpotlight: number
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.spotlight = { ...call.spotlight, spotlightedParticipants, maxParticipantsToSpotlight };
      }
    });
  }

  public setTeamsMeetingConference(
    callId: string,
    teamsMeetingConferenceDetails: TeamsMeetingAudioConferencingDetails
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.meetingConference = { conferencePhones: convertConferencePhoneInfo(teamsMeetingConferenceDetails) };
      }
    });
  }

  public setParticipantSpotlighted(callId: string, spotlightedParticipant: SpotlightedParticipant): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[toFlatCommunicationIdentifier(spotlightedParticipant.identifier)];
        if (participant) {
          participant.spotlight = { spotlightedOrderPosition: spotlightedParticipant.order };
        } else if (
          call.spotlight &&
          toFlatCommunicationIdentifier(draft.userId) ===
            toFlatCommunicationIdentifier(spotlightedParticipant.identifier)
        ) {
          call.spotlight.localParticipantSpotlight = { spotlightedOrderPosition: spotlightedParticipant.order };
        }
      }
    });
  }

  public setParticipantNotSpotlighted(callId: string, spotlightedParticipant: SpotlightedParticipant): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[toFlatCommunicationIdentifier(spotlightedParticipant.identifier)];
        if (participant) {
          participant.spotlight = undefined;
        } else if (
          call.spotlight &&
          toFlatCommunicationIdentifier(draft.userId) ===
            toFlatCommunicationIdentifier(spotlightedParticipant.identifier)
        ) {
          call.spotlight.localParticipantSpotlight = undefined;
        }
      }
    });
  }

  /* @conditional-compile-remove(breakout-rooms) */
  public setAssignedBreakoutRoom(callId: string, breakoutRoom?: BreakoutRoom): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.breakoutRooms = { ...call.breakoutRooms, assignedBreakoutRoom: breakoutRoom };
      }
    });
  }

  /* @conditional-compile-remove(breakout-rooms) */
  public setBreakoutRoomOriginCallId(callId: string, breakoutRoomCallId: string): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(breakoutRoomCallId)];
      if (call) {
        call.breakoutRooms = { ...call.breakoutRooms, breakoutRoomOriginCallId: callId };
      }
    });
  }

  /* @conditional-compile-remove(breakout-rooms) */
  public setBreakoutRoomSettings(callId: string, breakoutRoomSettings: BreakoutRoomsSettings): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.breakoutRooms = { ...call.breakoutRooms, breakoutRoomSettings: breakoutRoomSettings };
      }
    });
  }

  /* @conditional-compile-remove(breakout-rooms) */
  public setBreakoutRoomDisplayName(callId: string, breakoutRoomDisplayName: string): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.breakoutRooms = { ...call.breakoutRooms, breakoutRoomDisplayName };
      }
    });
  }

  public setCallScreenShareParticipant(callId: string, participantKey: string | undefined): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.screenShareRemoteParticipant = participantKey;
      }
    });
  }

  public setLocalVideoStreamRendererView(
    callId: string,
    localVideoMediaStreamType: string,
    view: VideoStreamRendererViewState | undefined
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const localVideoStream = call.localVideoStreams.find(
          (localVideoStream) => localVideoStream.mediaStreamType === localVideoMediaStreamType
        );
        if (localVideoStream) {
          localVideoStream.view = view;
        }
      }
    });
  }

  /* @conditional-compile-remove(together-mode) */
  public setTogetherModeVideoStreamRendererView(
    callId: string,
    togetherModeStreamType: string,
    view: VideoStreamRendererViewState | undefined
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        if (togetherModeStreamType === 'Video') {
          const togetherModeStream = call.togetherMode.streams.mainVideoStream;
          if (togetherModeStream) {
            togetherModeStream.view = view;
          }
        }
      }
    });
  }

  public setParticipantState(callId: string, participantKey: string, state: RemoteParticipantStatus): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          participant.state = state;
        }
      }
    });
  }

  public setParticipantIsMuted(callId: string, participantKey: string, muted: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          participant.isMuted = muted;
        }
      }
    });
  }

  public setOptimalVideoCount(callId: string, optimalVideoCount: number): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.optimalVideoCount.maxRemoteVideoStreams = optimalVideoCount;
      }
    });
  }

  public setParticipantRole(callId: string, participantKey: string, role: ParticipantRole): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          participant.role = role;
        }
      }
    });
  }

  public setParticipantDisplayName(callId: string, participantKey: string, displayName: string): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          participant.displayName = displayName;
        }
      }
    });
  }

  public setParticipantIsSpeaking(callId: string, participantKey: string, isSpeaking: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          participant.isSpeaking = isSpeaking;
        }
      }
    });
  }

  public setParticipantVideoStream(callId: string, participantKey: string, stream: RemoteVideoStreamState): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          // Set is called by subscriber will not modify any rendered stream so if there is existing stream only
          // modify the values that subscriber has access to.
          const existingStream = participant.videoStreams[stream.id];
          if (existingStream) {
            existingStream.isAvailable = stream.isAvailable;
            existingStream.isReceiving = stream.isReceiving;
            existingStream.mediaStreamType = stream.mediaStreamType;
          } else {
            participant.videoStreams[stream.id] = stream;
          }
        }
      }
    });
  }

  public setRemoteVideoStreamIsAvailable(
    callId: string,
    participantKey: string,
    streamId: number,
    isAvailable: boolean
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          const stream = participant.videoStreams[streamId];
          if (stream) {
            stream.isAvailable = isAvailable;
          }
        }
      }
    });
  }

  public setRemoteVideoStreamIsReceiving(
    callId: string,
    participantKey: string,
    streamId: number,
    isReceiving: boolean
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          const stream = participant.videoStreams[streamId];
          if (stream) {
            stream.isReceiving = isReceiving;
          }
        }
      }
    });
  }

  public setRemoteVideoStreamSize(
    callId: string,
    participantKey: string,
    streamId: number,
    size: { width: number; height: number }
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          const stream = participant.videoStreams[streamId];
          if (stream) {
            stream.streamSize = size;
          }
        }
      }
    });
  }

  public setRemoteVideoStreams(
    callId: string,
    participantKey: string,
    addRemoteVideoStream: RemoteVideoStreamState[],
    removeRemoteVideoStream: number[]
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          for (const id of removeRemoteVideoStream) {
            delete participant.videoStreams[id];
          }

          for (const newStream of addRemoteVideoStream) {
            // This should only be called by the subscriber and some properties are add by other components so if the
            // stream already exists, only update the values that subscriber knows about.
            const stream = participant.videoStreams[newStream.id];
            if (stream) {
              stream.mediaStreamType = newStream.mediaStreamType;
              stream.isAvailable = newStream.isAvailable;
              stream.isReceiving = newStream.isReceiving;
            } else {
              participant.videoStreams[newStream.id] = newStream;
            }
          }
        }
      }
    });
  }

  public setRemoteVideoStreamRendererView(
    callId: string,
    participantKey: string,
    streamId: number,
    view: VideoStreamRendererViewState | undefined
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          const stream = participant.videoStreams[streamId];
          if (stream) {
            stream.view = view;
          }
        }
      }
    });
  }

  public setRemoteVideoStreamViewScalingMode(
    callId: string,
    participantKey: string,
    streamId: number,
    scalingMode: ScalingMode
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const participant = call.remoteParticipants[participantKey];
        if (participant) {
          const stream = participant.videoStreams[streamId];
          if (stream && stream.view) {
            stream.view.scalingMode = scalingMode;
          }
        }
      }
    });
  }

  public setIncomingCall(call: IncomingCallState | TeamsIncomingCallState): void {
    this.modifyState((draft: CallClientState) => {
      const existingCall = draft.incomingCalls[call.id];
      if (existingCall) {
        existingCall.callerInfo = call.callerInfo;
      } else {
        draft.incomingCalls[call.id] = call;
      }
    });
  }

  public removeIncomingCall(callId: string): void {
    this.modifyState((draft: CallClientState) => {
      delete draft.incomingCalls[callId];
    });
  }

  public setIncomingCallEnded(callId: string, callEndReason: CallEndReason | undefined): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.incomingCalls[callId];
      if (call) {
        call.endTime = new Date();
        call.callEndReason = callEndReason;
        delete draft.incomingCalls[callId];
        // Performance note: This loop should run only once because the number of entries
        // is never allowed to exceed MAX_CALL_HISTORY_LENGTH. A loop is used for correctness.
        while (Object.keys(draft.incomingCallsEnded).length >= MAX_CALL_HISTORY_LENGTH) {
          const oldestCall = findOldestCallEnded(draft.incomingCallsEnded);
          if (oldestCall) {
            delete draft.incomingCallsEnded[oldestCall];
          }
        }
        draft.incomingCallsEnded[callId] = call;
      }
    });
  }

  public setDeviceManagerIsSpeakerSelectionAvailable(isSpeakerSelectionAvailable: boolean): void {
    this.modifyState((draft: CallClientState) => {
      draft.deviceManager.isSpeakerSelectionAvailable = isSpeakerSelectionAvailable;
    });
  }

  public setDeviceManagerSelectedMicrophone(selectedMicrophone?: AudioDeviceInfo): void {
    this.modifyState((draft: CallClientState) => {
      draft.deviceManager.selectedMicrophone = selectedMicrophone;
    });
  }

  public setDeviceManagerSelectedSpeaker(selectedSpeaker?: AudioDeviceInfo): void {
    this.modifyState((draft: CallClientState) => {
      draft.deviceManager.selectedSpeaker = selectedSpeaker;
    });
  }

  public setDeviceManagerSelectedCamera(selectedCamera?: VideoDeviceInfo): void {
    this.modifyState((draft: CallClientState) => {
      draft.deviceManager.selectedCamera = selectedCamera;
    });
  }

  public setDeviceManagerCameras(cameras: VideoDeviceInfo[]): void {
    this.modifyState((draft: CallClientState) => {
      /**
       * SDK initializes cameras with one dummy camera with value { id: 'camera:id', name: '', deviceType: 'USBCamera' } immediately after
       * camera permissions are granted. So selectedCamera will have this value before the actual cameras are obtained. Therefore we should reset
       * selectedCamera to the first camera when there are cameras AND when current selectedCamera does not exist in the new array of cameras *
       */
      if (cameras.length > 0 && !cameras.some((camera) => camera.id === draft.deviceManager.selectedCamera?.id)) {
        draft.deviceManager.selectedCamera = cameras[0];
      }
      draft.deviceManager.cameras = cameras;
    });
  }

  public setDeviceManagerMicrophones(microphones: AudioDeviceInfo[]): void {
    this.modifyState((draft: CallClientState) => {
      draft.deviceManager.microphones = microphones;
    });
  }

  public setDeviceManagerSpeakers(speakers: AudioDeviceInfo[]): void {
    this.modifyState((draft: CallClientState) => {
      draft.deviceManager.speakers = speakers;
    });
  }

  public setDeviceManagerDeviceAccess(deviceAccess: DeviceAccess): void {
    this.modifyState((draft: CallClientState) => {
      draft.deviceManager.deviceAccess = deviceAccess;
    });
  }

  public setDeviceManagerUnparentedView(
    localVideoStream: LocalVideoStreamState,
    view: VideoStreamRendererViewState | undefined
  ): void {
    this.modifyState((draft: CallClientState) => {
      draft.deviceManager.unparentedViews.push({
        source: localVideoStream.source,
        mediaStreamType: localVideoStream.mediaStreamType,
        view: view
      });
    });
  }

  public deleteDeviceManagerUnparentedView(localVideoStream: LocalVideoStreamState): void {
    this.modifyState((draft: CallClientState) => {
      const foundIndex = draft.deviceManager.unparentedViews.findIndex(
        (stream) => stream.mediaStreamType === localVideoStream.mediaStreamType
      );
      if (foundIndex !== -1) {
        draft.deviceManager.unparentedViews.splice(foundIndex, 1);
      }
    });
  }

  public setDeviceManagerUnparentedViewVideoEffects(
    localVideoStream: LocalVideoStreamState,
    videoEffects: LocalVideoStreamVideoEffectsState
  ): void {
    this.modifyState((draft: CallClientState) => {
      const view = draft.deviceManager.unparentedViews.find(
        (stream) => stream.mediaStreamType === localVideoStream.mediaStreamType
      );
      if (view) {
        view.videoEffects = videoEffects;
      }
    });
  }

  public getAndIncrementAtomicId(): number {
    const id = this._atomicId;
    this._atomicId++;
    return id;
  }

  private processNewCaption(captions: CaptionsInfo[], newCaption: CaptionsInfo): void {
    // time stamp when new caption comes in
    newCaption.timestamp = new Date();
    // if this is the first caption, push it in
    if (captions.length === 0) {
      captions.push(newCaption);
    }
    // if the last caption is final, then push the new one in
    else if (captions[captions.length - 1]?.resultType === 'Final') {
      captions.push(newCaption);
    }
    // if the last caption is Partial, then check if the speaker is the same as the new caption, if so, update the last caption
    else {
      const lastCaption = captions[captions.length - 1];

      if (
        lastCaption &&
        lastCaption.speaker.identifier &&
        newCaption.speaker.identifier &&
        toFlatCommunicationIdentifier(lastCaption.speaker.identifier) ===
          toFlatCommunicationIdentifier(newCaption.speaker.identifier)
      ) {
        captions[captions.length - 1] = newCaption;
      }
      // if different speaker, ignore the interjector until the current speaker finishes
      // edge case: if we dont receive the final caption from the current speaker for 5 secs, we turn the current speaker caption to final and push in the new interjector
      else if (lastCaption) {
        if (Date.now() - lastCaption.timestamp.getTime() > 5000) {
          lastCaption.resultType = 'Final';
          captions.push(newCaption);
        }
      }
    }

    // If the array length exceeds 50, remove the oldest caption
    if (captions.length > 50) {
      captions.shift();
    }
  }

  public addTeamsCaption(callId: string, caption: TeamsCaptionsInfo): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const currentCaptionLanguage = call.captionsFeature.currentCaptionLanguage;
        if (
          caption.captionLanguage.toUpperCase() === currentCaptionLanguage.toUpperCase() ||
          currentCaptionLanguage === '' ||
          currentCaptionLanguage === undefined
        ) {
          this.processNewCaption(call.captionsFeature.captions, convertFromTeamsSDKToCaptionInfoState(caption));
        }
      }
    });
  }

  public addCaption(callId: string, caption: AcsCaptionsInfo): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        this.processNewCaption(call.captionsFeature.captions, convertFromSDKToCaptionInfoState(caption));
      }
    });
  }

  public setCaptionsKind(callId: string, kind: CaptionsKind): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.captionsKind = kind;
      }
    });
  }

  public clearCaptions(callId: string): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.captions = [];
      }
    });
  }

  setIsCaptionActive(callId: string, isCaptionsActive: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.isCaptionsFeatureActive = isCaptionsActive;
      }
    });
  }

  setStartCaptionsInProgress(callId: string, startCaptionsInProgress: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.startCaptionsInProgress = startCaptionsInProgress;
      }
    });
  }

  setSelectedSpokenLanguage(callId: string, spokenLanguage: string): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.currentSpokenLanguage = spokenLanguage;
      }
    });
  }

  setSelectedCaptionLanguage(callId: string, captionLanguage: string): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.currentCaptionLanguage = captionLanguage;
      }
    });
  }

  setAvailableCaptionLanguages(callId: string, captionLanguages: string[]): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.supportedCaptionLanguages = captionLanguages;
      }
    });
  }

  setAvailableSpokenLanguages(callId: string, spokenLanguages: string[]): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.supportedSpokenLanguages = spokenLanguages;
      }
    });
  }

  setAcceptedTransfer(callId: string, acceptedTransfer: AcceptedTransfer): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.transfer.acceptedTransfers[acceptedTransfer.callId] = acceptedTransfer;
      }
    });
  }

  /**
   * Tees any errors encountered in an async function to the state.
   *
   * @param action Async function to execute.
   * @param target The error target to tee error to.
   * @returns Result of calling `f`. Also re-raises any exceptions thrown from `f`.
   * @throws CallError. Exceptions thrown from `f` are tagged with the failed `target.
   */
  public withAsyncErrorTeedToState<Args extends unknown[], R>(
    action: (...args: Args) => Promise<R>,
    target: CallErrorTarget
  ): (...args: Args) => Promise<R> {
    return async (...args: Args): Promise<R> => {
      try {
        return await action(...args);
      } catch (error) {
        const callError = toCallError(target, error);
        this.setLatestError(target, callError);
        throw callError;
      }
    };
  }

  /**
   * Tees any errors encountered in an function to the state.
   *
   * @param action Function to execute.
   * @param target The error target to tee error to.
   * @returns Result of calling `f`. Also re-raises any exceptions thrown from `f`.
   * @throws CallError. Exceptions thrown from `f` are tagged with the failed `target.
   */
  public withErrorTeedToState<Args extends unknown[], R>(
    action: (...args: Args) => R,
    target: CallErrorTarget
  ): (...args: Args) => R {
    return (...args: Args): R => {
      try {
        callingStatefulLogger.info(`Calling stateful client target function called: ${target}`);
        return action(...args);
      } catch (error) {
        const callError = toCallError(target, error);
        this.setLatestError(target, callError);
        throw callError;
      }
    };
  }

  /**
   * Tees direct errors to state.
   * @remarks
   * This is typically used for errors that are caught and intended to be shown to the user.
   *
   * @param error The raw error to report.
   * @param target The error target to tee error to.
   *
   * @private
   */
  public teeErrorToState = (error: Error, target: CallErrorTarget): void => {
    const callError = toCallError(target, error);
    this.setLatestError(target, callError);
  };

  private setLatestError(target: CallErrorTarget, error: CallError): void {
    this.modifyState((draft: CallClientState) => {
      draft.latestErrors[target] = error;
    });
  }

  /* @conditional-compile-remove(breakout-rooms) */
  public setLatestNotification(callId: string, notification: CallNotification): void {
    this._latestCallIdsThatPushedNotifications[notification.target] = callId;
    this.modifyState((draft: CallClientState) => {
      draft.latestNotifications[notification.target] = notification;
    });
  }

  /* @conditional-compile-remove(breakout-rooms) */
  public deleteLatestNotification(callId: string, notificationTarget: NotificationTarget): void {
    let callIdToPushLatestNotification = this._latestCallIdsThatPushedNotifications[notificationTarget];
    callIdToPushLatestNotification = callIdToPushLatestNotification
      ? this._callIdHistory.latestCallId(callIdToPushLatestNotification)
      : undefined;
    // Only delete the notification if the call that pushed the notification is the same as the call that is trying
    // to delete it.
    if (callIdToPushLatestNotification !== callId) {
      return;
    }

    this.modifyState((draft: CallClientState) => {
      delete draft.latestNotifications[notificationTarget];
    });
  }

  /* @conditional-compile-remove(media-access) */
  public setMediaAccesses(callId: string, mediaAccesses: MediaAccess[]): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (!call) {
        return;
      }

      mediaAccesses.forEach((participantMediaAccess) => {
        const participant = call.remoteParticipants[toFlatCommunicationIdentifier(participantMediaAccess.participant)];
        if (participant) {
          participant.mediaAccess = {
            isAudioPermitted: participantMediaAccess.isAudioPermitted,
            isVideoPermitted: participantMediaAccess.isVideoPermitted
          };
        }
      });
    });
  }

  /* @conditional-compile-remove(media-access) */
  public setMeetingMediaAccess(callId: string, meetingMediaAccess: MeetingMediaAccess): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (!call) {
        return;
      }

      if (meetingMediaAccess) {
        call.mediaAccess = {
          isAudioPermitted: meetingMediaAccess.isAudioPermitted,
          isVideoPermitted: meetingMediaAccess.isVideoPermitted
        };
      }
    });
  }
}

const toCallError = (target: CallErrorTarget, error: unknown): CallError => {
  if (error instanceof Error) {
    return new CallError(target, error);
  }
  return new CallError(target, new Error(error as string));
};

const findOldestCallEnded = (calls: { [key: string]: { endTime?: Date } }): string | undefined => {
  const callEntries = Object.entries(calls);
  const firstCallEntry = callEntries[0];

  if (!firstCallEntry) {
    return undefined; // no calls exist
  }

  let [oldestCallId, oldestCall] = firstCallEntry;
  if (oldestCall.endTime === undefined) {
    return oldestCallId;
  }

  for (const [callId, call] of callEntries.slice(1)) {
    if (call.endTime === undefined) {
      return callId;
    }
    if ((call.endTime?.getTime() ?? 0) < (oldestCall.endTime?.getTime() ?? 0)) {
      [oldestCallId, oldestCall] = [callId, call];
    }
  }
  return oldestCallId;
};

function clearParticipantReactionState(callContext: CallContext, callId: string, participantKey: string): void {
  callContext.setReceivedReactionFromParticipant(callId, participantKey, null);
}
