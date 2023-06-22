// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(raise-hands) */
import React from 'react';
/* @conditional-compile-remove(raise-hands) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(raise-hands) */
import { ControlBarButton, ControlBarButtonProps } from './ControlBarButton';
/* @conditional-compile-remove(raise-hands) */
import { DefaultPalette, IButtonStyles, mergeStyles, Theme, useTheme } from '@fluentui/react';
/* @conditional-compile-remove(raise-hands) */
import { _HighContrastAwareIcon } from './HighContrastAwareIcon';

/* @conditional-compile-remove(raise-hands) */
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

/* @conditional-compile-remove(raise-hands) */
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

/* @conditional-compile-remove(raise-hands) */
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

/* @conditional-compile-remove(raise-hands) */
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
