// © Microsoft Corporation. All rights reserved.

import React, { useState } from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { select, boolean } from '@storybook/addon-knobs';
import { MediaControlsComponent as MediaControls } from '../components';
import { getDocs } from './docs/MediaControlsDocs';
import { COMPONENT_FOLDER_PREFIX } from './constants';

export const MediaControlsComponent: () => JSX.Element = () => {
  const [localVideoEnabled, setLocalVideoEnabled] = useState(false);
  const toggleLocalVideo = (): void => setLocalVideoEnabled(!localVideoEnabled);
  const startLocalVideo = (): void => {
    !localVideoEnabled && toggleLocalVideo();
  };
  const stopLocalVideo = (): void => {
    localVideoEnabled && toggleLocalVideo();
  };
  const [isMicrophoneActive, setIsMicrophoneActive] = useState(false);
  const toggleMicrophone = (): void => setIsMicrophoneActive(!isMicrophoneActive);
  const muteMicrophone = (): void => {
    isMicrophoneActive && toggleMicrophone();
  };
  const unmuteMicrophone = (): void => {
    !isMicrophoneActive && toggleMicrophone();
  };
  const [isLocalScreenShareActive, setIsLocalScreenShareActive] = useState(false);
  const toggleScreenShare = (): void => setIsLocalScreenShareActive(!isLocalScreenShareActive);
  const startScreenShare = (): void => {
    !isLocalScreenShareActive && toggleScreenShare();
  };
  const stopScreenShare = (): void => {
    isLocalScreenShareActive && toggleScreenShare();
  };
  const onEndCallClick = (): void => {
    muteMicrophone();
    stopScreenShare();
    stopLocalVideo();
  };
  const leaveCall = async (): Promise<void> => {
    console.log('leaveCall');
  };

  const cameraPermission = select('Camera Permission', ['Granted', 'Denied', 'Prompt', 'Unknown'], 'Granted');
  const micPermission = select('Mic Permission', ['Granted', 'Denied', 'Prompt', 'Unknown'], 'Granted');
  const isRemoteScreenShareActive = boolean('Is remote screen share active', false);
  const localVideoBusy = boolean('Is local video busy', false);
  const isLocalScreenShareSupportedInBrowser = boolean('Is screen share supported in browser', true);
  const compressedMode = boolean('Compressed Mode', false);

  return (
    <MediaControls
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

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/MediaControls`,
  component: MediaControls,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
