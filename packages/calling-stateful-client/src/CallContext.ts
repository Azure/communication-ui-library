// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AudioDeviceInfo,
  DeviceAccess,
  TransferErrorCode,
  TransferState,
  VideoDeviceInfo
} from '@azure/communication-calling';
import EventEmitter from 'events';
import { enableMapSet, produce } from 'immer';
import { CallEndReason, CallState, RemoteParticipantState } from '@azure/communication-calling';
import { toFlatCommunicationIdentifier } from 'acs-ui-common';
import {
  Call,
  CallClientState,
  LocalVideoStream,
  RemoteParticipant,
  RemoteVideoStream,
  IncomingCall,
  VideoStreamRendererView,
  CallAgentState,
  TransferRequest,
  Transfer
} from './CallClientState';

enableMapSet();

// TODO: How can we make this configurable?
export const MAX_CALL_HISTORY_LENGTH = 10;
export const MAX_TRANSFER_REQUEST_LENGTH = 10;

export class CallContext {
  private _state: CallClientState;
  private _emitter: EventEmitter;
  private _atomicId: number;

  constructor(userId: string) {
    this._state = {
      calls: new Map<string, Call>(),
      callsEnded: [],
      incomingCalls: new Map<string, IncomingCall>(),
      incomingCallsEnded: [],
      deviceManager: {
        isSpeakerSelectionAvailable: false,
        cameras: [],
        microphones: [],
        speakers: [],
        unparentedViews: []
      },
      callAgent: undefined,
      userId: userId
    };
    this._emitter = new EventEmitter();
    this._atomicId = 0;
  }

  public setState(state: CallClientState): void {
    this._state = state;
    this._emitter.emit('stateChanged', this._state);
  }

