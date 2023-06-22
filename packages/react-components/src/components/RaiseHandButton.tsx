// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { useLocale } from '../localization';
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
import { DefaultPalette, IButtonStyles, mergeStyles, Theme, useTheme } from '@fluentui/react';
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';

/**
 * Strings of {@link RaiseHandButton} that can be overridden.
 *
 * @public
 */
export interface RaiseHandButtonStrings {
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
 * Props for {@link RaiseHandButton}.
 *
 * @public
 */
export interface RaiseHandButtonProps extends ControlBarButtonProps {
  /**
   * Utility property for using this component with `communication react eventHandlers`.
   * Maps directly to the `onClick` property.
   */
  onToggleRaiseHand?: () => Promise<void>;

  /**
   * Optional strings to override in component
   */
  strings?: Partial<RaiseHandButtonStrings>;
}

/**
 * A button to start / stop screen sharing.
 *
 * Can be used with {@link ControlBar}.
 *
 * @public
 */
export const RaiseHandButton = (props: RaiseHandButtonProps): JSX.Element => {
  const localeStrings = useLocale().strings.raiseHandButton;
  const strings = { ...localeStrings, ...props.strings };

  const theme = useTheme();
  const styles = raiseHandButtonStyles(theme);

  const onRenderRaiseHandIcon = (): JSX.Element => (
    <_HighContrastAwareIcon disabled={props.disabled} iconName="ControlButtonRaiseHand" />
  );
  const onRenderLowerHandIcon = (): JSX.Element => (
    <_HighContrastAwareIcon disabled={props.disabled} iconName="ControlButtonLowerHand" />
  );

  return (
    <ControlBarButton
      {...props}
      className={mergeStyles(styles, props.styles)}
      onClick={props.onToggleRaiseHand ?? props.onClick}
      onRenderOnIcon={props.onRenderOnIcon ?? onRenderRaiseHandIcon}
      onRenderOffIcon={props.onRenderOffIcon ?? onRenderLowerHandIcon}
      strings={strings}
      labelKey={props.labelKey ?? 'raiseHandButtonLabel'}
      disabled={props.disabled}
    />
  );
};

const raiseHandButtonStyles = (theme: Theme): IButtonStyles => ({
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
  labelChecked: { color: DefaultPalette.white }
});
