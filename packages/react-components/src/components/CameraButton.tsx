// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, DefaultButton, IButtonProps, mergeStyles, Stack } from '@fluentui/react';
import { CallVideoIcon, CallVideoOffIcon } from '@fluentui/react-northstar';
import React from 'react';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

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
  onToggleCamera?: () => Promise<void>;
}

/**
 * `CameraButton` allows you to easily create a component for rendering a camera button.
 * It can be used in your ControlBar component for example.
 *
 * @param props - of type CameraButtonProps
 */
export const CameraButton = (props: CameraButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;
  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    return props?.checked ? <CallVideoIcon key={'videoIconKey'} /> : <CallVideoOffIcon key={'videoOffIconKey'} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Stack key={'videoLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
        {props?.checked ? 'Turn off' : 'Turn on'}
      </Stack>
    );
  };

  return (
    <DefaultButton
      {...props}
      onClick={props.onToggleCamera ?? props.onClick}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
