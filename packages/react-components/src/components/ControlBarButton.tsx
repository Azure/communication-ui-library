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
  IButtonStyles
} from '@fluentui/react';
import { useTheme } from '../theming';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';
import { ControlButtonTooltip } from './ControlButtonTooltip';

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
  /**
   * Tooltip content of the button. This supersedes tooltipDisabledContent, tooltipOnContent and tooltipOffContent if used.
   */
  tooltipContent?: string;
  /**
   * Tooltip content when the button is disabled.
   */
  tooltipDisabledContent?: string;
  /**
   * Tooltip content when the button is in the checked state.
   */
  tooltipOnContent?: string;
  /**
   * Tooltip content when the button is in the unchecked state.
   */
  tooltipOffContent?: string;
}

/**
 * Styles for all {@link ControlBarButton} implementations.
 *
 * @public
 */
export type ControlBarButtonStyles = IButtonStyles;

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
   * Id to use for the tooltip host.
   *
   * @defaultValue This uses the labelKey and appends -tooltip by default
   */
  tooltipId?: string;

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

  const tooltipContent =
    props?.strings?.tooltipContent ??
    (props?.disabled
      ? props?.strings?.tooltipDisabledContent
      : props?.checked
      ? props?.strings?.tooltipOnContent
      : props?.strings?.tooltipOffContent);

  const tooltipId = props.tooltipId ?? props.labelKey ? props.labelKey + '-tooltip' : undefined;

  return (
    <ControlButtonTooltip content={tooltipContent} id={tooltipId}>
      <DefaultButton
        {...props}
        styles={componentStyles}
        onRenderText={props.showLabel ? props.onRenderText ?? DefaultRenderText : undefined}
        onRenderIcon={props.onRenderIcon ?? DefaultRenderIcon}
      />
    </ControlButtonTooltip>
  );
};
