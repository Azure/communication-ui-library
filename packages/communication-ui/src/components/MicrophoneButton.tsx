// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { DefaultButton, IButtonProps, Stack, concatStyleSets, mergeStyles } from '@fluentui/react';
import { MicIcon, MicOffIcon } from '@fluentui/react-northstar';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

/**
 * Props for MicrophoneButton component
 */
export interface MicrophoneButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;
}

/**
 * `MicrophoneButton` allows you to easily create a component for rendering an audio button. It can be used in your ControlBar component for example.
 * @param props - of type MicrophoneButtonProps
 */
export const MicrophoneButton = (props: MicrophoneButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;
  const componentStyles = styles ? concatStyleSets(controlButtonStyles, styles) : controlButtonStyles;

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <MicIcon />;
    }

    return <MicOffIcon />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Mute</Stack>;
    }

    return <Stack className={mergeStyles(controlButtonLabelStyles)}>Unmute</Stack>;
  };

  return (
    <DefaultButton
      {...props}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
