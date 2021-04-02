// © Microsoft Corporation. All rights reserved.
import { CallAgent, DeviceManager, ScalingMode } from '@azure/communication-calling';
import { CallingState } from '../CallingState';
import { CallingActions } from '../CallingActions';
import { updateDisplayName } from './CallClientReducers';
import {
  joinCall,
  leaveCall,
  startCamera,
  stopCamera,
  toggleCameraOnOff,
  mute,
  unmute,
  toggleMute,
  startScreenShare,
  stopScreenShare,
  toggleScreenShare
} from './CallAgentReducers';
import { setMicrophone, setCamera, queryCameras, queryMicrophones } from './DeviceManagerReducers';
import { renderLocalVideo } from './RendererReducers';
import { ChangeEmitter } from './StateUpdates';

// todo fix all async actions to pass statehook so that they can avoid the promise overhead
export function createActions(
  getState: () => Readonly<CallingState>,
  emitOnChange: ChangeEmitter,
  callAgent: CallAgent,
  deviceManager: DeviceManager
): CallingActions {
  const emit = emitOnChange;
  return {
    setDisplayName: (displayName) => emit(updateDisplayName(callAgent, displayName)),
    joinCall: async (groupId) => {
      emit(await joinCall(getState(), callAgent, groupId));
    },
    leaveCall: async (forEveryone) => emit(await leaveCall(getState(), callAgent, forEveryone ?? false)),
    setCamera: async (source) => emit(await setCamera(getState(), callAgent, source)),
    setMicrophone: (source) => emit(setMicrophone(deviceManager, source)),
    queryCameras: () => emit(queryCameras(deviceManager)), // set (queryCameras(get)) | declarative: queryCameras() -> onStateChange
    queryMicrophones: () => emit(queryMicrophones(deviceManager)),
    startCamera: async () => emit(await startCamera(getState(), callAgent)),
    stopCamera: async () => emit(await stopCamera(getState(), callAgent)),
    toggleCameraOnOff: async () => emit(await toggleCameraOnOff(getState(), callAgent)),
    mute: async () => emit(await mute(getState(), callAgent)),
    unmute: async () => emit(await unmute(getState(), callAgent)),
    toggleMute: async () => emit(await toggleMute(getState(), callAgent)),
    startScreenShare: async () => emit(await startScreenShare(callAgent)),
    stopScreenShare: async () => emit(await stopScreenShare(callAgent)),
    toggleScreenShare: async () => emit(await toggleScreenShare(getState(), callAgent)),
    renderLocalVideo: async (scalingMode?: ScalingMode, mirrored?: boolean) =>
      emit(await renderLocalVideo(getState(), scalingMode, mirrored))
  };
}
