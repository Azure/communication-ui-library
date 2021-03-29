// © Microsoft Corporation. All rights reserved.

import { AudioDeviceInfo, VideoDeviceInfo, CallAgent, DeviceManager } from '@azure/communication-calling';
import { CallingState } from '../CallingState';
import { startCamera, stopCamera } from './CallAgentReducers';
import { CallingStateUpdate, concatCallingStateUpdate } from './ActionsCreator';

export const setCamera = async (
  state: Readonly<CallingState>,
  callAgent: CallAgent,
  source: VideoDeviceInfo
): Promise<CallingStateUpdate> => {
  if (state.call.localVideoStream) {
    return await concatCallingStateUpdate([
      // delay dispose of video to make transition a little nicer
      (draft) => stopCamera(draft, callAgent, { skipDisposeVideo: true }),
      (draft) => {
        // startCamera depends on selectedCamera in state, so set it here
        draft.devices.selectedCamera = source;
      },
      (draft) => startCamera(draft, callAgent)
    ]);
  }
  return (draft) => {
    draft.devices.selectedCamera = source;
  };
};

export const setMicrophone = (
  deviceManager: DeviceManager,
  source: AudioDeviceInfo
): CallingStateUpdate | undefined => {
  if (!source) return;

  return (draft) => {
    draft.devices.selectedMicrophone = source;
    deviceManager.setMicrophone(source);
  };
};

export const queryCameras = (deviceManager: DeviceManager): CallingStateUpdate => {
  return (draft) => {
    draft.devices.cameras = deviceManager.getCameraList();
  };
};

export const queryMicrophones = (deviceManager: DeviceManager): CallingStateUpdate => {
  return (draft) => {
    draft.devices.microphones = deviceManager.getMicrophoneList();
  };
};
