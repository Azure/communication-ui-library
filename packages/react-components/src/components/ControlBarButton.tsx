// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { DefaultButton, IButtonProps, IRenderFunction, Text, concatStyleSets, mergeStyles } from '@fluentui/react';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

/**
 * Strings of ControlBarButton that can be overridden
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
 * Props for ControlBarButton component
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
}

const DefaultRenderText = (props?: ControlBarButtonProps): JSX.Element => {
  const labelText =
    props?.text ?? props?.strings?.label ?? (props?.checked ? props?.strings?.onLabel : props?.strings?.offLabel);
  return (
    <Text key={props?.labelKey} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
      {labelText}
    </Text>
  );
};

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
 * Default button styled for the Control Bar. This can be used to create custom buttons that are styled the same as other buttons provided by the UI Library.
 */
export const ControlBarButton = (props: ControlBarButtonProps): JSX.Element => {
  const componentStyles = concatStyleSets(controlButtonStyles, props.styles ?? {});
  return (
    <DefaultButton
      {...props}
      styles={componentStyles}
      onRenderText={props.showLabel ? props.onRenderText ?? DefaultRenderText : undefined}
      onRenderIcon={props.onRenderIcon ?? DefaultRenderIcon}
    />
  );
};
