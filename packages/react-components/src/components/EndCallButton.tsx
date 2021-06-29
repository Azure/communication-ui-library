// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { DefaultButton, IButtonProps, Label, concatStyleSets, mergeStyles, useTheme } from '@fluentui/react';
import { CallEnd20Filled } from '@fluentui/react-icons';
import { controlButtonLabelStyles, endCallControlButtonStyles } from './styles/ControlBar.styles';
import { lightTheme, darkTheme } from '../theming/themes';
import { isDarkThemed } from '../theming/themeUtils';
import { useLocale } from '../localization';

/**
 * Strings of EndCallButton that can be overridden
 */
export interface EndCallButtonStrings {
  /**
   * Label of button
   */
  label: string;
}

/**
 * Props for EndCallButton component
 */
export interface EndCallButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   *
   * @defaultValue `false`
   */
  showLabel?: boolean;

  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onHangUp?: () => Promise<void>;

  /**
   * Optional strings to override in component
   */
  strings?: EndCallButtonStrings;
}

/**
 * `EndCallButton` allows you to easily create a component for rendering a end call button. It can be used in your ControlBar component for example.
 *
 * @param props - of type EndCallButtonProps
 */
export const EndCallButton = (props: EndCallButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderIcon, onRenderText } = props;

  const isDarkTheme = isDarkThemed(useTheme());
  const { strings } = useLocale();
  const label = props.text ?? props.strings?.label ?? strings.endCallButton.label;

  const componentStyles = concatStyleSets(
    endCallControlButtonStyles,
    {
      root: {
        background: isDarkTheme ? darkTheme.callingPalette.callRed : lightTheme.callingPalette.callRed
      },
      rootHovered: {
        background: isDarkTheme ? darkTheme.callingPalette.callRedDark : lightTheme.callingPalette.callRedDark
      },
      rootPressed: {
        background: isDarkTheme ? darkTheme.callingPalette.callRedDarker : lightTheme.callingPalette.callRedDarker
      }
    },
    styles ?? {}
  );

  const defaultRenderIcon = (): JSX.Element => {
    return <CallEnd20Filled primaryFill="currentColor" key={'callEndIconKey'} />;
  };

  const defaultRenderText = useCallback(
    (props?: IButtonProps): JSX.Element => {
      return (
        <Label key={'callEndLabelKey'} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
          {label}
        </Label>
      );
    },
    [label]
  );

  return (
    <DefaultButton
      {...props}
      onClick={props.onHangUp ?? props.onClick}
      styles={componentStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
