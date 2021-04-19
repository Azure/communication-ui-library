// © Microsoft Corporation. All rights reserved.
import { AudioDeviceInfo, DeviceAccess, VideoDeviceInfo } from '@azure/communication-calling';
import EventEmitter from 'events';
import { enableMapSet, produce } from 'immer';
import { CallEndReason, CallState, RemoteParticipantState } from '@azure/communication-calling';
import {
  Call,
  CallClientState,
  LocalVideoStream,
  RemoteParticipant,
  RemoteVideoStream,
  IncomingCall
} from './CallClientState';
import { getRemoteParticipantKey } from './Converter';

enableMapSet();

// TODO: How can we make this configurable?
export const MAX_CALL_HISTORY_LENGTH = 10;

export class CallContext {
  private _state: CallClientState = {
    calls: new Map<string, Call>(),
    callsEnded: [],
    incomingCalls: new Map<string, IncomingCall>(),
    incomingCallsEnded: [],
    deviceManagerState: {
      isSpeakerSelectionAvailable: false,
      cameras: [],
      microphones: [],
      speakers: []
    }
  };
  private _emitter: EventEmitter = new EventEmitter();

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
            call.remoteParticipants.set(getRemoteParticipantKey(participant.identifier), participant);
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
            call.remoteParticipantsEnded.set(getRemoteParticipantKey(participant.identifier), participant);
          });
        }
      })
    );
  }

  public setCallLocalVideoStreams(callId: string, streams: LocalVideoStream[]): void {
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

  public setParticipantVideoStreams(callId: string, participantKey: string, streams: RemoteVideoStream[]): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.calls.get(callId);
        if (call) {
          const participant = call.remoteParticipants.get(participantKey);
          if (participant) {
            participant.videoStreams = streams;
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
        draft.deviceManagerState.isSpeakerSelectionAvailable = isSpeakerSelectionAvailable;
      })
    );
  }

  public setDeviceManagerSelectedMicrophone(selectedMicrophone?: AudioDeviceInfo): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManagerState.selectedMicrophone = selectedMicrophone;
      })
    );
  }

  public setDeviceManagerSelectedSpeaker(selectedSpeaker?: AudioDeviceInfo): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManagerState.selectedSpeaker = selectedSpeaker;
      })
    );
  }

  public setDeviceManagerCameras(cameras: VideoDeviceInfo[]): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManagerState.cameras = cameras;
      })
    );
  }

  public setDeviceManagerMicrophones(microphones: AudioDeviceInfo[]): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManagerState.microphones = microphones;
      })
    );
  }

  public setDeviceManagerSpeakers(speakers: AudioDeviceInfo[]): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManagerState.speakers = speakers;
      })
    );
  }

  public setDeviceManagerDeviceAccess(deviceAccess: DeviceAccess): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.deviceManagerState.deviceAccess = deviceAccess;
      })
    );
  }
}
