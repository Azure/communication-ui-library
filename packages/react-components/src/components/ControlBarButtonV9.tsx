// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { ButtonProps, Slot, SplitButton, ToggleButton, ToggleButtonProps, Tooltip } from '@fluentui/react-components';
import { controlButtonStyles } from './styles/ControlBar.styles';
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
export type ControlBarButtonProps = ToggleButtonProps & {
  /**
   * Whether the label is displayed or not.
   *
   * @defaultValue `false`
   */
  showLabel?: boolean;

  ariaLabel?: string;

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
  onIcon?: Slot<'span'>;

  /**
   * Icon to render when the button is not checked.
   */
  offIcon?: Slot<'span'>;

  /**
   * Fluent styles, including extensions common to all {@link ControlBarButton}s.
   */
  styles?: ControlBarButtonStyles;
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

  const labelText =
    props?.children ?? props?.strings?.label ?? (props?.checked ? props?.strings?.onLabel : props?.strings?.offLabel);

  const tooltipContent =
    props?.strings?.tooltipContent ??
    (props?.disabled
      ? props?.strings?.tooltipDisabledContent
      : props?.checked
      ? props?.strings?.tooltipOnContent
      : props?.strings?.tooltipOffContent);

  const tooltipId = props.tooltipId ?? props.labelKey ? props.labelKey + '-tooltip' : undefined;

  const icon = props?.checked ? (props?.onIcon ? props?.onIcon : null) : props?.offIcon ? props?.offIcon : undefined;

  return (
    <ControlButtonTooltip content={tooltipContent} id={tooltipId}>
      <ToggleButton
        {...props}
        styles={componentStyles}
        icon={icon}
        ariaLabel={props.ariaLabel ?? tooltipContent ?? labelText}
        disabledFocusable={props.disabledFocusable ?? true}
      >
        {props.showLabel ? labelText : <></>}
      </ToggleButton>
      <SplitButton
        {...props}
        styles={componentStyles}
        icon={icon}
        ariaLabel={props.ariaLabel ?? tooltipContent ?? labelText}
        disabledFocusable={props.disabledFocusable ?? true}
        menuTriggerKeyCode={KeyCodes.down} // explicitly sets the keypress to activiate the split button drop down.
      >
        {props.showLabel ? labelText : <></>}
      </SplitButton>
    </ControlButtonTooltip>
  );
};
