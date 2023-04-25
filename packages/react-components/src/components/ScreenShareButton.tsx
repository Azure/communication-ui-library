// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { DefaultPalette, IButtonStyles, mergeStyles, Theme, useTheme } from '@fluentui/react';
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';

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

  const onRenderScreenShareOnIcon = (): JSX.Element => (
    <_HighContrastAwareIcon disabled={props.disabled} iconName="ControlButtonScreenShareStop" />
  );
  const onRenderScreenShareOffIcon = (): JSX.Element => (
    <_HighContrastAwareIcon disabled={props.disabled} iconName="ControlButtonScreenShareStart" />
  );

  return (
    <ControlBarButton
      {...props}
      className={mergeStyles(styles, props.styles)}
      onClick={props.onToggleScreenShare ?? props.onClick}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderScreenShareOnIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderScreenShareOffIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'screenShareButtonLabel'}
      disabled={props.disabled}
    />
  );
};

const screenshareButtonStyles = (theme: Theme): IButtonStyles => ({
  rootChecked: {
    background: theme.palette.themePrimary,
    color: DefaultPalette.white,
    ':focus::after': { outlineColor: `${DefaultPalette.white} !important` }, // added !important to avoid override by FluentUI button styles
    '@media (forced-colors: active)': {
      border: '1px solid',
      borderColor: theme.palette.black
    }
  },
  rootCheckedHovered: {
    background: theme.palette.themePrimary,
    color: DefaultPalette.white,
    ':focus::after': { outlineColor: `${DefaultPalette.white} !important` }, // added !important to avoid override by FluentUI button styles
    '@media (forced-colors: active)': {
      border: '1px solid',
      borderColor: theme.palette.black
    }
  },
  labelChecked: { color: DefaultPalette.white }
});
