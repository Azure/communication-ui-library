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
 * Default button styled for the Control Bar.
 */
export const ControlBarButton = (props: ControlBarButtonProps): JSX.Element => {
  const { showLabel = false, styles, onRenderText, onRenderIcon, onRenderOnIcon, onRenderOffIcon, strings } = props;
  const componentStyles = concatStyleSets(controlButtonStyles, styles ?? {});
  const onLabel = props.text ?? strings?.label ?? strings?.onLabel;
  const offLabel = props.text ?? strings?.label ?? strings?.offLabel;

  const defaultRenderText = useCallback(
    (props?: IButtonProps): JSX.Element => {
      return (
        <Label key={Math.random()} className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
          {props?.checked ? onLabel : offLabel}
        </Label>
      );
    },
    [onLabel, offLabel]
  );

  const defaultRenderIcon = useCallback(
    (props?: IButtonProps): JSX.Element | null => {
      return props?.checked ? (onRenderOnIcon ? onRenderOnIcon() : null) : onRenderOffIcon ? onRenderOffIcon() : null;
    },
    [onRenderOnIcon, onRenderOffIcon]
  );

  return (
    <DefaultButton
      {...props}
      styles={componentStyles}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon}
    />
  );
};
