// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClient, LocalVideoStream, RemoteVideoStream, VideoStreamRenderer } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

const groupId = '1b69ea20-c065-11ee-9d41-1dbbab32777c';
const displayName = 'James test user';

const fetchTokenResponse = async (): Promise<{
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

async function startCall(): Promise<void> {
  const callStateElement = document.createElement('div');
  callStateElement.id = 'call-state';
  document.body.appendChild(callStateElement);
  callStateElement.innerText = 'Initializing';

  const { token, user: userId } = await fetchTokenResponse();
  const tokenCredential = new AzureCommunicationTokenCredential(token);
  console.log(userId, token);
  const callClient = new CallClient();
  const deviceManager = await callClient.getDeviceManager();
  callStateElement.innerText = 'Checking device permission';
  await deviceManager.askDevicePermission({
    video: true,
    audio: true
  });
  callStateElement.innerText = 'Enumerating devices';
  const [cameras] = await Promise.all([deviceManager.getCameras(), deviceManager.getMicrophones()]);
  if (deviceManager.isSpeakerSelectionAvailable) {
    await deviceManager.getSpeakers();
  }
  callStateElement.innerText = 'Joining call';
  const callAgent = await callClient.createCallAgent(tokenCredential, { displayName: displayName });
  const localVideoStream = new LocalVideoStream(cameras[0]);
  const call = callAgent.join(
    { groupId },
    {
      audioOptions: { muted: true }
    }
  );

  // Show call state on the dom
  call.on('stateChanged', () => {
    callStateElement.innerText = call.state;
  });

  // Show callId on the dom
  const callIdElement = document.createElement('div');
  callIdElement.id = 'call-id';
  document.body.appendChild(callIdElement);
  callIdElement.innerText = `CallId: ${call.id}`;
  call.on('idChanged', () => {
    callIdElement.innerText = `CallId: ${call.id}`;
  });

  // show mute state on the dom
  const muteStateElement = document.createElement('div');
  muteStateElement.id = 'mute-state';
  document.body.appendChild(muteStateElement);
  muteStateElement.innerText = `Mute state: ${call.isMuted ? 'muted' : 'unmuted'}`;
  call.on('isMutedChanged', () => {
    muteStateElement.innerText = `Mute state: ${call.isMuted ? 'muted' : 'unmuted'}`;
  });

  // show local video state on the dom
  const localVideoState = document.createElement('div');
  localVideoState.id = 'local-video-state';
  document.body.appendChild(localVideoState);
  localVideoState.innerText = `Local video state: off`;

  // add a button to the dom to stop the video
  const stopVideoButton = document.createElement('button');
  stopVideoButton.innerText = 'Stop Video';
  stopVideoButton.onclick = () => {
    call.stopVideo(localVideoStream);
  };
  document.body.appendChild(stopVideoButton);

  // add a button to the dom to start the video
  const startVideoButton = document.createElement('button');
  startVideoButton.innerText = 'Start Video';
  startVideoButton.onclick = () => {
    call.startVideo(localVideoStream);
  };
  document.body.appendChild(startVideoButton);

  // add a button to the dom to mute the microphone
  const muteButton = document.createElement('button');
  muteButton.innerText = 'Mute';
  muteButton.onclick = () => {
    !call.isMuted && call.mute();
  };
  document.body.appendChild(muteButton);

  // add a button to the dom to unmute the microphone
  const unmuteButton = document.createElement('button');
  unmuteButton.innerText = 'Unmute';
  unmuteButton.onclick = () => {
    call.isMuted && call.unmute();
  };
  document.body.appendChild(unmuteButton);

  // add a button to the dom to hang up the call
  const hangUpButton = document.createElement('button');
  hangUpButton.innerText = 'Hang Up';
  hangUpButton.onclick = () => {
    call.hangUp();
  };
  document.body.appendChild(hangUpButton);

  // Show video feed in the dom
  const localVideoText = document.createElement('div');
  localVideoText.innerText = 'Local Video';
  document.body.appendChild(localVideoText);
  const localVideoContainer = document.createElement('div');
  localVideoContainer.id = 'local-video-container';
  document.body.appendChild(localVideoContainer);
  const remoteVideoText = document.createElement('div');
  remoteVideoText.innerText = 'Remote Videos';
  document.body.appendChild(remoteVideoText);
  const remoteVideoContainer = document.createElement('div');
  remoteVideoContainer.id = 'remote-video-container';
  document.body.appendChild(remoteVideoContainer);

  const showOrDisposeRemoteStreamInDom = async (stream: RemoteVideoStream): Promise<void> => {
    if (stream.isAvailable) {
      const renderer = new VideoStreamRenderer(stream);
      const view = await renderer.createView();
      remoteVideoContainer.appendChild(view.target);
    } else {
      const renderer = new VideoStreamRenderer(stream);
      renderer.dispose();
    }
  };

  const showAndSubscribeToRemoteVideoStream = async (stream: RemoteVideoStream): Promise<void> => {
    await showOrDisposeRemoteStreamInDom(stream);
    stream.on('isAvailableChanged', async () => {
      await showOrDisposeRemoteStreamInDom(stream);
    });
  };

  // Subscribe to video streams
  call.on('remoteParticipantsUpdated', async (e) => {
    for (const participant of e.added) {
      for (const stream of participant.videoStreams) {
        await showAndSubscribeToRemoteVideoStream(stream);
      }
      participant.on('videoStreamsUpdated', async (e) => {
        for (const stream of e.added) {
          await showAndSubscribeToRemoteVideoStream(stream);
        }
        for (const stream of e.removed) {
          const renderer = new VideoStreamRenderer(stream);
          renderer.dispose();
        }
      });
    }
  });
  call.on('localVideoStreamsUpdated', async (e) => {
    for (const stream of e.added) {
      if (!(stream.mediaStreamType === 'Video')) {
        break;
      }
      const renderer = new VideoStreamRenderer(stream);
      const view = await renderer.createView();
      localVideoContainer.appendChild(view.target);
      localVideoState.innerText = `Local video state: on`;
    }
    for (const stream of e.removed) {
      if (!(stream.mediaStreamType === 'Video')) {
        break;
      }
      const renderer = new VideoStreamRenderer(stream);
      renderer.dispose();
      localVideoState.innerText = `Local video state: off`;
    }
  });
}

// Add a button to the dom:
const button = document.createElement('button');
button.innerText = 'Start';
button.onclick = startCall;
document.body.appendChild(button);
