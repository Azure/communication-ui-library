// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { DefaultButton, IButtonProps, Label, concatStyleSets, mergeStyles } from '@fluentui/react';
import { MicIcon, MicOffIcon } from '@fluentui/react-northstar';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';
import { useLocale } from '../localization';

/**
 * Props for MicrophoneButton component
 */
export interface MicrophoneButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;

  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onToggleMicrophone?: () => Promise<void>;
}

/**
 * `MicrophoneButton` allows you to easily create a component for rendering an audio button. It can be used in your ControlBar component for example.
 * @param props - of type MicrophoneButtonProps
 */
export const MicrophoneButton = (props: MicrophoneButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;
  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const strings = useLocale().strings;

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    return props?.checked ? <MicIcon key={'microphoneIconKey'} /> : <MicOffIcon key={'microphoneOffIconKey'} />;
  };

  const defaultRenderText = useCallback(
    (props?: IButtonProps): JSX.Element => {
      return (
        <Label key={'microphoneLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
          {props?.checked ? strings.microphone_button_on_text : strings.microphone_button_off_text}
        </Label>
      );
    },
    [strings]
  );

  return (
    <DefaultButton
      {...props}
      onClick={props.onToggleMicrophone ?? props.onClick}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
