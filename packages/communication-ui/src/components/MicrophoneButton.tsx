// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { DefaultButton, IButtonProps, mergeStyles, Stack } from '@fluentui/react';
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

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return <MicIcon key={'micIconKey'} />;
    }

    return <MicOffIcon key={'micOffIconKey'} />;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    if (props?.checked) {
      return (
        <Stack key={'micMuteLabelKey'} className={mergeStyles(controlButtonLabelStyles)}>
          Mute
        </Stack>
      );
    }

    return (
      <Stack key={'micUnmuteLabelKey'} className={mergeStyles(controlButtonLabelStyles)}>
        Unmute
      </Stack>
    );
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
