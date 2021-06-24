// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, DefaultButton, IButtonProps, Label, mergeStyles } from '@fluentui/react';
import React from 'react';
import { controlButtonLabelStyles, controlButtonStyles } from './styles/ControlBar.styles';

/**
 * Props for ControlBarButton component
 */
export interface ControlBarButtonProps extends IButtonProps {
  /**
   * Whether the label is displayed or not.
   * @defaultValue `false`
   */
  showLabel?: boolean;

  /**
   * Button label text
   */
  labelText?: string;

  /**
   * Button label text
   */
  toggledLabelText?: string;

  /**
   * Button icon in the non-toggled state
   */
  icon?: JSX.Element;

  /**
   * Button icon when button is toggled
   */
  toggledIcon?: JSX.Element;
}

const emptyStyles = {};

/**
 * `ControlBarButton` allows you to easily create a component consistent with control bar buttons.
 */
export const ControlBarButton = (props: ControlBarButtonProps): JSX.Element => {
  const {
    showLabel = false,
    styles,
    onRenderIcon,
    onRenderText,
    labelText,
    toggledLabelText,
    icon,
    toggledIcon
  } = props;
  const buttonStyles = concatStyleSets(controlButtonStyles, styles ?? emptyStyles);

  const defaultRenderIcon = (props?: IButtonProps): JSX.Element => {
    return (!props?.checked ? icon : toggledIcon ?? icon) ?? <></>;
  };

  const defaultRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label className={mergeStyles(controlButtonLabelStyles, props?.styles?.label)}>
        {!props?.checked ? labelText : toggledLabelText ?? labelText}
      </Label>
    );
  };

  return (
    <DefaultButton
      {...props}
      styles={buttonStyles}
      onRenderIcon={onRenderIcon ?? defaultRenderIcon ?? undefined}
      onRenderText={showLabel ? onRenderText ?? defaultRenderText : undefined}
    />
  );
};
