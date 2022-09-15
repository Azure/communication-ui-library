// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState } from 'react';
import { useLocale } from '../localization';
import { VideoStreamOptions } from '../types';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { HighContrastAwareIcon } from './HighContrastAwareIcon';

import { IContextualMenuItemStyles, IContextualMenuStyles } from '@fluentui/react';
import { ControlBarButtonStyles } from './ControlBarButton';
import { OptionsDevice, generateDefaultDeviceMenuProps } from './DevicesButton';
import { Announcer } from './Announcer';
/* @conditional-compile-remove(rooms) */
import { _usePermissions } from '../permissions';

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
  /**
   * description of camera button split button role
   */
  cameraButtonSplitRoleDescription?: string;
  /**
   * Camera split button aria label for when button is enabled.
   */
  onSplitButtonAriaLabel?: string;
  /**
   * Camera split button aria label for when button is disabled.
   */
  offSplitButtonAriaLabel?: string;
  /**
   * Camera action turned on string for announcer
   */
  cameraActionTurnedOnAnnouncement?: string;
  /**
   * Camera action turned off string for announcer
   */
  cameraActionTurnedOffAnnouncement?: string;
}

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
  /**
   * Available cameras for selection
   */
  cameras?: OptionsDevice[];
  /**
   * Camera that is shown as currently selected
   */
  selectedCamera?: OptionsDevice;
  /**
   * Callback when a camera is selected
   */
  onSelectCamera?: (device: OptionsDevice) => Promise<void>;
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

  let disabled = props.disabled || waitForCamera;
  /* @conditional-compile-remove(rooms) */
  const permissions = _usePermissions();
  /* @conditional-compile-remove(rooms) */
  disabled = disabled || !permissions.cameraButton;

  const onRenderCameraOnIcon = (): JSX.Element => (
    <HighContrastAwareIcon disabled={disabled} iconName="ControlButtonCameraOn" />
  );
  const onRenderCameraOffIcon = (): JSX.Element => (
    <HighContrastAwareIcon disabled={disabled} iconName="ControlButtonCameraOff" />
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
        disabled={disabled}
        onClick={onToggleCamera ? onToggleClick : props.onClick}
        onRenderOnIcon={props.onRenderOnIcon ?? onRenderCameraOnIcon}
        onRenderOffIcon={props.onRenderOffIcon ?? onRenderCameraOffIcon}
        strings={strings}
        labelKey={props.labelKey ?? 'cameraButtonLabel'}
        menuProps={
          props.menuProps ??
          (props.enableDeviceSelectionMenu
            ? generateDefaultDeviceMenuProps({ ...props, styles: props.styles?.menuStyles }, strings)
            : undefined)
        }
        menuIconProps={props.menuIconProps ?? !props.enableDeviceSelectionMenu ? { hidden: true } : undefined}
        split={props.split ?? props.enableDeviceSelectionMenu}
        aria-roledescription={props.enableDeviceSelectionMenu ? strings.cameraButtonSplitRoleDescription : undefined}
        splitButtonAriaLabel={props.enableDeviceSelectionMenu ? splitButtonAriaString : undefined}
      />
    </>
  );
};
