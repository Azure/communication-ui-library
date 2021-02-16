// © Microsoft Corporation. All rights reserved.

import React, { useCallback } from 'react';
import {
  CallControlCloseTrayIcon,
  CallControlPresentNewIcon,
  CallEndIcon,
  CallVideoIcon,
  CallVideoOffIcon,
  MicIcon,
  MicOffIcon
} from '@fluentui/react-icons-northstar';
import { CommandButton, Stack } from '@fluentui/react';
import {
  controlButtonDisabledStyle,
  controlButtonStyle,
  endCallButtonStyle,
  endCallButtonTextStyle,
  fullWidth,
  mediaControlStyles,
  leaveButtonStyle
} from './styles/MediaControls.styles';
import { connectFuncsToContext } from '../consumers/ConnectContext';
import { MapToMediaControlsProps, MediaControlsContainerProps } from '../consumers/MapToMediaControlsProps';

export interface MediaControlsProps extends MediaControlsContainerProps {
  /** Determines media control button layout. */
  compressedMode: boolean;
  /** Callback when call ends */
  onEndCallClick(): void;
}

export const MediaControlsComponent = (props: MediaControlsProps): JSX.Element => {
  const {
    muteMicrophone,
    stopScreenShare,
    localVideoEnabled,
    stopLocalVideo,
    leaveCall,
    onEndCallClick,
    cameraPermission,
    micPermission,
    isRemoteScreenShareActive,
    localVideoBusy,
    toggleLocalVideo,
    toggleMicrophone,
    isMicrophoneActive,
    isLocalScreenShareSupportedInBrowser,
    toggleScreenShare,
    isLocalScreenShareActive,
    compressedMode
  } = props;

  const endCallClick = useCallback(async (): Promise<void> => {
    muteMicrophone();
    stopScreenShare();
    localVideoEnabled && stopLocalVideo();
    await leaveCall({ forEveryone: false });
    onEndCallClick();
  }, [muteMicrophone, stopScreenShare, localVideoEnabled, stopLocalVideo, leaveCall, onEndCallClick]);

  const cameraDisabled = cameraPermission === 'Denied';
  const micDisabled = micPermission === 'Denied';
  const screenShareDisabled = isRemoteScreenShareActive;
  return (
    <Stack className={mediaControlStyles}>
      <CommandButton
        onKeyDownCapture={(e) => {
          if (e.keyCode === 13 && localVideoBusy) {
            e.preventDefault();
          }
        }}
        disabled={cameraDisabled || localVideoBusy}
        onClick={toggleLocalVideo}
        className={localVideoBusy || cameraDisabled ? controlButtonDisabledStyle : controlButtonStyle}
      >
        <div className={fullWidth}>
          {localVideoEnabled ? <CallVideoIcon size="medium" /> : <CallVideoOffIcon size="medium" />}
        </div>
      </CommandButton>
      <CommandButton
        onClick={toggleMicrophone}
        disabled={micDisabled}
        className={micDisabled ? controlButtonDisabledStyle : controlButtonStyle}
      >
        <div className={fullWidth}>{isMicrophoneActive ? <MicIcon size="medium" /> : <MicOffIcon size="medium" />}</div>
      </CommandButton>
      {isLocalScreenShareSupportedInBrowser() && (
        <CommandButton
          disabled={screenShareDisabled}
          onClick={toggleScreenShare}
          className={screenShareDisabled ? controlButtonDisabledStyle : controlButtonStyle}
        >
          <div className={fullWidth}>
            {isLocalScreenShareActive ? (
              <CallControlCloseTrayIcon size="medium" />
            ) : (
              <CallControlPresentNewIcon size="medium" />
            )}
          </div>
        </CommandButton>
      )}
      <CommandButton
        onClick={endCallClick}
        className={compressedMode ? controlButtonStyle : endCallButtonStyle}
        styles={leaveButtonStyle}
      >
        <div className={fullWidth}>
          <CallEndIcon size="medium" />
          {!compressedMode && <span className={endCallButtonTextStyle}>Leave</span>}
        </div>
      </CommandButton>
    </Stack>
  );
};

export default connectFuncsToContext(MediaControlsComponent, MapToMediaControlsProps);
