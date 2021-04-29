// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { DefaultButton, IButtonProps, mergeStyles, Stack } from '@fluentui/react';
import { CallVideoIcon, CallVideoOffIcon } from '@fluentui/react-northstar';
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
}

/**
 * `CameraButton` allows you to easily create a component for rendering a camera button.
 * It can be used in your ControlBar component for example.
 * @param props - of type CameraButtonProps
 */
export const CameraButton = (props: CameraButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <CallVideoIcon />;
    }

    return <CallVideoOffIcon />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Turn off</Stack>;
    }

    return <Stack className={mergeStyles(controlButtonLabelStyles)}>Turn on</Stack>;
  };

  return (
    <DefaultButton
      {...props}
      styles={styles ?? controlButtonStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
