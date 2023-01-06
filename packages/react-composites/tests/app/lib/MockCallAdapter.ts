// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { AudioDeviceInfo, Call, EnvironmentInfo, VideoDeviceInfo } from '@azure/communication-calling';
import type { CallAdapter, CallAdapterState } from '../../../src';
import type { MockCallAdapterState } from '../../common';
import { produce } from 'immer';
import EventEmitter from 'events';

/**
 * Mock class that implements CallAdapter interface for UI snapshot tests. The handler implementation is currently limited so
 * some composite behaviour will not work like clicking the 'Start Call' button in the Configuration page. The usage of
 * MockCallAdapter is intended to take snapshot based only on the state of a CallAdapter.
 */
export class MockCallAdapter implements CallAdapter {
  private _emitter: EventEmitter;
  private _state: CallAdapterState;

  /**
   * `testState` is deprecated. Use `initialState` instead.
   */
  constructor(initialState?: MockCallAdapterState) {
    if (!initialState) {
      throw new Error('`initialState` must be set');
    }
    this._state = populateViewTargets(initialState);
    this._emitter = new EventEmitter();
  }

  addParticipant(): Promise<void> {
    throw Error('addParticipant not implemented');
  }
  onStateChange(handler: (state: CallAdapterState) => void): void {
    this._emitter.on('stateChanged', handler);
  }
  offStateChange(handler: (state: CallAdapterState) => void): void {
    this._emitter.off('stateChanged', handler);
  }
  getState(): CallAdapterState {
    return this._state;
  }
  allowUnsupportedBrowserVersion(): void {
    throw Error('allowWithUnsupportedBrowserVersion not implemented');
  }
  dispose(): void {
    throw Error('dispose not implemented');
  }
  joinCall(): Call | undefined {
    throw Error('joinCall not implemented');
  }
  leaveCall(): Promise<void> {
    throw Error('leaveCall not implemented');
  }
  startCamera(): Promise<void> {
    throw Error('leaveCall not implemented');
  }
  stopCamera(): Promise<void> {
    throw Error('stopCamera not implemented');
  }
  mute(): Promise<void> {
    throw Error('mute not implemented');
  }
  unmute(): Promise<void> {
    throw Error('unmute not implemented');
  }
  startCall(): Call | undefined {
    throw Error('startCall not implemented');
  }
  startScreenShare(): Promise<void> {
    throw Error('startScreenShare not implemented');
  }
  stopScreenShare(): Promise<void> {
    throw Error('stopScreenShare not implemented');
  }
  removeParticipant(): Promise<void> {
    throw Error('removeParticipant not implemented');
  }
  createStreamView(): Promise<void> {
    throw Error('createStreamView not implemented');
  }
  disposeStreamView(): Promise<void> {
    throw Error('disposeStreamView not implemented');
  }
  askDevicePermission(): Promise<void> {
    return Promise.resolve();
  }
  async queryCameras(): Promise<VideoDeviceInfo[]> {
    return [];
  }
  async queryMicrophones(): Promise<AudioDeviceInfo[]> {
    return [];
  }
  async querySpeakers(): Promise<AudioDeviceInfo[]> {
    return [];
  }
  holdCall(): Promise<void> {
    throw Error('holdCall not implemented');
  }
  resumeCall(): Promise<void> {
    throw Error('resumeCall not implemented');
  }
  sendDtmfTone(): Promise<void> {
    throw Error('sendDtmfTone not implemented');
  }
  getEnvironmentInfo(): Promise<EnvironmentInfo> {
    throw Error('getEnvironmentInfo not implemented');
  }
  async setCamera(sourceInfo: VideoDeviceInfo): Promise<void> {
    this.modifyState((draft: CallAdapterState) => {
      draft.devices.selectedCamera = findDevice(this._state.devices.cameras, sourceInfo);
    });
  }
  async setMicrophone(sourceInfo: AudioDeviceInfo): Promise<void> {
    this.modifyState((draft: CallAdapterState) => {
      draft.devices.selectedMicrophone = findDevice(this._state.devices.microphones, sourceInfo);
    });
  }
  async setSpeaker(sourceInfo: AudioDeviceInfo): Promise<void> {
    this.modifyState((draft: CallAdapterState) => {
      draft.devices.selectedSpeaker = findDevice(this._state.devices.speakers, sourceInfo);
    });
  }
  on(): void {
    throw Error('on not implemented');
  }
  off(): void {
    throw Error('off not implemented');
  }

  private modifyState(modifier: (draft: CallAdapterState) => void): void {
    const prior = this._state;
    this._state = produce(this._state, modifier);
    if (this._state !== prior) {
      this._emitter.emit('stateChanged', this._state);
    }
  }
}

function populateViewTargets(state: MockCallAdapterState): CallAdapterState {
  const call = state.call;
  if (!call) {
    return state;
  }
  call.localVideoStreams.forEach((s) => {
    if (s.dummyView) {
      s.view = {
        ...s.dummyView,
        // Set some name to get a non-black color for the mock video.
        target: createMockHTMLElement('local')
      };
    }
  });
  for (const p of Object.values(call.remoteParticipants)) {
    for (const s of Object.values(p.videoStreams)) {
      if (s.dummyView) {
        s.view = {
          ...s.dummyView,
          target: createMockHTMLElement(p.displayName, 100, 100)
        };
      }
    }
  }
  for (const p of Object.values(call.remoteParticipantsEnded)) {
    for (const s of Object.values(p.videoStreams)) {
      if (s.dummyView) {
        s.view = {
          ...s.dummyView,
          target: createMockHTMLElement(p.displayName, 100, 100)
        };
      }
    }
  }
  return state;
}

/**
 * Helper function that creates an html element with a colored background with an input string. To ensure a consistent color,
 * the background coloris the hex representation of the participant's display name.
 * @param str - input string
 * @returns
 */
const createMockHTMLElement = (str?: string, widthPx?: number, heightPx?: number): HTMLElement => {
  const mockVideoElement = document.createElement('div');
  mockVideoElement.innerHTML = '<span />';
  mockVideoElement.style.width = widthPx ? `${widthPx}` : decodeURIComponent('100%25');
  mockVideoElement.style.height = heightPx ? `${heightPx}` : decodeURIComponent('100%25');
  mockVideoElement.style.background = stringToHexColor(str ?? '');
  mockVideoElement.style.backgroundPosition = 'center';
  mockVideoElement.style.backgroundRepeat = 'no-repeat';
  return mockVideoElement;
};

/**
 * Helper function to randomly choose a background color for mocking a video stream
 * @param str - input string
 * @returns hex color code as a string
 */
const stringToHexColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

function findDevice<T extends { id: string }>(devices: T[], source: T): T {
  const device = devices.find((d) => d.id === source.id);
  if (!device) {
    throw Error(`Unknown device ${JSON.stringify(source)}. Options are: ${JSON.stringify(devices)}`);
  }
  return device;
}
