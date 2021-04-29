// © Microsoft Corporation. All rights reserved.

import { DefaultButton, IButtonStyles, IContextualMenuProps } from '@fluentui/react';
import React, { useCallback } from 'react';
import { AudioButton, ControlBar, hangupButtonProps, optionsButtonProps, videoButtonProps } from '../../components';
import { ControlBarProps, screenShareButtonProps } from '../../components/ControlBar';
import {
  connectFuncsToContext,
  LocalDeviceSettingsContainerProps,
  MapToLocalDeviceSettingsProps
} from '../../consumers';
import { CallControlBarContainerProps, MapToCallControlBarProps } from '../common/consumers/MapToCallControlBarProps';
import { ErrorHandlingProps } from '../../providers';
import { isLocalScreenShareSupportedInBrowser, propagateError, WithErrorHandling } from '../../utils';
import { groupCallLeaveButtonCompressedStyle, groupCallLeaveButtonStyle } from './styles/CallControls.styles';

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
  return <DefaultButton {...optionsButtonProps} menuProps={callOptionsMenu} />;
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
    <DefaultButton
      onRenderIcon={hangupButtonProps.onRenderIcon}
      checked={false}
      onClick={() => {
        hangup().catch((error) => {
          propagateError(error, onErrorCallback);
        });
      }}
      styles={styles ?? hangupButtonProps.styles}
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
      <DefaultButton
        {...videoButtonProps}
        checked={localVideoEnabled}
        disabled={cameraDisabled || localVideoBusy}
        onClick={() => {
          toggleLocalVideo().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      <AudioButton
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
      <DefaultButton
        {...videoButtonProps}
        checked={localVideoEnabled}
        disabled={cameraDisabled || localVideoBusy}
        onClick={() => {
          toggleLocalVideo().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      <AudioButton
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
      <DefaultButton
        {...videoButtonProps}
        checked={localVideoEnabled}
        disabled={cameraDisabled || localVideoBusy}
        onClick={() => {
          toggleLocalVideo().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      <AudioButton
        checked={isMicrophoneActive}
        disabled={micDisabled}
        onClick={() => {
          toggleMicrophone().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      {isLocalScreenShareSupportedInBrowser() && (
        <DefaultButton
          {...screenShareButtonProps}
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

export interface GroupCallControlBarProps extends CallControlBarContainerProps {
  /** Determines media control button layout. */
  compressedMode: boolean;
  /** Callback when call ends */
  onEndCallClick(): void;
}

export const GroupCallControlBar = (
  props: ControlBarProps & GroupCallControlBarProps & ErrorHandlingProps
): JSX.Element => {
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
    compressedMode,
    onErrorCallback
  } = props;

  const cameraDisabled = cameraPermission === 'Denied';
  const micDisabled = micPermission === 'Denied';
  const screenShareDisabled = isRemoteScreenShareActive;

  return (
    <ControlBar {...props}>
      <DefaultButton
        {...videoButtonProps}
        checked={localVideoEnabled}
        disabled={cameraDisabled || localVideoBusy}
        onClick={() => {
          toggleLocalVideo().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      <AudioButton
        checked={isMicrophoneActive}
        disabled={micDisabled}
        onClick={() => {
          toggleMicrophone().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      {isLocalScreenShareSupportedInBrowser() && (
        <DefaultButton
          {...screenShareButtonProps}
          checked={isLocalScreenShareActive}
          disabled={screenShareDisabled}
          onClick={() => {
            toggleScreenShare().catch((error) => {
              propagateError(error, onErrorCallback);
            });
          }}
        />
      )}
      <div>
        <HangupButtonComponent
          onEndCallClick={onEndCallClick}
          text={!compressedMode ? 'Leave' : ''}
          styles={!compressedMode ? groupCallLeaveButtonStyle : groupCallLeaveButtonCompressedStyle}
        />
      </div>
    </ControlBar>
  );
};

export const GroupCallControlBarComponent = connectFuncsToContext(
  (props: ControlBarProps & GroupCallControlBarProps & ErrorHandlingProps) =>
    WithErrorHandling(GroupCallControlBar, props),
  MapToCallControlBarProps
);
