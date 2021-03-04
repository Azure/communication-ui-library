// © Microsoft Corporation. All rights reserved.
import { DefaultButton, IContextualMenuProps, IIconProps, IStyle, mergeStyles, Stack } from '@fluentui/react';
import {
  CallControlCloseTrayIcon,
  CallControlPresentNewIcon,
  CallEndIcon,
  CallIcon,
  CallVideoIcon,
  CallVideoOffIcon,
  MicIcon,
  MicOffIcon,
  MoreIcon
} from '@fluentui/react-northstar';
import React, { MouseEventHandler, useCallback } from 'react';
import { connectFuncsToContext } from '../consumers/ConnectContext';
import {
  LocalDeviceSettingsContainerProps,
  MapToLocalDeviceSettingsProps
} from '../consumers/MapToLocalDeviceSettingsProps';
import { MapToCallControlBarProps, CallControlBarContainerProps } from '../consumers/MapToCallControlBarProps';
import { ErrorHandlingProps } from '../providers/ErrorProvider';
import { propagateError } from '../utils/SDKUtils';
import {
  controlBarStyle,
  controlButtonStyles,
  controlButtonLabelStyles,
  hangUpControlButtonStyles
} from './styles/ControlBar.styles';
import { isLocalScreenShareSupportedInBrowser } from '../utils/SDKUtils';

export interface CustomStylesProps {
  root?: IStyle;
}

export interface ControlButtonStylesProps extends CustomStylesProps {
  /**
   * The flex container containing the elements inside a button.
   */
  flexContainer?: IStyle;
  /**
   * Text label styles.
   */
  label?: IStyle;
}

export interface CallControlButtonProps {
  /**
   * React Child components.
   */
  children?: React.ReactNode;
  /**
   * Whether the button is in a toggled state. Will render the toggled Icon if
   * set to `true`.
   */
  isToggled?: boolean;
  /**
   * Custom CSS Styling.
   */
  styles?: ControlButtonStylesProps;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
  /**
   * OnClick event handler.
   */
  onClick?: MouseEventHandler<HTMLElement>;
  /**
   * Display the `defaultLabel` and `toggledLabel` when set to true.
   */
  showLabel?: boolean;
  /**
   * Default Icon element to display.
   */
  defaultIcon?: JSX.Element;
  /**
   * Icon element to display when `isToggled` is `true`.
   */
  toggledIcon?: JSX.Element;
  /**
   * Default label to display is `showLabel` is set to `true`.
   */
  defaultLabel?: JSX.Element;
  /**
   * Label to display when `showLabel` and `isToggled` are true.
   */
  toggledLabel?: JSX.Element;
  /**
   * The props for the icon shown when providing a menu dropdown.
   * Uses `IIconProps` from FluentUI.
   * Visit https://developer.microsoft.com/en-us/fluentui#/controls/web/icon#IIconProps for more info.
   */
  menuIconProps?: IIconProps;
  /**
   * Props for button menu. Providing this will default to showing the menu icon. See menuIconProps for overriding
   * how the default icon looks. Providing this in addition of onClick and setting the split property to true will
   * render a SplitButton.
   * Uses `IContextualMenuProps` from FluentUI
   * Visit https://developer.microsoft.com/en-us/fluentui#/controls/web/contextualmenu#IContextualMenuProps for more info.
   */
  menuProps?: IContextualMenuProps;
}

/**
 * A Button component that can be rendered inside a Control Bar
 * @returns JSX.Element
 */
export const ControlButton = (props: CallControlButtonProps): JSX.Element => {
  const { defaultIcon, toggledIcon, defaultLabel, toggledLabel } = props;
  return (
    <DefaultButton
      disabled={props.disabled}
      onClick={props.onClick}
      className={mergeStyles(controlButtonStyles, props.styles?.root)}
      styles={{
        flexContainer: props.styles?.flexContainer ?? {
          flexDirection: 'column'
        }
      }}
      menuIconProps={props.menuIconProps}
      menuProps={props.menuProps}
    >
      {props.isToggled && toggledIcon ? toggledIcon : defaultIcon}
      <Stack className={mergeStyles(controlButtonLabelStyles, props.styles?.label)}>
        {props.showLabel
          ? (() => {
              if (props.isToggled && toggledLabel) {
                return toggledLabel;
              } else if (!props.isToggled && defaultLabel) {
                return defaultLabel;
              } else {
                return null;
              }
            })()
          : null}
      </Stack>
    </DefaultButton>
  );
};

export const videoButtonProps: CallControlButtonProps = {
  defaultIcon: <CallVideoIcon />,
  toggledIcon: <CallVideoOffIcon />,
  defaultLabel: <Stack>Camera</Stack>,
  toggledLabel: <Stack>Camera</Stack>
};

