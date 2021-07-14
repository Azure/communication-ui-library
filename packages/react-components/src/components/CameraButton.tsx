// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IButtonProps } from '@fluentui/react';
import { Video20Filled, VideoOff20Filled } from '@fluentui/react-icons';
import React, { useCallback, useState } from 'react';
import { useLocale } from '../localization';
import { VideoStreamOptions } from '../types';
import { ControlBarButton } from './ControlBarButton';

const defaultLocalVideoViewOption = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

/**
 * Strings of CameraButton that can be overridden
 */
export interface CameraButtonStrings {
  /** Label when button is on. */
  onLabel: string;
  /** Label when button is off. */
  offLabel: string;
}

/**
 * Props for CameraButton component
 */
export interface CameraButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;

  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onToggleCamera?: (options?: VideoStreamOptions) => Promise<void>;

  /**
   * Options for rendering local video view.
   */
  localVideoViewOption?: VideoStreamOptions;

  /**
   * Optional strings to override in component
   */
  strings?: CameraButtonStrings;
}

const onRenderOnIcon = (): JSX.Element => <Video20Filled key={'videoIconKey'} primaryFill="currentColor" />;
const onRenderOffIcon = (): JSX.Element => <VideoOff20Filled key={'videoOffIconKey'} primaryFill="currentColor" />;

/**
 * `CameraButton` allows you to easily create a component for rendering a camera button.
 * It can be used in your ControlBar component for example.
 *
 * @param props - of type CameraButtonProps
 */
export const CameraButton = (props: CameraButtonProps): JSX.Element => {
  const { localVideoViewOption, onToggleCamera } = props;
  const [waitForCamera, setWaitForCamera] = useState(false);

  const localeStrings = useLocale().strings.cameraButton;
  const onLabel = props.strings?.onLabel ?? localeStrings.onLabel;
  const offLabel = props.strings?.offLabel ?? localeStrings.offLabel;

  const onToggleClick = useCallback(async () => {
    // Throttle click on camera, need to await onToggleCamera then allow another click
    if (onToggleCamera) {
      setWaitForCamera(true);
      await onToggleCamera(localVideoViewOption ?? defaultLocalVideoViewOption);
      setWaitForCamera(false);
    }
  }, [localVideoViewOption, onToggleCamera]);

  return (
    <ControlBarButton
      {...props}
      disabled={props.disabled || waitForCamera}
      onClick={onToggleCamera ? onToggleClick : props.onClick}
      onRenderOnIcon={onRenderOnIcon}
      onRenderOffIcon={onRenderOffIcon}
      strings={{ onLabel, offLabel }}
    />
  );
};
