// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, DefaultButton, IButtonProps, Label, mergeStyles } from '@fluentui/react';
import { CallVideoIcon, CallVideoOffIcon } from '@fluentui/react-northstar';
import React, { useCallback, useState } from 'react';
import { VideoStreamOptions } from '../types';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

const defaultLocalVideoViewOption = {
  scalingMode: 'Crop',
  isMirrored: true
} as VideoStreamOptions;

interface CameraButtonStrings {
  /**
   * Label to indicate that pressing the button will turn off camera.
   *
   * Setting the underlying button `text` directly overrides this string.
   */
  turnOff?: string;

  /**
   * Label to indicate that pressing the button will turn on camera.
   *
   * Setting the underlying button `text` directly overrides this string.
   */
  turnOn?: string;
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

  strings?: CameraButtonStrings;
}

/**
 * `CameraButton` allows you to easily create a component for rendering a camera button.
 * It can be used in your ControlBar component for example.
 *
 * @param props - of type CameraButtonProps
 */
export const CameraButton = (props: CameraButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText, localVideoViewOption, onToggleCamera } = props;
  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});
  const [waitForCamera, setWaitForCamera] = useState(false);

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    return props?.checked ? <CallVideoIcon key={'videoIconKey'} /> : <CallVideoOffIcon key={'videoOffIconKey'} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label key={'videoLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
        {props?.checked ? 'Turn off' : 'Turn on'}
      </Label>
    );
  };

  const onToggleClick = useCallback(async () => {
    // Throttle click on camera, need to await onToggleCamera then allow another click
    if (onToggleCamera) {
      setWaitForCamera(true);
      await onToggleCamera(localVideoViewOption ?? defaultLocalVideoViewOption);
      setWaitForCamera(false);
    }
  }, [localVideoViewOption, onToggleCamera]);

  return (
    <DefaultButton
      {...props}
      disabled={props.disabled || waitForCamera}
      onClick={onToggleCamera ? onToggleClick : props.onClick}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
