// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { DefaultButton, IButtonProps, mergeStyles, Stack } from '@fluentui/react';
import { MicIcon, MicOffIcon } from '@fluentui/react-northstar';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

/**
 * Props for AudioButton component
 */
export interface AudioButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;
}

/**
 * `AudioButton` allows you to easily create a component for rendering an audio button. It can be used in your ControlBar component for example.
 * @param props - of type AudioButtonProps
 */
export const AudioButton = (props: AudioButtonProps): JSX.Element => {
  const { checked, showLabel = false, styles, onRenderIcon, onRenderText } = props;

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (checked) {
      return <MicIcon />;
    }

    return <MicOffIcon />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    if (checked) {
      return <Stack className={mergeStyles(controlButtonLabelStyles)}>Mute</Stack>;
    }

    return <Stack className={mergeStyles(controlButtonLabelStyles)}>Unmute</Stack>;
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
