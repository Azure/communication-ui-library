// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, mergeStyles } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { VideoStreamOptions } from '../types';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';

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
   * Optional strings to override in component
   */
  strings?: Partial<CameraButtonStrings>;
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
  const theme = useTheme();
  const localeStrings = useLocale().strings.cameraButton;
  const strings = { ...localeStrings, ...props.strings };
  const onRenderCameraOnIcon = (): JSX.Element => (
    <Icon
      iconName="ControlButtonCameraOn"
      className={mergeStyles({
        svg: { fill: props.disabled || waitForCamera ? theme.palette.neutralTertiary : theme.palette.neutralPrimaryAlt }
      })}
    />
  );
  const onRenderCameraOffIcon = (): JSX.Element => (
    <Icon
      iconName="ControlButtonCameraOff"
      className={mergeStyles({
        svg: { fill: props.disabled || waitForCamera ? theme.palette.neutralTertiary : theme.palette.neutralPrimaryAlt }
      })}
    />
  );
  if (waitForCamera && strings.tooltipVideoLoadingContent) {
    strings.tooltipDisabledContent = strings.tooltipVideoLoadingContent;
  }

  const onToggleClick = useCallback(async () => {
    // Throttle click on camera, need to await onToggleCamera then allow another click
    if (onToggleCamera) {
      setWaitForCamera(true);
      try {
        await onToggleCamera(localVideoViewOptions ?? defaultLocalVideoViewOptions);
      } finally {
        setWaitForCamera(false);
      }
    }
  }, [localVideoViewOptions, onToggleCamera]);

  return (
    <ControlBarButton
      {...props}
      disabled={props.disabled || waitForCamera}
      onClick={onToggleCamera ? onToggleClick : props.onClick}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderCameraOnIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderCameraOffIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'cameraButtonLabel'}
    />
  );
};
