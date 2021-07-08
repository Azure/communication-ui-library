// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { DefaultButton, IButtonProps, Label, concatStyleSets, mergeStyles } from '@fluentui/react';
import { MicOn20Filled, MicOff20Filled } from '@fluentui/react-icons';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';
import { useLocale } from '../localization';

/**
 * Strings of MicrophoneButton that can be overridden
 */
export interface MicrophoneButtonStrings {
  /** Label when button is on. */
  onLabel: string;
  /** Label when button is off. */
  offLabel: string;
}

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

  /**
   * Optional strings to override in component
   */
  strings?: Partial<MicrophoneButtonStrings>;
}

/**
 * `MicrophoneButton` allows you to easily create a component for rendering an audio button. It can be used in your ControlBar component for example.
 * @param props - of type MicrophoneButtonProps
 */
export const MicrophoneButton = (props: MicrophoneButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;
  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});

  const localeStrings = useLocale().strings.microphoneButton;
  const onLabel = props.strings?.onLabel ?? localeStrings.onLabel;
  const offLabel = props.strings?.offLabel ?? localeStrings.offLabel;

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    return props?.checked ? (
      <MicOn20Filled primaryFill="currentColor" key={'microphoneIconKey'} />
    ) : (
      <MicOff20Filled primaryFill="currentColor" key={'microphoneOffIconKey'} />
    );
  };

  const defaultRenderText = useCallback(
    (props?: IButtonProps): JSX.Element => {
      return (
        <Label key={'microphoneLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
          {props?.checked ? onLabel : offLabel}
        </Label>
      );
    },
    [onLabel, offLabel]
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
