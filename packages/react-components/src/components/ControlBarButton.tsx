// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback } from 'react';
import { DefaultButton, IButtonProps, IRenderFunction, Label, concatStyleSets, mergeStyles } from '@fluentui/react';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

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

/**
 * Default button styled for the Control Bar. This can be used to create custom buttons that are styled the same as other buttons provided by the UI Library.
 */
export const ControlBarButton = (props: ControlBarButtonProps): JSX.Element => {
  const {
    showLabel = false,
    labelKey,
    styles,
    onRenderText,
    onRenderIcon,
    onRenderOnIcon,
    onRenderOffIcon,
    strings
  } = props;

  const defaultRenderText = useCallback(
    (props?: IButtonProps): JSX.Element => {
      const labelText = props?.text ?? strings?.label ?? (props?.checked ? strings?.onLabel : strings?.offLabel);
      return (
        <Label key={labelKey} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
          {labelText}
        </Label>
      );
    },
    [labelKey, strings?.label, strings?.offLabel, strings?.onLabel]
  );

  const defaultRenderIcon = useCallback(
    (props?: IButtonProps): JSX.Element | null => {
      return props?.checked ? (onRenderOnIcon ? onRenderOnIcon() : null) : onRenderOffIcon ? onRenderOffIcon() : null;
    },
    [onRenderOnIcon, onRenderOffIcon]
  );

  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});
  return (
    <DefaultButton
      {...props}
      styles={componentStyles}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
    />
  );
};
