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
  /** Tooltip content. */
  tooltipContent?: string;
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
    styles ?? {}
  );

  const onHangUp = (): void => {
    if (props.onHangUp) {
      props.onHangUp();
    }
  };

  return (
    <ControlBarButton
      {...props}
      onClick={props.onHangUp ? onHangUp : props.onClick}
      styles={componentStyles}
      onRenderIcon={props.onRenderIcon ?? onRenderEndCallIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'endCallButtonLabel'}
    />
  );
};
// using media query to prevent windows from overwriting the button color
const darkThemeCallButtonStyles = {
  root: {
    color: darkTheme.callingPalette.iconWhite,
    background: darkTheme.callingPalette.callRed,
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'none'
    },
    ':focus::after': { outlineColor: `${darkTheme.callingPalette.iconWhite} !important` } // added !important to avoid override by FluentUI button styles
  },
  rootHovered: {
    color: darkTheme.callingPalette.iconWhite,
    background: darkTheme.callingPalette.callRed,
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'none'
    }
  },
  rootPressed: {
    color: darkTheme.callingPalette.iconWhite,
    background: darkTheme.callingPalette.callRed,
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'none'
    }
  },
  label: {
    color: darkTheme.callingPalette.iconWhite
  }
};

const lightThemeCallButtonStyles = {
  root: {
    color: lightTheme.callingPalette.iconWhite,
    background: lightTheme.callingPalette.callRed,
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'none'
    },
    ':focus::after': { outlineColor: `${lightTheme.callingPalette.iconWhite} !important` } // added !important to avoid override by FluentUI button styles
  },
  rootHovered: {
    color: lightTheme.callingPalette.iconWhite,
    background: lightTheme.callingPalette.callRed,
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'none'
    }
  },
  rootPressed: {
    color: lightTheme.callingPalette.iconWhite,
    background: lightTheme.callingPalette.callRed,
    '@media (forced-colors: active)': {
      forcedColorAdjust: 'none'
    }
  },
  label: {
    color: lightTheme.callingPalette.iconWhite
  }
};
