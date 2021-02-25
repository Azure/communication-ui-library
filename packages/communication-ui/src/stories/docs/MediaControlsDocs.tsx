// © Microsoft Corporation. All rights reserved.
import React, { useState } from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { Provider, teamsTheme } from '@fluentui/react-northstar';
import { MediaControlsComponent } from '../../components';

const importStatement = `
import { MediaControlsComponent } from '@azure/communication-ui';
import { Provider, teamsTheme } from '@fluentui/react-northstar';
`;

const MediaControlsExample: () => JSX.Element = () => {
  const [localVideoEnabled, setLocalVideoEnabled] = useState(false);
  const toggleLocalVideo = (): Promise<void> => {
    setLocalVideoEnabled(!localVideoEnabled);
    return Promise.resolve();
  };
  const startLocalVideo = (): Promise<void> => {
    !localVideoEnabled && toggleLocalVideo();
    return Promise.resolve();
  };
  const stopLocalVideo = (): Promise<void> => {
    localVideoEnabled && toggleLocalVideo();
    return Promise.resolve();
  };
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
  const toggleMicrophone = (): Promise<void> => {
    setIsMicrophoneActive(!isMicrophoneActive);
    return Promise.resolve();
  };
  const muteMicrophone = (): Promise<void> => {
    isMicrophoneActive && toggleMicrophone();
    return Promise.resolve();
  };
  const unmuteMicrophone = (): Promise<void> => {
    !isMicrophoneActive && toggleMicrophone();
    return Promise.resolve();
  };
  const [isLocalScreenShareActive, setIsLocalScreenShareActive] = useState(false);
  const toggleScreenShare = (): Promise<void> => {
    setIsLocalScreenShareActive(!isLocalScreenShareActive);
    return Promise.resolve();
  };
  const startScreenShare = (): Promise<void> => {
    !isLocalScreenShareActive && toggleScreenShare();
    return Promise.resolve();
  };
  const stopScreenShare = (): Promise<void> => {
    isLocalScreenShareActive && toggleScreenShare();
    return Promise.resolve();
  };
  const onEndCallClick = (): void => {
    muteMicrophone();
    stopScreenShare();
    stopLocalVideo();
  };
  const leaveCall = async (): Promise<void> => {
    console.log('leaveCall');
  };

  const cameraPermission = 'Granted';
  const micPermission = 'Granted';
  const isRemoteScreenShareActive = false;
  const localVideoBusy = false;
  const isLocalScreenShareSupportedInBrowser = true;
  const compressedMode = false;

  return (
    <MediaControlsComponent
      toggleMicrophone={toggleMicrophone}
      muteMicrophone={muteMicrophone}
      unmuteMicrophone={unmuteMicrophone}
      startLocalVideo={startLocalVideo}
      stopLocalVideo={stopLocalVideo}
      toggleLocalVideo={toggleLocalVideo}
      startScreenShare={startScreenShare}
      stopScreenShare={stopScreenShare}
      toggleScreenShare={toggleScreenShare}
      onEndCallClick={onEndCallClick}
      isMicrophoneActive={isMicrophoneActive}
      localVideoEnabled={localVideoEnabled}
      localVideoBusy={localVideoBusy}
      isLocalScreenShareActive={isLocalScreenShareActive}
      isRemoteScreenShareActive={isRemoteScreenShareActive}
      cameraPermission={cameraPermission}
      micPermission={micPermission}
      isLocalScreenShareSupportedInBrowser={() => isLocalScreenShareSupportedInBrowser}
      compressedMode={compressedMode}
      leaveCall={leaveCall}
    />
  );
};

const sourceCode = `
  const [localVideoEnabled, setLocalVideoEnabled] = useState(false);
  const toggleLocalVideo = (): Promise<void> => {
    setLocalVideoEnabled(!localVideoEnabled);
    return Promise.resolve();
  };
  const startLocalVideo = (): Promise<void> => {
    !localVideoEnabled && toggleLocalVideo();
    return Promise.resolve();
  };
  const stopLocalVideo = (): Promise<void> => {
    localVideoEnabled && toggleLocalVideo();
    return Promise.resolve();
  };
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
  const toggleMicrophone = (): Promise<void> => {
    setIsMicrophoneActive(!isMicrophoneActive);
    return Promise.resolve();
  };
  const muteMicrophone = (): Promise<void> => {
    isMicrophoneActive && toggleMicrophone();
    return Promise.resolve();
  };
  const unmuteMicrophone = (): Promise<void> => {
    !isMicrophoneActive && toggleMicrophone();
    return Promise.resolve();
  };
  const [isLocalScreenShareActive, setIsLocalScreenShareActive] = useState(false);
  const toggleScreenShare = (): Promise<void> => {
    setIsLocalScreenShareActive(!isLocalScreenShareActive);
    return Promise.resolve();
  };
  const startScreenShare = (): Promise<void> => {
    !isLocalScreenShareActive && toggleScreenShare();
    return Promise.resolve();
  };
  const stopScreenShare = (): Promise<void> => {
    isLocalScreenShareActive && toggleScreenShare();
    return Promise.resolve();
  };
  const onEndCallClick = (): void => {
    muteMicrophone();
    stopScreenShare();
    stopLocalVideo();
  };

const cameraPermission = 'Granted';
const micPermission = 'Granted';
const isRemoteScreenShareActive = false;
const localVideoBusy = false;
const isLocalScreenShareSupportedInBrowser = true;
const compressedMode = false;
const leaveCall = async (): Promise<void> => {
  console.log('leaveCall');
};

return (
  <Provider theme={teamsTheme}>
    <MediaControlsComponent
      toggleMicrophone={toggleMicrophone}
      muteMicrophone={muteMicrophone}
      unmuteMicrophone={unmuteMicrophone}
      startLocalVideo={startLocalVideo}
      stopLocalVideo={stopLocalVideo}
      toggleLocalVideo={toggleLocalVideo}
      startScreenShare={startScreenShare}
      stopScreenShare={stopScreenShare}
      toggleScreenShare={toggleScreenShare}
      onEndCallClick={onEndCallClick}
      isMicrophoneActive={isMicrophoneActive}
      localVideoEnabled={localVideoEnabled}
      localVideoBusy={localVideoBusy}
      isLocalScreenShareActive={isLocalScreenShareActive}
      isRemoteScreenShareActive={isRemoteScreenShareActive}
      cameraPermission={cameraPermission}
      micPermission={micPermission}
      isLocalScreenShareSupportedInBrowser={() => isLocalScreenShareSupportedInBrowser}
      compressedMode={compressedMode}
      leaveCall={leaveCall}
    />
  </Provider>
);`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MediaControls</Title>
      <Description>
        The MediaControls component displays buttons to toggle video, audio, screenshare, as well as a button to leave
        the call. Callbacks for each change are also passed in.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <Provider theme={teamsTheme}>
          <MediaControlsExample />
        </Provider>
      </Canvas>
      <Source code={sourceCode} />
      <Heading>Props</Heading>
      <Props of={MediaControlsComponent} />
    </>
  );
};
