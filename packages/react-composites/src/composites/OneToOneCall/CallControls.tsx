// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonStyles, IContextualMenuProps } from '@fluentui/react';
import React, { useCallback } from 'react';
import {
  CameraButton,
  ControlBar,
  ControlBarProps,
  EndCallButton,
  MicrophoneButton,
  OptionsButton,
  ScreenShareButton
} from 'react-components';
import { connectFuncsToContext } from '../../consumers';
import { CallControlBarContainerProps, MapToCallControlBarProps } from './consumers/MapToCallControlBarProps';
import { ErrorHandlingProps } from '../../providers';
import { propagateError } from '../../utils';
import {
  LocalDeviceSettingsContainerProps,
  MapToLocalDeviceSettingsProps
} from './consumers/MapToLocalDeviceSettingsProps';
import { isLocalScreenShareSupportedInBrowser } from './utils/SDKUtils';

const CallOptionsButton = (props: LocalDeviceSettingsContainerProps): JSX.Element => {
  const {
    videoDeviceInfo,
    videoDeviceList,
    audioDeviceInfo,
    audioDeviceList,
    updateLocalVideoStream,
    updateAudioDeviceInfo
  } = props;

  const callOptionsMenu: IContextualMenuProps = {
    items: [
      {
        key: '1',
        name: 'Choose Camera',
        iconProps: { iconName: 'LocationCircle' },
        subMenuProps: {
          items: videoDeviceList.map((item) => ({
            key: item.id,
            text: item.name,
            title: item.name,
            canCheck: true,
            isChecked: videoDeviceInfo?.id === item.id,
            onClick: () => updateLocalVideoStream(item)
          }))
        }
      },
      {
        key: '2',
        name: 'Choose Microphone',
        iconProps: { iconName: 'LocationCircle' },
        subMenuProps: {
          items: audioDeviceList.map((item) => ({
            key: item.id,
            text: item.name,
            title: item.name,
            canCheck: true,
            isChecked: audioDeviceInfo?.id === item.id,
            onClick: () => updateAudioDeviceInfo(item)
          }))
        }
      }
    ]
  };
  return <OptionsButton menuProps={callOptionsMenu} />;
};

const CallOptionsButtonComponent = connectFuncsToContext(CallOptionsButton, MapToLocalDeviceSettingsProps);

interface HangupButtonProps extends CallControlBarContainerProps, ErrorHandlingProps {
  onEndCallClick(): void;
  styles?: IButtonStyles;
  text?: string;
}

const HangupButton = (props: HangupButtonProps): JSX.Element => {
  const {
    muteMicrophone,
    stopScreenShare,
    localVideoEnabled,
    stopLocalVideo,
    leaveCall,
    onEndCallClick,
    onErrorCallback,
    styles,
    text
  } = props;

  const hangup = useCallback(async (): Promise<void> => {
    await muteMicrophone();
    await stopScreenShare();
    await (localVideoEnabled && stopLocalVideo());
    await leaveCall({ forEveryone: false });
    onEndCallClick();
  }, [muteMicrophone, stopScreenShare, localVideoEnabled, stopLocalVideo, leaveCall, onEndCallClick]);

  return (
    <EndCallButton
      checked={false}
      onClick={() => {
        hangup().catch((error) => {
          propagateError(error, onErrorCallback);
        });
      }}
      styles={styles}
      text={text}
    />
  );
};

export const HangupButtonComponent = connectFuncsToContext(HangupButton, MapToCallControlBarProps);

export interface OutgoingCallControlBarProps extends ControlBarProps, CallControlBarContainerProps {
  /** Callback when call ends */
  onEndCallClick(): void;
}

export const OutgoingCallControlBar = (props: OutgoingCallControlBarProps & ErrorHandlingProps): JSX.Element => {
  const {
    localVideoEnabled,
    onEndCallClick,
    cameraPermission,
    micPermission,
    localVideoBusy,
    toggleLocalVideo,
    toggleMicrophone,
    isMicrophoneActive,
    onErrorCallback
  } = props;
  const cameraDisabled = cameraPermission === 'Denied';
  const micDisabled = micPermission === 'Denied';

  return (
    <ControlBar {...props}>
      <CameraButton
        checked={localVideoEnabled}
        disabled={cameraDisabled || localVideoBusy}
        onClick={() => {
          toggleLocalVideo().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      <MicrophoneButton
        checked={isMicrophoneActive}
        disabled={micDisabled}
        onClick={() => {
          toggleMicrophone().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      <CallOptionsButtonComponent />
      <HangupButtonComponent onEndCallClick={onEndCallClick} />
    </ControlBar>
  );
};

export const OutgoingCallControlBarComponent = connectFuncsToContext(OutgoingCallControlBar, MapToCallControlBarProps);

export const IncomingCallControlBar = (
  props: ControlBarProps & CallControlBarContainerProps & ErrorHandlingProps
): JSX.Element => {
  const {
    localVideoEnabled,
    cameraPermission,
    micPermission,
    localVideoBusy,
    toggleLocalVideo,
    toggleMicrophone,
    isMicrophoneActive,
    onErrorCallback
  } = props;
  const cameraDisabled = cameraPermission === 'Denied';
  const micDisabled = micPermission === 'Denied';

  return (
    <ControlBar {...props}>
      <CameraButton
        checked={localVideoEnabled}
        disabled={cameraDisabled || localVideoBusy}
        onClick={() => {
          toggleLocalVideo().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      <MicrophoneButton
        checked={isMicrophoneActive}
        disabled={micDisabled}
        onClick={() => {
          toggleMicrophone().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      <CallOptionsButtonComponent />
    </ControlBar>
  );
};

export const IncomingCallControlBarComponent = connectFuncsToContext(IncomingCallControlBar, MapToCallControlBarProps);

export interface CallControlBarProps extends CallControlBarContainerProps {
  /** Callback when call ends */
  onEndCallClick(): void;
}

/**
 * An Azure Calling Services Call Control Bar with built in call handling.
 * @param props - CallControlBarProps & ErrorHandlingProps & LocalDeviceSettingsContainerProps
 */
export const CallControlBar = (props: ControlBarProps & CallControlBarProps & ErrorHandlingProps): JSX.Element => {
  const {
    localVideoEnabled,
    onEndCallClick,
    cameraPermission,
    micPermission,
    isRemoteScreenShareActive,
    localVideoBusy,
    toggleLocalVideo,
    toggleMicrophone,
    isMicrophoneActive,
    toggleScreenShare,
    isLocalScreenShareActive,
    onErrorCallback
  } = props;
  const cameraDisabled = cameraPermission === 'Denied';
  const micDisabled = micPermission === 'Denied';
  const screenShareDisabled = isRemoteScreenShareActive;

  return (
    <ControlBar {...props}>
      <CameraButton
        checked={localVideoEnabled}
        disabled={cameraDisabled || localVideoBusy}
        onClick={() => {
          toggleLocalVideo().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      <MicrophoneButton
        checked={isMicrophoneActive}
        disabled={micDisabled}
        onClick={() => {
          toggleMicrophone().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      {isLocalScreenShareSupportedInBrowser() && (
        <ScreenShareButton
          checked={isLocalScreenShareActive}
          disabled={screenShareDisabled}
          onClick={() => {
            toggleScreenShare().catch((error) => {
              propagateError(error, onErrorCallback);
            });
          }}
        />
      )}
      <CallOptionsButtonComponent />
      <HangupButtonComponent onEndCallClick={onEndCallClick} />
    </ControlBar>
  );
};

export const CallControlBarComponent = connectFuncsToContext(CallControlBar, MapToCallControlBarProps);
