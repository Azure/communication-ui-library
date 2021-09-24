// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import {
  DefaultButton,
  IButtonProps,
  IRenderFunction,
  Text,
  concatStyleSets,
  mergeStyles,
  useTheme,
  IButtonStyles
} from '@fluentui/react';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

/**
 * Strings of {@link ControlBarButton} that can be overridden.
 *
 * @public
 */
export interface ControlBarButtonStrings {
  /**
   * Label of the button. This supersedes onLabel or offLabel if used.
   */
  label?: string;
  /**
   * Label of the button shown when the button is checked.
   */
  onLabel?: string;
  /**
   * Label of the button shown when the button is not checked.
   */
  offLabel?: string;
}

/**
 * Styles for all {@link ControlBarButton} implementations.
 *
 * @public
 */
export interface ControlBarButtonStyles extends IButtonStyles {}

/**
 * Props for {@link ControlBarButton}.
 *
 * @public
 */
export interface ControlBarButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   *
   * @defaultValue `false`
   */
  showLabel?: boolean;

  /**
   * Key to use for the Label component
   */
  labelKey?: string;

  /**
   * Optional strings to override in component.
   */
  strings?: ControlBarButtonStrings;

  /**
   * Icon to render when the button is checked.
   */
  onRenderOnIcon?: IRenderFunction<IButtonProps>;

  /**
   * Icon to render when the button is not checked.
   */
  onRenderOffIcon?: IRenderFunction<IButtonProps>;

  /**
   * Fluent styles, including extensions common to all {@link ControlBarButton}s.
   */
  styles?: ControlBarButtonStyles;
}

const DefaultRenderIcon = (props?: ControlBarButtonProps): JSX.Element | null => {
  return props?.checked
    ? props?.onRenderOnIcon
      ? props?.onRenderOnIcon()
      : null
    : props?.onRenderOffIcon
    ? props?.onRenderOffIcon()
    : null;
};

/**
 * Default button styled for the {@link ControlBar}.
 *
 * Use this component create custom buttons that are styled the same as other buttons provided by the UI Library.
 *
 * @public
 */
export const ControlBarButton = (props: ControlBarButtonProps): JSX.Element => {
  const componentStyles = concatStyleSets(controlButtonStyles, props.styles ?? {});
  const theme = useTheme();

  const labelText =
    props?.text ?? props?.strings?.label ?? (props?.checked ? props?.strings?.onLabel : props?.strings?.offLabel);

  const DefaultRenderText = useCallback(() => {
    return (
      <Text
        key={props?.labelKey}
        className={mergeStyles(controlButtonLabelStyles, theme.palette.neutralPrimary, props?.styles?.label)}
      >
        {labelText}
      </Text>
    );
  }, [labelText, props?.labelKey, props?.styles?.label, theme]);

  return (
    <DefaultButton
      {...props}
      styles={componentStyles}
      onRenderText={props.showLabel ? props.onRenderText ?? DefaultRenderText : undefined}
      onRenderIcon={props.onRenderIcon ?? DefaultRenderIcon}
    />
  );
};