export const audioButtonProps: CallControlButtonProps = {
  defaultIcon: <MicIcon />,
  toggledIcon: <MicOffIcon />,
  defaultLabel: <Stack>Mute</Stack>,
  toggledLabel: <Stack>Unmute</Stack>
};

export const screenShareButtonProps: CallControlButtonProps = {
  defaultIcon: <CallControlPresentNewIcon bordered={false} />,
  toggledIcon: <CallControlCloseTrayIcon />,
  defaultLabel: <Stack>Share</Stack>,
  toggledLabel: <Stack>Stop</Stack>
};

export const optionsButtonProps: CallControlButtonProps = {
  defaultIcon: <MoreIcon />,
  defaultLabel: <Stack>Options</Stack>,
  menuIconProps: {
    hidden: true
  }
};

export const answerButtonProps: CallControlButtonProps = {
  defaultIcon: <CallIcon />,
  defaultLabel: <Stack>Answer</Stack>
};

export const hangupButtonProps: CallControlButtonProps = {
  defaultIcon: <CallEndIcon />,
  defaultLabel: <Stack>Hangup</Stack>,
  styles: hangUpControlButtonStyles
};

export interface ControlBarProps {
  children?: React.ReactNode;
  /**
   * Allows users to pass in an object contains custom CSS styles.
   * Example
   * ```
   * <ControlBar styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: CustomStylesProps;
  /**
   * Changes the layout of the control bar.
   * Available layouts are `horizontal`, `vertical`.
   * Defaults to a `horizontal` layout.
   */
  layout?: 'horizontal' | 'vertical';
}

/**
 * A Call Control Bar used for handling a call state. Contains actions like
 * toggle video, audo, device settings etc.
 * @returns JSX.Element
 */
export const ControlBar = (props: ControlBarProps): JSX.Element => {
  const { styles, layout } = props;
  const isHorizontal = layout === 'vertical' ? false : true;
  return (
    <Stack horizontal={isHorizontal} verticalAlign="center" className={mergeStyles(controlBarStyle, styles?.root)}>
      {props.children}
    </Stack>
  );
};

export interface CallControlBarProps extends CallControlBarContainerProps {
  /** Determines media control button layout. */
  compressedMode: boolean;
  /** Callback when call ends */
  onEndCallClick(): void;
}

/**
 * An Azure Calling Services Call Control Bar with built in call handling.
 * @param props CallControlBarProps & ErrorHandlingProps & LocalDeviceSettingsContainerProps
 */
export const CallControlBar = (
  props: CallControlBarProps & ErrorHandlingProps & LocalDeviceSettingsContainerProps
): JSX.Element => {
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
    toggleScreenShare,
    isLocalScreenShareActive,
    onErrorCallback,
    videoDeviceList,
    audioDeviceList,
    videoDeviceInfo,
    audioDeviceInfo,
    updateLocalVideoStream,
    updateAudioDeviceInfo
  } = props;
  const cameraDisabled = cameraPermission === 'Denied';
  const micDisabled = micPermission === 'Denied';
  const screenShareDisabled = isRemoteScreenShareActive;
  const hangup = useCallback(async (): Promise<void> => {
    await muteMicrophone();
    await stopScreenShare();
    await (localVideoEnabled && stopLocalVideo());
    await leaveCall({ forEveryone: false });
    onEndCallClick();
  }, [muteMicrophone, stopScreenShare, localVideoEnabled, stopLocalVideo, leaveCall, onEndCallClick]);

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

  return (
    <ControlBar>
      <ControlButton
        {...videoButtonProps}
        isToggled={!localVideoEnabled}
        disabled={cameraDisabled || localVideoBusy}
        onClick={() => {
          toggleLocalVideo().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      <ControlButton
        {...audioButtonProps}
        isToggled={!isMicrophoneActive}
        disabled={micDisabled}
        onClick={() => {
          toggleMicrophone().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
      {isLocalScreenShareSupportedInBrowser() && (
        <ControlButton
          {...screenShareButtonProps}
          isToggled={isLocalScreenShareActive}
          disabled={screenShareDisabled}
          onClick={() => {
            toggleScreenShare().catch((error) => {
              propagateError(error, onErrorCallback);
            });
          }}
        />
      )}
      <ControlButton {...optionsButtonProps} isToggled={false} menuProps={callOptionsMenu} />
      <ControlButton
        {...hangupButtonProps}
        isToggled={false}
        onClick={() => {
          hangup().catch((error) => {
            propagateError(error, onErrorCallback);
          });
        }}
      />
    </ControlBar>
  );
};

export const CallControlBarComponent = connectFuncsToContext(
  CallControlBar,
  MapToCallControlBarProps,
  MapToLocalDeviceSettingsProps
);
