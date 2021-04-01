// © Microsoft Corporation. All rights reserved.

import { AudioOptions, CallAgent, LocalVideoStream } from '@azure/communication-calling';
import { CallingState } from '../CallingState';
import { disposeLocalVideo } from './RendererReducers';
import { CallingStateUpdate } from './StateUpdates';

export const joinCall = async (
  state: Readonly<CallingState>,
  callAgent: CallAgent,
  groupId: string
): Promise<CallingStateUpdate | undefined> => {
  if (state.call.status !== 'None') return;

  const audioOptions: AudioOptions = { muted: !state.call.isMicrophoneEnabled };
  const videoOptions = { localVideoStreams: state.call.localVideoStream ? [state.call.localVideoStream] : undefined };

  const call = await callAgent.join(
    { groupId },
    {
      videoOptions,
      audioOptions
    }
  );
  return (draft) => {
    draft.call.status = call.state;
  };
};

export const leaveCall = async (
  state: Readonly<CallingState>,
  callAgent: CallAgent,
  forEveryone: boolean
): Promise<CallingStateUpdate | undefined> => {
  // ToDo: check call.status before calling hangup?

  // ToDo fix hard-coded!
  const call = callAgent.calls[0];
  if (!call) return;
  await call.hangUp({ forEveryone });

  return (draft) => {
    draft.call.status = call.state;
    // more things to set on call or wait for events to come in?
  };
};

export const startCamera = async (
  state: Readonly<CallingState>,
  callAgent: CallAgent
): Promise<CallingStateUpdate | undefined> => {
  const camera = state.devices.selectedCamera;
  if (!camera) return;

  const video = new LocalVideoStream(camera);
  // ToDo fix hard-coded!
  const call = callAgent.calls[0];
  if (call) {
    // Only start video in the call if the video hasn't already been started.
    if (call.localVideoStreams.some((s) => s.getSource().id === camera.id)) return;
    await call.startVideo(video);
  }

  return (draft) => {
    draft.call.localVideoStream = video;
    draft.call.isLocalVideoOn = true;
  };
};

export const stopCamera = async (
  state: Readonly<CallingState>,
  callAgent: CallAgent,
  options = {
    skipDisposeVideo: false
  }
): Promise<CallingStateUpdate | undefined> => {
  const video = state.call.localVideoStream;
  if (!video) return;

  // ToDo fix hard-coded!
  const call = callAgent.calls[0];
  await call?.stopVideo(video);

  if (!options?.skipDisposeVideo) {
    disposeLocalVideo();
  }

  return (draft) => {
    draft.call.localVideoStream = undefined;
    draft.call.localVideoElement = undefined;
    draft.call.rawLocalMediaStream = null;
    draft.call.isLocalVideoOn = false;
  };
};

export const toggleCameraOnOff = (
  state: Readonly<CallingState>,
  callAgent: CallAgent
): Promise<CallingStateUpdate | undefined> => {
  return state.call.isLocalVideoOn ? stopCamera(state, callAgent) : startCamera(state, callAgent);
};

export const mute = async (
  state: Readonly<CallingState>,
  callAgent: CallAgent
): Promise<CallingStateUpdate | undefined> => {
  const microphone = state.devices.selectedMicrophone;
  if (!microphone) return;

  // ToDo fix hard-coded!
  const call = callAgent.calls[0];
  await call?.mute();
  return (draft) => {
    draft.call.isMicrophoneEnabled = false;
  };
};

export const unmute = async (
  state: Readonly<CallingState>,
  callAgent: CallAgent
): Promise<CallingStateUpdate | undefined> => {
  const microphone = state.devices.selectedMicrophone;
  if (!microphone) return;

  // ToDo fix hard-coded!
  const call = callAgent.calls[0];
  await call?.unmute();
  return (draft) => {
    draft.call.isMicrophoneEnabled = true;
  };
};

export const toggleMute = (
  state: Readonly<CallingState>,
  callAgent: CallAgent
): Promise<CallingStateUpdate | undefined> => {
  return state.call.isMicrophoneEnabled ? mute(state, callAgent) : unmute(state, callAgent);
};

export const startScreenShare = async (callAgent: CallAgent): Promise<CallingStateUpdate | undefined> => {
  // ToDo fix hard-coded!
  const call = callAgent.calls[0];

  // hook used to query call.isScreenSharingOn first, why?
  await call?.startScreenSharing();
  return (draft) => {
    draft.call.localScreenShareActive = true;
  };
};

export const stopScreenShare = async (callAgent: CallAgent): Promise<CallingStateUpdate | undefined> => {
  // ToDo fix hard-coded!
  const call = callAgent.calls[0];

  // hook used to query call.isScreenSharingOn first, why?
  await call?.stopScreenSharing();
  return (draft) => {
    draft.call.localScreenShareActive = true;
  };
};

export const toggleScreenShare = (
  state: Readonly<CallingState>,
  callAgent: CallAgent
): Promise<CallingStateUpdate | undefined> => {
  return state.call.localScreenShareActive ? startScreenShare(callAgent) : stopScreenShare(callAgent);
};
