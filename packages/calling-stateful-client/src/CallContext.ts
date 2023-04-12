// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationIdentifierKind } from '@azure/communication-common';
import {
  AudioDeviceInfo,
  DeviceAccess,
  DominantSpeakersInfo,
  ScalingMode,
  VideoDeviceInfo
} from '@azure/communication-calling';
/* @conditional-compile-remove(close-captions) */
import { TeamsCaptionsInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
/* @conditional-compile-remove(rooms) */
import { ParticipantRole } from '@azure/communication-calling';
import { AzureLogger, createClientLogger, getLogLevel } from '@azure/logger';
import EventEmitter from 'events';
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
/* @conditional-compile-remove(close-captions) */
import { CaptionsInfo } from './CallClientState';
import { callingStatefulLogger } from './Logger';
import { CallIdHistory } from './CallIdHistory';
/* @conditional-compile-remove(video-background-effects) */
import { LocalVideoStreamVideoEffectsState } from './CallClientState';
/* @conditional-compile-remove(close-captions) */
import { convertFromSDKToCaptionInfoState } from './Converter';

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
export class CallContext {
  private _logger: AzureLogger;
  private _state: CallClientState;
  private _emitter: EventEmitter;
  private _atomicId: number;
  private _callIdHistory: CallIdHistory = new CallIdHistory();

  constructor(
    userId: CommunicationIdentifierKind,
    maxListeners = 50,
    /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId?: string
  ) {
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
      /* @conditional-compile-remove(unsupported-browser) */ environmentInfo: undefined,
      /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId: alternateCallerId,
      latestErrors: {} as CallErrors
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
        existingCall.recording.isRecordingActive = call.recording.isRecordingActive;
        /* @conditional-compile-remove(rooms) */
        existingCall.role = call.role;
        /* @conditional-compile-remove(total-participant-count) */
        existingCall.totalParticipantCount = call.totalParticipantCount;
        // We don't update the startTime and endTime if we are updating an existing active call
        existingCall.captionsFeature.currentSpokenLanguage = call.captionsFeature.currentSpokenLanguage;
        existingCall.captionsFeature.currentCaptionLanguage = call.captionsFeature.currentCaptionLanguage;
      } else {
        draft.calls[latestCallId] = call;
      }
    });
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
          delete draft.callsEnded[findOldestCallEnded(draft.callsEnded)];
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
    });
  }

  /* @conditional-compile-remove(unsupported-browser) */
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

  public setCallLocalVideoStream(callId: string, streams: LocalVideoStreamState[]): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.localVideoStreams = streams;
      }
    });
  }

  /* @conditional-compile-remove(video-background-effects) */
  public setCallLocalVideoStreamVideoEffects(
    callId: string,
    videoEffects: Partial<LocalVideoStreamVideoEffectsState>
  ): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        const stream = call.localVideoStreams?.find((i) => i.mediaStreamType === 'Video');
        if (stream) {
          stream.videoEffects = {
            isActive: videoEffects.isActive ?? stream.videoEffects?.isActive ?? false,
            effectName: videoEffects.effectName ?? stream.videoEffects?.effectName
          };
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

  /* @conditional-compile-remove(rooms) */
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

  public setCallTranscriptionActive(callId: string, isTranscriptionActive: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.transcription.isTranscriptionActive = isTranscriptionActive;
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

  public setLocalVideoStreamRendererView(callId: string, view: VideoStreamRendererViewState | undefined): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        if (call.localVideoStreams.length > 0) {
          call.localVideoStreams[0].view = view;
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

  /* @conditional-compile-remove(rooms) */
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
            /* @conditional-compile-remove(video-stream-is-receiving-flag) */
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

  /* @conditional-compile-remove(video-stream-is-receiving-flag) */
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
              /* @conditional-compile-remove(video-stream-is-receiving-flag) */
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

  public setIncomingCall(call: IncomingCallState): void {
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
          delete draft.incomingCallsEnded[findOldestCallEnded(draft.incomingCallsEnded)];
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
        (stream) =>
          stream.source.id === localVideoStream.source.id && stream.mediaStreamType === localVideoStream.mediaStreamType
      );
      if (foundIndex !== -1) {
        draft.deviceManager.unparentedViews.splice(foundIndex, 1);
      }
    });
  }

  /* @conditional-compile-remove(video-background-effects) */
  public setDeviceManagerUnparentedViewVideoEffects(
    localVideoStream: LocalVideoStreamState,
    videoEffects: LocalVideoStreamVideoEffectsState
  ): void {
    this.modifyState((draft: CallClientState) => {
      const foundIndex = draft.deviceManager.unparentedViews.findIndex(
        (stream) =>
          stream.source.id === localVideoStream.source.id && stream.mediaStreamType === localVideoStream.mediaStreamType
      );
      if (foundIndex !== -1) {
        const draftStream = draft.deviceManager.unparentedViews[foundIndex];
        draftStream.videoEffects = {
          isActive: videoEffects.isActive ?? draftStream.videoEffects?.isActive ?? false,
          effectName: videoEffects.effectName ?? draftStream.videoEffects?.effectName
        };
      }
    });
  }

  public getAndIncrementAtomicId(): number {
    const id = this._atomicId;
    this._atomicId++;
    return id;
  }
  /* @conditional-compile-remove(close-captions) */
  private processNewCaption(captions: CaptionsInfo[], newCaption: CaptionsInfo): void {
    // going through current captions to find the last caption said by the same speaker, remove that caption if it's partial and replace with the new caption
    for (let index = captions.length - 1; index >= 0; index--) {
      const currentCaption = captions[index];
      if (
        currentCaption &&
        currentCaption.resultType !== 'Final' &&
        currentCaption.speaker.identifier &&
        newCaption.speaker.identifier &&
        toFlatCommunicationIdentifier(currentCaption.speaker.identifier) ===
          toFlatCommunicationIdentifier(newCaption.speaker.identifier)
      ) {
        captions.splice(index, 1);
        break;
      }
    }

    captions.push(newCaption);

    // If the array length exceeds 50, remove the oldest caption
    if (captions.length > 50) {
      captions.shift();
    }
  }
  /* @conditional-compile-remove(close-captions) */
  public addCaption(callId: string, caption: TeamsCaptionsInfo): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        this.processNewCaption(call.captionsFeature.captions, convertFromSDKToCaptionInfoState(caption));
      }
    });
  }
  /* @conditional-compile-remove(close-captions) */
  setIsCaptionActive(callId: string, isCaptionsActive: boolean): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.isCaptionsFeatureActive = isCaptionsActive;
      }
    });
  }
  /* @conditional-compile-remove(close-captions) */
  setSelectedSpokenLanguage(callId: string, spokenLanguage: string): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.currentSpokenLanguage = spokenLanguage;
      }
    });
  }
  /* @conditional-compile-remove(close-captions) */
  setSelectedCaptionLanguage(callId: string, captionLanguage: string): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.currentCaptionLanguage = captionLanguage;
      }
    });
  }
  /* @conditional-compile-remove(close-captions) */
  setAvailableCaptionLanguages(callId: string, captionLanguages: string[]): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.supportedCaptionLanguages = captionLanguages;
      }
    });
  }
  /* @conditional-compile-remove(close-captions) */
  setAvailableSpokenLanguages(callId: string, spokenLanguages: string[]): void {
    this.modifyState((draft: CallClientState) => {
      const call = draft.calls[this._callIdHistory.latestCallId(callId)];
      if (call) {
        call.captionsFeature.supportedSpokenLanguages = spokenLanguages;
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
}

const toCallError = (target: CallErrorTarget, error: unknown): CallError => {
  if (error instanceof Error) {
    return new CallError(target, error);
  }
  return new CallError(target, new Error(error as string));
};

const findOldestCallEnded = (calls: { [key: string]: { endTime?: Date } }): string => {
  const callEntries = Object.entries(calls);
  let [oldestCallId, oldestCall] = callEntries[0];
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
