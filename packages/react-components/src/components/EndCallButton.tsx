// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, Icon } from '@fluentui/react';
import React from 'react';
import { useLocale } from '../localization';
import { useTheme } from '../theming';
import { darkTheme, lightTheme } from '../theming/themes';
import { isDarkThemed } from '../theming/themeUtils';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';

/**
 * Strings of {@link EndCallButton} that can be overridden.
 *
 * @public
 */
export interface EndCallButtonStrings {
  /**
   * Label of button
   */
  label: string;
}

/**
 * Props for {@link EndCallButton}.
 *
 * @public
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

const onRenderEndCallIcon = (): JSX.Element => <Icon iconName="ControlButtonEndCall" />;

/**
 * A button to end an ongoing call.
 *
 * Can be used with {@link ControlBar}.
 *
 * @public
 */
export const EndCallButton = (props: EndCallButtonProps): JSX.Element => {
  const { styles } = props;

  const localeStrings = useLocale().strings.endCallButton;
  const strings = { ...localeStrings, ...props.strings };

  const theme = useTheme();
  const isDarkTheme = isDarkThemed(theme);
  const componentStyles = concatStyleSets(
    isDarkTheme ? darkThemeCallButtonStyles : lightThemeCallButtonStyles,
    { root: { ':focus::after': { outlineColor: `${theme.palette.white} !important` } } },
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

const darkThemeCallButtonStyles = {
  root: {
    color: darkTheme.callingPalette.iconWhite,
    background: darkTheme.callingPalette.callRed
  },
  rootHovered: {
    color: darkTheme.callingPalette.iconWhite,
    background: darkTheme.callingPalette.callRed
  },
  rootPressed: {
    color: darkTheme.callingPalette.iconWhite,
    background: darkTheme.callingPalette.callRed
  },
  label: {
    color: darkTheme.callingPalette.iconWhite
  }
};

const lightThemeCallButtonStyles = {
  root: {
    color: lightTheme.callingPalette.iconWhite,
    background: lightTheme.callingPalette.callRed
  },
  rootHovered: {
    color: lightTheme.callingPalette.iconWhite,
    background: lightTheme.callingPalette.callRed
  },
  rootPressed: {
    color: lightTheme.callingPalette.iconWhite,
    background: lightTheme.callingPalette.callRed
  },
  label: {
    color: lightTheme.callingPalette.iconWhite
  }
};
