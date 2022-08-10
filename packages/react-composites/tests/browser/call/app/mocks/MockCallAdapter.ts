// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { AudioDeviceInfo, Call, VideoDeviceInfo } from '@azure/communication-calling';
import type { CallAdapter, CallAdapterState } from '../../../../../src';
import type { MockCallAdapterState } from '../../MockCallAdapterState';

/**
 * Mock class that implements CallAdapter interface for UI snapshot tests. The handler implementation is currently limited so
 * some composite behaviour will not work like clicking the 'Start Call' button in the Configuration page. The usage of
 * MockCallAdapter is intended to take snapshot based only on the state of a CallAdapter.
 */
export class MockCallAdapter implements CallAdapter {
  /**
   * `testState` is deprecated. Use `initialState` instead.
   */
  constructor(initialState?: MockCallAdapterState) {
    if (!initialState) {
      throw new Error('`initialState` must be set');
    }
    this.state = populateViewTargets(initialState);
  }

  state: CallAdapterState;

  addParticipant(): Promise<void> {
    throw Error('addParticipant not implemented');
  }
  onStateChange(): void {
    return;
  }
  offStateChange(): void {
    return;
  }
  getState(): CallAdapterState {
    return this.state;
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
  setCamera(): Promise<void> {
    throw Error('setCamera not implemented');
  }
  setMicrophone(): Promise<void> {
    throw Error('setMicrophone not implemented');
  }
  setSpeaker(): Promise<void> {
    throw Error('setSpeaker not implemented');
  }
  on(): void {
    throw Error('on not implemented');
  }
  off(): void {
    throw Error('off not implemented');
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
          target: createMockHTMLElement(p.displayName)
        };
      }
    }
  }
  for (const p of Object.values(call.remoteParticipantsEnded)) {
    for (const s of Object.values(p.videoStreams)) {
      if (s.dummyView) {
        s.view = {
          ...s.dummyView,
          target: createMockHTMLElement(p.displayName)
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
const createMockHTMLElement = (str?: string): HTMLElement => {
  const mockVideoElement = document.createElement('div');
  mockVideoElement.innerHTML = '<span />';
  mockVideoElement.style.width = decodeURIComponent('100%25');
  mockVideoElement.style.height = decodeURIComponent('100%25');
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
