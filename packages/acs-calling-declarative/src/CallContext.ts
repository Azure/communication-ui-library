// © Microsoft Corporation. All rights reserved.
import { CallEndReason, CallState, RemoteParticipantState } from '@azure/communication-calling';
import EventEmitter from 'events';
import produce, { enableMapSet } from 'immer';
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

export class CallContext {
  private _state: CallClientState = {
    calls: new Map<string, Call>(),
    incomingCalls: new Map<string, IncomingCall>()
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

  public setCall(call: Call): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const existingCall = draft.calls.get(call.id);
        if (existingCall) {
          existingCall.callerInfo = call.callerInfo;
          existingCall.state = call.state;
          existingCall.callEndReason = call.callEndReason;
          existingCall.direction = call.direction;
          existingCall.isMicrophoneMuted = call.isMicrophoneMuted;
          existingCall.isScreenSharingOn = call.isScreenSharingOn;
          existingCall.localVideoStreams = call.localVideoStreams;
          existingCall.remoteParticipants = call.remoteParticipants;
        } else {
          draft.calls.set(call.id, call);
        }
      })
    );
  }

  public removeCall(id: string): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        draft.calls.delete(id);
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

  public setIncomingCallEnded(callId: string, callEndReason: CallEndReason): void {
    this.setState(
      produce(this._state, (draft: CallClientState) => {
        const call = draft.incomingCalls.get(callId);
        if (call) {
          call.callEndReason = callEndReason;
          call.callEnded = true;
        }
      })
    );
  }
}
