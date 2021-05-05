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
import { connectFuncsToContext, ErrorHandlingProps, WithErrorHandling, propagateError } from 'react-composites';
import { MapToMediaControlsProps, MediaControlsContainerProps } from './consumers/MapToMediaControlsProps';

export interface MediaControlsProps extends MediaControlsContainerProps {
  /** Determines media control button layout. */
  compressedMode: boolean;
  /** Callback when call ends */
  onEndCallClick(): void;
}

const MediaControlsComponentBase = (props: MediaControlsProps & ErrorHandlingProps): JSX.Element => {
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
    compressedMode,
    onErrorCallback
  } = props;

  const endCallClick = useCallback(async (): Promise<void> => {
    await muteMicrophone();
    await stopScreenShare();
    await (localVideoEnabled && stopLocalVideo());
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
        onClick={() => {
          toggleLocalVideo().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
        className={localVideoBusy || cameraDisabled ? controlButtonDisabledStyle : controlButtonStyle}
      >
        <div className={fullWidth}>
          {localVideoEnabled ? <CallVideoIcon size="medium" /> : <CallVideoOffIcon size="medium" />}
        </div>
      </CommandButton>
      <CommandButton
        onClick={() => {
          toggleMicrophone().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
        disabled={micDisabled}
        className={micDisabled ? controlButtonDisabledStyle : controlButtonStyle}
      >
        <div className={fullWidth}>{isMicrophoneActive ? <MicIcon size="medium" /> : <MicOffIcon size="medium" />}</div>
      </CommandButton>
      {isLocalScreenShareSupportedInBrowser() && (
        <CommandButton
          disabled={screenShareDisabled}
          onClick={() => {
            toggleScreenShare().catch((error) => {
              propagateError(error, onErrorCallback);
            });
          }}
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
        onClick={() => {
          endCallClick().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
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

export const MediaControlsComponent = (props: MediaControlsProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(MediaControlsComponentBase, props);

export const MediaControls = connectFuncsToContext(MediaControlsComponent, MapToMediaControlsProps);
