// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Call, LocalVideoStream, VideoDeviceInfo } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  createStatefulCallClient,
  DeclarativeCallAgent,
  StatefulCallClient,
  StatefulDeviceManager,
  toFlatCommunicationIdentifier
} from '@azure/communication-react';

const groupId = '1b69ea20-c065-11ee-9d41-1dbbab32777b';
const displayName = 'James test user';

export const fetchTokenResponse = async (): Promise<{
  token: string;
  user: string;
}> => {
  const response = await fetch('/token');
  if (response.ok) {
    const responseAsJson = await response.json();
    const token = responseAsJson.token;
    if (token) {
      return responseAsJson;
    }
  }
  throw 'Invalid token response';
};

export interface InitResult {
  statefulCallClient: StatefulCallClient;
  statefulCallAgent: DeclarativeCallAgent;
  call: Call;
  deviceManager: StatefulDeviceManager;
  cameras: VideoDeviceInfo[];
}

export const initStatefulClient = async (args: { onStateChange: (state: string) => void }): Promise<InitResult> => {
  const { onStateChange } = args;
  onStateChange('Initializing');

  const { token, user: userId } = await fetchTokenResponse();
  const tokenCredential = new AzureCommunicationTokenCredential(token);
  const statefulCallClient = createStatefulCallClient({
    userId: { communicationUserId: userId }
  });
  const deviceManager = (await statefulCallClient.getDeviceManager()) as StatefulDeviceManager;
  onStateChange('Checking device permission');
  await deviceManager.askDevicePermission({
    video: true,
    audio: true
  });
  onStateChange('Enumerating devices');
  const [cameras] = await Promise.all([deviceManager.getCameras(), deviceManager.getMicrophones()]);
  if (deviceManager.isSpeakerSelectionAvailable) {
    await deviceManager.getSpeakers();
  }

  onStateChange('Joining call');
  const statefulCallAgent = await statefulCallClient.createCallAgent(tokenCredential, { displayName: displayName });
  const call = statefulCallAgent.join(
    { groupId },
    {
      audioOptions: { muted: true }
    }
  );

  onStateChange(call.state);

  return { statefulCallClient, statefulCallAgent, call, deviceManager, cameras };
};

export const startLocalVideo = async (
  callClient: StatefulCallClient,
  call: Call,
  deviceManager: StatefulDeviceManager
): Promise<void> => {
  const callId = call?.id;
  let videoDeviceInfo = callClient.getState().deviceManager.selectedCamera;
  if (!videoDeviceInfo) {
    const cameras = await deviceManager?.getCameras();
    videoDeviceInfo = cameras && cameras.length > 0 ? cameras[0] : undefined;
    videoDeviceInfo && deviceManager?.selectCamera(videoDeviceInfo);
  }
  if (!callId || !videoDeviceInfo) {
    return;
  }
  const stream = new LocalVideoStream(videoDeviceInfo);
  if (call && !call.localVideoStreams.find((s) => areStreamsEqual(s, stream))) {
    await call.startVideo(stream);
  }
};

export const stopLocalVideo = async (call: Call): Promise<void> => {
  const callId = call?.id;
  if (!callId) {
    return;
  }
  const stream = call.localVideoStreams.find((stream) => stream.mediaStreamType === 'Video');
  if (stream && call && call.localVideoStreams.find((s) => areStreamsEqual(s, stream))) {
    await call.stopVideo(stream);
  }
};

const areStreamsEqual = (prevStream: LocalVideoStream, newStream: LocalVideoStream): boolean => {
  return !!prevStream && !!newStream && prevStream.source.id === newStream.source.id;
};

export const createLocalStreamView = async (callClient: StatefulCallClient, call: Call): Promise<void> => {
  if (!call || call.localVideoStreams.length === 0) {
    return;
  }

  const callState = callClient.getState().calls[call.id];
  if (!callState) {
    return;
  }

  const localStream = callState.localVideoStreams.find((item) => item.mediaStreamType === 'Video');
  if (!localStream) {
    return;
  }

  await callClient.createView(call.id, undefined, localStream);
};

export const disposeLocalStreamView = async (callClient: StatefulCallClient, call: Call): Promise<void> => {
  const callState = call && callClient.getState().calls[call.id];
  const localStream = callState?.localVideoStreams.find((item) => item.mediaStreamType === 'Video');
  if (call && callState && localStream) {
    callClient.disposeView(call.id, undefined, localStream);
  }
};

export const createRemoteStreamView = async (
  callClient: StatefulCallClient,
  call: Call,
  userId: string
): Promise<void> => {
  if (!call) {
    return;
  }
  const callState = callClient.getState().calls[call.id];
  if (!callState) {
    throw new Error(`Call Not Found: ${call.id}`);
  }

  const participant = Object.values(callState.remoteParticipants).find(
    (participant) => toFlatCommunicationIdentifier(participant.identifier) === userId
  );

  if (!participant || !participant.videoStreams) {
    return;
  }

  // Find the first available stream, if there is none, then get the first stream
  const remoteVideoStream =
    Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'Video' && i.isAvailable) ||
    Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'Video');

  if (remoteVideoStream && remoteVideoStream.isAvailable && !remoteVideoStream.view) {
    await callClient.createView(call.id, participant.identifier, remoteVideoStream);
  }
};

export const disposeRemoteVideoStreamView = async (
  callClient: StatefulCallClient,
  call: Call,
  userId: string
): Promise<void> => {
  if (!call) {
    return;
  }
  const callState = callClient.getState().calls[call.id];
  if (!callState) {
    throw new Error(`Call Not Found: ${call.id}`);
  }

  const participant = Object.values(callState.remoteParticipants).find(
    (participant) => toFlatCommunicationIdentifier(participant.identifier) === userId
  );

  if (!participant || !participant.videoStreams) {
    return;
  }

  const remoteVideoStream = Object.values(participant.videoStreams).find((i) => i.mediaStreamType === 'Video');

  if (remoteVideoStream && remoteVideoStream.view) {
    callClient.disposeView(call.id, participant.identifier, remoteVideoStream);
  }
};
