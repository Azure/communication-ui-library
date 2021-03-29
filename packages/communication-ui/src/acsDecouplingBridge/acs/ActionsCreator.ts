// © Microsoft Corporation. All rights reserved.
import { CallAgent, DeviceManager, ScalingMode } from '@azure/communication-calling';
import { CallingState } from '../CallingState';
import { CallingActions } from '../CallingActions';
import { updateDisplayName } from './CallClientReducers';
import { joinCall, startCamera, stopCamera, toggleCameraOnOff, mute, unmute, toggleMute } from './CallAgentReducers';
import { setMicrophone, setCamera, queryCameras, queryMicrophones } from './DeviceManagerReducers';
import { renderLocalVideo } from './RendererReducers';
import { ChangeEmitter } from './AcsCallingAdapter';

export type CallingStateUpdate = (state: CallingState) => void;
export type CallingStateUpdateAsync = (state: CallingState) => Promise<void>;

export const isPromise = <T>(obj: any): obj is Promise<T> => {
  return obj && 'then' in obj;
};

export const concatCallingStateUpdate = async (
  updates: (((draft: CallingState) => Promise<CallingStateUpdate | undefined>) | CallingStateUpdate)[]
): Promise<CallingStateUpdateAsync> => {
  const concatenated = async (draft: CallingState): Promise<void> => {
    for (const apply of updates) {
      const applied = apply(draft);
      const update = isPromise(applied) ? await applied : applied;
      if (update) {
        update(draft);
      }
    }
  };
  return concatenated;
};

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
    renderLocalVideo: async (scalingMode?: ScalingMode, mirrored?: boolean) =>
      emit(await renderLocalVideo(getState(), scalingMode, mirrored))
  };
}