  public getState(): CallClientState {
    return this._state;
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
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.calls.clear();
        draft.incomingCalls.clear();
        draft.callsEnded.splice(0, draft.callsEnded.length);
        draft.incomingCallsEnded.splice(0, draft.incomingCallsEnded.length);
      })
    );
  }

  public setCallAgent(callAgent: CallAgentState): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.callAgent = callAgent;
      })
    );
  }

  public setCall(call: Call): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const existingCall = draft.calls.get(call.id);
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
          // We don't update the startTime and endTime if we are updating an existing active call
        } else {
          draft.calls.set(call.id, call);
        }
      })
    );
  }

  public removeCall(callId: string): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.calls.delete(callId);
      })
    );
  }

  public setCallEnded(callId: string, callEndReason: CallEndReason | undefined): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          call.endTime = new Date();
          call.callEndReason = callEndReason;
          draft.calls.delete(callId);
          if (draft.callsEnded.length >= MAX_CALL_HISTORY_LENGTH) {
            draft.callsEnded.shift();
          }
          draft.callsEnded.push(call);
        }
      })
    );
  }

  public setCallState(callId: string, state: CallState): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          call.state = state;
        }
      })
    );
  }

  public setCallId(newCallId: string, oldCallId: string): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(oldCallId);
        if (call) {
          draft.calls.delete(oldCallId);
          draft.calls.set(newCallId, call);
        }
      })
    );
  }

  public setCallIsScreenSharingOn(callId: string, isScreenSharingOn: boolean): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          call.isScreenSharingOn = isScreenSharingOn;
        }
      })
    );
  }

  public setCallRemoteParticipants(
    callId: string,
    addRemoteParticipant: RemoteParticipant[],
    removeRemoteParticipant: string[]
  ): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          removeRemoteParticipant.forEach((id: string) => {
            call.remoteParticipants.delete(id);
          });
          addRemoteParticipant.forEach((participant: RemoteParticipant) => {
            call.remoteParticipants.set(toFlatCommunicationIdentifier(participant.identifier), participant);
          });
        }
      })
    );
  }

  public setCallRemoteParticipantsEnded(
    callId: string,
    addRemoteParticipant: RemoteParticipant[],
    removeRemoteParticipant: string[]
  ): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          removeRemoteParticipant.forEach((id: string) => {
            call.remoteParticipantsEnded.delete(id);
          });
          addRemoteParticipant.forEach((participant: RemoteParticipant) => {
            call.remoteParticipantsEnded.set(toFlatCommunicationIdentifier(participant.identifier), participant);
          });
        }
      })
    );
  }

  public setCallLocalVideoStream(callId: string, streams: LocalVideoStream[]): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          call.localVideoStreams = streams;
        }
      })
    );
  }

  public setCallIsMicrophoneMuted(callId: string, isMicrophoneMuted: boolean): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          call.isMuted = isMicrophoneMuted;
        }
      })
    );
  }

  public setCallRecordingActive(callId: string, isRecordingActive: boolean): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          call.recording.isRecordingActive = isRecordingActive;
        }
      })
    );
  }

  public setCallTranscriptionActive(callId: string, isTranscriptionActive: boolean): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          call.transcription.isTranscriptionActive = isTranscriptionActive;
        }
      })
    );
  }

  public setCallReceivedTransferRequest(callId: string, transfer: TransferRequest): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          if (call.transfer.receivedTransferRequests.length >= MAX_TRANSFER_REQUEST_LENGTH) {
            call.transfer.receivedTransferRequests.shift();
          }
          call.transfer.receivedTransferRequests.push(transfer);
        }
      })
    );
  }

  public setCallRequestedTransfer(callId: string, transfer: Transfer): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          if (call.transfer.requestedTransfers.length >= MAX_TRANSFER_REQUEST_LENGTH) {
            call.transfer.requestedTransfers.shift();
          }
          call.transfer.requestedTransfers.push(transfer);
        }
      })
    );
  }

  public setCallRequestedTransferState(
    callId: string,
    transferId: number,
    state: TransferState,
    error?: TransferErrorCode
  ): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          for (const requestedTransfer of call.transfer.requestedTransfers) {
            if (requestedTransfer.id === transferId) {
              requestedTransfer.state = state;
              requestedTransfer.error = error;
              break;
            }
          }
        }
      })
    );
  }

  public setCallScreenShareParticipant(callId: string, participantKey: string | undefined): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          call.screenShareRemoteParticipant = participantKey;
        }
      })
    );
  }

  public setLocalVideoStreamRendererView(callId: string, view: VideoStreamRendererView | undefined): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          if (call.localVideoStreams.length > 0) {
            call.localVideoStreams[0].videoStreamRendererView = view;
          }
        }
      })
    );
  }

  public setParticipantState(callId: string, participantKey: string, state: RemoteParticipantState): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          const participant = call.remoteParticipants.get(participantKey);
          if (participant) {
            participant.state = state;
          }
        }
      })
    );
  }

  public setParticipantIsMuted(callId: string, participantKey: string, muted: boolean): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          const participant = call.remoteParticipants.get(participantKey);
          if (participant) {
            participant.isMuted = muted;
          }
        }
      })
    );
  }

  public setParticipantDisplayName(callId: string, participantKey: string, displayName: string): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          const participant = call.remoteParticipants.get(participantKey);
          if (participant) {
            participant.displayName = displayName;
          }
        }
      })
    );
  }

  public setParticipantIsSpeaking(callId: string, participantKey: string, isSpeaking: boolean): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          const participant = call.remoteParticipants.get(participantKey);
          if (participant) {
            participant.isSpeaking = isSpeaking;
          }
        }
      })
    );
  }

  public setParticipantVideoStream(callId: string, participantKey: string, stream: RemoteVideoStream): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          const participant = call.remoteParticipants.get(participantKey);
          if (participant) {
            // Set is called by subscriber will not modify any rendered stream so if there is existing stream only
            // modify the values that subscriber has access to.
            const existingStream = participant.videoStreams.get(stream.id);
            if (existingStream) {
              existingStream.isAvailable = stream.isAvailable;
              existingStream.mediaStreamType = stream.mediaStreamType;
            } else {
              participant.videoStreams.set(stream.id, stream);
            }
          }
        }
      })
    );
  }

  public setRemoteVideoStreamIsAvailable(
    callId: string,
    participantKey: string,
    streamId: number,
    isAvailable: boolean
  ): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          const participant = call.remoteParticipants.get(participantKey);
          if (participant) {
            const stream = participant.videoStreams.get(streamId);
            if (stream) {
              stream.isAvailable = isAvailable;
            }
          }
        }
      })
    );
  }

  public setRemoteVideoStreams(
    callId: string,
    participantKey: string,
    addRemoteVideoStream: RemoteVideoStream[],
    removeRemoteVideoStream: number[]
  ): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          const participant = call.remoteParticipants.get(participantKey);
          if (participant) {
            for (const id of removeRemoteVideoStream) {
              participant.videoStreams.delete(id);
            }

            for (const newStream of addRemoteVideoStream) {
              // This should only be called by the subscriber and some properties are add by other components so if the
              // stream already exists, only update the values that subscriber knows about.
              const stream = participant.videoStreams.get(newStream.id);
              if (stream) {
                stream.mediaStreamType = newStream.mediaStreamType;
                stream.isAvailable = newStream.isAvailable;
              } else {
                participant.videoStreams.set(newStream.id, newStream);
              }
            }
          }
        }
      })
    );
  }

  public setRemoteVideoStreamRendererView(
    callId: string,
    participantKey: string,
    streamId: number,
    view: VideoStreamRendererView | undefined
  ): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          const participant = call.remoteParticipants.get(participantKey);
          if (participant) {
            const stream = participant.videoStreams.get(streamId);
            if (stream) {
              stream.videoStreamRendererView = view;
            }
          }
        }
      })
    );
  }

  public setIncomingCall(call: IncomingCall): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const existingCall = draft.incomingCalls.get(call.id);
        if (existingCall) {
          existingCall.callerInfo = call.callerInfo;
        } else {
          draft.incomingCalls.set(call.id, call);
        }
      })
    );
  }

  public removeIncomingCall(callId: string): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.incomingCalls.delete(callId);
      })
    );
  }

  public setIncomingCallEnded(callId: string, callEndReason: CallEndReason | undefined): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.incomingCalls.get(callId);
        if (call) {
          call.endTime = new Date();
          call.callEndReason = callEndReason;
          draft.incomingCalls.delete(callId);
          if (draft.incomingCallsEnded.length >= MAX_CALL_HISTORY_LENGTH) {
            draft.incomingCallsEnded.shift();
          }
          draft.incomingCallsEnded.push(call);
        }
      })
    );
  }

  public setDeviceManagerIsSpeakerSelectionAvailable(isSpeakerSelectionAvailable: boolean): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManager.isSpeakerSelectionAvailable = isSpeakerSelectionAvailable;
      })
    );
  }

  public setDeviceManagerSelectedMicrophone(selectedMicrophone?: AudioDeviceInfo): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManager.selectedMicrophone = selectedMicrophone;
      })
    );
  }

  public setDeviceManagerSelectedSpeaker(selectedSpeaker?: AudioDeviceInfo): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManager.selectedSpeaker = selectedSpeaker;
      })
    );
  }

  public setDeviceManagerSelectedCamera(selectedCamera?: VideoDeviceInfo): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManager.selectedCamera = selectedCamera;
      })
    );
  }

  public setDeviceManagerCameras(cameras: VideoDeviceInfo[]): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        if (!!draft.deviceManager.cameras && cameras.length > 0) {
          draft.deviceManager.selectedCamera = cameras[0];
        }
        draft.deviceManager.cameras = cameras;
      })
    );
  }

  public setDeviceManagerMicrophones(microphones: AudioDeviceInfo[]): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManager.microphones = microphones;
      })
    );
  }

  public setDeviceManagerSpeakers(speakers: AudioDeviceInfo[]): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManager.speakers = speakers;
      })
    );
  }

  public setDeviceManagerDeviceAccess(deviceAccess: DeviceAccess): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManager.deviceAccess = deviceAccess;
      })
    );
  }

  public setDeviceManagerUnparentedView(view: VideoStreamRendererView): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManager.unparentedViews.push(view);
      })
    );
  }

  public removeDeviceManagerUnparentedView(index: number): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManager.unparentedViews.splice(index, 1);
      })
    );
  }

  public getAndIncrementAtomicId(): number {
    const id = this._atomicId;
    this._atomicId++;
    return id;
  }
}
