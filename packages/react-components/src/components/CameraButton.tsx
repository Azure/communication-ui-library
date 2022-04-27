// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IContextualMenuProps } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import { useLocale } from '../localization';
import { VideoStreamOptions } from '../types';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { HighContrastAwareIcon } from './HighContrastAwareIcon';

/* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
import { IContextualMenuItemStyles, IContextualMenuStyles } from '@fluentui/react';
/* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
import { ControlBarButtonStyles } from './ControlBarButton';
/* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
import { OptionsDevice, generateDefaultDeviceMenuProps } from './DevicesButton';
import { Announcer } from './Announcer';

const defaultLocalVideoViewOptions = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

/**
 * Strings of CameraButton that can be overridden.
 *
 * @public
 */
export interface CameraButtonStrings {
  /** Label when button is on. */
  onLabel: string;
  /** Label when button is off. */
  offLabel: string;
  /** Tooltip content when the button is disabled. */
  tooltipDisabledContent?: string;
  /** Tooltip content when the button is on. */
  tooltipOnContent?: string;
  /** Tooltip content when the button is off. */
  tooltipOffContent?: string;
  /** Tooltip content when the button is disabled due to video loading. */
  tooltipVideoLoadingContent?: string;
  /**
   * Title of camera menu
   */
  cameraMenuTitle: string;
  /**
   * Tooltip of camera menu
   */
  cameraMenuTooltip: string;
  /* @conditional-compile-remove(control-bar-split-buttons) */
  /**
   * description of camera button split button role
   */
  cameraButtonSplitRoleDescription?: string;
  /* @conditional-compile-remove(control-bar-split-buttons) */
  /**
   * Camera split button aria label for when button is enabled.
   */
  onSplitButtonAriaLabel?: string;
  /* @conditional-compile-remove(control-bar-split-buttons) */
  /**
   * Camera split button aria label for when button is disabled.
   */
  offSplitButtonAriaLabel?: string;
  /**
   * Camera action turned on string for announcer
   */
  cameraActionTurnedOnAnnouncement: string;
  /**
   * Camera action turned off string for announcer
   */
  cameraActionTurnedOffAnnouncement: string;
}

/* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
/**
 * Styles for {@link CameraButton}
 *
 * @public
 */
export interface CameraButtonStyles extends ControlBarButtonStyles {
  /**
   * Styles for the {@link CameraButton} menu.
   */
  menuStyles?: Partial<CameraButtonContextualMenuStyles>;
}

/* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
/**
 * Styles for the {@link CameraButton} menu.
 *
 * @public
 */
export interface CameraButtonContextualMenuStyles extends IContextualMenuStyles {
  /**
   * Styles for the items inside the {@link CameraButton} button menu.
   */
  menuItemStyles?: IContextualMenuItemStyles;
}
/**
 * Props for {@link CameraButton} component.
 *
 * @public
 */
export interface CameraButtonProps extends ControlBarButtonProps {
  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onToggleCamera?: (options?: VideoStreamOptions) => Promise<void>;

  /**
   * Options for rendering local video view.
   */
  localVideoViewOptions?: VideoStreamOptions;
  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
  /**
   * Available cameras for selection
   */
  cameras?: OptionsDevice[];
  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
  /**
   * Camera that is shown as currently selected
   */
  selectedCamera?: OptionsDevice;
  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
  /**
   * Callback when a camera is selected
   */
  onSelectCamera?: (device: OptionsDevice) => Promise<void>;
  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
  /**
   * Whether to use a {@link SplitButton} with a {@link IContextualMenu} for device selection.
   *
   * default: false
   */
  enableDeviceSelectionMenu?: boolean;
  /**
   * Optional strings to override in component
   */
  strings?: Partial<CameraButtonStrings>;
  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
  /**
   * Styles for {@link CameraButton} and the device selection flyout.
   */
  styles?: Partial<CameraButtonStyles>;
}

/**
 * A button to turn camera on / off.
 *
 * Can be used with {@link ControlBar}.
 *
 * @public
 */
