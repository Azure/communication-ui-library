// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { LocalVideoStream } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { createStatefulCallClient, StatefulDeviceManager } from '@azure/communication-react';

const groupId = '1b69ea20-c065-11ee-9d41-1dbbab32777a';
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
  const statefulCallClient = createStatefulCallClient({
    userId: { communicationUserId: userId }
  });
  const deviceManager = (await statefulCallClient.getDeviceManager()) as StatefulDeviceManager;
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
  const statefulCallAgent = await statefulCallClient.createCallAgent(tokenCredential, { displayName: displayName });
  const localVideoStream = new LocalVideoStream(cameras[0]);
  const call = statefulCallAgent.join({ groupId });

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
    call.mute();
  };
  document.body.appendChild(muteButton);

  // add a button to the dom to unmute the microphone
  const unmuteButton = document.createElement('button');
  unmuteButton.innerText = 'Unmute';
  unmuteButton.onclick = () => {
    call.unmute();
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
  const videoContainer = document.createElement('div');
  videoContainer.id = 'video-container';
  document.body.appendChild(videoContainer);

  // Subscribe to video streams
  call.on('remoteParticipantsUpdated', async (e) => {
    for (const participant of e.added) {
      for (const stream of participant.videoStreams) {
        const result = await statefulCallClient.createView(call.id, participant.identifier, stream);
        if (result) {
          videoContainer.appendChild(result.view.target);
        }
      }
    }
  });
  call.on('localVideoStreamsUpdated', async (e) => {
    for (const stream of e.added) {
      const result = await statefulCallClient.createView(call.id, undefined, stream);
      if (result) {
        videoContainer.appendChild(result.view.target);
      }
    }
  });
}

// Add a button to the dom:
const button = document.createElement('button');
button.innerText = 'Start';
button.onclick = startCall;
document.body.appendChild(button);
