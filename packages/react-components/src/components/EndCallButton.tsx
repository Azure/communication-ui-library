// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, Icon } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { darkTheme, lightTheme } from '../theming/themes';
import { isDarkThemed } from '../theming/themeUtils';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { endCallControlButtonStyles } from './styles/ControlBar.styles';

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
export interface EndCallButtonProps extends ControlBarButtonProps {
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

const onRenderEndCallIcon = (): JSX.Element => <Icon iconName="EndCall" />;

/**
 * `EndCallButton` allows you to easily create a component for rendering a end call button. It can be used in your ControlBar component for example.
 *
 * @param props - of type EndCallButtonProps
 */
export const EndCallButton = (props: EndCallButtonProps): JSX.Element => {
  const { styles } = props;

  const localeStrings = useLocale().strings.endCallButton;
  const strings = { ...localeStrings, ...props.strings };

  const isDarkTheme = isDarkThemed(useTheme());
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

  return (
    <ControlBarButton
      {...props}
      onClick={props.onHangUp ?? props.onClick}
      styles={componentStyles}
      onRenderIcon={props.onRenderIcon ?? onRenderEndCallIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'endCallButtonLabel'}
    />
  );
};