export const CameraButton = (props: CameraButtonProps): JSX.Element => {
  const { localVideoViewOptions, onToggleCamera } = props;
  const [waitForCamera, setWaitForCamera] = useState(false);
  const localeStrings = useLocale().strings.cameraButton;
  const strings = { ...localeStrings, ...props.strings };
  const [announcerString, setAnnouncerString] = useState<string | undefined>(undefined);
  const onRenderCameraOnIcon = (): JSX.Element => (
    <HighContrastAwareIcon disabled={props.disabled || waitForCamera} iconName="ControlButtonCameraOn" />
  );
  const onRenderCameraOffIcon = (): JSX.Element => (
    <HighContrastAwareIcon disabled={props.disabled || waitForCamera} iconName="ControlButtonCameraOff" />
  );
  if (waitForCamera && strings.tooltipVideoLoadingContent) {
    strings.tooltipDisabledContent = strings.tooltipVideoLoadingContent;
  }

  const cameraOn = props.checked;
  const splitButtonAriaString = cameraOn ? strings.onSplitButtonAriaLabel : strings.offSplitButtonAriaLabel;

  const toggleAnnouncerString = useCallback(
    (isCameraOn: boolean) => {
      setAnnouncerString(
        !isCameraOn ? strings.cameraActionTurnedOffAnnouncement : strings.cameraActionTurnedOnAnnouncement
      );
    },
    [strings.cameraActionTurnedOffAnnouncement, strings.cameraActionTurnedOnAnnouncement]
  );

  const onToggleClick = useCallback(async () => {
    // Throttle click on camera, need to await onToggleCamera then allow another click
    if (onToggleCamera) {
      setWaitForCamera(true);
      try {
        await onToggleCamera(localVideoViewOptions ?? defaultLocalVideoViewOptions);
        // allows for the setting of narrator strings triggering the announcer when camera is turned on or off.
        toggleAnnouncerString(!cameraOn);
      } finally {
        setWaitForCamera(false);
      }
    }
  }, [cameraOn, localVideoViewOptions, onToggleCamera, toggleAnnouncerString]);

  return (
    <>
      <Announcer announcementString={announcerString} ariaLive={'polite'} />
      <ControlBarButton
        {...props}
        disabled={props.disabled || waitForCamera}
        onClick={onToggleCamera ? onToggleClick : props.onClick}
        onRenderOnIcon={props.onRenderOnIcon ?? onRenderCameraOnIcon}
        onRenderOffIcon={props.onRenderOffIcon ?? onRenderCameraOffIcon}
        strings={strings}
        labelKey={props.labelKey ?? 'cameraButtonLabel'}
        menuProps={props.menuProps ?? generateDefaultDeviceMenuPropsTrampoline(props, strings)}
        menuIconProps={
          props.menuIconProps ?? !enableDeviceSelectionMenuTrampoline(props) ? { hidden: true } : undefined
        }
        split={props.split ?? enableDeviceSelectionMenuTrampoline(props)}
        aria-roledescription={
          enableDeviceSelectionMenuTrampoline(props) ? strings.cameraButtonSplitRoleDescription : undefined
        }
        splitButtonAriaLabel={enableDeviceSelectionMenuTrampoline(props) ? splitButtonAriaString : undefined}
      />
    </>
  );
};

const generateDefaultDeviceMenuPropsTrampoline = (
  props: CameraButtonProps,
  strings: CameraButtonStrings
): IContextualMenuProps | undefined => {
  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
  if (props.enableDeviceSelectionMenu) {
    return generateDefaultDeviceMenuProps({ ...props, styles: props.styles?.menuStyles }, strings);
  }
  return undefined;
};

const enableDeviceSelectionMenuTrampoline = (props: CameraButtonProps): boolean => {
  /* @conditional-compile-remove(call-with-chat-composite) @conditional-compile-remove(control-bar-split-buttons) */
  if (props.enableDeviceSelectionMenu) {
    return true;
  }
  return false;
};
