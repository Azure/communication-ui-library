// © Microsoft Corporation. All rights reserved.
import { AudioDeviceInfo, DeviceAccess, VideoDeviceInfo } from '@azure/communication-calling';
import EventEmitter from 'events';
import { enableMapSet, produce } from 'immer';
import { CallClientState } from './CallClientState';

enableMapSet();

export class CallContext {
  private _state: CallClientState = {
    calls: [],
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
