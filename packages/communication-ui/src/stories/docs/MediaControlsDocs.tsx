// © Microsoft Corporation. All rights reserved.
import React, { useState } from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
// @ts-ignore silence the typescript error, we can only use commonjs to make storybook use this icon correctly
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
// @ts-ignore
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
// @ts-ignore
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';
import { Provider } from '@fluentui/react-northstar';
import { MediaControlsComponent } from '../../components';

const importStatement = `
import { MediaControlsComponent } from '@azure/communication-ui';
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';
import { Provider } from '@fluentui/react-northstar';
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

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

return (
  <Provider theme={iconTheme}>
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

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

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
        <Provider theme={iconTheme}>
          <MediaControlsExample />
        </Provider>
      </Canvas>
      <Source code={sourceCode} />
      <Heading>Props</Heading>
      <Props of={MediaControlsComponent} />
    </>
  );
};
