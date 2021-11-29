// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { DefaultPalette, IButtonStyles, Icon, Theme, useTheme } from '@fluentui/react';

/**
 * Strings of {@link ScreenShareButton} that can be overridden.
 *
 * @public
 */
export interface ScreenShareButtonStrings {
  /** Label when button is on. */
  onLabel: string;
  /** Label when button is off. */
  offLabel: string;
  /** * Tooltip content when the button is disabled. */
  tooltipDisabledContent?: string;
  /** Tooltip content when the button is on. */
  tooltipOnContent?: string;
  /** Tooltip content when the button is off. */
  tooltipOffContent?: string;
}

/**
 * Props for {@link ScreenShareButton}.
 *
 * @public
 */
export interface ScreenShareButtonProps extends ControlBarButtonProps {
  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onToggleScreenShare?: () => Promise<void>;

  /**
   * Optional strings to override in component
   */
  strings?: Partial<ScreenShareButtonStrings>;
}

const onRenderScreenShareOnIcon = (): JSX.Element => <Icon iconName="ControlButtonScreenShareStop" />;
const onRenderScreenShareOffIcon = (): JSX.Element => <Icon iconName="ControlButtonScreenShareStart" />;

/**
 * A button to start / stop screen sharing.
 *
 * Can be used with {@link ControlBar}.
 *
 * @public
 */
export const ScreenShareButton = (props: ScreenShareButtonProps): JSX.Element => {
  const localeStrings = useLocale().strings.screenShareButton;
  const strings = { ...localeStrings, ...props.strings };

  const theme = useTheme();
  const styles = screenshareButtonStyles(theme);

  return (
    <ControlBarButton
      {...props}
      styles={styles}
      onClick={props.onToggleScreenShare ?? props.onClick}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderScreenShareOnIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderScreenShareOffIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'screenShareButtonLabel'}
    />
  );
};

const screenshareButtonStyles = (theme: Theme): IButtonStyles => ({
  rootChecked: {
    background: theme.palette.themePrimary,
    color: DefaultPalette.white,
    ':focus::after': { outlineColor: `${DefaultPalette.white} !important` } // added !important to avoid override by FluentUI button styles
  },
  rootCheckedHovered: {
    background: theme.palette.themePrimary,
    color: DefaultPalette.white,
    ':focus::after': { outlineColor: `${DefaultPalette.white} !important` } // added !important to avoid override by FluentUI button styles
  },
  labelHovered: { color: DefaultPalette.white },
  labelChecked: { color: DefaultPalette.white }
});
